import express from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { client } from '../client/index.js';

const router = express.Router();

const authMiddleware = (req, res, next) => {
	const token = req.headers.authorization;
	if (!token) return res.status(StatusCodes.UNAUTHORIZED);
	next();
};

router.use(authMiddleware);

router.get('/profile', (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const decoded = jwt.verify(token, 'myprivatekey');
	// console.log(decoded);
	client.GetUserById({ user_id: decoded.user_id }, (err, response) => {
		if (err) return next(err);
		res.send(response);
	});
});

export { router as userRouter };
