import express from 'express';
import { balanceClient } from '../client/index.js';
import { StatusCodes } from 'http-status-codes';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/transfer/initiate', (req, res, next) => {
	const { senderAccount, receiverAccount, amount } = req.body;

	if (!(senderAccount && receiverAccount && amount)) {
		res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid request' });
	}

	const params = {
		sender_acc: senderAccount,
		receiver_acc: receiverAccount,
		amount: amount,
	};

	balanceClient.InitiateTransaction(params, (err, response) => {
		console.log(err);
		if (err) {
			return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message });
		}
		res.status(StatusCodes.OK).send(response);
	});
});

router.get('/transfer/verify', (req, res, next) => {
	const { transactionId, otp } = req.body;

	if (!(transactionId && otp)) {
		res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid request' });
	}

	const params = {
		transaction_id: transactionId,
		otp: otp,
	};

	balanceClient.CompleteTransaction(params, (err, response) => {
		console.log(err);
		if (err) {
			console.log(err.details);
			return res.status(StatusCodes.BAD_REQUEST).send({ message: err.message });
		}
		res.status(StatusCodes.OK).send(response);
	});
});

router.get('/load', (req, res, next) => {
	const { accountNumber, amount } = req.body;
	if (!(accountNumber && amount)) {
		res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid request' });
	}

	const params = {
		account_number: accountNumber,
		amount: amount,
	};

	balanceClient.LoadBalance(params, (err, response) => {
		if (err) return next(err);
		res.status(StatusCodes.OK).send(response);
	});
});

export { router as balanceRouter };
