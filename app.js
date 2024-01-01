const express = require('express');
const stateRoutes = require("./src/routes/stateRoutes");
const authRoutes = require("./src/routes/authRoutes")
const agricultureRoutes = require("./src/routes/agricultureRoutes")
const sequelize = require("./database");
const cors = require("cors");
const verifyToken = require('./src/middlewares/verifyToken');
const PORT = process.env.PORT || 8080

sequelize.sync().then(() => console.log("DB is ready")).catch(() => console.log("Error loading DB"))

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET',
    credentials: true,
}));
app.use('/api/token', authRoutes)
app.use('/api/state', verifyToken, stateRoutes);
app.use('/api/agriculture', verifyToken, agricultureRoutes)

app.listen(PORT, () => {
    console.log(`I am listening on port ${PORT}`)
})