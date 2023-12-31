const express = require('express');
const { Sequelize, Op } = require("sequelize");
const router = express.Router();
const createResponse = require("../utils/createResponse")
const HttpStatus = require("../constants/HttpStatus")
const pagination = require("../constants/pagination")
const { Agriculture, State, Crop, District, Season } = require("../../models")
const column = {
    year: "Year",
    production: "Production",
    area: "Area",
    crop: "CropName",
    season: "SeasonName",
    district: "DistrictName",
    yield: "Yield",
    state: "StateName"
}
const model = {
    crop: "Crop",
    season: "Season",
    district: "District"
}
const pageSize = pagination.pageSize;


router.get('/:stateName/production-per-year', async (req, res) => {
    try {
        const stateName = req.params.stateName
        // Group data by year and sum the production for each year
        const productionPerYear = await Agriculture.findAll({
            attributes: ['Year', [Sequelize.fn('SUM', Sequelize.col('Production')), 'TotalProduction']],
            include: [
                {
                    model: State,
                    attributes: ['StateName'],
                    where: {
                        StateName: stateName
                    }
                }
            ],
            group: ['Year'],
            raw: true
        });
        const formattedResponse = formatProductionPerYearData(productionPerYear)
        response = createResponse(formattedResponse, HttpStatus.OK, "Data retrieved successfully.")
        res.status(HttpStatus.OK).send(response)

    } catch (error) {
        console.log("Error retrieving data", error)
        response = createResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving data")
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response)
    }
})

router.get('/:stateName/production-per-crop', async (req, res) => {
    try {
        const stateName = req.params.stateName
        // Group data by year and sum the production for each year
        const productionPerCrop = await Agriculture.findAll({
            attributes: [[Sequelize.fn('SUM', Sequelize.col('Production')), 'TotalProduction']],
            include: [
                {
                    model: State,
                    attributes: ['StateName'],
                    where: {
                        StateName: stateName
                    }
                },
                {
                    model: Crop,
                    attributes: ['CropName', 'CropID']
                },

            ],
            group: ['Crop.CropID'],
            raw: true
        });
        const formattedResponse = formatProductionPerCropData(productionPerCrop)
        response = createResponse(formattedResponse, HttpStatus.OK, "Data retrieved successfully.")
        res.status(HttpStatus.OK).send(response)

    } catch (error) {
        console.log("Error retrieving data", error)
        response = createResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving data")
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response)
    }
})

const formatProductionPerCropData = (DBData) => {
    return DBData.map(data => ({
        TotalProduction: data["TotalProduction"],
        Crop: data["Crop.CropName"]
    }));
}
const formatProductionPerYearData = (DBData) => {
    return DBData.map(data => ({
        TotalProduction: data["TotalProduction"],
        Year: data["Year"]
    }));
}


const formatAgricultureDataResponse = (DBData) => {
    return DBData.map(data => ({
        Year: data.Year,
        Area: data.Area,
        id: data.DataID,
        AreaUnit: data.AreaUnit,
        Production: data.Production,
        ProductionUnit: data.ProductionUnit,
        Yield: data.Yield,
        State: data.State ? data.State.StateName : null,
        Crop: data.Crop ? data.Crop.CropName : null,
        Season: data.Season ? data.Season.SeasonName : null,
        District: data.District ? data.District.DistrictName : null,
    }));
}

router.get('/:stateName', async (req, res) => {
    try {
        const stateName = req.params.stateName
        const { crop, season, district, year, production, yield, area, sortColumn, sortOrder, page = 1 } = req.query;
        const whereCondition = {}
        if (crop) {
            whereCondition['$Crop.CropName$'] = { [Op.like]: `%${crop}%` };
        }
        if (season) {
            whereCondition['$Season.SeasonName$'] = { [Op.like]: `%${season}%` };
        }
        if (district) {
            whereCondition['$District.DistrictName$'] = { [Op.like]: `%${district}%` };
        }
        if (year) {
            whereCondition['Year'] = year;
        }

        if (production) {
            whereCondition['Production'] = production;
        }

        if (yield) {
            whereCondition['Yield'] = yield;
        }

        if (area) {
            whereCondition['Area'] = area;
        }

        let orderBy = [['Year', 'DESC']];

        if (sortColumn && sortOrder) {
            const isAssociatedColumn = ['crop', 'season', 'district'].includes(sortColumn);
            if (isAssociatedColumn) {
                orderBy = [
                    [
                        model[sortColumn],
                        column[sortColumn],
                        sortOrder.toUpperCase(),
                    ],
                ];
            } else {
                orderBy = [[sortColumn, sortOrder.toUpperCase()]];
            }
        }


        const offset = (page - 1) * pageSize

        const agricultureData = await Agriculture.findAll({
            include: [{
                model: State,
                attributes: ['StateName'],
                where: {
                    StateName: stateName
                }
            },
            {
                model: Crop,
                attributes: ['CropName'],
            },
            {
                model: Season,
                attributes: ['SeasonName'],
            },
            {
                model: District,
                attributes: ['DistrictName'],
            },

            ],
            attributes: ['DataID', 'Production', 'Year', 'Area', 'Yield'],
            where: whereCondition,
            order: orderBy,
            limit: pageSize,
            offset
        }
        )

        let response;
        if (!agricultureData || agricultureData.length === 0) {
            response = createResponse(null, HttpStatus.NOT_FOUND, "Data not found.")
            res.status(HttpStatus.NOT_FOUND).send(response)
            return
        }

        const formattedResponse = formatAgricultureDataResponse(agricultureData)

        response = createResponse(formattedResponse, HttpStatus.OK, "Data retrieved successfully.")
        res.status(HttpStatus.OK).send(response)
    } catch (error) {
        console.log("Error retrieving data", error)
        response = createResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving data")
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response)
    }
})

module.exports = router
