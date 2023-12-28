const { DataTypes, Sequelize } = require('sequelize')
const sequelize = require("../database")


const Crop = sequelize.define("Crop", {
    CropID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    CropName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}, {
    timestamps: true,
    tableName: "Crop"
})

module.exports = Crop