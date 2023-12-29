const express = require('express');
const stateRoutes = require("./src/routes/stateRoutes");
const sequelize = require("./database")
const PORT = process.env.PORT || 8080

sequelize.sync().then(() => console.log("DB is ready")).catch(() => console.log("Error loading DB"))

const app = express();

app.use('/api/state', stateRoutes);

app.listen(8080, () => {
    console.log("I am listening on port 8080")
})