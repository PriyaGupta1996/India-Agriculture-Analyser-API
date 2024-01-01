const express = require('express');
const router = express.Router();
const { getStateWiseData, getProductionPerCrop, getProductionPerYear } = require("../controllers/agricultureController.js")

router.get('/:stateName/production-per-year', getProductionPerYear)

router.get('/:stateName/production-per-crop', getProductionPerCrop)

router.get('/:stateName', getStateWiseData)

module.exports = router
