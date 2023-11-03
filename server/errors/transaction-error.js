import TransactionErrorCodes from './transaction-error-codes.js';

class TransactionError extends Error {
	/**
	 * @param {TransactionErrorCodes} code error code for the transaction error
	 */
	constructor(code) {
		super();
		this.code = code;
		this.name = 'Database Error';
		switch (code) {
			case TransactionErrorCodes.INVALID_OTP:
				this.message = `Invalid OTP.`;
				break;

			case TransactionErrorCodes.NOT_FOUND:
				this.message = `Invalid transaction ID`;
				break;

			case TransactionErrorCodes.NOT_ALLOWED:
				this.message = 'This transaction is already completed. It cannot be modified.';
				break;

			case TransactionErrorCodes.INSUFFICIENT_BALANCE:
				this.message = 'Insufficient balance.';
				break;

			default:
				this.message = 'custom message';
				break;
		}
	}
}

export default TransactionError;
