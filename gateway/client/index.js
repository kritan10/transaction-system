import grpc from '@grpc/grpc-js';
import dotenv from 'dotenv';
import process from 'process';
import { BalanceService, UserService } from '../proto/index.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const userClient1 = new UserService(`${process.env.GRPC_ADDRESS}:3000`, grpc.credentials.createInsecure());
const userClient2 = new UserService(`${process.env.GRPC_ADDRESS}:3001`, grpc.credentials.createInsecure());
function userClient(client) {
	if (client === 0) {
		return userClient1;
	}
	return userClient2;
}

const balanceClient1 = new BalanceService(`${process.env.GRPC_ADDRESS}:3000`, grpc.credentials.createInsecure());
const balanceClient2 = new BalanceService(`${process.env.GRPC_ADDRESS}:3001`, grpc.credentials.createInsecure());
function balanceClient(client) {
	if (client === 0) {
		return balanceClient1;
	}
	return balanceClient2;
}

export { userClient, balanceClient };
