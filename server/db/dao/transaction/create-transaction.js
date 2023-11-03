import connection from '../../connection.js';
import { DatabaseError, DatabaseErrorCodes } from '../../../errors/index.js';
import Tables from '../../constants/tables.js';

async function createTransaction(transactionId, senderAccount, receiverAccount, amount, status, otp, transactionType) {
	const statement = 'INSERT INTO Transactions(id, sender, receiver, amount, status, otp, type, created_at) VALUES (?,?,?,?,?,?,?,?)';
	const inserts = [transactionId, senderAccount, receiverAccount, amount, status, otp, transactionType, new Date()];
	const [rows] = await connection.execute(statement, inserts);
	if (rows.affectedRows < 1) throw new DatabaseError(DatabaseErrorCodes.INSERT, Tables.Transaction);
	console.log(`--- CREATE TRANSACTION // receiver = ${receiverAccount} // sender = ${senderAccount} // ${rows.affectedRows} ROWS INSERTED ---`);
}

export default createTransaction;
