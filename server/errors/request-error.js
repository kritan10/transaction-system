class RequestError extends Error {
	static MISSING_PARAMS = 400;
	constructor(code) {
		super();
		this.code = code;
		this.name = 'Request Error';
		switch (code) {
			case RequestError.MISSING_PARAMS:
				this.message = `Missing parameters for request.`;
				break;

			default:
				this.message = 'message not implemented';
				break;
		}
	}
}

export default RequestError;
