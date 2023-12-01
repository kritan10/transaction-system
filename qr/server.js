import { createServer } from 'node:http';
import path from 'node:path';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import { generateFancyQR } from './qr.js';
import { SocketEvents } from '../common/socket-events.js';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('./'));
app.use(cors());

app.get('/', (req, res) => {
	res.sendFile(path.resolve('index.html'));
});

let clients = [];

io.on('connection', async (socket) => {
	console.log(io.engine.clientsCount);

	socket.on('ping', (ackcb) => {
		socket.emit('pong');
		ackcb();
	});

	socket.on(SocketEvents.QR_INITIATE, async (otp, transactionId, receiver, ackcb) => {
		const base64PngQR = await generateFancyQR(otp);
		const emitToUser = 'kritan';
		const emitTo = clients.filter((c) => c?.user === emitToUser);
		emitTo.forEach((c) => io.to(c?.socket).emit(SocketEvents.QR_INITIATE, base64PngQR, transactionId, receiver));
		ackcb();
	});

	socket.on(SocketEvents.QR_RESPONSE, (userotp, transactionId, ackcb) => {
		socket.broadcast.emit(SocketEvents.QR_RESPONSE, userotp, transactionId);
		ackcb();
	});

	socket.on(SocketEvents.TRANSACTION, (res, ackcb) => {
		socket.broadcast.emit(SocketEvents.TRANSACTION, res);
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
