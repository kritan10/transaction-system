import { getUserById } from '../../db/dao/user/index.js';
import { RequestError, UserError, UserErrorCodes, customErrorHandler } from '../../errors/index.js';

async function getUserByIdService(call, callback) {
	const { user_id } = call.request;
	try {
		if (!user_id) throw new RequestError(RequestError.MISSING_PARAMS);
		const user = await getUserById(user_id); // execute select
		if (!user) throw new UserError(UserErrorCodes.NOT_FOUND);
		return callback(null, {
			...user,
			meta: {
				code: 1,
				status: 'OK',
				message: '',
			},
		});
	} catch (error) {
		return customErrorHandler(error, callback);
	}
}

export default getUserByIdService;
