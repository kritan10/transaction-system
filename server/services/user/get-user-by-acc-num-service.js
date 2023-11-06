import { getUserByAccountNumber } from '../../db/dao/user/index.js';
import { RequestError, UserError, UserErrorCodes, customErrorHandler } from '../../errors/index.js';

async function getUserByAccountNumberService(call, callback) {
	const { acc_num } = call.request;
	try {
		if (!acc_num) throw new RequestError(RequestError.MISSING_PARAMS); // check for empty account number
		const user = await getUserByAccountNumber(acc_num); // execute select
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
		customErrorHandler(error, callback);
	}
}

export default getUserByAccountNumberService;
