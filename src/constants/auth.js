const { v4: uuidv4 } = require('uuid');

const tokenSecret = {
    API_KEY_SERVER: "123456789",
    DUMMY_USER_ID: uuidv4(),
    SECRET_KEY: 'APAC'
}

module.exports = tokenSecret