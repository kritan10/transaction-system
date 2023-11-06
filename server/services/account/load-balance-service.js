import { v4 } from 'uuid';
import { getBalanceByAccountNumber, updateBalance } from '../../db/dao/account/index.js';
import createTransaction from '../../db/dao/transaction/create-transaction.js';
import connection from '../../db/connection.js';
import customErrorHandler from '../../errors/error-handler.js';

async function loadBalanceService(call, callback) {
	const { account_number, amount } = call.request;
	if (!account_number || !amount) return callback({ message: 'Missing fields' });
	try {
		const account = await getBalanceByAccountNumber(account_number);
		const newBalance = account.balance + amount;
		connection.beginTransaction();
		await updateBalance(account_number, newBalance);
		await createTransaction(v4(), account_number, account_number, amount, 'success', null, 'load');
		connection.commit();
		const updatedAccount = await getBalanceByAccountNumber(account_number);
		return callback(null, {
			account_number: account_number,
			balance: updatedAccount.balance,
			meta: {
				code: 1,
				status: 'OK',
				message: 'Balance load success.',
			},
		});
	} catch (error) {
		connection.rollback();
		return customErrorHandler(error);
	}
}

export default loadBalanceService;
