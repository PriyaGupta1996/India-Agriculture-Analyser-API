const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('india-agriculture', 'apac', 'apac-jan-test', {
    dialect: 'sqlite',
    host: 'india-agriculture-db.sqlite',
})

module.exports = sequelize;