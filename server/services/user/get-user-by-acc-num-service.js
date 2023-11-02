import { getUserByAccountNumber } from '../../db/dao/user/index.js';

async function getUserByAccountNumberService(call, callback) {
	const { acc_num } = call.request;
	if (!acc_num) return callback({ message: 'Missing fields' }, null); // check for empty account number
	const user = await getUserByAccountNumber(acc_num); // execute select
	if (!user) return callback({ message: 'User not found' }, null);
	return callback(null, user);
}

export default getUserByAccountNumberService;
