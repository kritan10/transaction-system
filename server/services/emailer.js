import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import process from 'process';
import path from 'path';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASSWORD,
	},
});

async function sendBalanceSentMail(amount) {
	const info = await transporter.sendMail({
		from: process.env.NODEMAILER_EMAIL, // sender address
		to: 'kritant37@gmail.com', // list of receivers
		subject: 'Balance Transfer Success ✔', // Subject line
		text: `You send ${amount} from your account.`, // plain text body
	});
	console.log('Message sent: %s', info.messageId);
}

async function sendBalanceReceivedMail(amount) {
	const info = await transporter.sendMail({
		from: process.env.NODEMAILER_EMAIL, // sender address
		to: 'kritant37@gmail.com', // list of receivers
		subject: 'Balance Received ✔', // Subject line
		text: `You received ${amount} in your account.`, // plain text body
	});
	console.log('Message sent: %s', info.messageId);
}

async function sendTransactionCompleteMail(senderEmail, receiverEmail, amount) {
	await sendBalanceSentMail(senderEmail, amount);
	await sendBalanceReceivedMail(receiverEmail, amount);
}

async function sendOTPMail(otp, amount) {
	const info = await transporter.sendMail({
		from: process.env.NODEMAILER_EMAIL, // sender address
		to: 'kritant37@gmail.com', // list of receivers
		subject: 'Transaction OTP', // Subject line
		text: `You have requested to send ${amount} from your account. Your OTP is ${otp}`, // plain text body
	});
	console.log('Message sent: %s', info);
}

export { sendTransactionCompleteMail, sendOTPMail };
