import connection from '../../connection.js';

function updateUser(id, name) {
	return new Promise((resolve, reject) => {
		const statement = 'UPDATE Users SET name=? WHERE id=?;';
		const inserts = [name, id];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- UPDATE // ID = ${id} // ${result.affectedRows} ROWS UPDATED ---`);
			resolve(result.affectedRows >= 1 ? true : false);
		});
	});
}

export default updateUser;
