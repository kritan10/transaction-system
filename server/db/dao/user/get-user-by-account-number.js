import connection from '../../connection.js';

function getUserByAccountNumber(acc_num) {
	return new Promise((resolve, reject) => {
		const statement = `
		SELECT account_number, name, email, balance 
		FROM Users 
		JOIN Accounts ON Users.id=Accounts.account_holder
		WHERE account_number=?;`;
		const inserts = [acc_num];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- SELECT // ID = ${acc_num} // ${result[0]} ---`);
			resolve(result[0]);
		});
	});
}

export default getUserByAccountNumber;
