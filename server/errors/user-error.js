import UserErrorCodes from './user-error-codes.js';

class UserError extends Error {
	/**
	 * @param {UserErrorCodes} code error code for the transaction error
	 */
	constructor(code) {
		super();
		this.code = code;
		this.name = 'User Error';
		switch (code) {
			case UserErrorCodes.NOT_FOUND:
				this.message = `User not found.`;
				break;

			default:
				this.message = 'message not implemented';
				break;
		}
	}
}

export default UserError;
