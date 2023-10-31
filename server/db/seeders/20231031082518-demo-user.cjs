var v4 = require('uuid').v4;

('use strict');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert(
			'Users',
			[
				{
					id: v4(),
					account_number: 2001,
					name: 'ramu',
					email: 'ramu@mail.com',
					password: 'password',
					balance: '2000',
					createdAt: new Date(),
				},
				{
					id: v4(),
					account_number: 2002,
					name: 'hari',
					email: 'hari@mail.com',
					password: 'password',
					balance: '2500',
					createdAt: new Date(),
				},
				{
					id: v4(),
					account_number: 2003,
					name: 'sam',
					email: 'sam@mail.com',
					password: 'password',
					balance: '12000',
					createdAt: new Date(),
				},
				{
					id: v4(),
					account_number: 2004,
					name: 'sita',
					email: 'sita@mail.com',
					password: 'password',
					balance: '22000',
					createdAt: new Date(),
				},
				{
					id: v4(),
					account_number: 2005,
					name: 'asdf',
					email: 'asdf@mail.com',
					password: 'password',
					balance: '9000',
					createdAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Users', null, {});
	},
};
