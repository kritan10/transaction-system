import bcrypt from 'bcrypt';
import { createUser, deleteUser, updateUser, getUserById, getUserByAccountNumber, getUserCredentialsByEmail } from '../db/dao/user/index.js';

async function createUserService(call, callback) {
	const { name, email, password, initialAmount, createAccount } = call.request;
	if (!name || !email || !password) return callback({ message: 'Missing fields' }, null); // check for any empty fields

	const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/gi;
	if (!emailRegex.test(email)) return callback({ message: 'Invalid email address' }, null); // validate email

	const passwordHash = await bcrypt.hash(password, 10); // hash password

	const mCreateAccount = createAccount ? createAccount : false;
	const mInitialAmount = initialAmount ? initialAmount : 0;

	let result;
	try {
		result = await createUser(name, email, passwordHash, mInitialAmount, mCreateAccount); // execute insert
	} catch (error) {
		console.log(error);
		return callback({ message: 'User creation failed' }, null);
	}
	if (!result) return callback({ message: 'User creation failed' }, null); // undefined result = error in insert or not inserted
	const user = await getUserByAccountNumber(result);
	return callback(null, user);
}

async function getUserByIdService(call, callback) {
	const { user_id } = call.request;
	if (!user_id) return callback({ message: 'Missing fields' }, null); // check for empty user_id
	const user = await getUserById(user_id); // execute select
	if (!user) return callback({ message: 'User not found' }, null);
	return callback(null, user);
}

async function getUserByAccountNumberService(call, callback) {
	const { acc_num } = call.request;
	if (!acc_num) return callback({ message: 'Missing fields' }, null); // check for empty account number
	const user = await getUserByAccountNumber(acc_num); // execute select
	if (!user) return callback({ message: 'User not found' }, null);
	return callback(null, user);
}

async function getUserCredentialsByEmailService(call, callback) {
	const { email } = call.request;
	if (!email) return callback({ message: 'Missing fields' }, null); // check for empty email
	const user = await getUserCredentialsByEmail(email); // execute select
	if (!user) return callback({ message: 'User not found' }, null);
	return callback(null, { user_id: user.id, email: user.email, password: user.password });
}

async function updateUserService(call, callback) {
	const { user_id, name } = call.request;
	if (!user_id || !name) return callback({ message: 'Missing fields' }, null); // check for empty user_id
	const result = await updateUser(user_id, name); // execute update
	if (!result) return callback({ message: 'Error updating user' });
	return callback(null, { message: 'User update successful' });
}

async function deleteUserService(call, callback) {
	const { user_id } = call.request;
	if (!user_id) return callback({ message: 'Missing fields' }, null); // check for empty user_id
	const result = await deleteUser(user_id); // execute delete
	if (!result) return callback({ message: 'Error deleting user' });
	return callback(null, { message: 'User delete successful' });
}

export {
	createUserService as createUser,
	deleteUserService as deleteUser,
	updateUserService as updateUser,
	getUserByIdService as getUser,
	getUserByAccountNumberService as getUserByAccountNumber,
	getUserCredentialsByEmailService as getUserCredentialsByEmail,
};
