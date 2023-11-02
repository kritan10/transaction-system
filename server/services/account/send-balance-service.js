import { sendTransactionCompleteMail } from '../emailer.js';
import connection from '../../db/connection.js';
import { getBalanceByAccountNumber, updateBalance } from '../../db/dao/account/index.js';

async function sendBalanceService(call, callback) {
	const { sender_acc: senderAccount, receiver_acc: receiverAccount, amount: transactionAmount } = call.request;
	if (!senderAccount || !receiverAccount || !transactionAmount) return callback({ message: 'Missing fields' });

	try {
		await connection.beginTransaction();
		await decreaseSenderBalance(senderAccount, transactionAmount);
		await increaseReceiverBalance(receiverAccount, transactionAmount);
		await createTransactionLog(senderAccount, receiverAccount, transactionAmount);
		await sendTransactionCompleteMail();
		await connection.commit();
		return callback(null, { success: true, message: 'Balance transfer success' });
	} catch (error) {
		await connection.rollback();
		return callback({ message: 'Error' });
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

async function createTransactionLog(senderAccount, receiverAccount, amount) {
	const statement = 'INSERT INTO Transactions(sender, receiver, transaction_amount, created_at) VALUES (?,?,?,?)';
	const inserts = [senderAccount, receiverAccount, amount, new Date()];
	const [rows] = await connection.execute(statement, inserts);
	console.log(`--- TRANSACTION LOG // receiver = ${receiverAccount} // sender = ${senderAccount} // ${rows.affectedRows} ROWS INSERTED ---`);
}

export default sendBalanceService;
