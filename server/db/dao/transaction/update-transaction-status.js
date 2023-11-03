import connection from '../../connection.js';

async function updateTransactionStatus(transaction_id, status) {
	const statement = 'UPDATE Transactions SET status=? WHERE id=?';
	const inserts = [status, transaction_id];
	const [rows] = await connection.execute(statement, inserts);
	console.log(`--- UPDATE // id = ${transaction_id} // ${rows.affectedRows} ROWS UPDATED ---`);
}

export default updateTransactionStatus;
