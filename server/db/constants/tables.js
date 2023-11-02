class Tables {
	static User = new Tables('Users');
	static Account = new Tables('Accounts');
	static Transaction = new Tables('Transactions');
	constructor(name) {
		this.name = name;
	}
	toString() {
		return `Tables.${this.name}`;
	}
}

export default Tables;
