const { DataTypes, Sequelize } = require("sequelize")

module.exports = (sequelize) => {
    const AgricultureData = sequelize.define('AgricultureData', {
        DataID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        StateID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        CropID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        SeasonID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        DistrictID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Year: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        Area: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        AreaUnit: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Production: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        ProductionUnit: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Yield: {
            type: Sequelize.FLOAT,
            allowNull: false
        },

    }, {
        timestamps: true,
        underscored: true,
        tableName: "AgricultureData"
    });


    //Associations
    AgricultureData.associate = (models) => {
        AgricultureData.belongsTo(models.Crop, { foreignKey: "CropID", as: "crop" });
        AgricultureData.belongsTo(models.Season, { foreignKey: "SeasonID", as: "season" });
        AgricultureData.belongsTo(models.District, { foreignKey: "DistrictID", as: "district" });
        AgricultureData.belongsTo(models.State, { foreignKey: "StateID", as: "state" });
    };

    return AgricultureData;
}