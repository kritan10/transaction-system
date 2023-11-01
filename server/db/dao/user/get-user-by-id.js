import connection from '../../connection.js';

function getUserById(id) {
	return new Promise((resolve, reject) => {
		const statement = `
		SELECT account_number, name, email, balance 
		FROM Users 
		JOIN Accounts ON Users.id=Accounts.account_holder
		WHERE Users.id=?;`;
		const inserts = [id];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- SELECT // ID = ${id} // ${result[0]} ---`);
			resolve(result[0]);
		});
	});
}

export default getUserById;
