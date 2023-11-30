import process from 'node:process';
import grpc from '@grpc/grpc-js';
import dotenv from 'dotenv';
import { BalanceService, UserService } from './proto/index.js';
import { createUser, deleteUser, updateUser, getUserById, getUserByAccountNumber, getUserCredentialsByEmail } from './services/user/index.js';
import { createBalanceAccount, completeTransaction, initiateTransaction, loadBalance, getTransactionHistory } from './services/account/index.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

/**
 * This method is starts the server at the configured address/port.
 */
function main() {

	const server = new grpc.Server();

	server.addService(UserService.service, {
		GetUserById: getUserById,
		GetUserByAccountNumber: getUserByAccountNumber,
		CreateUser: createUser,
		UpdateUser: updateUser,
		DeleteUser: deleteUser,
		GetUserCredentialsByEmail: getUserCredentialsByEmail,
	});

	server.addService(BalanceService.service, {
		InitiateTransaction: initiateTransaction,
		LoadBalance: loadBalance,
		CompleteTransaction: completeTransaction,
		CreateBalanceAccount: createBalanceAccount,
		GetTransactionHistoryByUser: getTransactionHistory,
	});

	server.bindAsync(`${process.env.GRPC_ADDRESS}:${process.env.GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
		console.log(`Server started at port ${port}`);
		server.start();
	});
}

main();
