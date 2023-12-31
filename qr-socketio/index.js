import path from 'node:path';
import { createServer } from 'node:http';

import cors from 'cors';
import { v4 } from 'uuid';
import express from 'express';
import { Server } from 'socket.io';

import { decodeImageQR, generateFancyQR } from './utils/qr.js';
import { logIncomingAndOutgoingEvents } from './utils/log-socket-events.js';
import { performTransaction } from './utils/perform-transaction.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('./'));
app.use(cors());

app.get('/', (req, res) => {
	res.sendFile(path.resolve('static', 'index.html'));
});

// Socket Events
const INIT = 1;
const REQUEST_BALANCE = 2;
const DECODE_QR = 3;
const TRANSACTION_STATUS = 4;
const ACCEPT_TRANSACTION = 5;
const REJECT_TRANSACTION = 6;
const START_QR_TIMER = 7;
const DISSOLVE_QR = 8;

/**
 * This object holds all the connected clients in key-value format.
 * @example {socket.id: user.id}
 */
let clients = {};

/**
 * @type {Transaction[]}
 * This list holds all valid pending QR transactions.
 */
let transactions = [];

/**
 * @type {number}
 * This variable determines the QR expiry time.
 */
const QR_EXPIRY_TIME_MINUTE = 1;

/**
 * This function defines the model of the pending transaction that is stored in the websocket.
 *
 * @param {string} id (UUID) the unique identifier of transaction
 * @param {number} sender the sender's account number
 * @param {number} receiver the receiver's account number
 * @param {number} amount the transaction amount
 * @param {string | null} remarks any transaction remarks
 */
function Transaction(id, sender, receiver, amount, remarks) {
	this.id = id;
	this.sender = sender;
	this.receiver = receiver;
	this.amount = amount;
	this.remarks = remarks;
}

io.on('connection', async (socket) => {
	/**
	 * This event is triggered from the client on socket initializtion.
	 * The event hanler adds connected sockets to `clients` every time a new user joins.
	 */
	socket.on(INIT, (user, ackcb) => {
		ackcb();
		clients[socket.id] = user;
		console.log(`${user} connected`);
		console.log(`clients count: ${io.engine.clientsCount}`);
		socket.emit(INIT, socket.id, user);
	});

	/**
	 * This event is triggered when the user requests balance from the client-side
	 * The event handler creates a `Transaction` object and emits back the encoded QR data.
	 */
	socket.on(REQUEST_BALANCE, async (amount, remarks, ackcb) => {
		ackcb();
		// get user id from connected clients
		const user = clients[socket.id];
		console.log(`${user} requested ${amount}`);

		if (!user) return;

		// create a new transaction
		const transactionId = v4();
		const transaction = new Transaction(transactionId, null, user, amount, remarks);
		transactions.push(transaction);

		// start qr expiry timer
		startQrExpiryTimer(transactionId);
		socket.emit(START_QR_TIMER, QR_EXPIRY_TIME_MINUTE);

		// generate and send QR
		const qrString = transactionId;
		const qrData = await generateFancyQR(qrString);
		socket.emit(REQUEST_BALANCE, qrData);
	});

	/**
	 * This event is triggered when the user scans the QR code.
	 * The event handler decodes the QR data sent from the client and emit backs the transaction details.
	 */
	socket.on(DECODE_QR, async (qr, ackcb) => {
		ackcb();

		// decode qr
		const decodedQr = await decodeImageQR(qr);
		console.log(decodedQr);

		// get the transaction from transactions
		const transactionId = decodedQr;
		const transaction = transactions.find((t) => t.id == transactionId);

		// if transaction does not exist
		if (!transaction) {
			socket.emit(TRANSACTION_STATUS, 'INVALID_QR');
			return;
		}

		// get the user id of the user who scanned the qr
		const sender = clients[socket.id];

		//send txn info
		socket.emit(DECODE_QR, transaction, sender);
	});

	/**
	 * This event is triggered when user accepts the transaction request.
	 * The event handler performs the transaction in the database and emits the transaction status.
	 */
	socket.on(ACCEPT_TRANSACTION, async (transactionId, ackcb) => {
		ackcb();
		// get the sender of the txn
		const sender = clients[socket.id];

		try {
			const transaction = findRemoveAndGetTransaction(transactionId);
			const result = await performTransaction(transaction, sender);

			for (const socketid in clients) {
				if (clients[socketid] == transaction.receiver) {
					io.to(socketid).emit(TRANSACTION_STATUS, `${result.message} by ${sender}`);
					io.to(socketid).emit(DISSOLVE_QR);
					break;
				}
			}
			socket.emit(TRANSACTION_STATUS, result.message);
		} catch (error) {
			let errorMessage = 'UNHANDLED_EXCEPTION';
			if (error.message == 'TXN_NOT_FOUND') errorMessage = 'INVALID_QR';
			return socket.emit(TRANSACTION_STATUS, errorMessage);
		}
	});

	/**
	 * This event is triggered when user rejects the transaction request.
	 * The event handler removes the `Transaction` from transactions and emits corresponding message.
	 */
	socket.on(REJECT_TRANSACTION, (transactionId, ackcb) => {
		ackcb();
		const transaction = findRemoveAndGetTransaction(transactionId);
		for (const socketid in clients) {
			if (clients[socketid] == transaction.receiver) {
				socket.emit('You cancelled this transaction.');
				io.to(socketid).emit(TRANSACTION_STATUS, `${transaction.sender} cancelled this transaction.`);
				io.to(socketid).emit(DISSOLVE_QR);
				break;
			}
		}
	});

	/**
	 * This event is triggered when user disconnects from the websocket server.
	 * The event handler removes the disconnected client from `clients`.
	 */

	socket.on('disconnect', () => {
		const user = clients[socket.id];
		console.log(`${user} disconncted`);
		console.log(`clients count: ${io.engine.clientsCount}`);
		delete clients[socket.id];
	});

	logIncomingAndOutgoingEvents(socket, true);
});

/**
 * This function removes the specifed `Transaction` from `transactions` (in-place) and returns it.
 * @param {string} transactionId the transaction uuid
 * @returns the removed `Transaction` object
 */
function findRemoveAndGetTransaction(transactionId) {
	const transactionIndex = transactions.findIndex((t) => t.id == transactionId);
	if (transactionIndex == -1) throw new Error('TXN_NOT_FOUND');
	const [transaction] = transactions.splice(transactionIndex, 1);
	return transaction;
}

/**
 * This function starts a expiry timer using `setTimeout()`. Upon completion, removes the `transaction` from `transactions`.
 * @param {string} transactionId the transaction for which to start the expiry timer
 */
function startQrExpiryTimer(transactionId) {
	setTimeout(() => {
		try {
			findRemoveAndGetTransaction(transactionId);
		} catch (error) {
			// console.log();
		}
	}, QR_EXPIRY_TIME_MINUTE * 60 * 1000);
}

server.listen(3001, () => {
	console.log('socketio server running at http://localhost:3001');
});
