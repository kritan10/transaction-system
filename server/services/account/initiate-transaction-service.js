import { v4 } from 'uuid';
import { createTransaction } from '../../db/dao/transaction/index.js';
import { TransactionError, TransactionErrorCodes } from '../../errors/index.js';

async function initiateTransactionService(call, callback) {
	const { sender_acc: senderAccount, receiver_acc: receiverAccount, amount: transactionAmount } = call.request;
	if (!senderAccount || !receiverAccount || !transactionAmount) return callback({ message: 'Missing fields' });

	try {
		const transactionId = v4();
		const otp = generateOTP();
		await createTransaction(transactionId, senderAccount, receiverAccount, transactionAmount, otp);
		return callback(null, { transaction_id: transactionId });
	} catch (error) {
		if (error instanceof TransactionError) {
			return callback({ message: error.message });
		}
		return callback({ message: 'Transaction failed' });
	}
}

function generateOTP() {
	return Math.floor(Math.random() * 1000000)
		.toString()
		.padStart(6, '0');
}

export default initiateTransactionService;
