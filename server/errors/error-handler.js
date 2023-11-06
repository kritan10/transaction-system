import { RequestError, TransactionError, UserError } from './index.js';

/**
 *
 * @param {Error} error
 * @param {*} callback
 */
function customErrorHandler(error, callback) {
	if (error instanceof TransactionError || error instanceof RequestError || error instanceof UserError) {
		return callback(null, {
			meta: {
				code: error.code,
				status: 'FAILED',
				message: error.message,
			},
		});
	}
	return callback({ message: 'EXCEPTION_NOT_HANDLED' });
}

export default customErrorHandler;
