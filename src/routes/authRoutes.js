const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const apiKeyServer = "123456789"
const dummy_user_id = uuidv4()
const secretKey = 'APAC';
const createResponse = require("../utils/createResponse")
const HttpStatus = require("../constants/HttpStatus")

router.get('/', (req, res) => {
    const apiKeyClient = req.headers['x-api-key'];
    console.log("x-api-key", apiKeyClient)
    if (apiKeyClient === apiKeyServer) {
        const payload = {
            userId: dummy_user_id
        }
        const token = jwt.sign(payload, secretKey, { expiresIn: '15m' });
        const response = createResponse(token, HttpStatus.OK, "Token generated successfully");
        res.status(HttpStatus.OK).send(response)
    } else {
        console.log("Invalid API key")
        const response = createResponse(null, HttpStatus.UNAUTHORIZED, "Not Authorized. ");
        res.status(HttpStatus.UNAUTHORIZED).send(response)
    }
});

module.exports = router
