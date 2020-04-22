// --- Spreadsheet Casting: Company Data Collection Sheet --- //

/* global 
centralConfig,
indicatorsVector,
researchStepsVector,
spreadSheetFileName,
createSpreadsheet,
insertPointValidationSheet,
cleanCompanyName,
addSetOfScoringSteps
insertSheetIfNotExist,
moveHideSheetifExists,
removeEmptySheet,
fillPrevOutcomeSheet,
fillSourceSheet,
populateDCSheetByCategory
*/


function createSpreadsheetInput(useStepsSubset, useIndicatorSubset, CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {
    Logger.log("PROCESS: begin main DC --- // ---")

    let sourcesTabName = "Sources"

    let companyShortName = cleanCompanyName(CompanyObj)

    Logger.log("--- // --- creating " + mainSheetMode + " Spreadsheet for " + companyShortName + " --- // ---")

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    let Config = centralConfig // let Config = importLocalJSON("Config")
    // let CompanyObj = CompanyObj // TODO this a JSON Obj now; adapt in scope
    let IndicatorsObj = indicatorsVector
    let ResearchStepsObj = researchStepsVector
    let doCollapseAll = Config.collapseAllGroups
    let integrateOutputs = Config.integrateOutputs
    let importedOutcomeTabName = Config.prevYearOutcomeTab
    let includeRGuidanceLink = Config.includeRGuidanceLink
    let collapseRGuidance = Config.collapseRGuidance


    // connect to existing spreadsheet or creat a blank spreadsheet
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    let SS = createSpreadsheet(spreadsheetName, true)

    let fileID = SS.getId()
    Logger.log("SS ID: " + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    let externalFormula = "=IMPORTRANGE(\"" + Config.urlPreviousYearResults + "\",\"" + CompanyObj.tabPrevYearsOutcome + "!" + "A:Z" + "\")"

    let Sheet

    // if set in Config, import previous Index Outcome
    if (Config.YearOnYear) {
        Sheet = insertSheetIfNotExist(SS, importedOutcomeTabName, false) // Import only once; hard copy; do not overwrite
        if (Sheet !== null) {
            fillPrevOutcomeSheet(Sheet, importedOutcomeTabName, externalFormula)
        }
    }

    // --- // creates sources page // --- //

    Sheet = insertSheetIfNotExist(SS, sourcesTabName, false)
    if (Sheet !== null) {
        fillSourceSheet(Sheet)
    }

    // if scoring sheet is integrated into DC, create Points sheet

    let hasOpCom = CompanyObj.hasOpCom

    // fetch number of Services once
    let companyNumberOfServices = CompanyObj.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Category do
    let Category

    for (let i = 0; i < IndicatorsObj.indicatorCategories.length; i++) {

        Category = IndicatorsObj.indicatorCategories[i]

        Logger.log("--- Starting " + Category.labelLong)
        populateDCSheetByCategory(SS, Category, CompanyObj, ResearchStepsObj, companyNumberOfServices, hasOpCom, doCollapseAll, includeRGuidanceLink, collapseRGuidance, useIndicatorSubset, useStepsSubset)

        Logger.log("--- Completed " + Category.labelLong)
    }

    Logger.log("PROCESS: end DC main")

    // --- // additional integrated Outputs // --- //
    // --- // Pilot Feature, so probably irrelevant // --- //
    // TODO: remove //

    if (integrateOutputs) {
        Logger.log("Adding Extra Sheets (Scoring / Feedback / Notes")

        // fetch params
        let isPilotMode = Config.integrateOutputsArray.isPilotMode
        let includeNotes = Config.integrateOutputsArray.includeNotes
        let includeScoring = Config.integrateOutputsArray.includeScoring
        let hasFullScores = Config.integrateOutputsArray.isFullScoring

        let sheetModeID = "SC"

        let outputParams

        if (includeScoring) {

            Logger.log("Extra Sheet --- Scores --- adding")

            // Scoring Scheme / Validation
            let pointsSheet = insertPointValidationSheet(SS, "Points")

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

    Logger.log("FILE: " + mainSheetMode + " Spreadsheet created for " + companyShortName)
    return fileID
}
