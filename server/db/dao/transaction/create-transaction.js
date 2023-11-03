import connection from '../../connection.js';
import { DatabaseError, DatabaseErrorCodes } from '../../../errors/index.js';
import Tables from '../../constants/tables.js';

async function createTransaction(transactionId, senderAccount, receiverAccount, amount, otp) {
	const statement = 'INSERT INTO Transactions(id, sender, receiver, transaction_amount, status, otp, created_at) VALUES (?,?,?,?,?,?,?)';
	const inserts = [transactionId, senderAccount, receiverAccount, amount, 'pending', otp, new Date()];
	const [rows] = await connection.execute(statement, inserts);
	if (rows.affectedRows < 1) throw new DatabaseError(DatabaseErrorCodes.INSERT, Tables.Transaction);
	console.log(`--- CREATE TRANSACTION // receiver = ${receiverAccount} // sender = ${senderAccount} // ${rows.affectedRows} ROWS INSERTED ---`);
}

export default createTransaction;
