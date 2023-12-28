const { DataTypes } = require("sequelize")
const sequelize = require("../database")
const Crop = require("./Crop")
const Season = require("./Season")
const State = require("./State")
const District = require("./District")
const AgricultureData = sequelize.define('AgricultureData', {
    DataID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    StateID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    CropID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    SeasonID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    DistrictID: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    Year: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    Area: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    AreaUnit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Production: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    ProductionUnit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Yield: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

}, {
    timestamps: true,
    underscored: false,
    tableName: "AgricultureData",
    indexes: [
        {
            unique: true,
            fields: ['CropID', 'SeasonID', 'StateID', 'DistrictID', 'Year']
        }
    ]
});


//Associations
AgricultureData.associate = () => {
    AgricultureData.belongsTo(Crop, { foreignKey: "CropID", as: "crop" });
    AgricultureData.belongsTo(Season, { foreignKey: "SeasonID", as: "season" });
    AgricultureData.belongsTo(District, { foreignKey: "DistrictID", as: "district" });
    AgricultureData.belongsTo(State, { foreignKey: "StateID", as: "state" });
};

module.exports = AgricultureData;