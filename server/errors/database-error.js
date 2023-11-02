// eslint-disable-next-line no-unused-vars
import Tables from '../db/constants/tables.js';
import DatabaseErrorCodes from './database-error-codes.js';

class DatabaseError extends Error {
	/**
	 * Error codes
	 * 1 - Insert error
	 * 2 - Update error
	 * 3 - Delete error
	 * @param {DatabaseErrorCodes} code error code for database error
	 * @param {Tables} table
	 */
	constructor(code, table) {
		super();
		this.code = code;
		this.table = table;
		this.name = 'Database Error';
		switch (code) {
			case DatabaseErrorCodes.INSERT:
				this.message = `Error inserting record in ${table.name} table`;
				break;

			case DatabaseErrorCodes.UPDATE:
				this.message = `Error updating record in ${table.name} table`;
				break;

			case DatabaseErrorCodes.DELETE:
				this.message = `Error deleting record in ${table.name} table`;
				break;

			default:
				break;
		}
		this.message = 'custom message';
	}
}

export default DatabaseError;
