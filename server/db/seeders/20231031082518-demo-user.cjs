('use strict');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Users',
			[
				{
					id: '038f2f29-4de1-4b88-b114-635905a26c4f',
					name: 'ramu',
					email: 'ramu@mail.com',
					password: 'password',
					created_at: new Date(),
				},
				{
					id: 'c2885513-fd87-4d42-ac38-21c6926d4d16',
					name: 'hari',
					email: 'hari@mail.com',
					password: 'password',
					created_at: new Date(),
				},
				{
					id: 'ccdaf800-0908-4b22-b883-5914b8de0b5c',
					name: 'sam',
					email: 'sam@mail.com',
					password: 'password',
					created_at: new Date(),
				},
				{
					id: '9ddd9cda-f064-4b21-8324-e9816a0af47d',
					name: 'sita',
					email: 'sita@mail.com',
					password: 'password',
					created_at: new Date(),
				},
				{
					id: 'f61af6c5-570d-4e6a-a54a-6ce476f34e83',
					name: 'gita',
					email: 'gita@mail.com',
					password: 'password',
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
