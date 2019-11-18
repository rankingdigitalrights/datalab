// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

// --------------- This is the Main Scoring Process Caller ---------------- //

function createSpreadsheetSC(useStepsSubset, useIndicatorSubset, thisCompany, filenamePrefix, filenameSuffix, mainSheetMode) {
    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var Config = centralConfig // var Config = importLocalJSON("Config")
    var CompanyObj = thisCompany // TODO this a JSON Obj now; adapt in scope
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var sheetModeID = "SC"

    var companyFilename = cleanCompanyName(CompanyObj)

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

    // Scoring Scheme / Validation
    // TODO Refactor to module and values to i.e. Config.JSON
    var pointsSheet = insertSheetIfNotExist(File, "Points", false)
    if (pointsSheet !== null) {
        fillPointsSheet(pointsSheet, "Points")
    }

    // --- // Main Procedure // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = Config.integrateOutputsArray.scoringParams


    addSetOfScoringSteps(File, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)


    if (pointsSheet) {
        moveSheetToPos(File, pointsSheet, 1)
        pointsSheet.hideSheet() // hide points - only possible after a 2nd sheet exists
    }

    // clean up // 
    // if empty Sheet exists, delete
    removeEmptySheet(File)

    return fileID
}
