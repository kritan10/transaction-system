import express from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import process from 'process';
import { userClient } from '../client/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const decoded = jwt.verify(token, process.env.JWT_KEY);
	// console.log(decoded);
	userClient.GetUserById({ user_id: decoded.user_id }, (err, response) => {
		if (err) return next(err);
		res.status(StatusCodes.OK).send(response);
	});
});

export { router as userRouter };
