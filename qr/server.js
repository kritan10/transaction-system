import { createServer } from 'node:http';
import path from 'node:path';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { generateFancyQR } from './qr.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('./'));
app.use(cors());

app.get('/', (req, res) => {
	res.sendFile(path.resolve('index.html'));
});

var clients = [];

io.on('connection', async (socket) => {
	console.log(io.engine.clientsCount);

	socket.on('ping', (ackcb) => {
		socket.emit('pong');
		ackcb();
	});

	socket.on('qr-initiate', async (otp, transactionId, receiver, ackcb) => {
		const qr = await generateFancyQR(otp);
		const emitTo = clients.filter((c) => c?.user === 'kritan');
		emitTo.forEach((c) => io.to(c?.socket).emit('qr-initiate', qr, transactionId, receiver));
		// socket.broadcast.emit();
		ackcb();
	});

	socket.on('qr-response', (userotp, transactionId, ackcb) => {
		socket.broadcast.emit('qr-response', userotp, transactionId);
		ackcb();
	});

	socket.on('transaction-status', (res, ackcb) => {
		socket.broadcast.emit('transaction-status', res);
		ackcb();
	});

	socket.on('init', (user, ackcb) => {
		clients.push({ user: user, socket: socket.id });
		console.log(`${user} connected`);
		ackcb();
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
