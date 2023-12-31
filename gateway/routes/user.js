import process from 'node:process';

import express from 'express';
import jwt from 'jsonwebtoken';

import { userClient } from '../client/index.js';
import { authMiddleware } from '../middleware/auth.js';
import customResponseHandler from '../utils/response-handler.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const decoded = jwt.verify(token, process.env.JWT_KEY);
	// console.log(decoded);
	userClient.GetUserById({ user_id: decoded.user_id }, (err, response) => {
		customResponseHandler(err, res, response);
	});
});

router.put('/edit', (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
	const decoded = jwt.verify(token, process.env.JWT_KEY);

	const newName = req.body.name;
	// console.log(decoded);
	userClient.UpdateUser({ user_id: decoded.user_id, name: newName }, (err, response) => {
		customResponseHandler(err, res, response);
	});
});

export { router as userRouter };
