function createAggregationSS(useStepsSubset, useIndicatorSubset, Companies, filenamePrefix, filenameSuffix, mainSheetMode, scoringStepNr) {

    // scroing step number should be passed via main method call

    var sheetModeID = "SC"
    var Config = centralConfig // var Config = importLocalJSON("Config")

    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector
    var stepName = " S" + scoringStepNr
    var summarySheetName = Config.summaryParams.sheetNameSimple + stepName

    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, stepName, mainSheetMode, filenameSuffix)

    var SS = connectToSpreadsheetByName(spreadsheetName)

    var fileID = SS.getId()
    Logger.log("SS ID: " + fileID)

    // Scoring Scheme / Validation
    var pointsSheet = insertPointValidationSheet(SS, "Points")

    var indicatorParams = countIndicatorLengths(IndicatorsObj)

    // --- // Main Procedure // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = Config.integrateOutputsArray.scoringParams
    outputParams.firstStepNr = scoringStepNr
    outputParams.lastStepNr = scoringStepNr

    // --- // Individual Company Outcome Sheets // --- //

    Companies.forEach(function (CompanyObj) {

        var companyFilename = cleanCompanyName(CompanyObj)

        outputParams.sheetName = companyFilename

        Logger.log("creating " + mainSheetMode + ' Spreadsheet for ' + companyFilename)

        var hasOpCom = CompanyObj.hasOpCom
        Logger.log(companyFilename + " opCom? - " + hasOpCom)

        addSetOfScoringSteps(SS, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

    })

    // --- // Core: Summary Sheet // --- //

    var thisSubStepID = ResearchStepsObj.researchSteps[scoringStepNr - 1].substeps[0].subStepID

    var summarySheet = insertSheetIfNotExist(SS, summarySheetName, true)
    summarySheet.clear()

    summarySheet = fillSummaryScoresSheet(summarySheet, sheetModeID, Config, IndicatorsObj, thisSubStepID, Companies, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode, indicatorParams)

    // Prototype: Element Level //

    summarySheet = insertSheetIfNotExist(SS, "Summary: Elements", true)
    summarySheet.clear()
    summarySheet = fillSummaryScoresSheet(summarySheet, sheetModeID, Config, IndicatorsObj, thisSubStepID, Companies, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode, indicatorParams)

    // --- // Side: testing Element Level // --- //

    // TODO

    // --- // Final formatiing // --- //
    // summarySheet = SS.getSheetByName(summarySheetName)
    summarySheet.setFrozenColumns(1)
    summarySheet.setFrozenRows(2)
    moveSheetifExists(SS, summarySheet, 1)

    var connectorSheet = insertSheetConnector(SS, Companies)

    moveSheetifExists(SS, connectorSheet, 1)

    moveHideSheetifExists(SS, pointsSheet, 1)

    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    return fileID
}