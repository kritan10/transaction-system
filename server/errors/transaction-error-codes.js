class TransactionErrorCodes {
	static INVALID_OTP = new TransactionErrorCodes(1);
	static NOT_FOUND = new TransactionErrorCodes(2);
	static NOT_ALLOWED = new TransactionErrorCodes(3);
	constructor(code) {
		this.code = code;
	}
	toString() {
		return `TransactionErrorCodes.${this.code}`;
	}
}

export default TransactionErrorCodes;
