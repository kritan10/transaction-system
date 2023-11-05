import { StatusCodes } from 'http-status-codes';

const authMiddleware = (req, res, next) => {
	const token = req.headers?.authorization;
	if (!token) return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Unauthorized' });
	next();
};

export { authMiddleware };
