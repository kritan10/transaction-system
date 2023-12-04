import path from 'node:path';
import { createServer } from 'node:http';

import cors from 'cors';
import { v4 } from 'uuid';
import express from 'express';
import { Server } from 'socket.io';

import { decodeImageQR, generateFancyQR } from './qr.js';
import { balanceClient } from './grpc-client.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('./'));
app.use(cors());

app.get('/', (req, res) => {
	res.sendFile(path.resolve('index.html'));
});

const USER_LOGIN = 1;
const REQUEST_BALANCE = 2;
const TRANSFER_BALANCE = 3;
const VERIFY_TRANSACTION = 4;

let clients = [];
let transactions = [];

io.on('connection', async (socket) => {
	console.log(io.engine.clientsCount);

	socket.on(USER_LOGIN, (user, ackcb) => {
		clients.push({ user: user, socket: socket.id });
		console.log(`${user} connected`);
		ackcb();
	});

	socket.on(REQUEST_BALANCE, async (amount, remarks, ackcb) => {
		const userObj = clients.find((c) => c.socket == socket.id);
		const user = userObj?.user;
		console.log(`${user} requested ${amount}`);
		const transactionId = v4();
		const transaction = {
			id: transactionId,
			sender: null,
			receiver: user,
			amount: amount,
			remarks: remarks,
			status: 'pending',
		};
		transactions.push(transaction);
		const qrString = transactionId;
		const qrData = await generateFancyQR(qrString);
		socket.broadcast.emit(REQUEST_BALANCE, qrData);
		ackcb();
	});

	socket.on(TRANSFER_BALANCE, async (qr, ackcb) => {
		// get sender from socketid
		const senderObj = clients.find((c) => c.socket == socket.id);
		const sender = senderObj?.user;

		// decode qr
		const decodedQr = await decodeImageQR(qr);
		console.log(decodedQr);

		// get the transaction from transactions
		const transactionId = decodedQr;
		const transactionIndex = transactions.findIndex((t) => t.id == transactionId);
		const transaction = transactions[transactionIndex];

		if (transaction?.status != 'pending') {
			return socket.emit(VERIFY_TRANSACTION, 'QR already used.');
		}
		// set the sender of the txn
		const mTransaction = { ...transaction, sender: sender };
		transactions[transactionIndex] = mTransaction;

		//emit txn info
		socket.emit(TRANSFER_BALANCE, mTransaction);
		ackcb();
	});

	socket.on(VERIFY_TRANSACTION, (success, transactionId, ackcb) => {
		console.log(success);
		ackcb();
		const transactionIndex = transactions.findIndex((t) => t.id == transactionId);
		const transaction = transactions[transactionIndex];

		if (success) {
			// socket.emit(VERIFY_TRANSACTION, 'Balanced transferred succesfully');
			const params = {
				sender_acc: transaction.sender,
				receiver_acc: transaction.receiver,
				amount: transaction.amount,
			};
			balanceClient.InitiateTransaction(params, (err, res) => {
				if (err) console.error(err);
				console.log(res);
				const params = { transaction_id: res.transaction_id, otp: res.otp };
				balanceClient.CompleteTransaction(params, (err, res) => {
					if (err) console.error(err);
					console.log(res);
					const { meta } = res;
					socket.emit(VERIFY_TRANSACTION, meta?.message);
				});
			});
		} else {
			socket.emit(VERIFY_TRANSACTION, 'You canceled this transaction');
		}

		// set the sender of the txn
		const mTransaction = { ...transaction, status: success ? 'success' : 'cancelled' };
		transactions[transactionIndex] = mTransaction;

		//grpc ma transaction
		// ackcb();
	});

	logIncomingAndOutgoingEvents(socket, true);
});

function logIncomingAndOutgoingEvents(socket, enabled) {
	if (!enabled) return;
	socket.onAny((eventName, ...args) => {
		console.log(`incoming event: ${eventName}`); // 'hello'
		// console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
	});

	socket.onAnyOutgoing((eventName, ...args) => {
		console.log(`outgoing event: ${eventName}`); // 'hello'
		// console.log(args); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
	});
}

server.listen(3001, () => {
	console.log('socketio server running at http://localhost:3001');
});
