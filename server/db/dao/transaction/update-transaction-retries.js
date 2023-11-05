import connection from '../../connection.js';

async function updateTransactionRetries(transaction_id, otpRetries) {
	const statement = 'UPDATE Transactions SET otp_retries=? WHERE id=?';
	const inserts = [otpRetries, transaction_id];
	const [rows] = await connection.execute(statement, inserts);
	console.log(`--- UPDATE // id = ${transaction_id} // ${rows.affectedRows} ROWS UPDATED ---`);
}

export default updateTransactionRetries;
