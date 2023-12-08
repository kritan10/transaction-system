import process from 'node:process';

import express from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';

import { userClient } from '../client/index.js';
import customResponseHandler from '../utils/response-handler.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;

	// check if user exists by email
	userClient.GetUserCredentialsByEmail({ email: email }, async (err, response) => {
		if (err) customResponseHandler(err, res);

		if (!response.user_id) {
			return res.status(StatusCodes.UNAUTHORIZED).send({
				meta: {
					status: 'FAILED',
					code: 1000,
					message: 'User is not registered.',
				},
			});
		}

		// only if user exists -> fetch user data
		const isPasswordValid = await compare(password, response.password);
		if (!isPasswordValid) {
			return res.status(StatusCodes.UNAUTHORIZED).send({
				meta: {
					status: 'FAILED',
					code: 1001,
					message: 'Incorrect password.',
				},
			});
		}
		const token = jwt.sign(
			{
				user_id: response.user_id,
			},
			process.env.JWT_KEY,
			{
				expiresIn: process.env.JWT_EXPIRY_TIME,
			}
		);
		res.status(StatusCodes.OK).send({ token: token });
	});
});

router.post('/register', async (req, res) => {
	const params = req.body; //name, email, password, initialAmount, createAccount
	userClient.CreateUser(params, (err, response) => {
		if (err) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: 'INTERNAL SERVER ERROR' });
		}
		if (response?.meta?.status === 'FAILED') {
			console.log(response);
			return res.status(StatusCodes.BAD_REQUEST).send(response.meta);
		}
		const token = jwt.sign(
			{
				user_id: response.user_id,
			},
			process.env.JWT_KEY,
			{
				expiresIn: process.env.JWT_EXPIRY_TIME,
			}
		);
		return res.status(StatusCodes.OK).send({ token: token, meta: response.meta });
	});
});

export { router as authRouter };
