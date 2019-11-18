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

    var File = connectToSpreadsheetByName(spreadsheetName)

    var fileID = File.getId()
    Logger.log("File ID: " + fileID)

    // Scoring Scheme / Validation
    // TODO Refactor to module and values to i.e. Config.JSON
    var pointsSheet = insertSheetIfNotExist(File, "Points", false)
    if (pointsSheet !== null) {
        fillPointsSheet(pointsSheet, "Points")
    }

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

        Logger.log('begin Scoring for ' + companyFilename)
        Logger.log("creating " + mainSheetMode + ' Spreadsheet for ' + companyFilename)

        var hasOpCom = CompanyObj.hasOpCom
        Logger.log(companyFilename + " opCom? - " + hasOpCom)

        addSetOfScoringSteps(File, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

    })

    // --- // Core: Summary Sheet // --- //

    var thisSubStepID = ResearchStepsObj.researchSteps[scoringStepNr - 1].substeps[0].subStepID

    var summarySheet = insertSheetIfNotExist(File, summarySheetName, true)
    summarySheet.clear()

    summarySheet = fillSummaryScoresSheet(summarySheet, sheetModeID, Config, IndicatorsObj, thisSubStepID, Companies, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode, indicatorParams)

    // --- // Side: testing Element Level // --- //

    // summarySheet = File.getSheetByName(summarySheetName)
    summarySheet.setFrozenColumns(1)
    summarySheet.setFrozenRows(2)
    moveSheetToPos(File, summarySheet, 1)

    var connectorSheet = insertSheetConnector(File, Companies)
    moveSheetToPos(File, connectorSheet, 1)

    // --- // Final formatiing // --- //
    if (pointsSheet) {
        moveSheetToPos(File, pointsSheet, 1)
        pointsSheet.hideSheet() // hide points - only possible after a 2nd sheet exists
    }

    // clean up // 
    // if empty Sheet exists, delete
    removeEmptySheet(File)

    return fileID
}
