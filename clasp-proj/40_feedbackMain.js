// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

// --------------- This is the Main Scoring Process Caller ---------------- //

function createFeedbackForms(useStepsSubset, useIndicatorSubset, thisCompany, filenamePrefix, filenameSuffix, mainSheetMode) {
    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var Config = centralConfig // var Config = importLocalJSON("Config")
    var CompanyObj = thisCompany // TODO this a JSON Obj now; adapt in scope
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var sheetModeID = "SC"

    var companyFilename
    if (CompanyObj.label.altFilename) {
        companyFilename = CompanyObj.label.altFilename
    } else {
        companyFilename = CompanyObj.label.current
    }

    Logger.log('begin main Scoring for ' + companyFilename)
    Logger.log("creating " + mainSheetMode + ' Spreadsheet for ' + companyFilename)

    var hasOpCom = CompanyObj.hasOpCom
    Logger.log(companyFilename + " opCom? - " + hasOpCom)

    // define File name
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyFilename, filenameSuffix)

    // connect to Spreadsheet if it already exists (Danger!), otherwise create and return new file
    var File = connectToSpreadsheetByName(spreadsheetName)
    var fileID = File.getId()

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
    var pointsSheet
    // var pointsSheet = insertSheetIfNotExist(File, "Points", false)
    // if (pointsSheet !== null) {
    //     fillPointsSheet(pointsSheet, "Points")
    // }

    // --- // Main Procedure // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = Config.integrateOutputsArray.feedbackParams


    addSetOfScoringSteps(File, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

    // if existing, remove first empty sheet
    if (hasEmptySheet) {
        File.deleteSheet(emptySheet)
    }

    if (pointsSheet) {
        moveSheetToPos(File, pointsSheet,1)
        pointsSheet.hideSheet() // hide points - only possible after a 2nd sheet exists
    }



    return fileID
}
