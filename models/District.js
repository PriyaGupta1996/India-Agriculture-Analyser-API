const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require("../database")


const District = sequelize.define("District", {
    DistrictID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    DistrictName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: true,
    underscored: false,
    tableName: "District"
})

module.exports = District;