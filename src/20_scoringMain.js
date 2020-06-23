// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

// --------------- This is the Main Scoring Process Caller ---------------- //

function createSpreadsheetOutput(useStepsSubset, useIndicatorSubset, thisCompany, filenamePrefix, filenameSuffix, mainSheetMode) {
    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var CompanyObj = thisCompany // TODO this a JSON Obj now; adapt in scope
    var Indicators = IndicatorsObj
    var ResearchStepsObj = researchStepsVector

    var sheetModeID = "SC"

    var companyFilename = cleanCompanyName(CompanyObj)

    Logger.log("--- --- START: main Scoring for " + companyFilename)
    Logger.log("--- --- START: creating " + mainSheetMode + " Spreadsheet for " + companyFilename)

    var hasOpCom = CompanyObj.hasOpCom
    Logger.log(companyFilename + " opCom? - " + hasOpCom)

    // define SS name
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyFilename, filenameSuffix)

    // connect to Spreadsheet if it already exists (Danger!), otherwise create and return new file
    var SS = createSpreadsheet(spreadsheetName, true)
    var fileID = SS.getId()

    // creates Outcome  page

    // Scoring Scheme / Validation
    var pointsSheet = insertPointValidationSheet(SS, "Points")

    // --- // Main Procedure // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = Config.integrateOutputsArray.scoringParams

    addSetOfScoringSteps(SS, sheetModeID, Config, Indicators, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

    moveHideSheetifExists(SS, pointsSheet, 1)

    // clean up // 
    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    Logger.log("--- --- END: main Scoring for " + companyFilename)

    return fileID
}
