import { StatusCodes } from 'http-status-codes';

/**
 * This function is a generic response handler.
 * @param {Error} err the error
 * @param {Response} res the Express response object
 * @param {any} gRes the gRPC call response object
 */
function customResponseHandler(err, res, gRes) {
	if (err) {
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'INTERNAL SERVER ERROR' });
	}
	if (gRes?.meta?.status === 'FAILED') {
		console.log(gRes);
		return res.status(StatusCodes.BAD_REQUEST).send({ meta: gRes.meta });
	}
	res.status(StatusCodes.OK).send(gRes);
}

export default customResponseHandler;
