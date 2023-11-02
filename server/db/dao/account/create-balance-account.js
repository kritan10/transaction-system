import { DatabaseError, DatabaseErrorCodes } from '../../../errors/index.js';
import connection from '../../connection.js';
import Tables from '../../constants/tables.js';

async function createBalanceAccount(user_id, account_type, balance) {
	const statement = 'INSERT INTO Accounts(account_holder, account_type, balance, created_at) VALUES (?,?,?,?);';
	const inserts = [user_id, account_type, balance, new Date()];
	const [rows] = await connection.execute(statement, inserts);
	if (!rows.affectedRows) throw new DatabaseError(DatabaseErrorCodes.INSERT, Tables.Account);
	console.log(`--- INSERT // insertId=${rows.insertId} // ${rows.affectedRows} ROWS INSERTED ---`);
}

export default createBalanceAccount;
