import grpc from '@grpc/grpc-js';
import protoloader from '@grpc/proto-loader';
import path from 'path';

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

const BalanceService = grpc.loadPackageDefinition(balancePackage).balance.BalanceService.service;
const UserService = grpc.loadPackageDefinition(userPackage).user.UserService.service;

export { BalanceService, UserService };
