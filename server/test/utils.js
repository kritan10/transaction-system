import grpc from '@grpc/grpc-js';
import protoloader from '@grpc/proto-loader';
import path from 'path';

import { createUser, deleteUser, updateUser, getUserById, getUserByAccountNumber, getUserCredentialsByEmail } from '../services/user/index.js';
import { createBalanceAccount, sendBalance } from '../services/account/index.js';

const balancePackage = protoloader.loadSync(path.resolve('../common/proto/balance.proto'), {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const userPackage = protoloader.loadSync(path.resolve('../common/proto/user.proto'), {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});

const BalanceService = grpc.loadPackageDefinition(balancePackage).balance.BalanceService;
const UserService = grpc.loadPackageDefinition(userPackage).user.UserService;

function startMockServer() {
	var server = new grpc.Server();

	server.addService(UserService.service, {
		GetUserById: getUserById,
		GetUserByAccountNumber: getUserByAccountNumber,
		CreateUser: createUser,
		UpdateUser: updateUser,
		DeleteUser: deleteUser,
		GetUserCredentialsByEmail: getUserCredentialsByEmail,
	});

	server.addService(BalanceService.service, {
		SendBalance: sendBalance,
		CreateBalanceAccount: createBalanceAccount,
	});

	server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
		console.log(`Server started at port ${port}`);
		server.start();
	});
}

const userClient = new UserService('0.0.0.0:50051', grpc.credentials.createInsecure());
const balanceClient = new BalanceService('0.0.0.0:50051', grpc.credentials.createInsecure());

export { userClient, balanceClient };
