import { getTransactionDetailsByDate } from '../../db/dao/transaction/index.js';

async function getTransactionHistoryService(call, callback) {
	const { user_id: userId, from_date: fromDate, to_date: toDate } = call.request;
	if (!userId) return callback({ message: 'user id not provided' });

	const transactions = await getTransactionDetailsByDate(userId, parseDate(fromDate, 'from'), parseDate(toDate, 'to'));
	const mTransactions = transactions.map((t) => {
		return {
			receiver_acc: t.receiver,
			amount: t.amount,
			date_of_transaction: t.created_at,
			status: t.status,
		};
	});
	return callback(null, { transactions: mTransactions });
}

/**
 * Parse and generate date for selecting transactions based on date-time.
 * @param {string} dateString the date to parse (must be in YYYY-MM-DD format)
 * @param {string} option "to" or "from" options supported
 * @returns
 */
function parseDate(dateString, option) {
	const date = Date.parse(dateString);
	const mDate = new Date(date);
	if (option === 'to') mDate.setHours(23, 59, 59);
	if (option === 'from') mDate.setHours(0, 0, 0);
	return mDate;
}

export default getTransactionHistoryService;
