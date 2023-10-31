import connection from '../connection.js';

function updateReceiverBalance(receiver_acc, amount) {
	const statement = 'UPDATE Users SET balance=? WHERE account_number=?;';
	const inserts = [amount, receiver_acc];
	connection.execute(statement, inserts, (err, result, fields) => {
		if (err) {
			return connection.rollback(function () {
				throw err;
			});
		}
		console.log(`--- INCREASE BALANCE // UPDATE // acc_num = ${receiver_acc} // ${result.affectedRows} ROWS UPDATED ---`);
	});
}

function updateSenderBalance(sender_acc, amount) {
	const statement = 'UPDATE Users SET balance=? WHERE account_number=?;';
	const inserts = [amount, sender_acc];
	connection.execute(statement, inserts, (err, result, fields) => {
		if (err) {
			return connection.rollback(function () {
				throw err;
			});
		}
		console.log(`--- DECREASE BALANCE // UPDATE // acc_num = ${sender_acc} // ${result.affectedRows} ROWS UPDATED ---`);
	});
}

function createTransactionLog(sender_acc, receiver_acc, amount) {
	const statement = 'INSERT INTO Transactions(sender, receiver, amount, timestamp) VALUES (?,?,?,?)';
	const inserts = [sender_acc, receiver_acc, amount, new Date()];
	connection.execute(statement, inserts, (err, result, fields) => {
		if (err) {
			return connection.rollback(function () {
				throw err;
			});
		}
		console.log(`--- TRANSACTION LOG // INSERT // acc_num = ${receiver_acc} // ${result.affectedRows} ROWS UPDATED ---`);
	});
}

function makeTransaction(sender_acc, receiver_acc, transaction_amount, sender_new_balance, receiver_new_balance) {
	connection.beginTransaction((err) => {
		if (err) connection.rollback();
		updateSenderBalance(sender_acc, sender_new_balance);
		updateReceiverBalance(receiver_acc, receiver_new_balance);
		createTransactionLog(sender_acc, receiver_acc, transaction_amount);
		connection.commit(function (err) {
			if (err) {
				return connection.rollback(function () {
					throw err;
				});
			}
			console.log('success!');
		});
	});
}

export { makeTransaction };
