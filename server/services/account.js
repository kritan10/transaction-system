import { createBalanceAccount, makeTransaction } from '../db/dao/account/index.js';
import { sendTransactionCompleteMail } from './emailer.js';

async function sendBalanceService(call, callback) {
	const { sender_acc, receiver_acc, amount } = call.request;
	if (!sender_acc || !receiver_acc || !amount) return callback({ message: 'Missing fields' });

	const transaction = await makeTransaction(sender_acc, receiver_acc, amount);
	if (!transaction) return callback({ message: 'Something went wrong' });

	await sendTransactionCompleteMail();
	callback(null, { success: true, message: 'Balance transfer success' });
}

async function createBalanceAccountService(call, callback) {
	const { user_id, amount, account_type } = call.request;
	if (!user_id || !amount || !account_type) return callback({ message: 'Missing fields' });

	const account_number = await createBalanceAccount(user_id, account_type, amount);
	if (!account_number) return callback({ message: 'Error creating account' });

	callback(null, {});
}

export { sendBalanceService, createBalanceAccountService };
