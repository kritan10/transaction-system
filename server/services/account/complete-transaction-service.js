import connection from '../../db/connection.js';
import { getBalanceByAccountNumber, updateBalance } from '../../db/dao/account/index.js';
import { getTransactionDetailsById, updateTransactionRetries, updateTransactionStatus } from '../../db/dao/transaction/index.js';
import { TransactionErrorCodes, TransactionError, customErrorHandler, RequestError } from '../../errors/index.js';

async function completeTransactionService(call, callback) {
	const { transaction_id, otp } = call.request;
	let transaction;
	try {
		if (!transaction_id || !otp) throw new RequestError(RequestError.MISSING_PARAMS);
		await connection.beginTransaction();
		transaction = await getTransactionDetailsById(transaction_id);
		await verifyTransactionStatus(transaction);
		await verifyTransactionOTP(otp, transaction.otp, transaction.id, transaction.otp_retries);
		await decreaseSenderBalance(transaction.sender, transaction.amount);
		await increaseReceiverBalance(transaction.receiver, transaction.amount);
		await updateTransactionStatus(transaction_id, 'success');
		await connection.commit();
		// await sendTransactionCompleteMail();

		return callback(null, {
			from: transaction.sender,
			to: transaction.receiver,
			amount: transaction.amount,
			transaction_date: transaction.created_at,
			meta: {
				status: 'OK',
				code: 1,
				message: 'Balance transferred succesfully',
			},
		});
	} catch (error) {
		await connection.rollback();
		if (error instanceof TransactionError && error.code === TransactionErrorCodes.INVALID_OTP) {
			await increaseOtpRetries(transaction.id, transaction.otp_retries);
		}
		if (error instanceof TransactionError && error.code === TransactionErrorCodes.OTP_LIMIT_REACHED) {
			await updateTransactionStatus(transaction.id, 'failed');
		}
		return customErrorHandler(error, callback);
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
	if (currentBalance < amount) throw new TransactionError(TransactionErrorCodes.INSUFFICIENT_BALANCE); // cant complete transaction if current balance is less than sending balance
	const newBalance = currentBalance - amount; // decrease balance
	await updateBalance(account_number, newBalance); // update balance
}

/**
 * This function is used to verify the OTP provided by the user
 * @param {number} userOTP the OTP code provided by the user
 * @param {number} actualOTP the OTP code that is stored in the database
 */
async function verifyTransactionOTP(userOTP, actualOTP) {
	if (userOTP.toString() === actualOTP.toString()) return;

	throw new TransactionError(TransactionErrorCodes.INVALID_OTP);
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

	if (transaction.otp_retries >= 2) throw new TransactionError(TransactionErrorCodes.OTP_LIMIT_REACHED);
}

async function increaseOtpRetries(transactionId, otpRetries) {
	await updateTransactionRetries(transactionId, otpRetries + 1);
}

export default completeTransactionService;
