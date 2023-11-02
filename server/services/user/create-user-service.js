import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import connection from '../../db/connection.js';
import createBalanceAccount from '../../db/dao/account/create-balance-account.js';
import { createUser, getUserById } from '../../db/dao/user/index.js';
import DatabaseError from '../../errors/database-error.js';

async function createUserService(call, callback) {
	const { name, email, password, initialAmount, createAccount: mCreateAccount } = call.request;
	if (!name || !email || !password) return callback({ message: 'Missing fields' }, null); // check for any empty fields

	const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/gi;
	if (!emailRegex.test(email)) return callback({ message: 'Invalid email address' }, null); // validate email

	const passwordHash = await bcrypt.hash(password, 10); // hash password

	const mInitialAmount = initialAmount ? initialAmount : 0;

	const userId = v4();
	try {
		await connection.beginTransaction();
		await createUser(userId, name, email, passwordHash); // execute insert
		if (mCreateAccount) await createBalanceAccount(userId, 'savings', mInitialAmount);
		await connection.commit();
	} catch (error) {
		await connection.rollback();
		if (error instanceof DatabaseError) {
			return callback({ message: error.message }, null);
		}
		if (error.code && error.code == 'ER_DUP_ENTRY') {
			return callback({ code: 1000, message: 'User already exists' });
		}
		console.log(error);
		return callback({ message: 'User creation failed' }, null);
	}
	const user = await getUserById(userId);
	if (!user) return callback({ message: 'Internal error' });

	return callback(null, user);
}

export default createUserService;
