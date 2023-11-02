import connection from '../../connection.js';

async function getUserByAccountNumber(acc_num) {
	const statement = `
		SELECT account_number, name, email, balance 
		FROM Users 
		JOIN Accounts ON Users.id=Accounts.account_holder
		WHERE account_number=?;`;
	const inserts = [acc_num];
	const [rows] = await connection.execute(statement, inserts);
	return rows[0];
}

export default getUserByAccountNumber;
