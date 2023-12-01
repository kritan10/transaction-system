import process from 'node:process';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

export const databaseOptions = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
};
