import { io } from 'socket.io-client';
import { BalanceService } from '../proto/index.js';
import grpc from '@grpc/grpc-js';

let socket = null;

function initSocket(transaction_id) {
	return new Promise((resolve, reject) => {
		socket = io('http://localhost:3001/', { ackTimeout: 30000, retries: 3 });

		socket.on('pong', () => {
			resolve('OK');
		});

		socket.on('qr-response', (userInput) => {
			const balanceClient = new BalanceService('0.0.0.0:3000', grpc.credentials.createInsecure());
			const params = { transaction_id: transaction_id, otp: userInput };
			balanceClient.CompleteTransaction(params, (err, res) => {
				console.log(res);
				socket.emit('transaction-status', res);
			});
		});

		socket.on('destroy', () => {
			socket.removeAllListeners();
			socket.disconnect();
		});

		socket.emit('ping');
	});
}

function sendQRMessage(otp, receiver) {
	socket.emit('qr-initiate', otp, receiver);
}

export { sendQRMessage, initSocket };
