const express = require('express');
const stateRoutes = require("./src/routes/stateRoutes");
const agricultureRoutes = require("./src/routes/agricultureRoutes")
const sequelize = require("./database");
const cors = require("cors");
const PORT = process.env.PORT || 8080

sequelize.sync().then(() => console.log("DB is ready")).catch(() => console.log("Error loading DB"))

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET',
    credentials: true,
}));

app.use('/api/state', stateRoutes);
app.use('/api/agriculture', agricultureRoutes)

app.listen(8080, () => {
    console.log("I am listening on port 8080")
})