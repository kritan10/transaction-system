import { DatabaseError, DatabaseErrorCodes } from '../../../errors/index.js';
import connection from '../../connection.js';
import Tables from '../../constants/tables.js';

/**
 * this function updates the balance of the provided account.
 * @param {number} account the account to update
 * @param {number} balance the new balance to update
 * @returns void
 */
async function updateBalance(account, balance) {
	const statement = 'UPDATE Accounts SET balance=? WHERE account_number=?;';
	const inserts = [balance, account];
	const [rows] = await connection.execute(statement, inserts);
	if (rows.affectedRows < 1) throw new DatabaseError(DatabaseErrorCodes.UPDATE, Tables.Account);
	console.log(`--- UPDATE // acc_num = ${account} // ${rows.affectedRows} ROWS UPDATED ---`);
}

export default updateBalance;
