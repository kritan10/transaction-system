import connection from '../../connection.js';
import { getBalanceByAccountNumber } from './get-balance-by-account-number.js';
import { updateBalance } from './update-balance.js';

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

function createTransactionLog(senderAccount, receiverAccount, amount) {
	const statement = 'INSERT INTO Transactions(sender, receiver, transaction_amount, created_at) VALUES (?,?,?,?)';
	const inserts = [senderAccount, receiverAccount, amount, new Date()];
	connection.execute(statement, inserts, (err, result, fields) => {
		if (err) {
			return connection.rollback(function () {
				throw err;
			});
		}
		console.log(`--- TRANSACTION LOG // INSERT // receiver = ${receiverAccount} // sender = ${senderAccount} // ${result.affectedRows} ROWS INSERTED ---`);
	});
}

function makeTransaction(senderAccount, receiverAccount, transactionAmount) {
	return new Promise((resolve, reject) => {
		connection.beginTransaction(async (err) => {
			// check for transaction error
			if (err) return connection.rollback((err) => reject(err));

			try {
				await decreaseSenderBalance(senderAccount, transactionAmount);
				await increaseReceiverBalance(receiverAccount, transactionAmount);
				createTransactionLog(senderAccount, receiverAccount, transactionAmount);
			} catch (error) {
				return connection.rollback((err) => reject(err));
			}
			connection.commit(function (err) {
				if (err) return connection.rollback((err) => reject(err));
				console.log('success!');
				resolve(true);
			});
		});
	});
}

export default makeTransaction;
