const statusMessage = require("../constants/statusMessage")
const HttpStatus = require("../constants/HttpStatus")


const createResponse = (data = null, status, message = null) => {
    const response = {
        statusCode: status
    }
    if (data != null) response.data = data
    response.message = message || HttpStatus[status]
    return response
}

module.exports = createResponse