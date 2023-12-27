const { DataTypes, Sequelize } = require('sequelize')


module.exports = (Sequelize) => {
    const District = Sequelize.define("District", {
        DistrictID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true
        },
        DistrictName: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        timestamp: true,
        underscored: true,
        tableName: "District"
    })
    return District;
}
