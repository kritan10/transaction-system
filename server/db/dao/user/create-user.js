import { DatabaseError, DatabaseErrorCodes } from '../../../errors/index.js';
import connection from '../../connection.js';
import Tables from '../../constants/tables.js';

async function createUser(id, name, email, password) {
	const statement = 'INSERT INTO Users(id, name, email, password, created_at) VALUES (?,?,?,?,?);';
	const inserts = [id, name, email, password, new Date()];
	const [rows] = await connection.execute(statement, inserts);
	if (!rows.affectedRows) throw new DatabaseError(DatabaseErrorCodes.INSERT, Tables.User);
	console.log(`--- INSERT // insertId=${id} // ${rows.affectedRows} ROWS INSERTED ---`);
}

export default createUser;
