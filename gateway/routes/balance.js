import express from 'express';
import { balanceClient } from '../client/index.js';
import { StatusCodes } from 'http-status-codes';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/transfer', (req, res, next) => {
	const { senderAccount, receiverAccount, amount } = req.body;

	if (!(senderAccount && receiverAccount && amount)) {
		res.status(StatusCodes.BAD_REQUEST).send({ message: 'Invalid request' });
	}

	const params = {
		sender_acc: senderAccount,
		receiver_acc: receiverAccount,
		amount: amount,
	};

	balanceClient.SendBalance(params, (err, response) => {
		if (err) return next(err);
		res.status(StatusCodes.OK).send(response);
	});
});

export { router as balanceRouter };
