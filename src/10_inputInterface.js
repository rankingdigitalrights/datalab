// --- Spreadsheet Casting: Company Data Collection Sheet --- //

/* global 
Config,
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
produceSourceSheet,
populateDCSheetByCategory
*/

function createSpreadsheetInput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode, doClearNamedRanges) {

    Logger.log("PROCESS: begin main DC --- // ---")

    let companyShortName = cleanCompanyName(Company)

    Logger.log("--- // --- creating " + mainSheetMode + " Spreadsheet for " + companyShortName + " --- // ---")

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    // let Company = Company // TODO this a JSON Obj now; adapt in scope
    let Indicators = indicatorsVector
    let ResearchStepsObj = researchStepsVector
    let doCollapseAll = Config.collapseAllGroups
    let integrateOutputs = Config.integrateOutputs
    let importedOutcomeTabName = Config.prevYearOutcomeTab
    let importedSourcesTabName = "2019 Sources" // TODO: Config

    let includeRGuidanceLink = Config.includeRGuidanceLink
    let collapseRGuidance = Config.collapseRGuidance


    // connect to existing spreadsheet or creat a blank spreadsheet
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    let SS = createSpreadsheet(spreadsheetName, true)

    let fileID = SS.getId()
    Logger.log("SS ID: " + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    let externalFormula

    let tabPrevYearsOutcome = (Company.tabPrevYearsOutcome != null) ? Company.tabPrevYearsOutcome : "VodafoneOutcome"

    let tabPrevYearsSources = (Company.tabPrevYearsOutcome != null) ? (companyShortName + "Sources") : "VodafoneSources"

    let sourcesTabName = "2020 Sources"

    let Sheet

    // if set in Config, import previous Index Outcome & Sources
    if (Config.YearOnYear) {

        // Previous OUTCOME
        externalFormula = "=IMPORTRANGE(\"" + Config.urlPreviousYearResults + "\",\"" + tabPrevYearsOutcome + "!" + "A:Z" + "\")"

        // Import only once; hard copy; do not overwrite
        Sheet = insertSheetIfNotExist(SS, importedOutcomeTabName, false)

        if (Sheet !== null) {
            fillPrevOutcomeSheet(Sheet, importedOutcomeTabName, externalFormula)
        }

        // Previous SOURCES
        externalFormula = "=IMPORTRANGE(\"" + Config.urlPreviousYearSources + "\",\"" + tabPrevYearsSources + "!" + "A:Z" + "\")"

        // Import only once; hard copy; do not overwrite
        Sheet = insertSheetIfNotExist(SS, importedSourcesTabName, false)
        if (Sheet !== null) {
            fillPrevOutcomeSheet(Sheet, importedSourcesTabName, externalFormula)
            produceSourceSheet(Sheet, false)

        }

    }

    // --- // creates sources page // --- //

    Sheet = insertSheetIfNotExist(SS, sourcesTabName, false)
    if (Sheet !== null) {
        produceSourceSheet(Sheet, true)
    }

    // if scoring sheet is integrated into DC, create Points sheet

    let hasOpCom = Company.hasOpCom
    let isNewCompany = (Company.isPrevScored) ? false : true

    // fetch number of Services once
    let companyNumberOfServices = Company.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Category do
    let Category

    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {

        Category = Indicators.indicatorCategories[i]

        Logger.log("--- NEXT : Starting " + Category.labelLong)
        populateDCSheetByCategory(SS, Category, Company, ResearchStepsObj, companyNumberOfServices, hasOpCom, isNewCompany, doCollapseAll, includeRGuidanceLink, collapseRGuidance, useIndicatorSubset, useStepsSubset)

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
            addSetOfScoringSteps(SS, sheetModeID, Config, Indicators, ResearchStepsObj, Company, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

            Logger.log("Extra Sheet --- Scores --- added")

            moveHideSheetifExists(SS, pointsSheet, 1)

        }

        if (includeNotes) {
            Logger.log("Extra Sheet --- Researcher Feedback --- adding")
            outputParams = Config.integrateOutputsArray.researchNotesParams

            addSetOfScoringSteps(SS, sheetModeID, Config, Indicators, ResearchStepsObj, Company, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode)

            Logger.log("Extra Sheet --- Researcher Feedback --- added")
        }
    }

    // clean up //
    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    Logger.log("FILE: " + mainSheetMode + " Spreadsheet created for " + companyShortName)
    return fileID
}
