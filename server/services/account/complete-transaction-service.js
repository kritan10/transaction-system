import connection from '../../db/connection.js';
import { getBalanceByAccountNumber, updateBalance } from '../../db/dao/account/index.js';
import { getTransactionDetailsById, updateTransactionStatus } from '../../db/dao/transaction/index.js';
import { TransactionErrorCodes, TransactionError } from '../../errors/index.js';

async function completeTransactionService(call, callback) {
	const { transaction_id, otp } = call.request;

	try {
		await connection.beginTransaction();
		const transaction = await getTransactionDetailsById(transaction_id);
		await verifyTransactionStatus(transaction);
		await verifyTransactionOTP(otp, transaction.otp);
		await decreaseSenderBalance(transaction.sender, transaction.transaction_amount);
		await increaseReceiverBalance(transaction.receiver, transaction.transaction_amount);
		await updateTransactionStatus(transaction_id, 'success');
		await connection.commit();
		// await sendTransactionCompleteMail();
		return callback(null, { success: true, message: 'Balance transfer success' });
	} catch (error) {
		await connection.rollback();
		return callback({ message: error.message });
	}
}

/**
 * This function is used for increasing the receiver balance.
 * @param {number} account_number the account that will receive the balance
 * @param {number} amount the amount to receive
 */
async function increaseReceiverBalance(account_number, amount) {
	const { balance: currentBalance } = await getBalanceByAccountNumber(account_number); // fetch receiver's current balance
	const newBalance = currentBalance + amount; // increase balance
	await updateBalance(account_number, newBalance); // update balance
}

/**
 * This function is used for decreasing the sender balance.
 * @param {number} account_number the account that will send the balance
 * @param {number} amount the amount to send
 */
async function decreaseSenderBalance(account_number, amount) {
	const { balance: currentBalance } = await getBalanceByAccountNumber(account_number); // fetch sender's current balance
	if (currentBalance < amount) throw new Error('Not enough balance'); // cant complete transaction if current balance is less than sending balance
	const newBalance = currentBalance - amount; // decrease balance
	await updateBalance(account_number, newBalance); // update balance
}

/**
 * This function is used to verify the OTP provided by the user
 * @param {number} userOTP the OTP code provided by the user
 * @param {number} actualOTP the OTP code that is stored in the database
 */
async function verifyTransactionOTP(userOTP, actualOTP) {
	if (userOTP.toString() !== actualOTP.toString()) throw new TransactionError(TransactionErrorCodes.INVALID_OTP);
}

/**
 * This method does two things:
 * verify if the transaction exists and,
 * verify the transaction is in a pending state
 * @param {object} transaction the transaction instance
 */
async function verifyTransactionStatus(transaction) {
	if (!transaction) throw new TransactionError(TransactionErrorCodes.NOT_FOUND);

	if (transaction.status !== 'pending') throw new TransactionError(TransactionErrorCodes.NOT_ALLOWED);
}

export default completeTransactionService;
