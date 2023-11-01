import connection from '../../connection.js';

export function getBalanceByAccountNumber(account_number) {
	return new Promise((resolve, reject) => {
		const statement = `SELECT balance FROM Accounts WHERE account_number=?;`;
		const inserts = [account_number];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- SELECT // ID = ${account_number} // ${result[0]} ---`);
			resolve(result[0]);
		});
	});
}
