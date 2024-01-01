const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const apiKeyServer = "123456789"
const dummy_user_id = uuidv4()
const secretKey = 'APAC';
const createResponse = require("../utils/createResponse")
const HttpStatus = require("../constants/HttpStatus")
const { getToken } = require("../controllers/authController")

router.get('/', getToken)

module.exports = router
