import connection from '../../connection.js';

async function getTransactionDetailsById(transaction_id) {
	const statement = 'SELECT * FROM Transactions WHERE id=?';
	const inserts = [transaction_id];
	const [rows] = await connection.execute(statement, inserts);
	console.log(`--- SELECT // id = ${transaction_id} // 1 ROWS SELECTED ---`);
	return rows[0];
}

export default getTransactionDetailsById;
