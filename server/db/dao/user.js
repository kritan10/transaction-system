import connection from '../connection.js';
import { v4 } from 'uuid';

function getUserById(id) {
	return new Promise((resolve, reject) => {
		const statement = 'SELECT account_number, name, email, balance FROM Users WHERE id=?;';
		const inserts = [id];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- SELECT // ID = ${id} // ${result[0]} ---`);
			resolve(result[0]);
		});
	});
}

function getUserDataByEmail(email) {
	return new Promise((resolve, reject) => {
		const statement = 'SELECT id, email, password FROM Users WHERE email=?;';
		const inserts = [email];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- SELECT // ${result[0]} ---`);
			resolve(result[0]);
		});
	});
}

function getUserByAccountNumber(acc_num) {
	return new Promise((resolve, reject) => {
		const statement = 'SELECT account_number, name, email, balance FROM Users WHERE account_number=?;';
		const inserts = [acc_num];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- SELECT // ID = ${acc_num} // ${result[0]} ---`);
			resolve(result[0]);
		});
	});
}

function createUser(name, email, password) {
	return new Promise((resolve, reject) => {
		const statement = 'INSERT INTO Users(id, name, email, password, createdAt) VALUES (?,?,?,?,?);';
		const inserts = [v4(), name, email, password, new Date()];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- INSERT // insertId=${result.insertId} // ${result.affectedRows} ROWS INSERTED ---`);
			return resolve(result.insertId);
		});
	});
}

function updateUser(id, name) {
	return new Promise((resolve, reject) => {
		const statement = 'UPDATE Users SET name=? WHERE id=?;';
		const inserts = [name, id];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- UPDATE // ID = ${id} // ${result.affectedRows} ROWS UPDATED ---`);
			resolve(result.affectedRows >= 1 ? true : false);
		});
	});
}

function deleteUser(id) {
	return new Promise((resolve, reject) => {
		const statement = 'DELETE FROM Users WHERE id=?;';
		const inserts = [id];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- DELETE // ID = ${id} // ${result.affectedRows} ROWS DELETED ---`);
			return resolve(result.affectedRows >= 1 ? true : false);
		});
	});
}

export { createUser, deleteUser, updateUser, getUserById, getUserByAccountNumber, getUserDataByEmail };
