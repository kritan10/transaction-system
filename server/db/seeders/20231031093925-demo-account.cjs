'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Accounts',
			[
				{
					account_holder: '038f2f29-4de1-4b88-b114-635905a26c4f',
					balance: 100000,
					account_type: 'savings',
				},
				{
					account_holder: 'c2885513-fd87-4d42-ac38-21c6926d4d16',
					balance: 200000,
					account_type: 'current',
				},
				{
					account_holder: '038f2f29-4de1-4b88-b114-635905a26c4f',
					balance: 50000,
					account_type: 'fixed',
				},
				{
					account_holder: '9ddd9cda-f064-4b21-8324-e9816a0af47d',
					balance: 100000,
					account_type: 'savings',
				},
				{
					account_holder: 'f61af6c5-570d-4e6a-a54a-6ce476f34e83',
					balance: 100000,
					account_type: 'savings',
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Accounts', null, {});
	},
};
