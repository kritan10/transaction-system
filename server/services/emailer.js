import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: 'sandbox.smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: 'b6c6a935967eb5',
		pass: 'dbd4debfbec93d',
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
