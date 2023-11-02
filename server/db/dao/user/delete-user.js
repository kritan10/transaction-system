import { DatabaseError, DatabaseErrorCodes } from '../../../errors/index.js';
import connection from '../../connection.js';
import Tables from '../../constants/tables.js';

async function deleteUser(id) {
	const statement = 'DELETE FROM Users WHERE id=?;';
	const inserts = [id];
	const [rows] = await connection.execute(statement, inserts);
	if (rows.affectedRows < 1) throw new DatabaseError(DatabaseErrorCodes.DELETE, Tables.User);
	console.log(`--- DELETE // ID = ${id} // ${rows.affectedRows} ROWS DELETED ---`);
}

export default deleteUser;
