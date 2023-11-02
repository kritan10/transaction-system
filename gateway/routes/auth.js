import express from 'express';
import process from 'process';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { userClient } from '../client/index.js';

const router = express.Router();

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;

	// check for email and password
	if (!email || !password) {
		return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid request' });
	}
	// check if user exists by email
	userClient.GetUserCredentialsByEmail({ email: email }, async (err, response) => {
		if (err) return next(err);

		if (!response.user_id) {
			return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'User not registered.' });
		}

		// only if user exists -> fetch user data
		const isPasswordValid = await compare(password, response.password);
		if (!isPasswordValid) {
			return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Incorrect password.' });
		}
		console.log(process.env.JWT_KEY);
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
	const { name, email, password, initialAmount, createAccount } = req.body;
	if (!(name && email && password)) {
		return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Missing params' });
	}
	const params = { name: name, email: email, password: password, initialAmount: initialAmount, createAccount: createAccount };
	userClient.CreateUser(params, (err, response) => {
		if (err) {
			console.log(err);
			return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Error creating account' });
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
		return res.status(StatusCodes.OK).send({ token: token });
	});
});

export { router as authRouter };
