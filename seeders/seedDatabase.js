const fs = require('fs');
const sequelize = require("../database");
const csv = require("csv-parser");
const { AgricultureData, Crop, District, Season, State } = require("../models");

const AVG_COCONUT_WEIGHT = 1.4;
const balesToTonMultiplier = 0.24;
const csvFilePath = "./seeders/India Agriculture Crop Production.csv";
const BULK_INSERT_THRESHOLD = 10000;

async function populateEntity(model, field, value) {
    try {
        let record = await model.findOne({ where: { [field]: value } });
        if (!record) {
            record = await model.create({ [field]: value });
        }
        return record.get(`${model.name}ID`);
    } catch (error) {
        console.log(`Error in populate${model.name}: ${error}`);
        throw new Error(`Error in populate${model.name}: ${error}`);
    }
}

async function populateCrop(cropName) {
    return populateEntity(Crop, 'CropName', cropName);
}

async function populateSeason(seasonName) {
    return populateEntity(Season, 'SeasonName', seasonName);
}

async function populateDistrict(districtName) {
    return populateEntity(District, 'DistrictName', districtName);
}

async function populateState(stateName) {
    return populateEntity(State, 'StateName', stateName);
}

async function processRow(row, bulkInsertData) {
    try {
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
            productionUnit: row['Production Units'].toLowerCase(),
        };
        const [cropID, districtID, seasonID, stateID] = await Promise.all([
            populateCrop(rowData["crop"]),
            populateDistrict(rowData["district"]),
            populateSeason(rowData["season"]),
            populateState(rowData["state"]),
        ]);

        bulkInsertData.push(createAgricultureDataObject(cropID, districtID, seasonID, stateID, rowData));

        if (bulkInsertData.length === BULK_INSERT_THRESHOLD) {
            await bulkInsertAgricultureData([...bulkInsertData]);
            bulkInsertData.length = 0;
        }
    } catch (error) {
        console.log('Error in processing row', error);
    }
}

function createAgricultureDataObject(cropID, districtID, seasonID, stateID, rowData) {
    return {
        CropID: cropID,
        DistrictID: districtID,
        SeasonID: seasonID,
        StateID: stateID,
        Year: parseInt(rowData.year),
        Area: rowData.area,
        AreaUnit: rowData.areaUnit,
        Production: rowData.production,
        ProductionUnit: rowData.productionUnit,
        Yield: rowData.cropYield,
    };
}

async function bulkInsertAgricultureData(data) {
    try {
        const processedData = data.map((rowData) => {
            let { year, area, areaUnit, production, cropYield, productionUnit } = rowData;

            if (productionUnit === "nuts") {
                production = (production * (AVG_COCONUT_WEIGHT)) / 1000; // converting kgs to tonnes
                cropYield = production / area;
            }

            if (productionUnit === "bales") {
                production = production * (balesToTonMultiplier);
                cropYield = production / area;
            }
            productionUnit = "tonnes"

            return {
                CropID: rowData.CropID,
                DistrictID: rowData.DistrictID,
                SeasonID: rowData.SeasonID,
                StateID: rowData.StateID,
                Year: rowData.Year,
                Area: rowData.Area,
                AreaUnit: rowData.AreaUnit,
                Production: rowData.Production,
                ProductionUnit: rowData.ProductionUnit,
                Yield: rowData.Yield,
            };
        });

        await AgricultureData.bulkCreate(processedData, { ignoreDuplicates: true });
    } catch (error) {
        console.log('Error in bulkInsertAgricultureData', error);
        throw new Error('Error in bulkInsertAgricultureData', error);
    }
}
async function seedDatabase() {
    try {
        await sequelize.sync();

        const stream = fs.createReadStream(csvFilePath).pipe(csv());
        const bulkInsertData = [];

        for await (const row of stream) {
            await processRow(row, bulkInsertData);
        }

        // Insert any remaining records
        if (bulkInsertData.length > 0) {
            await bulkInsertAgricultureData([...bulkInsertData]);
        }
    } catch (error) {
        console.log('Error in populating the database', error);
    } finally {
        await sequelize.close();
    }
}

// Start seeding the database
seedDatabase();
