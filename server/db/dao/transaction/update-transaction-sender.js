import connection from '../../connection.js';

async function updateTransactionSender(transaction_id, sender) {
	const statement = 'UPDATE Transactions SET sender=? WHERE id=?';
	const inserts = [sender, transaction_id];
	const [rows] = await connection.execute(statement, inserts);
	console.log(`--- UPDATE // id = ${transaction_id} // ${rows.affectedRows} ROWS UPDATED ---`);
}

export default updateTransactionSender;
