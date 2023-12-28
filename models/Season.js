const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require("../database")


const Season = sequelize.define("Season", {
    SeasonID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    SeasonName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamp: true,
    underscored: false,
    tableName: "Season"
})

module.exports = Season