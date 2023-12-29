const express = require('express');
const router = express.Router();
const createResponse = require("../utils/createResponse")
const HttpStatus = require("../constants/HttpStatus")
const { Agriculture, State, Crop, District, Season } = require("../../models")


const formatDBResponse = (DBData) => {
    return DBData.map(data => ({
        Year: data.Year,
        Area: data.Area,
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
            attributes: ['Production', 'Year', 'Area', 'Yield'],
        }
        )

        let response;
        if (!agricultureData || agricultureData.length === 0) {
            response = createResponse(null, HttpStatus.NOT_FOUND, "Data not found for selected state.")
            res.status(HttpStatus.NOT_FOUND).send(response)
        }

        const formattedResponse = formatDBResponse(agricultureData)

        response = createResponse(formattedResponse, HttpStatus.OK, "Data retrieved successfully.")
        res.status(HttpStatus.OK).send(response)
    } catch (error) {
        console.log("Error retrieving data", error)
        response = createResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving data")
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response)
    }
})


module.exports = router