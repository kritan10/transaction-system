'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'Users',
			{
				id: {
					type: Sequelize.UUID,
					primaryKey: true,
				},
				account_number: {
					type: Sequelize.INTEGER,
					unique: true,
					autoIncrement: true,
				},
				name: {
					type: Sequelize.STRING,
				},
				email: {
					type: Sequelize.STRING,
					unique: true,
				},
				password: {
					type: Sequelize.STRING,
				},
				balance: {
					type: Sequelize.DOUBLE,
					defaultValue: 0,
				},
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
			},
			{
				initialAutoIncrement: 1000,
			}
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Users');
	},
};
