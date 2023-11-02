import { updateUser } from '../../db/dao/user/index.js';

async function updateUserService(call, callback) {
	const { user_id, name } = call.request;
	if (!user_id || !name) return callback({ message: 'Missing fields' }, null); // check for empty user_id
	await updateUser(user_id, name); // execute update
	return callback(null, { message: 'User update successful' });
}

export default updateUserService;
