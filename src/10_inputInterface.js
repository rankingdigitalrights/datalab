/** Interface  - Produce single Company Data Collection Sheet
 * also parameterized Interface for mainAddNewInputStep() and mainRepairInputSheets()
 */

/* global 
    Config, addNewStep, startAtMainStepNr, doRepairsOnly, updateProduction, includeFeedback, IndicatorsObj, researchStepsVector, spreadSheetFileName, createSpreadsheet, cleanCompanyName, insertSheetIfNotExist, removeEmptySheet, produceSourceSheet, populateDCSheetByCategory, insertCompanyFeedbackSheet, fillSheetWithImportRanges
*/

// eslint-disable-next-line no-unused-vars
function processInputSpreadsheet(useStepsSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode) {
    console.log('PROCESS: begin main DC --- // ---')

    let companyShortName = cleanCompanyName(Company)

    console.log('--- // --- creating ' + mainSheetMode + ' Spreadsheet for ' + companyShortName + ' --- // ---')

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    // let Company = Company // TODO this a JSON Obj now; adapt in scope
    let Indicators = IndicatorsObj
    let ResearchStepsObj = researchStepsVector
    let doCollapseAll = Config.collapseAllGroups
    let importedOutcomeTabName = Config.prevYearOutcomeTab
    let importedSourcesTabName = Config.prevYearSourcesTab

    let includeRGuidanceLink = Config.includeRGuidanceLink
    let collapseRGuidance = Config.collapseRGuidance

    // IMPORTANT: if startAtMainStepNr > 0 the make sure then maxStep is at least equal
    if (startAtMainStepNr > Config.subsetMaxStep) {
        Config.subsetMaxStep = startAtMainStepNr
    }

    // connect to existing spreadsheet or creat a blank spreadsheet
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    // HOOK: Override for local development

    let SS =
        !doRepairsOnly && !updateProduction
            ? createSpreadsheet(spreadsheetName, true)
            : SpreadsheetApp.openById(Company.urlCurrentInputSheet)

    let fileID = SS.getId()

    console.log('SS ID: ' + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    let externalFormula

    let tabPrevOutcome = 'Outcome'
    let tabPrevSources = importedSourcesTabName
    let sourcesTabName = Config.sourcesTabName

    let Sheet

    // if set in Config, import previous Index Outcome & Sources
    if (Config.importPrevOutcome && !doRepairsOnly && !addNewStep) {
        // Previous OUTCOME: Labels Column, Results Column
        externalFormula = [
            `=IMPORTRANGE("${Company.urlPrevOutputSheet}","${tabPrevOutcome}!A:A")`,
            `=IMPORTRANGE("${Company.urlPrevOutputSheet}","${tabPrevOutcome}!${Company.columnPrevOutcomeStart}:${Company.columnPrevOutcomeEnd}")`,
        ]

        // Import only once; hard copy; do not overwrite
        Sheet = insertSheetIfNotExist(SS, importedOutcomeTabName, false)

        if (Sheet !== null) {
            fillSheetWithImportRanges(Sheet, importedOutcomeTabName, externalFormula)
        }

        // Previous SOURCES
        externalFormula = [`=IMPORTRANGE("${Company.urlPrevInputSheet}","${tabPrevSources}!A:Z")`]

        // Import only once; hard copy; do not overwrite
        Sheet = insertSheetIfNotExist(SS, importedSourcesTabName, false)
        if (Sheet !== null) {
            fillSheetWithImportRanges(Sheet, importedSourcesTabName, externalFormula)
            produceSourceSheet(Sheet, false)
        }
    }

    // --- // creates sources page // --- //
    if (!doRepairsOnly && !addNewStep) {
        Sheet = insertSheetIfNotExist(SS, sourcesTabName, false)
        if (Sheet !== null) {
            produceSourceSheet(Sheet, true)
        }
    }

    // -- // For Company Feedback Steps // --- //
    if (includeFeedback && !doRepairsOnly) {
        let updateSheet = false // flag for overwriting or not
        console.log('producing / updating Feedback Tab')
        insertCompanyFeedbackSheet(SS, Config.feedbackForms.compFeedbackSheetName, Company, Indicators, updateSheet)
    }

    let hasOpCom = Company.hasOpCom
    let isNewCompany = Company.isPrevScored ? false : true

    // fetch number of Services once
    let companyNumberOfServices = Company.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Category do
    let Category

    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {
        Category = Indicators.indicatorCategories[i]

        console.log('--- NEXT : Starting ' + Category.labelLong)

        populateDCSheetByCategory(
            SS,
            Category,
            Company,
            ResearchStepsObj,
            companyNumberOfServices,
            hasOpCom,
            isNewCompany,
            doCollapseAll,
            includeRGuidanceLink,
            collapseRGuidance,
            useStepsSubset
        )

        console.log('--- Completed ' + Category.labelLong)
    }

    console.log('PROCESS: end DC main')

    // clean up - if empty Sheet exists, delete
    removeEmptySheet(SS)

    console.log('FILE: ' + mainSheetMode + ' Spreadsheet created for ' + companyShortName)
    return fileID
}
