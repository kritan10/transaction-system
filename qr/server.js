import { createServer } from 'node:http';
import path from 'node:path';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import qrcode from 'qrcode';

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('./'));
app.use(cors());

app.get('/', (req, res) => {
	res.sendFile(path.resolve('index.html'));
});

io.on('connection', async (socket) => {
	socket.on('ping', (ackcb) => {
		socket.emit('pong');
		ackcb();
	});
	socket.on('qr-initiate', async (otp, receiver, ackcb) => {
		const qr = await qrcode.toDataURL(otp);
		socket.broadcast.emit('qr-initiate', qr, receiver);
		ackcb();
	});

	socket.on('qr-response', (userotp, ackcb) => {
		socket.broadcast.emit('qr-response', userotp);
		ackcb();
	});

	socket.on('transaction-status', (res, ackcb) => {
		socket.broadcast.emit('transaction-status', res);
		io.emit('destroy');
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
