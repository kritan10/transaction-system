import grpc from '@grpc/grpc-js';
import { connect } from 'amqplib';
import { BalanceService, UserService } from './proto/index.js';
import { createUser, deleteUser, updateUser, getUserById, getUserByAccountNumber, getUserCredentialsByEmail } from './services/user/index.js';
import { createBalanceAccount, completeTransaction, initiateTransaction, loadBalance, getTransactionHistory } from './services/account/index.js';

function startServer(port) {
	let server = new grpc.Server();

	server.addService(UserService, {
		GetUserById: getUserById,
		GetUserByAccountNumber: getUserByAccountNumber,
		CreateUser: createUser,
		UpdateUser: updateUser,
		DeleteUser: deleteUser,
		GetUserCredentialsByEmail: getUserCredentialsByEmail,
	});

	server.addService(BalanceService, {
		InitiateTransaction: initiateTransaction,
		LoadBalance: loadBalance,
		CompleteTransaction: completeTransaction,
		CreateBalanceAccount: createBalanceAccount,
		GetTransactionHistoryByUser: getTransactionHistory,
	});

	server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
		setupBroker(port);
		console.log(`Server started at port ${port}`);
		server.start();
	});
}

async function setupBroker(serverPort) {
	const queue = 'rpc_queue';

	const connection = await connect('amqp://localhost');
	const channel = await connection.createChannel();

	await channel.assertQueue(queue, { durable: false });
	channel.prefetch(1);
	console.log(`[x] Awaiting RPC requests at port ${serverPort}`);

	channel.consume(queue, (msg) => {
		const message = msg.content.toString();
		console.log(message, serverPort);
		let result = null;
		// switch (method) {
		// 	case 1:
		// 		result = addNum(args[0], args[1]);
		// 		break;

		// 	case 2:
		// 		result = subtractNum(args[0], args[1]);
		// 		break;

		// 	default:
		// 		break;
		// }
		// console.log(`method:${method}, args:${args}`);

		const { replyTo, correlationId } = msg.properties;
		console.log(replyTo, correlationId);
		channel.sendToQueue(replyTo, Buffer.from('response'), {
			correlationId: correlationId,
		});
		channel.ack(msg);
	});
}

startServer(3000);
startServer(3001);
startServer(3002);
