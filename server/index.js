import grpc from '@grpc/grpc-js';

import { BalanceService, UserService } from './proto/index.js';
import { createUser, deleteUser, getUser, updateUser, getUserByAccountNumber, getUserCredentialsByEmail } from './services/user.js';
import { sendBalanceService } from './services/account.js';

function main() {
	var server = new grpc.Server();

	server.addService(UserService, {
		GetUserById: getUser,
		CreateUser: createUser,
		UpdateUser: updateUser,
		DeleteUser: deleteUser,
		GetUserByAccountNumber: getUserByAccountNumber,
		GetUserDataByEmail: getUserCredentialsByEmail,
	});

	server.addService(BalanceService, {
		SendBalance: sendBalanceService,
	});

	server.bindAsync('0.0.0.0:3000', grpc.ServerCredentials.createInsecure(), (err, port) => {
		console.log(port);
		server.start();
	});
}

// try {
// 	main();
// } catch (e) {
// 	console.log(e);
// }

main();
