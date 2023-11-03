'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Transactions', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
			},
			sender: {
				type: Sequelize.INTEGER,
			},
			receiver: {
				type: Sequelize.INTEGER,
			},
			amount: {
				type: Sequelize.DOUBLE,
				allowNull: false,
			},
			type: {
				type: Sequelize.ENUM('transfer', 'load'),
			},
			status: {
				type: Sequelize.ENUM('pending', 'success', 'failed'),
			},
			otp: {
				type: Sequelize.STRING,
				allowNull: true,
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
			onDelete: 'CASCADE',
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
			onDelete: 'CASCADE',
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Transactions');
	},
};
