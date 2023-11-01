import connection from '../../connection.js';

function getUserCredentialsByEmail(email) {
	return new Promise((resolve, reject) => {
		const statement = `
		SELECT id, email, password 
		FROM Users
		WHERE email=?;`;
		const inserts = [email];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- SELECT // ${result[0]} ---`);
			resolve(result[0]);
		});
	});
}

export default getUserCredentialsByEmail;
