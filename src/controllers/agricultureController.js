const { Sequelize, Op } = require("sequelize");
const createResponse = require("../utils/createResponse")
const HttpStatus = require("../constants/HttpStatus")
const { PAGE_SIZE, PAGE_NO } = require("../constants/pagination")
const { Agriculture, State, Crop, District, Season } = require("../../models")
const { formatAgricultureDataResponse, formatProductionPerCropData, formatProductionPerYearData } = require("../services/agricultureService")

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




const getProductionPerYear = async (req, res) => {
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
}

const getProductionPerCrop = async (req, res) => {
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
}

const getStateWiseData = async (req, res) => {
    try {
        const stateName = req.params.stateName
        const { crop, season, district, year, production, yieldValue, area, sortColumn, sortOrder, page = PAGE_NO, pageSize = PAGE_SIZE } = req.query;
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

        if (yieldValue) {
            whereCondition['Yield'] = yieldValue;
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

        const agricultureData = await Agriculture.findAndCountAll({
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
            offset,

        }
        )

        let response;
        if (!agricultureData || agricultureData.length === 0) {
            response = createResponse(null, HttpStatus.NOT_FOUND, "Data not found.")
            res.status(HttpStatus.NOT_FOUND).send(response)
            return
        }

        const formattedResponse = { totalCount: agricultureData.count, records: formatAgricultureDataResponse(agricultureData.rows) }

        response = createResponse(formattedResponse, HttpStatus.OK, "Data retrieved successfully.")
        res.status(HttpStatus.OK).send(response)
    } catch (error) {
        console.log("Error retrieving data", error)
        response = createResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving data")
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response)
    }
}


module.exports = { getProductionPerCrop, getProductionPerYear, getStateWiseData }