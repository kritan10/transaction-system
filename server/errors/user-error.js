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
				this.message = 'User not found.';
				break;

			case UserErrorCodes.INVALID_EMAIL:
				this.message = 'Invalid email address. Check email and try again.';
				break;

			case UserErrorCodes.INVALID_PASSWORD:
				this.message = 'Invalid password address. Password must be longer than 8 characters.';
				break;

			case UserErrorCodes.ALREADY_EXISTS:
				this.message = 'This user already exists.';
				break;

			default:
				this.message = 'message not implemented';
				break;
		}
	}
}

export default UserError;
