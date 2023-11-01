'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Transactions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			sender: {
				type: Sequelize.INTEGER,
			},
			receiver: {
				type: Sequelize.INTEGER,
			},
			transaction_amount: {
				type: Sequelize.DOUBLE,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});

		await queryInterface.addConstraint('Transactions', {
			type: 'foreign key',
			fields: ['sender'],
			name: 'fk_sender__accounts',
			references: {
				table: 'Accounts',
				field: 'account_number',
			},
			onUpdate: 'CASCADE',
			onDelete: 'NO ACTION',
		});

		await queryInterface.addConstraint('Transactions', {
			type: 'foreign key',
			fields: ['receiver'],
			name: 'fk_receiver__accounts',
			references: {
				table: 'Accounts',
				field: 'account_number',
			},
			onUpdate: 'CASCADE',
			onDelete: 'NO ACTION',
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Transactions');
	},
};
