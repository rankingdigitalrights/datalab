// --- Spreadsheet Casting: Company Data Collection Sheet --- //

/* global 
Config,
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

function createSpreadsheetInput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode) {

    Logger.log("PROCESS: begin main DC --- // ---")

    let companyShortName = cleanCompanyName(Company)

    Logger.log("--- // --- creating " + mainSheetMode + " Spreadsheet for " + companyShortName + " --- // ---")

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    // let Company = Company // TODO this a JSON Obj now; adapt in scope
    let Indicators = IndicatorsObj
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

    // HOOK: Override for local development
    // let SS = SpreadsheetApp.openById("1YbbOuxJ-pAWoUhLIo7SxarJb4uyPB7zg7iVKEj_AB7c")

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
