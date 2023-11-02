import express from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { balanceClient } from '../client/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const decoded = jwt.verify(token, 'myprivatekey');
	// console.log(decoded);
	balanceClient.GetUserById({ user_id: decoded.user_id }, (err, response) => {
		if (err) return next(err);
		res.status(StatusCodes.OK).send(response);
	});
});

export { router as userRouter };
