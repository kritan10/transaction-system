import path from 'node:path';
// import process from 'node:process';
import grpc from '@grpc/grpc-js';
import protoloader from '@grpc/proto-loader';
// dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

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

const balanceClient = new BalanceService(`0.0.0.0:50051`, grpc.credentials.createInsecure());
const userClient = new UserService(`0.0.0.0:50051`, grpc.credentials.createInsecure());

export { userClient, balanceClient };
