import { deleteUser } from '../../db/dao/user/index.js';

async function deleteUserService(call, callback) {
	const { user_id } = call.request;
	if (!user_id) return callback({ message: 'Missing fields' }, null); // check for empty user_id
	await deleteUser(user_id); // execute delete
	return callback(null, { message: 'User delete successful' });
}

export default deleteUserService;
