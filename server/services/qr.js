import process from 'node:process';
import { io } from 'socket.io-client';
import { BalanceService } from '../proto/index.js';
import grpc from '@grpc/grpc-js';

var socket = null;

function initSocket() {
	return new Promise((resolve, reject) => {
		if (socket === null) socket = io('http://localhost:3001/', { ackTimeout: 30000, retries: 3 });
		if (socket !== null && socket.connected) return resolve('OK');

		socket.connect();

		socket.on('pong', () => {
			return resolve('OK');
		});

		socket.on('qr-response', (transactionId, userInput) => {
			const balanceClient = new BalanceService(`${process.env.GRPC_ADDRESS}:${process.env.GRPC_PORT}`, grpc.credentials.createInsecure());
			const params = { transaction_id: transactionId, otp: userInput };
			balanceClient.CompleteTransaction(params, (err, res) => {
				console.log(res);
				socket.emit('transaction-status', res);
			});
		});

		socket.emit('ping');

		setTimeout(() => {
			return reject('NOT_OK');
		}, 1000);
	});
}

function sendQRMessage(otp, transaction_id, receiver) {
	socket.emit('qr-initiate', otp, transaction_id, receiver);
}

export { sendQRMessage, initSocket };
