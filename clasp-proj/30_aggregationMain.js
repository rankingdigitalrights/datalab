function createAggregationSS(useStepsSubset, useIndicatorSubset, Companies, filenamePrefix, filenameSuffix, mainSheetMode, scoringStepNr) {

    // scroing step number should be passed via main method call

    var sheetModeID = "SC"
    var Config = centralConfig // var Config = importLocalJSON("Config")

    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector
    var filename = Config.summaryParams.spreadsheetName
    var summarySheetName = Config.summaryParams.sheetNameSimple + " " + scoringStepNr
    var testSheetName = "Summary Element"

    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, filename, filenameSuffix)

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

    var indicatorParams = countIndicatorLengths(IndicatorsObj)

    // --- // Main Procedure // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = Config.integrateOutputsArray.scoringParams
    outputParams.firstStepNr = scoringStepNr
    outputParams.lastStepNr = scoringStepNr

    // --- // Individual Company Outcome Sheets // --- //

    Companies.forEach(function (Company) {

        var companyFilename
        if (Company.label.altFilename) {
            companyFilename = Company.label.altFilename
        } else {
            companyFilename = Company.label.current
        }

        outputParams.sheetName = companyFilename

        Logger.log('begin Scoring for ' + companyFilename)
        Logger.log("creating " + mainSheetMode + ' Spreadsheet for ' + companyFilename)

        var hasOpCom = Company.hasOpCom
        Logger.log(companyFilename + " opCom? - " + hasOpCom)

        addSetOfScoringSteps(File, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, Company, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

    })
    
    // --- // Core: Summary Sheet // --- //

    var thisSubStepID = ResearchStepsObj.researchSteps[scoringStepNr - 1].substeps[0].subStepID

    var summarySheet = insertSheetIfNotExist(File, summarySheetName, true)
    summarySheet.clear()

    summarySheet = fillSummaryScoresSheet(summarySheet, sheetModeID, Config, IndicatorsObj, thisSubStepID, Companies, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode, indicatorParams)

    // --- // Side: testing Element Level // --- //
    

    // --- // Final formatiing // --- //
    if (pointsSheet) {
        moveSheetToPos(File, pointsSheet, 1)
        pointsSheet.hideSheet() // hide points - only possible after a 2nd sheet exists
    }

    // summarySheet = File.getSheetByName(summarySheetName)
    summarySheet.setFrozenColumns(1)
    summarySheet.setFrozenRows(2)
    moveSheetToPos(File, summarySheet, 1)

    var connectorSheet = insertSheetConnector(File, Companies)
    moveSheetToPos(File, connectorSheet, 1)

    return fileID
}
