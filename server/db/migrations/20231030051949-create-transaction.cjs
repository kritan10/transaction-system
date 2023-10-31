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
			amount: {
				type: Sequelize.DOUBLE,
			},
			timestamp: {
				type: Sequelize.DATE,
			},
		});

		await queryInterface.sequelize.query(`
          ALTER TABLE Transactions 
          ADD FOREIGN KEY (sender) 
          REFERENCES Users (account_number)
          ON UPDATE CASCADE 
          ON DELETE SET NULL;
        `);

		await queryInterface.sequelize.query(`
          ALTER TABLE Transactions 
          ADD FOREIGN KEY (receiver) 
          REFERENCES Users (account_number)
          ON UPDATE CASCADE 
          ON DELETE SET NULL;
        `);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('Transactions');
	},
};
