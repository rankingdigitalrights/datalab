// --- Spreadsheet Casting: Company Data Collection Sheet --- //

function createSpreadsheetDC(useStepsSubset, useIndicatorSubset, CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {
    Logger.log("--- // --- begin main data collection --- // ---")

    var sourcesTabName = "Sources"

    var companyShortName = cleanCompanyName(CompanyObj)

    Logger.log("--- // --- creating " + mainSheetMode + " Spreadsheet for " + companyShortName + " --- // ---")

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

    var SS = connectToSpreadsheetByName(spreadsheetName)

    var fileID = SS.getId()
    Logger.log("SS ID: " + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    var externalFormula = "=IMPORTRANGE(\"" + Config.prevIndexSSID + "\",\"" + CompanyObj.tabPrevYearsOutcome + "!" + "A:Z" + "\")"

    var newSheet

    // if set in Config, import previous Index Outcome
    if (Config.YearOnYear) {
        newSheet = insertSheetIfNotExist(SS, importedOutcomeTabName, false)
        if (newSheet !== null) {
            fillPrevOutcomeSheet(newSheet, importedOutcomeTabName, externalFormula)
        }
    }

    // --- // creates sources page // --- //

    newSheet = insertSheetIfNotExist(SS, sourcesTabName, false)
    if (newSheet !== null) {
        fillSourceSheet(newSheet)
    }

    // if scoring sheet is integrated into DC, create Points sheet

    var hasOpCom = CompanyObj.hasOpCom

    // fetch number of Services once
    var companyNumberOfServices = CompanyObj.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Class do
    var currentCat

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        currentCat = IndicatorsObj.indicatorClasses[i]

        Logger.log("Starting " + currentCat.labelLong)
        Logger.log("Passing over " + ResearchStepsObj.researchSteps.length + " Steps")

        populateDCSheetByCategory(SS, currentCat, CompanyObj, ResearchStepsObj, companyNumberOfServices, serviceColWidth, hasOpCom, doCollapseAll, includeRGuidanceLink, collapseRGuidance, useIndicatorSubset)

        Logger.log("Completed " + currentCat.labelLong)
    }

    Logger.log("end DC main")

    // --- // additional integrated Outputs // --- //

    if (integrateOutputs) {
        Logger.log("Adding Extra Sheets (Scoring / Feedback / Notes")

        // fetch params
        var isPilotMode = Config.integrateOutputsArray.isPilotMode
        var includeNotes = Config.integrateOutputsArray.includeNotes
        var includeScoring = Config.integrateOutputsArray.includeScoring
        var hasFullScores = Config.integrateOutputsArray.isFullScoring


        var sheetModeID = "SC"

        var outputParams

        if (includeScoring) {

            Logger.log("Extra Sheet --- Scores --- adding")

            // Scoring Scheme / Validation
            var pointsSheet = insertPointValidationSheet(SS, "Points")

            outputParams = Config.integrateOutputsArray.scoringParams
            isPilotMode = false
            addSetOfScoringSteps(SS, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

            Logger.log("Extra Sheet --- Scores --- added")

            moveHideSheetifExists(SS, pointsSheet, 1)

        }

        if (includeNotes) {
            Logger.log("Extra Sheet --- Researcher Feedback --- adding")
            outputParams = Config.integrateOutputsArray.researchNotesParams

            addSetOfScoringSteps(SS, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

            Logger.log("Extra Sheet --- Researcher Feedback --- added")
        }
    }

    // clean up //
    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    Logger.log(mainSheetMode + " Spreadsheet created for " + companyShortName)
    return fileID
}