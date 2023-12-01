import process from 'node:process';
import { io } from 'socket.io-client';
import { BalanceService } from '../proto/index.js';
import grpc from '@grpc/grpc-js';
import dotenv from 'dotenv';
import { SocketEvents } from '../../common/socket-events.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

var socket = null;

function initSocket() {
	return new Promise((resolve, reject) => {
		const socketAddress = `http://${process.env.SOCKETIO_ADDRESS}:${process.env.SOCKETIO_PORT}/`;
		if (socket === null) socket = io(socketAddress, { ackTimeout: 30000, retries: 3 });
		if (socket !== null && socket.connected) return resolve('OK');

		socket.connect();

		socket.on('pong', () => {
			return resolve('OK');
		});

		socket.on(SocketEvents.QR_RESPONSE, (transactionId, userInput) => {
			const balanceClient = new BalanceService(`${process.env.GRPC_ADDRESS}:${process.env.GRPC_PORT}`, grpc.credentials.createInsecure());
			const params = { transaction_id: transactionId, otp: userInput };
			balanceClient.CompleteTransaction(params, (err, res) => {
				socket.emit(SocketEvents.TRANSACTION, res);
			});
		});

		socket.emit('ping');

		setTimeout(() => {
			return reject('NOT_OK');
		}, 1000);
	});
}

function sendQRMessage(otp, transaction_id, receiver) {
	socket.emit(SocketEvents.QR_INITIATE, otp, transaction_id, receiver);
}

export { sendQRMessage, initSocket };
