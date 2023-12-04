import dotenv from 'dotenv';
import process from 'process';
import connection from '../../db/connection.js';
import { getTransactionDetailsById, updateTransactionRetries, updateTransactionStatus } from '../../db/dao/transaction/index.js';
import { TransactionErrorCodes, TransactionError, customErrorHandler, RequestError } from '../../errors/index.js';
import { decreaseSenderBalance, increaseReceiverBalance } from './transaction_utils.js';
import { sendTransactionCompleteMail } from '../emailer.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

async function completeTransactionService(call, callback) {
	const { transaction_id, otp } = call.request;
	let transaction;
	try {
		if (!transaction_id || !otp) throw new RequestError(RequestError.MISSING_PARAMS);
		transaction = await getTransactionDetailsById(transaction_id);
		await verifyTransactionStatus(transaction);
		await verifyTransactionOTP(otp, transaction.otp, transaction.id, transaction.otp_retries);
		try {
			await connection.beginTransaction();
			await decreaseSenderBalance(transaction.sender, transaction.amount);
			await increaseReceiverBalance(transaction.receiver, transaction.amount);
			await updateTransactionStatus(transaction_id, 'success');
			await connection.commit();
		} catch (error) {
			await connection.rollback();
			console.log();
		}
		if (process.env.ENABLE_NODEMAILER != 0) await sendTransactionCompleteMail();

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
		// await connection.rollback();
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
