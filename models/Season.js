const { DataTypes, Sequelize } = require('sequelize')


module.exports = (Sequelize) => {
    const Season = Sequelize.define("Season", {
        SeasonID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true
        },
        SeasonName: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        timestamp: true,
        underscored: true,
        tableName: "Season"
    })
    return Season;
}
