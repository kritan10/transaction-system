import dotenv from 'dotenv';
import process from 'process';
import { sendOTPMail } from './emailer.js';
import { sendQRMessage } from './qr.js';

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

export async function dispatchOTP(transactionId, otp, transactionAmount, receiverDetails) {
	try {
		sendQRMessage(otp, transactionId, { receiver_acc: receiverDetails.account_number, receiver_name: receiverDetails.name, amount: transactionAmount });
	} catch (error) {
		console.error(error);
		if (process.env.ENABLE_NODEMAILER != 0) await sendOTPMail(otp);
	}
}
