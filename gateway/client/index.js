import grpc from '@grpc/grpc-js';
import dotenv from 'dotenv';
import process from 'process';
import { UserService } from '../proto/index.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const client = new UserService(`${process.env.GRPC_ADDRESS}:${process.env.GRPC_PORT}`, grpc.credentials.createInsecure());

export { client };
