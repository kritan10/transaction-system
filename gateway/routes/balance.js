import express from 'express';
import { balanceClient } from '../client/index.js';
import { StatusCodes } from 'http-status-codes';
import { authMiddleware } from '../middleware/auth.js';
import customResponseHandler from '../utils/response-handler.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/transfer/initiate', (req, res, next) => {
	const { senderAccount, receiverAccount, amount } = req.body;

	if (!(senderAccount && receiverAccount && amount)) {
		return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid request' });
	}

	const params = {
		sender_acc: senderAccount,
		receiver_acc: receiverAccount,
		amount: amount,
	};

	balanceClient.InitiateTransaction(params, (err, response) => {
		customResponseHandler(err, res, response);
	});
});

router.get('/transfer/verify', (req, res, next) => {
	const { transactionId, otp } = req.body;

	if (!(transactionId && otp)) {
		return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid request' });
	}

	const params = {
		transaction_id: transactionId,
		otp: otp,
	};

	balanceClient.CompleteTransaction(params, (err, response) => {
		customResponseHandler(err, res, response);
	});
});

router.get('/load', (req, res, next) => {
	const { accountNumber, amount } = req.body;
	if (!(accountNumber && amount)) {
		return res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid request' });
	}

	const params = {
		account_number: accountNumber,
		amount: amount,
	};

	balanceClient.LoadBalance(params, (err, response) => {
		customResponseHandler(err, res, response);
	});
});

export { router as balanceRouter };
