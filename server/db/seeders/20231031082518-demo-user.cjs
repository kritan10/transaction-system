('use strict');
/** @type {import('sequelize-cli').Migration} */

var bcrypt = require('bcrypt');
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Users',
			[
				{
					id: '038f2f29-4de1-4b88-b114-635905a26c4f',
					name: 'Amy Spears',
					email: 'amyspears@mail.com',
					password: bcrypt.hashSync('AmySpears', 10),
					created_at: new Date(),
				},
				{
					id: 'c2885513-fd87-4d42-ac38-21c6926d4d16',
					name: 'Juana Garrison',
					email: 'juanagarrison@mail.com',
					password: bcrypt.hashSync('JuanaGarrison', 10),
					created_at: new Date(),
				},
				{
					id: 'ccdaf800-0908-4b22-b883-5914b8de0b5c',
					name: 'Hattie Atkins',
					email: 'hattieatkins@mail.com',
					password: bcrypt.hashSync('HattieAtkins', 10),
					created_at: new Date(),
				},
				{
					id: '9ddd9cda-f064-4b21-8324-e9816a0af47d',
					name: 'Ida Gilbert',
					email: 'idagilbert@mail.com',
					password: bcrypt.hashSync('IdaGilbert', 10),
					created_at: new Date(),
				},
				{
					id: 'f61af6c5-570d-4e6a-a54a-6ce476f34e83',
					name: 'Larry Liu',
					email: 'larryliu@mail.com',
					password: bcrypt.hashSync('LarryLiu', 10),
					created_at: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Users', {}, {});
	},
};
