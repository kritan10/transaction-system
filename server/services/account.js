import { makeTransaction } from '../db/dao/account/index.js';

async function sendBalanceService(call, callback) {
	const { sender_acc, receiver_acc, amount } = call.request;
	if (!sender_acc || !receiver_acc || !amount) return callback({ message: 'Missing fields' });

	const transaction = await makeTransaction(sender_acc, receiver_acc, amount);
	if (!transaction) return callback({ message: 'Something went wrong' });
	callback(null, { success: true, message: 'Balance transfer success' });
}

export { sendBalanceService };
