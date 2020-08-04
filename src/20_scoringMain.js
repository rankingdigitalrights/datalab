// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

/* global Config, IndicatorsObj, researchStepsVector, cleanCompanyName, spreadSheetFileName, createSpreadsheet, insertPointValidationSheet, addSetOfScoringSteps, moveHideSheetifExists, removeEmptySheet */

// --------------- This is the Main Scoring Process Caller ---------------- //

function createSpreadsheetOutput(Company, filenamePrefix, filenameSuffix, mainSheetMode) {
    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    let Indicators = IndicatorsObj
    let ResearchStepsObj = researchStepsVector

    let sheetModeID = "SC"

    let companyFilename = cleanCompanyName(Company)

    Logger.log("--- --- START: main Scoring for " + companyFilename)
    Logger.log("--- --- START: creating " + mainSheetMode + " Spreadsheet for " + companyFilename)

    let hasOpCom = Company.hasOpCom
    Logger.log(companyFilename + " opCom? - " + hasOpCom)

    // define SS name
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyFilename, filenameSuffix)

    // connect to Spreadsheet if it already exists (Danger!), otherwise create and return new file
    let SS = createSpreadsheet(spreadsheetName, true)
    let fileID = SS.getId()

    // creates Outcome  page

    // Scoring Scheme / Validation
    let pointsSheet = insertPointValidationSheet(SS, "Points")

    // --- // Main Procedure // --- //

    let integrateOutputs = false
    let isPilotMode = false
    let outputParams = Config.integrateOutputsArray.scoringParams

    addSetOfScoringSteps(SS, sheetModeID, Config, Indicators, ResearchStepsObj, Company, hasOpCom, integrateOutputs, outputParams, isPilotMode)

    moveHideSheetifExists(SS, pointsSheet, 1)

    // clean up // 
    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    Logger.log("--- --- END: main Scoring for " + companyFilename)

    return fileID
}
