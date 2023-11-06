import grpc from '@grpc/grpc-js';

import { BalanceService, UserService } from './proto/index.js';
import { createUser, deleteUser, updateUser, getUserById, getUserByAccountNumber, getUserCredentialsByEmail } from './services/user/index.js';
import { createBalanceAccount, completeTransaction, initiateTransaction, loadBalance, getTransactionHistory } from './services/account/index.js';
import customErrorHandler from './errors/error-handler.js';

function main() {
	var server = new grpc.Server();

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

	server.bindAsync('0.0.0.0:3000', grpc.ServerCredentials.createInsecure(), (err, port) => {
		console.log(`Server started at port ${port}`);
		server.start();
	});
}

main();
