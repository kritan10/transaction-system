import { balanceClient } from './grpc-client.js';

/**
 * This method makes a request to the gRPC server to InitiateTransaction and CompleteTransaction.
 * @param {transaction} transaction the transaction to perform in the database
 * @param {number} sender the account number of the sender
 * @returns the transaction status in `Promise`
 */
export function performTransaction(transaction, sender) {
	return new Promise((resolve, reject) => {
		const params = {
			sender_acc: sender,
			receiver_acc: transaction.receiver,
			amount: transaction.amount,
			remarks: transaction.remarks,
		};

		// transaction initiation
		balanceClient.InitiateTransaction(params, (err, res) => {
			if (err) return reject(err);
			const params = { transaction_id: res.transaction_id, otp: res.otp };

			// transaction verification
			balanceClient.CompleteTransaction(params, (err, res) => {
				if (err) return reject(err);

				// transaction status
				const { meta } = res;
				return resolve(meta);
			});
		});
	});
}
