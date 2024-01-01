const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const secretKey = 'APAC';
const createResponse = require("../utils/createResponse")
const HttpStatus = require("../constants/HttpStatus")

// Middleware to verify Bearer token
const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, secretKey, (err) => {
            if (err) {
                const response = createResponse(null, HttpStatus.UNAUTHORIZED, "Not authorized.")
                res.status(HttpStatus.UNAUTHORIZED).send(response);
            } else {
                next();
            }
        });
    } else {
        const response = createResponse(null, HttpStatus.UNAUTHORIZED, "Not authorized.")
        res.status(HttpStatus.UNAUTHORIZED).send(response);
    }
};

module.exports = verifyToken