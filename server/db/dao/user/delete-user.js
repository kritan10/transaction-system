import connection from '../../connection.js';

function deleteUser(id) {
	return new Promise((resolve, reject) => {
		const statement = 'DELETE FROM Users WHERE id=?;';
		const inserts = [id];
		connection.execute(statement, inserts, (err, result, fields) => {
			if (err) return reject(err);
			console.log(`--- DELETE // ID = ${id} // ${result.affectedRows} ROWS DELETED ---`);
			return resolve(result.affectedRows >= 1 ? true : false);
		});
	});
}

export default deleteUser;
