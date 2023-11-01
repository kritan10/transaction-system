/* eslint-disable no-unused-vars */
import { createConnection } from 'mysql2';
import process from 'process';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const databaseOptions = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
};

const connection = createConnection(databaseOptions);
connection.query('SELECT 1', (err, result, fields) => {
	if (err) console.log(err);
	console.log('Database connected');
});

// try {
// 	const [rows, fields] = await connection.query('SELECT 1;');
// 	// console.log(databaseOptions);
// 	console.log('Database connected');
// } catch (err) {
// 	console.log(err);
// }

export default connection;
