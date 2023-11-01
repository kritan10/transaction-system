import grpc from '@grpc/grpc-js';

import { BalanceService, UserService } from './proto/index.js';
import { createUserService, deleteUserService, updateUserService, getUserByIdService, getUserByAccountNumberService, getUserCredentialsByEmailService } from './services/user.js';
import { createBalanceAccountService, sendBalanceService } from './services/account.js';

function main() {
	var server = new grpc.Server();

	server.addService(UserService, {
		GetUserById: getUserByIdService,
		GetUserByAccountNumber: getUserByAccountNumberService,
		CreateUser: createUserService,
		UpdateUser: updateUserService,
		DeleteUser: deleteUserService,
		GetUserDataByEmail: getUserCredentialsByEmailService,
	});

	server.addService(BalanceService, {
		SendBalance: sendBalanceService,
		CreateBalanceAccount: createBalanceAccountService,
	});

	server.bindAsync('0.0.0.0:3000', grpc.ServerCredentials.createInsecure(), (err, port) => {
		console.log(port);
		server.start();
	});
}

main()