/* eslint-disable no-unused-vars */
import process from 'node:process';
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

// const connection = createConnection(databaseOptions);
// connection.query('SELECT 1', (err, result, fields) => {
// 	if (err) console.log(err);
// 	console.log('Database connected');
// });
const databaseOptions = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
};

const connection = await createConnection(databaseOptions);
try {
	const [rows, fields] = await connection.query('SELECT 1;');
	console.log('Database connected');
} catch (err) {
	console.log(err);
}

export default connection;
