import express from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { client } from '../client/index.js';
import { compare } from 'bcrypt';

const router = express.Router();

router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;

	// check for email and password
	if (!email || !password) {
		return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid request' });
	}

	// check if user exists by email
	client.GetUserCredentialsByEmail({ email: email }, async (err, response) => {
		if (err) return next(err);

		if (!response.user_id) {
			return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'User not registered.' });
		}

		// only if user exists -> fetch user data
		const isPasswordValid = await compare(password, response.password);
		if (!isPasswordValid) {
			return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Incorrect password.' });
		}
		const token = jwt.sign(
			{
				user_id: response.user_id,
			},
			'myprivatekey'
		);
		res.status(StatusCodes.OK).send({ token: token });
	});
});

router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;

	const user = await client.createUser(name, email, password);

	const token = jwt.sign(
		{
			user_id: user.id,
		},
		'myprivatekey',
		{
			expiresIn: '7d',
		}
	);

	res.status(StatusCodes.OK).send({ token: token });
});

export { router as authRouter };
