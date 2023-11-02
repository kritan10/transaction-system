import { getUserById } from '../../db/dao/user/index.js';

async function getUserByIdService(call, callback) {
	const { user_id } = call.request;
	if (!user_id) return callback({ message: 'Missing fields' }, null); // check for empty user_id
	const user = await getUserById(user_id); // execute select
	if (!user) return callback({ message: 'User not found' }, null);
	return callback(null, user);
}

export default getUserByIdService;
