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
				created_at: {
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
