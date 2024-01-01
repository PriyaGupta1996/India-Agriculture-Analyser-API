const formatProductionPerCropData = (DBData) => {
    return DBData.map(data => ({
        TotalProduction: data["TotalProduction"],
        Crop: data["Crop.CropName"]
    }));
}
const formatProductionPerYearData = (DBData) => {
    return DBData.map(data => ({
        TotalProduction: data["TotalProduction"],
        Year: data["Year"]
    }));
}
const formatAgricultureDataResponse = (DBData) => {
    return DBData.map(data => ({
        Year: data.Year,
        Area: data.Area,
        id: data.DataID,
        AreaUnit: data.AreaUnit,
        Production: data.Production,
        ProductionUnit: data.ProductionUnit,
        Yield: data.Yield,
        State: data.State ? data.State.StateName : null,
        Crop: data.Crop ? data.Crop.CropName : null,
        Season: data.Season ? data.Season.SeasonName : null,
        District: data.District ? data.District.DistrictName : null,
    }));
}

module.exports = { formatAgricultureDataResponse, formatProductionPerCropData, formatProductionPerYearData }