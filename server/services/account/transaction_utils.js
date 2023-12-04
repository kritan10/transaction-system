import { TransactionErrorCodes, TransactionError } from '../../errors/index.js';
import { updateBalance, getBalanceByAccountNumber } from '../../db/dao/account/index.js';

/**
 * This function is used for increasing the receiver balance.
 * @param {number} account_number the account that will receive the balance
 * @param {number} amount the amount to receive
 */
export async function increaseReceiverBalance(account_number, amount) {
	const { balance: currentBalance } = await getBalanceByAccountNumber(account_number); // fetch receiver's current balance
	const newBalance = currentBalance + amount; // increase balance
	await updateBalance(account_number, newBalance); // update balance
}

/**
 * This function is used for decreasing the sender balance.
 * @param {number} account_number the account that will send the balance
 * @param {number} amount the amount to send
 */
export async function decreaseSenderBalance(account_number, amount) {
	const { balance: currentBalance } = await getBalanceByAccountNumber(account_number); // fetch sender's current balance
	if (currentBalance < amount) throw new TransactionError(TransactionErrorCodes.INSUFFICIENT_BALANCE); // cant complete transaction if current balance is less than sending balance
	const newBalance = currentBalance - amount; // decrease balance
	await updateBalance(account_number, newBalance); // update balance
}
