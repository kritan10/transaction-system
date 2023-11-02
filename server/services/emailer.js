import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'smtp.forwardemail.net',
	port: 465,
	secure: true,
	auth: {
		// TODO: replace `user` and `pass` values from <https://forwardemail.net>
		user: 'REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM',
		pass: 'REPLACE-WITH-YOUR-GENERATED-PASSWORD',
	},
});

async function sendBalanceSentMail(recepient, amount) {
	const info = await transporter.sendMail({
		from: 'System', // sender address
		to: recepient, // list of receivers
		subject: 'Balance Transfer Success ✔', // Subject line
		text: `You send ${amount} from your account.`, // plain text body
	});
	console.log('Message sent: %s', info.messageId);
}

async function sendBalanceReceivedMail(recepient, amount) {
	const info = await transporter.sendMail({
		from: 'System', // sender address
		to: recepient, // list of receivers
		subject: 'Balance Received ✔', // Subject line
		text: `You received ${amount} in your account.`, // plain text body
	});
	console.log('Message sent: %s', info.messageId);
}

async function sendTransactionCompleteMail(senderEmail, receiverEmail, amount) {
	await sendBalanceSentMail(senderEmail, amount);
	await sendBalanceReceivedMail(receiverEmail, amount);
}
export { sendTransactionCompleteMail };
