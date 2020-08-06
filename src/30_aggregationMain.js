/* global 
Config, IndicatorsObj, researchStepsVector, spreadSheetFileName, createSpreadsheet, insertPointValidationSheet, countIndiClassLengths, cleanCompanyName, addSetOfScoringSteps, insertSheetIfNotExist, fillSummaryScoresSheet, moveSheetifExists, insertSheetConnector, moveHideSheetifExists, removeEmptySheet, filterSingleSubstep
*/

// eslint-disable-next-line no-unused-vars
function createAggregationOutput(useIndicatorSubset, Companies, filenamePrefix, filenameSuffix, mainSheetMode, scoringStepNr, includeCompanyOutcomeSheets) {

    // scroing step number should be passed via main method call

    var sheetModeID = "SC"

    var Indicators = IndicatorsObj
    var ResearchStepsObj = researchStepsVector
    var stepName = "S" + scoringStepNr
    var summarySheetName = Config.summaryParams.sheetNameSimple + " " + stepName

    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, stepName, mainSheetMode, filenameSuffix)

    var SS = createSpreadsheet(spreadsheetName, true)

    var fileID = SS.getId()
    Logger.log("SS ID: " + fileID)

    // Scoring Scheme / Validation
    var pointsSheet = insertPointValidationSheet(SS, "Points")

    var indicatorParams = countIndiClassLengths(Indicators)

    // --- // Main Procedure // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = Config.integrateOutputsArray.scoringParams
    outputParams.firstStepNr = scoringStepNr
    outputParams.lastStepNr = scoringStepNr

    // --- // Individual Company Outcome Sheets // --- //

    var companyFilename
    var hasOpCom

    if (includeCompanyOutcomeSheets) {
        Companies.forEach(function (CompanyObj) {

            companyFilename = cleanCompanyName(CompanyObj)

            outputParams.sheetName = companyFilename

            Logger.log("--- --- START: creating " + mainSheetMode + " Sheet for " + companyFilename)

            hasOpCom = CompanyObj.hasOpCom

            addSetOfScoringSteps(SS, sheetModeID, Indicators, ResearchStepsObj, CompanyObj, hasOpCom, integrateOutputs, outputParams, isPilotMode)

            Logger.log("--- --- END: created " + mainSheetMode + " Sheet for " + companyFilename)

        })
    }

    // --- // Core: Summary Sheet // --- //

    var thisSubStepID = filterSingleSubstep(ResearchStepsObj.researchSteps[scoringStepNr], ResearchStepsObj.researchSteps[scoringStepNr].scoringSubStep)
    thisSubStepID = thisSubStepID.subStepID

    var summarySheet
    var includeElements

    includeElements = false

    summarySheet = insertSheetIfNotExist(SS, summarySheetName, false)

    if (summarySheet === null) {
        Logger.log("BREAK: Sheet for " + summarySheetName + " already exists. Skipping.")
    } else {
        summarySheet.clear()

        summarySheet = fillSummaryScoresSheet(summarySheet, Indicators, thisSubStepID, Companies, indicatorParams, includeElements)

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

        summarySheet = fillSummaryScoresSheet(summarySheet, Indicators, thisSubStepID, Companies, indicatorParams, includeElements)

        summarySheet.setFrozenColumns(1)
        summarySheet.setFrozenRows(2)
        moveSheetifExists(SS, summarySheet, 2)
    }

    // --- // Final formatiing // --- //

    var connectorSheet = insertSheetConnector(SS, Companies)

    // moveSheetifExists(SS, connectorSheet, 1)
    moveHideSheetifExists(SS, connectorSheet, 1)

    moveHideSheetifExists(SS, pointsSheet, 1)

    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    return fileID
}
