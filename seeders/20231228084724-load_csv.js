'use strict';

const seedDatabase = require("./seedDatabase")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await seedDatabase()
  },

  async down(queryInterface, Sequelize) {

  }
};
