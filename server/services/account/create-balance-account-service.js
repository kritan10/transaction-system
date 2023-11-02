import { createBalanceAccount } from '../../db/dao/account/index.js';

async function createBalanceAccountService(call, callback) {
	const { user_id, amount, account_type } = call.request;
	if (!user_id || !amount || !account_type) return callback({ message: 'Missing fields' });

	const account_number = await createBalanceAccount(user_id, account_type, amount);
	if (!account_number) return callback({ message: 'Error creating account' });

	callback(null, {});
}

export default createBalanceAccountService;
