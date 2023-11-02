class DatabaseErrorCodes {
	static INSERT = new DatabaseErrorCodes('INSERT');
	static UPDATE = new DatabaseErrorCodes('UPDATE');
	static DELETE = new DatabaseErrorCodes('DELETE');
	constructor(name) {
		this.name = name;
	}
	toString() {
		return `DatabaseErrorCodes.${this.name}`;
	}
}

export default DatabaseErrorCodes;
