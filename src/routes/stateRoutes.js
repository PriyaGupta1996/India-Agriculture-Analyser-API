const express = require("express")
const router = express.Router()
const createResponse = require("../utils/createResponse")
const HttpStatus = require("../constants/HttpStatus")
const { State } = require("../../models")
const getAllState = require("../controllers/stateController")

router.get('/', getAllState)




module.exports = router