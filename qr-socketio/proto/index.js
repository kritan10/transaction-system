import path from 'node:path';

import grpc from '@grpc/grpc-js';
import protoloader from '@grpc/proto-loader';

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

export { BalanceService, UserService };
