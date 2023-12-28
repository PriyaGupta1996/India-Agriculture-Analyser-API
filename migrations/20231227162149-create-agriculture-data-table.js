'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AgricultureData", {
      DataID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      StateID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      CropID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      SeasonID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      DistrictID: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Area: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      AreaUnit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Production: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      ProductionUnit: {
        type: Sequelize.STRING,
        allowNull: false
      },
      Yield: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AgricultureData")
  }
};
