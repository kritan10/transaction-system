import process from 'node:process';
import { v4 } from 'uuid';
import dotenv from 'dotenv';

import { createTransaction } from '../../db/dao/transaction/index.js';
import { RequestError, TransactionError, TransactionErrorCodes, customErrorHandler } from '../../errors/index.js';
import { getAccountByAccountNumber, getBalanceByAccountNumber } from '../../db/dao/account/index.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

async function initiateTransactionService(call, callback) {
	const { sender_acc: senderAccount, receiver_acc: receiverAccount, amount: transactionAmount, remarks: remarks } = call.request;

	try {
		if (!senderAccount || !receiverAccount || !transactionAmount) throw new RequestError(RequestError.MISSING_PARAMS);
		const transactionId = v4();
		const otp = generateOTP();
		console.log(otp);
		await validateReceiverAccount(receiverAccount);
		await validateAmount(senderAccount, transactionAmount);
		await createTransaction(transactionId, senderAccount, receiverAccount, transactionAmount, 'pending', otp, 'transfer', remarks);

		return callback(null, {
			transaction_id: transactionId,
			otp: otp,
			meta: {
				code: 1,
				status: 'OK',
				message: 'Transaction initiation success.',
			},
		});
	} catch (error) {
		customErrorHandler(error, callback);
	}
}

function generateOTP() {
	return Math.floor(Math.random() * 1000000)
		.toString()
		.padStart(6, '0');
}

/**
 * This method checks if the receiver account exists in the database.
 * @param {number} receiver the account number of the receiver
 * @throws {TransactionError} if user is not found
 */
async function validateReceiverAccount(receiver) {
	const account = await getAccountByAccountNumber(receiver);
	if (!account) throw new TransactionError(TransactionErrorCodes.INVALID_RECEIVER);
}

/**
 * This method checks whether the requested amount to transfer is valid or not.
 * @param {number} sender the account number of the sender
 * @param {number} amount the amount to be sent
 * @throws {TransactionError} if the amount to be sent is greater than sender's current balance
 */
async function validateAmount(sender, amount) {
	const { balance } = await getBalanceByAccountNumber(sender);
	if (balance < amount) throw new TransactionError(TransactionErrorCodes.INSUFFICIENT_BALANCE);
}

export default initiateTransactionService;
