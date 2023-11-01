'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'Accounts',
			{
				account_number: {
					type: Sequelize.INTEGER,
					unique: true,
					autoIncrement: true,
				},
				account_holder: {
					type: Sequelize.UUID,
				},
				balance: {
					type: Sequelize.DOUBLE,
					defaultValue: 0,
				},
				account_type: {
					type: Sequelize.ENUM('current', 'savings', 'fixed'),
					defaultValue: 'savings',
				},
				created_at: {
					type: Sequelize.DATE,
				},
			},
			{
				initialAutoIncrement: 1000,
			}
		);

		await queryInterface.addConstraint('Accounts', {
			type: 'foreign key',
			fields: ['account_holder'],
			name: 'fk_account_holder__users',
			references: {
				table: 'Users',
				field: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'NO ACTION',
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Accounts');
	},
};
