// --- Spreadsheet Casting: Company Data Collection Sheet --- //

/* global 
Config,
startAtMainStepNr,
doRepairsOnly,
updateProduction,
includeFeedback,
insertFeedbackSheet,
IndicatorsObj,
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

function processInputSpreadsheet(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode) {

    Logger.log("PROCESS: begin main DC --- // ---")

    let companyShortName = cleanCompanyName(Company)

    Logger.log("--- // --- creating " + mainSheetMode + " Spreadsheet for " + companyShortName + " --- // ---")

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    // let Company = Company // TODO this a JSON Obj now; adapt in scope
    let Indicators = IndicatorsObj
    let ResearchStepsObj = researchStepsVector
    let doCollapseAll = Config.collapseAllGroups
    // let integrateOutputs = Config.integrateOutputs // old Pilot feature
    let importedOutcomeTabName = Config.prevYearOutcomeTab
    let importedSourcesTabName = "2019 Sources" // TODO: Config

    let includeRGuidanceLink = Config.includeRGuidanceLink
    let collapseRGuidance = Config.collapseRGuidance

    // IMPORTANT: if startAtMainStepNr > 0 the make sure then maxStep is at least equal
    if (startAtMainStepNr > Config.subsetMaxStep) {
        Config.subsetMaxStep = startAtMainStepNr
    }

    // connect to existing spreadsheet or creat a blank spreadsheet
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    // HOOK: Override for local development

    let SS = !doRepairsOnly && !updateProduction ? createSpreadsheet(spreadsheetName, true) :
        SpreadsheetApp.openById(Company.urlCurrentDataCollectionSheet)

    let fileID = SS.getId()

    Logger.log("SS ID: " + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    let externalFormula

    let tabPrevYearsOutcome = (Company.tabPrevYearsOutcome != null) ? Company.tabPrevYearsOutcome : "VodafoneOutcome"

    let tabPrevYearsSources = (Company.tabPrevYearsOutcome != null) ? (companyShortName + "Sources") : "VodafoneSources"

    let sourcesTabName = Config.sourcesTabName

    let Sheet

    // if set in Config, import previous Index Outcome & Sources
    if (Config.YearOnYear && !doRepairsOnly && !addNewStep) {

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
    if (Sheet !== null && !doRepairsOnly && !addNewStep) {
        produceSourceSheet(Sheet, true)
    }

    // -- // For Company Feedback Steps // --- //
    if (includeFeedback) {
        let doOverwrite = false // flag for overwriting or not
        insertCompanyFeedbackSheet(SS, Config.compFeedbackSheetName, Company, Indicators, doOverwrite)
    }

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

    // clean up //
    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    Logger.log("FILE: " + mainSheetMode + " Spreadsheet created for " + companyShortName)
    return fileID
}
