import connection from '../../connection.js';

export function createBalanceAccount(user_id, account_type, amount) {
	return new Promise((resolve, reject) => {
		const statement = `INSERT INTO Accounts(account_holder, account_type, balance) VALUES ?,?,?;`;
		const inserts = [user_id, account_type, amount];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- SELECT // ID = ${result.insertId} // ${result[0]} ---`);
			resolve(result[0]);
		});
	});
}
