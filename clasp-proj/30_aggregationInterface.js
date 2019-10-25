function createAggregationSS(useStepsSubset, useIndicatorSubset, Companies, filenamePrefix, filenameSuffix, mainSheetMode) {
    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var Config = centralConfig // var Config = importLocalJSON("Config")

    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var sheetModeID = "SC"

    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, "Scores PROTO", filenameSuffix)
    //   var File = SpreadsheetApp.create(spreadsheetName)
    var File = connectToSpreadsheetByName(spreadsheetName)

    var fileID = File.getId()
    Logger.log("File ID: " + fileID)

    // creates Outcome  page
    // TODO: redundant --> refactor to function 
    // if an empty Sheet exists, track and delete later
    var emptySheet = File.getSheetByName("Sheet1")

    var hasEmptySheet
    if (emptySheet) {
        hasEmptySheet = true
    } else {
        hasEmptySheet = false
    }

    // Scoring Scheme / Validation
    // TODO Refactor to module and values to i.e. Config.JSON
    var pointsSheet = insertSheetIfNotExist(File, "Points", false)
    if (pointsSheet !== null) {
        fillPointsSheet(pointsSheet, "Points")
    }

    // if existing, remove first empty sheet
    if (hasEmptySheet) {
        File.deleteSheet(emptySheet)
    }

    // --- // Main Procedure // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = Config.integrateOutputsArray.scoringParams


    Companies.forEach(function(Company) {

    var companyFilename
    if (Company.label.altFilename) {
        companyFilename = Company.label.altFilename
    } else {
        companyFilename = Company.label.current
    }

    outputParams.sheetName = companyFilename

    Logger.log('begin main Scoring for ' + companyFilename)
    Logger.log("creating " + mainSheetMode + ' Spreadsheet for ' + companyFilename)

    var hasOpCom = Company.hasOpCom
    Logger.log(companyFilename + " opCom? - " + hasOpCom)

    addSetOfScoringSteps(File, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, Company, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

    })


    if (pointsSheet) {
        moveSheetToPos(File, pointsSheet,1)
        pointsSheet.hideSheet() // hide points - only possible after a 2nd sheet exists
    }

    return fileID
}
