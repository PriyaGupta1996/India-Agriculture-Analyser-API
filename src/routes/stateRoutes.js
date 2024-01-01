const express = require("express")
const router = express.Router()

const getAllState = require("../controllers/stateController")

router.get('/', getAllState)




module.exports = router