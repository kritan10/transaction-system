import grpc from '@grpc/grpc-js';
import dotenv from 'dotenv';
import process from 'process';
import { BalanceService, UserService } from '../proto/index.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const userClient = new UserService(`${process.env.GRPC_ADDRESS}:${process.env.GRPC_PORT}`, grpc.credentials.createInsecure());
const balanceClient = new BalanceService(`${process.env.GRPC_ADDRESS}:${process.env.GRPC_PORT}`, grpc.credentials.createInsecure());

export { userClient, balanceClient };
