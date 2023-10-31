/* eslint-disable no-unused-vars */
import { createConnection } from 'mysql2';
import process from 'process';
import dotenv from 'dotenv';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const db_info = `
    host: ${process.env.DB_HOST}
    user: ${process.env.DB_USER}
    password: ${process.env.DB_PASSWORD}
    database: ${process.env.DB_NAME}
    port: ${process.env.DB_PORT}`;
    
console.log(db_info);

const connection = createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
});

connection.query('SELECT 1', (err, result, fields) => {
	if (err) return console.log(err);
	console.log('\nDatabase Connected');
});

export default connection;
