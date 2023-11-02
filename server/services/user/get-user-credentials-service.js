import { getUserCredentialsByEmail } from '../../db/dao/user/index.js';

async function getUserCredentialsByEmailService(call, callback) {
	const { email } = call.request;
	if (!email) return callback({ message: 'Missing fields' }, null); // check for empty email
	const user = await getUserCredentialsByEmail(email); // execute select
	if (!user) return callback({ message: 'User not found' }, null);
	return callback(null, { user_id: user.id, email: user.email, password: user.password });
}

export default getUserCredentialsByEmailService;
