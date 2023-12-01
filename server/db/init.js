import process from 'node:process';
import path from 'node:path';
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(`.env.${process.env.NODE_ENV}`) });

const databaseOptions = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
};

async function initSchema() {
	const conn = await createConnection({ ...databaseOptions });
	const result = await conn.execute(`CREATE SCHEMA IF NOT EXISTS ${process.env.DB_NAME}`);
	conn.destroy();
	return result;
}

try {
	await initSchema();
} catch (error) {
	console.log(error);
	console.log('Failed creating schema.');
}
