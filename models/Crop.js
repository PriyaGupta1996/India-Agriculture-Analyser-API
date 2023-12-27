const { DataTypes, Sequelize } = require('sequelize')


module.exports = (Sequelize) => {
    const Crop = Sequelize.define("Crop", {
        CropID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true
        },
        CropName: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        timestamp: true,
        underscored: true,
        tableName: "Crop"
    })
    return Crop;
}
