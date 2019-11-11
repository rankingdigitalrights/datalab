// --- Spreadsheet Casting: Company Data Collection Sheet --- //

function createSpreadsheetDC(useStepsSubset, useIndicatorSubset, CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {
    Logger.log('--- // --- begin main data collection --- // ---')

    var sourcesTabName = "Sources"

    var companyShortName
    if (CompanyObj.label.altFilename) {
        companyShortName = CompanyObj.label.altFilename
    } else {
        companyShortName = CompanyObj.label.current
    }

    Logger.log("--- // --- creating " + mainSheetMode + ' Spreadsheet for ' + companyShortName + " --- // ---")

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var Config = centralConfig // var Config = importLocalJSON("Config")
    // var CompanyObj = CompanyObj // TODO this a JSON Obj now; adapt in scope
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var serviceColWidth = Config.serviceColWidth
    var doCollapseAll = Config.collapseAllGroups
    var integrateOutputs = Config.integrateOutputs
    var importedOutcomeTabName = Config.prevYearOutcomeTab
    var includeRGuidanceLink = Config.includeRGuidanceLink
    var collapseRGuidance = Config.collapseRGuidance


    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)
    //   var File = SpreadsheetApp.create(spreadsheetName)
    var File = connectToSpreadsheetByName(spreadsheetName)

    var fileID = File.getId()
    Logger.log("File ID: " + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    var externalFormula = '=IMPORTRANGE("' + Config.prevIndexSSID + '","' + CompanyObj.tabPrevYearsOutcome + '!' + 'A:Z' + '")'

    // if an empty Sheet exists, track and delete later
    var emptySheet = File.getSheetByName("Sheet1")
    var hasEmptySheet

    if (emptySheet) {
        hasEmptySheet = true
    } else {
        hasEmptySheet = false
    }

    var newSheet

    // if set in Config, import previous Index Outcome
    if (centralConfig.YearOnYear) {
        newSheet = insertSheetIfNotExist(File, importedOutcomeTabName, false)
        if (newSheet !== null) {
            fillPrevOutcomeSheet(newSheet, importedOutcomeTabName)
        }
    }

    // --- // creates sources page // --- //

    newSheet = insertSheetIfNotExist(File, sourcesTabName, false)
    if (newSheet !== null) {
        fillSourceSheet(newSheet)
    }

    // if scoring sheet is integrated into DC, create Points sheet

    var hasOpCom = CompanyObj.hasOpCom

    // fetch number of Services once
    var companyNumberOfServices = CompanyObj.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        var currentClass = IndicatorsObj.indicatorClasses[i]

        Logger.log("Starting " + currentClass.labelLong)
        Logger.log("Passing over " + ResearchStepsObj.researchSteps.length + " Steps")

        populateDCSheetByCategory(File, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, serviceColWidth, hasOpCom, doCollapseAll, includeRGuidanceLink, collapseRGuidance, useIndicatorSubset)

        Logger.log("Completed " + currentClass.labelLong)
    }

    Logger.log('end DC main')

    // --- // additional integrated Outputs // --- //
   
    if (integrateOutputs) {
        Logger.log("Adding Extra Sheets (Scoring / Feedback / Notes")

        // fetch params
        var isPilotMode = Config.integrateOutputsArray.isPilotMode
        var includeNotes = Config.integrateOutputsArray.includeNotes
        var includeScoring = Config.integrateOutputsArray.isFullScoring
        var hasFullScores = Config.integrateOutputsArray.isFullScoring
        

        var sheetModeID = "SC"

        var outputParams

        if (includeScoring) {

            var pointsSheet = insertSheetIfNotExist(File, "Points", false)
            if (pointsSheet !== null) { fillPointsSheet(pointsSheet, "Points") }

            outputParams = Config.integrateOutputsArray.scoringParams
            isPilotMode = false
            addSetOfScoringSteps(File, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

            if (pointsSheet !== null) {
                moveSheetToPos(File, pointsSheet,1)
                pointsSheet.hideSheet()
            }

        }

        if(includeNotes) {
            outputParams = Config.integrateOutputsArray.researchNotesParams

            addSetOfScoringSteps(File, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

            Logger.log("Extra Sheet --- Researcher Feedback --- added")
        }
    }


    // clean up // 
    // if existing, remove first empty sheet
    if (hasEmptySheet) {
        File.deleteSheet(emptySheet)
    }

    Logger.log(mainSheetMode + ' Spreadsheet created for ' + companyShortName)
    return fileID
}
