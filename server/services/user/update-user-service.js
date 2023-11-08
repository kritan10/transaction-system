import { getUserById, updateUser } from '../../db/dao/user/index.js';
import { RequestError, customErrorHandler } from '../../errors/index.js';

async function updateUserService(call, callback) {
	try {
		const { user_id, name } = call.request;
		if (!user_id || !name) throw new RequestError(RequestError.MISSING_PARAMS); // check for empty user_id
		await updateUser(user_id, name); // execute update

		const user = await getUserById(user_id);
		if (!user) throw new Error();

		return callback(null, {
			name: user.name,
			email: user.email,
			meta: {
				code: 1,
				status: 'OK',
				message: 'User update success.',
			},
		});
	} catch (error) {
		customErrorHandler(error, callback);
	}
}

export default updateUserService;
