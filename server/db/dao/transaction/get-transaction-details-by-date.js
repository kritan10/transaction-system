import connection from '../../connection.js';

async function getTransactionDetailsByDate(userId, fromDate, toDate) {
	const fromClause = 'AND Transactions.created_at > ?';
	const toClause = 'AND Transactions.created_at < ?';
	const statement = `
    SELECT receiver, amount, Transactions.created_at, status FROM Transactions 
    JOIN Accounts ON Transactions.sender=Accounts.account_number
    WHERE Accounts.account_holder=? 
    ${fromClause}
    ${toClause}
    ORDER BY Transactions.created_at DESC
    LIMIT 5;
    `;
	const inserts = [userId, fromDate, toDate];
	const [rows] = await connection.execute(statement, inserts);
	console.log(`--- SELECT // id = ${userId} // 1 ROWS SELECTED ---`);
	return rows;
}

export default getTransactionDetailsByDate;
