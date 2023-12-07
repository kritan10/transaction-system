import { balanceClient } from './grpc-client.js';

export function performTransaction(transaction, sender) {
	return new Promise((resolve, reject) => {
		// transaction initiation
		const params = {
			sender_acc: sender,
			receiver_acc: transaction.receiver,
			amount: transaction.amount,
			remarks: transaction.remarks,
		};
		balanceClient.InitiateTransaction(params, (err, res) => {
			if (err) return reject(err);
			// console.log(res);
			// transaction verification
			const params = { transaction_id: res.transaction_id, otp: res.otp };
			balanceClient.CompleteTransaction(params, (err, res) => {
				if (err) return reject(err);
				// console.log(res);
				const { meta } = res;
				return resolve(meta);
			});
		});
	});
}
