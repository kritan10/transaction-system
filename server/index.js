import grpc from '@grpc/grpc-js';

import { BalanceService, UserService } from './proto/index.js';
import { createUser, deleteUser, updateUser, getUserById, getUserByAccountNumber, getUserCredentialsByEmail } from './services/user/index.js';

import { createBalanceAccount, sendBalance } from './services/account/index.js';

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
		SendBalance: sendBalance,
		CreateBalanceAccount: createBalanceAccount,
	});

	server.bindAsync('0.0.0.0:3000', grpc.ServerCredentials.createInsecure(), (err, port) => {
		console.log(`Server started at port ${port}`);
		server.start();
	});
}

main();
