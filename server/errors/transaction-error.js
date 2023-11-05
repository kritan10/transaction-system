import TransactionErrorCodes from './transaction-error-codes.js';

class TransactionError extends Error {
	/**
	 * @param {TransactionErrorCodes} code error code for the transaction error
	 */
	constructor(code) {
		super();
		this.code = code;
		this.name = 'Transaction Error';
		switch (code) {
			case TransactionErrorCodes.INVALID_OTP:
				this.message = `Invalid OTP.`;
				break;

			case TransactionErrorCodes.NOT_FOUND:
				this.message = `Invalid transaction ID`;
				break;

			case TransactionErrorCodes.NOT_ALLOWED:
				this.message = 'This method is not allowed for this transaction.';
				break;

			case TransactionErrorCodes.INSUFFICIENT_BALANCE:
				this.message = 'Insufficient balance.';
				break;

			case TransactionErrorCodes.OTP_LIMIT_REACHED:
				this.message = 'You have reached OTP tries limit. This transaction is now cancelled.';
				break;

			case TransactionErrorCodes.INVALID_RECEIVER:
				this.message = 'This receiver does not exist.';
				break;

			default:
				this.message = 'message not implemented';
				break;
		}
	}
}

export default TransactionError;
