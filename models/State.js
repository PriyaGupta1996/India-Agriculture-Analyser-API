const { DataTypes, Sequelize } = require('sequelize')


module.exports = (Sequelize) => {
    const District = Sequelize.define("State", {
        StateID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true
        },
        StateName: {
            type: Sequelize.STRING,
            allowNull: false
        },
    }, {
        timestamp: true,
        underscored: true,
        tableName: "State"
    })
    return State;
}
