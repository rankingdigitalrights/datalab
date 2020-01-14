// Interface to health / integrity assessment

function inspectHealth(Companies, filenamePrefix, filenameSuffix, mainSheetMode) {

    var controlSpreadsheetName = "00_ControlHealth"

    Companies.array.forEach(Company => {
        inspectHealthSingleSpreadsheet(Company, filenamePrefix, filenameSuffix, mainSheetMode)
    })
}

function inspectHealthSingleSpreadsheet(Company, filenamePrefix, filenameSuffix, mainSheetMode) {

    var companyShortName = cleanCompanyName(Company)

    var Config = centralConfig
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector
    var includeRGuidanceLink = Config.includeRGuidanceLink
    var collapseRGuidance = Config.collapseRGuidance


    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)
    //   var SS = SpreadsheetApp.create(spreadsheetName)
    var SS = connectToSpreadsheetByName(spreadsheetName)

    var fileID = SS.getId()
    Logger.log("SS ID: " + fileID)

    var currentDate = getISOtimeAsString()

    var ListSheetBroken = insertSheetIfNotExist(SS, "BrokenRefs", true)
}