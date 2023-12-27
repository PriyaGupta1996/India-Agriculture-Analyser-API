const express = require('express');
const router = express.Router();
const sequelize = require("./database")

sequelize.sync().then(() => console.log("DB is ready")).catch(() => console.log("Error loading DB"))

router.get('/ping', (req, res) => {
    res.status(200).json({ message: "pong" })
})

const app = express();
app.use(router)
app.listen(8080, () => {
    console.log("I am listening on port 8080")
})