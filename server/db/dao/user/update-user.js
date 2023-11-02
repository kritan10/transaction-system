import { DatabaseError, DatabaseErrorCodes } from '../../../errors/index.js';
import connection from '../../connection.js';
import Tables from '../../constants/tables.js';

async function updateUser(id, name) {
	const statement = 'UPDATE Users SET name=? WHERE id=?;';
	const inserts = [name, id];
	const [rows] = await connection.execute(statement, inserts);
	if (rows.affectedRows < 1) throw new DatabaseError(DatabaseErrorCodes.UPDATE, Tables.User);
	console.log(`--- UPDATE // ID = ${id} // ${rows.affectedRows} ROWS UPDATED ---`);
}

export default updateUser;
