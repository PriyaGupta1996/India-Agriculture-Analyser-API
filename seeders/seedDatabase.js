const fs = require('fs')
const sequelize = require("../database")
const csv = require("csv-parser")
const { AgricultureData, Crop, District, Season, State } = require("../models")
const csvFilePath = "./seeders/India Agriculture Crop Production.csv"

const AVG_COCONUT_WEIGHT = 1.4
const balesToTonMultiplier = 0.24

const populateCrop = async (cropName) => {
    try {
        let record = await Crop.findOne({ where: { CropName: cropName } });
        if (!record) {
            record = await Crop.create({ CropName: cropName });
        }
        return record.CropID

    } catch (error) {
        console.log("Error in populateCrop: " + error)
        throw new Error("Error in populateCrop: " + error);
    }

}

const populateSeason = async (seasonName) => {
    try {
        let record = await Season.findOne({ where: { SeasonName: seasonName } });
        if (!record) {
            record = await Season.create({ SeasonName: seasonName });
        }
        return record.SeasonID
    } catch (error) {
        console.log("Error in populateSeason: " + error)
        throw new Error("Error in populateSeason: " + error);
    }
}

const populateDistrict = async (districtName) => {
    try {
        let record = await District.findOne({ where: { DistrictName: districtName } });
        if (!record) {
            record = await District.create({ DistrictName: districtName });
        }
        return record.DistrictID
    } catch (error) {
        console.log("Error in populateDistrict: " + error)
        throw new Error("Error in populateDistrict: " + error);
    }
}

const populateState = async (stateName) => {
    try {
        let record = await State.findOne({ where: { StateName: stateName } });
        if (!record)
            record = await State.create({ StateName: stateName });
        return record.get("StateID")
    } catch (error) {
        console.log("Error in populateState: " + error)
        throw new Error("Error in populateState: " + error);
    }
}

const populateAgricultureData = async (cropID, districtID, seasonID, stateID, rowData) => {
    let { year, area, areaUnit, production, cropYield, productionUnit } = rowData
    if (productionUnit === "nuts") {
        production = production * (AVG_COCONUT_WEIGHT) / 1000 //converting kgs to tonnes
        cropYield = production / area
    }
    if (productionUnit === "bales") {
        production = production * (balesToTonMultiplier);
        cropYield = production / area;
    }
    try {
        let record = await AgricultureData.findOne({
            where: {
                CropID: cropID,
                DistrictID: districtID,
                SeasonID: seasonID,
                StateID: stateID,
                Year: parseInt(year),
            }
        });
        if (!record) {
            record = await AgricultureData.create({
                CropID: cropID,
                DistrictID: districtID,
                SeasonID: seasonID,
                StateID: stateID,
                Year: parseInt(year),
                Area: area,
                AreaUnit: areaUnit,
                Production: production,
                ProductionUnit: productionUnit,
                Yield: cropYield,
            })
        }
    } catch (error) {
        console.log("Error in populateAgricultureData", error)
        throw new Error("Error in populateAgricultureData", error)
    }
}

const seedDatabase = async () => {
    try {
        const stream = fs.createReadStream(csvFilePath).pipe(csv());
        let rowNo = 1;
        for await (const row of stream) {
            console.log("row:", rowNo++)
            //fetching the row data
            const rowData = {
                state: row['State'].toLowerCase(),
                district: row['District'].toLowerCase(),
                season: row['Season'].toLowerCase(),
                year: row['Year'].split('-')[0],
                crop: row['Crop'].toLowerCase(),
                area: row['Area'],
                areaUnit: row['Area Units'].toLowerCase(),
                production: row['Production'],
                cropYield: row['Yield'],
                productionUnit: row['Production Units'].toLowerCase()
            }
            const [cropID, districtID, seasonID, stateID] = await Promise.all([populateCrop(rowData["crop"]), populateDistrict(rowData["district"]), populateSeason(rowData["season"]), populateState(rowData["state"])])
            await populateAgricultureData(cropID, districtID, seasonID, stateID, rowData);

        }

    }
    catch (error) {
        console.log("Error in populating the database", error);
    }
    finally {
        await sequelize.close();
    }
}
seedDatabase()