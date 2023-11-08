import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import connection from '../../db/connection.js';
import createBalanceAccount from '../../db/dao/account/create-balance-account.js';
import { createUser, getUserById } from '../../db/dao/user/index.js';
import { RequestError, UserError, UserErrorCodes, customErrorHandler } from '../../errors/index.js';

async function createUserService(call, callback) {
	try {
		const { name, email, password, initialAmount, createAccount } = call.request;
		if (!name || !email || !password) throw new RequestError(RequestError.MISSING_PARAMS); // check for any empty fields

		const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/gi;
		if (!emailRegex.test(email)) throw new UserError(UserErrorCodes.INVALID_EMAIL); // validate email

		if (password.length < 8) throw new UserError(UserErrorCodes.INVALID_PASSWORD);
		const passwordHash = await bcrypt.hash(password, 10); // hash password

		const mInitialAmount = initialAmount ? initialAmount : 0;

		// create account start
		const userId = v4();
		await connection.beginTransaction();
		await createUser(userId, name, email, passwordHash); // execute insert
		if (createAccount) await createBalanceAccount(userId, 'savings', mInitialAmount);
		await connection.commit();
		// create account end

		const user = await getUserById(userId);
		if (!user) throw new Error();
		return callback(null, {
			...user,
			meta: {
				code: 1,
				status: 'OK',
				message: 'User creation success.',
			},
		});

	} catch (error) {
		await connection.rollback();

		if (error?.code == 'ER_DUP_ENTRY') {
			return customErrorHandler(new UserError(UserErrorCodes.ALREADY_EXISTS), callback);
		}

		return customErrorHandler(error, callback);
	}
}

export default createUserService;
