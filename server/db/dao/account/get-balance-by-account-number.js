import connection from '../../connection.js';

async function getBalanceByAccountNumber(account_number) {
	const statement = `SELECT balance FROM Accounts WHERE account_number=?;`;
	const inserts = [account_number];
	const [rows] = await connection.execute(statement, inserts);
	console.log(`--- SELECT // ID = ${account_number} // ${rows[0]} ---`);
	return rows[0];
}

export default getBalanceByAccountNumber;
