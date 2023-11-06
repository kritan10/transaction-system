import { getUserCredentialsByEmail } from '../../db/dao/user/index.js';
import { RequestError, UserError, UserErrorCodes, customErrorHandler } from '../../errors/index.js';

async function getUserCredentialsByEmailService(call, callback) {
	const { email } = call.request;
	try {
		if (!email) throw new RequestError(RequestError.MISSING_PARAMS); // check for empty email
		const user = await getUserCredentialsByEmail(email); // execute select
		if (!user) throw new UserError(UserErrorCodes.NOT_FOUND);
		return callback(null, {
			user_id: user.id,
			email: user.email,
			password: user.password,
			meta: {
				code: 1,
				status: 'OK',
				message: '',
			},
		});
	} catch (error) {
		customErrorHandler(error, callback);
	}
}

export default getUserCredentialsByEmailService;
