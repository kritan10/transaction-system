import connection from '../../connection.js';

async function getUserById(id) {
	const statement = `
		SELECT account_number, name, email, balance 
		FROM Users 
		JOIN Accounts ON Users.id=Accounts.account_holder
		WHERE Users.id=?;`;
	const inserts = [id];
	const [rows] = await connection.execute(statement, inserts);
	console.log(`--- SELECT // ID = ${id} // ${rows[0]} ---`);
	return rows[0];
}

export default getUserById;
