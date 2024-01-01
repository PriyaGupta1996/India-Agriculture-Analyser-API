const jwt = require('jsonwebtoken');
const createResponse = require("../utils/createResponse")
const HttpStatus = require("../constants/HttpStatus")
const { SECRET_KEY, DUMMY_USER_ID, API_KEY_SERVER } = require("../constants/auth")

const getToken = (req, res) => {
    const apiKeyClient = req.headers['x-api-key'];
    if (apiKeyClient === API_KEY_SERVER) {
        const payload = {
            userId: DUMMY_USER_ID
        }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
        const response = createResponse(token, HttpStatus.OK, "Token generated successfully");
        res.status(HttpStatus.OK).send(response)
    } else {
        console.log("Invalid API key")
        const response = createResponse(null, HttpStatus.UNAUTHORIZED, "Not Authorized. ");
        res.status(HttpStatus.UNAUTHORIZED).send(response)
    }
}

module.exports = { getToken }