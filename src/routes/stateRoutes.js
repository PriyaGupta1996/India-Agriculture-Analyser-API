const express = require("express")
const router = express.Router()
const createResponse = require("../utils/createResponse")
const HttpStatus = require("../constants/HttpStatus")
const { State } = require("../../models")

router.get('/', async (req, res) => {
    try {
        const states = await State.findAll({
            attributes: ['StateID', 'StateName'],
        })
        const response = createResponse(states, HttpStatus.OK, "States retrieved successfully");
        res.status(HttpStatus.OK).send(response)
    } catch (error) {
        console.log("Error retrieving states.")
        const response = createResponse(null, HttpStatus.INTERNAL_SERVER_ERROR, "Error retrieving states")
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(response)
    }
})


module.exports = router