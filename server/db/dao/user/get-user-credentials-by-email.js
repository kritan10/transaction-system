import connection from '../../connection.js';

async function getUserCredentialsByEmail(email) {
	const statement = `
		SELECT id, email, password 
		FROM Users
		WHERE email=?;`;
	const inserts = [email];
	const [rows] = await connection.execute(statement, inserts);
	console.log(`--- SELECT // ${rows[0]} ---`);
	return rows[0];
}

export default getUserCredentialsByEmail;
