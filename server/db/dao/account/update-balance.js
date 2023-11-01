import connection from '../../connection.js';

/**
 * this function updates the balance of the provided account.
 * it is promise based, so make sure to handle errors and rollbacks for transaction
 * @param {number} account the account to update
 * @param {number} balance the new balance to update
 * @returns void
 */
export function updateBalance(account, balance) {
	return new Promise((resolve, reject) => {
		const statement = 'UPDATE Accounts SET balance=? WHERE account_number=?;';
		const inserts = [balance, account];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			if (result.affectedRows < 1) reject(new Error('Record not updated'));
			console.log(`--- UPDATE // acc_num = ${account} // ${result.affectedRows} ROWS UPDATED ---`);
			resolve();
		});
	});
}
