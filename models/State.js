const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require("../database")

const State = sequelize.define("State", {
    StateID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    StateName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: true,
    underscored: false,
    tableName: "State"
})


module.exports = State