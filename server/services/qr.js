import process from 'node:process';
import { io } from 'socket.io-client';
import { BalanceService } from '../proto/index.js';
import grpc from '@grpc/grpc-js';
import dotenv from 'dotenv';
import { SocketEvents } from '../../common/socket-events.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

function initSocket() {
	let socket = null;

	return new Promise((resolve, reject) => {
		const socketAddress = `http://${process.env.SOCKETIO_ADDRESS}:${process.env.SOCKETIO_PORT}/`;
		if (socket === null) socket = io(socketAddress, { ackTimeout: 30000, retries: 3 });
		if (socket !== null && socket.connected) return socket;

		socket.connect();

		socket.on('pong', () => {
			return socket;
		});

		socket.on(SocketEvents.QR_RESPONSE, (transactionId, userId) => {
			const balanceClient = new BalanceService(`${process.env.GRPC_ADDRESS}:${process.env.GRPC_PORT}`, grpc.credentials.createInsecure());
			const params = { transaction_id: transactionId, sender: userId };
			balanceClient.CompleteQRRequestService(params, (err, res) => {
				socket.emit(SocketEvents.TRANSACTION, res);
			});
		});

		socket.emit('ping');

		setTimeout(() => {
			return reject('COULD_NOT_CONNECT_TO_WEBSOCKET');
		}, 1000);
	});
}

async function sendQRMessage(otp, transaction_id, receiver) {
	const socket = await initSocket();
	socket.emit(SocketEvents.QR_INITIATE, otp, transaction_id, receiver);
}

async function broadcastQRRequest(requestToken) {
	const socket = await initSocket();
	socket.emit(SocketEvents.QR_REQUEST, requestToken);
}

export { sendQRMessage, broadcastQRRequest };
