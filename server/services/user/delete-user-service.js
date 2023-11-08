import { deleteUser } from '../../db/dao/user/index.js';
import customErrorHandler from '../../errors/error-handler.js';
import UserErrorCodes from '../../errors/user-error-codes.js';
import UserError from '../../errors/user-error.js';

async function deleteUserService(call, callback) {
	try {
		const { user_id } = call.request;
		if (!user_id) throw new UserError(UserErrorCodes.NOT_FOUND); // check for empty user_id
		await deleteUser(user_id); // execute delete
		return callback(null, {
			meta: {
				code: 1,
				status: 'OK',
				message: 'User deletion success.',
			},
		});
	} catch (error) {
		return customErrorHandler(error, callback);
	}
}

export default deleteUserService;
