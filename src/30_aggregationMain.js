/* global 
centralConfig,
indicatorsVector,
researchStepsVector,
spreadSheetFileName,
connectToSpreadsheetByName,
insertPointValidationSheet,
countIndiClassLengths,
cleanCompanyName,
addSetOfScoringSteps
insertSheetIfNotExist,
fillSummaryScoresSheet,
moveSheetifExists,
insertSheetConnector,
moveHideSheetifExists,
removeEmptySheet
*/

function createAggregationOutput(useIndicatorSubset, Companies, filenamePrefix, filenameSuffix, mainSheetMode, scoringStepNr) {

    // scroing step number should be passed via main method call

    var sheetModeID = "SC"
    var Config = centralConfig // var Config = importLocalJSON("Config")

    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector
    var stepName = "S" + scoringStepNr
    var summarySheetName = Config.summaryParams.sheetNameSimple + " " + stepName

    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, stepName, mainSheetMode, filenameSuffix)

    var SS = connectToSpreadsheetByName(spreadsheetName, true)

    var fileID = SS.getId()
    Logger.log("SS ID: " + fileID)

    // Scoring Scheme / Validation
    var pointsSheet = insertPointValidationSheet(SS, "Points")

    var indicatorParams = countIndiClassLengths(IndicatorsObj)

    // --- // Main Procedure // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = Config.integrateOutputsArray.scoringParams
    outputParams.firstStepNr = scoringStepNr
    outputParams.lastStepNr = scoringStepNr

    // --- // Individual Company Outcome Sheets // --- //

    var companyFilename
    var hasOpCom

    Companies.forEach(function (CompanyObj) {

        companyFilename = cleanCompanyName(CompanyObj)

        outputParams.sheetName = companyFilename

        Logger.log("--- --- START: creating " + mainSheetMode + " Sheet for " + companyFilename)

        hasOpCom = CompanyObj.hasOpCom

        addSetOfScoringSteps(SS, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

        Logger.log("--- --- END: created " + mainSheetMode + " Sheet for " + companyFilename)

    })

    // --- // Core: Summary Sheet // --- //

    var thisSubStepID = ResearchStepsObj.researchSteps[scoringStepNr - 1].substeps[0].subStepID

    var summarySheet
    var includeElements

    includeElements = false

    summarySheet = insertSheetIfNotExist(SS, summarySheetName, false)

    if (summarySheet === null) {
        Logger.log("BREAK: Sheet for " + summarySheetName + " already exists. Skipping.")
    } else {
        summarySheet.clear()

        summarySheet = fillSummaryScoresSheet(summarySheet, IndicatorsObj, thisSubStepID, Companies, indicatorParams, includeElements)

        summarySheet.setFrozenColumns(1)
        summarySheet.setFrozenRows(2)
        moveSheetifExists(SS, summarySheet, 1)
    }

    // Prototype: with Element Level //

    includeElements = true

    summarySheetName = "Summary w Elements "
    summarySheet = insertSheetIfNotExist(SS, summarySheetName + stepName, false)

    if (summarySheet === null) {
        Logger.log("BREAK: Sheet for " + summarySheetName + " already exists. Skipping.")
    } else {
        summarySheet.clear()

        summarySheet = fillSummaryScoresSheet(summarySheet, IndicatorsObj, thisSubStepID, Companies, indicatorParams, includeElements)

        summarySheet.setFrozenColumns(1)
        summarySheet.setFrozenRows(2)
        moveSheetifExists(SS, summarySheet, 2)
    }

    // --- // Final formatiing // --- //

    var connectorSheet = insertSheetConnector(SS, Companies)

    moveSheetifExists(SS, connectorSheet, 1)

    moveHideSheetifExists(SS, pointsSheet, 1)

    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    return fileID
}