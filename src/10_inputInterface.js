/** Main Interface  - Produce single Company Data Collection Sheet
 * also parameterized Interface for @function mainAppendInputStep()
 * and @function mainRepairInputSheets()
 * ---
 * @function mainAppendInputStep() skips the front matter, and appends n Steps[] to lastRow
 * @function mainRepairInputSheets() restores labels, formatting (optional), and named Ranges
 * it will never overwrite cells with user-entered labels
 * (unless @param doRepairs is locally and manually commented out in a particular 1x_submodule)
 */

/* global 
    Config, addNewStep, startAtMainStepNr, doRepairsOnly, updateProduction, includeFeedback, IndicatorsObj, researchStepsVector, spreadSheetFileName, createSpreadsheet, cleanCompanyName, insertSheetIfNotExist, removeEmptySheet, produceSourceSheet, populateDCSheetByCategory, insertCompanyFeedbackSheet, fillSheetWithImportRanges
*/

// eslint-disable-next-line no-unused-vars
function processInputSpreadsheet(useStepsSubset, Company, filenamePrefix, filenameSuffix) {
    console.log('PROCESS: begin main Input --- // ---')

    let companyShortName = cleanCompanyName(Company) // returns Company Name without empty spaces and special characters

    console.log('--- // --- creating Input Spreadsheet for ' + companyShortName + ' --- // ---')

    let Indicators = IndicatorsObj
    let ResearchStepsObj = researchStepsVector
    let doCollapseAll = Config.collapseAllGroups // default: false; fold all row groups?
    let importedOutcomeTabName = Config.prevYearOutcomeTab // for import of prev. results
    let importedSourcesTabName = Config.prevYearSourcesTab // for import of prev. results

    let includeRGuidanceLink = Config.includeRGuidanceLink // Baseamp Link
    let collapseRGuidance = Config.collapseRGuidance // fold research guidance at top of sheet?

    /** for 
     * @function addNewStep and/or development
     * @param startAtMainStepNr is HOOK to skip research steps
    // define startAtMainStepNr in 00-mainController */

    // if startAtMainStepNr > 0 the make sure that maxStep is at least equal
    if (startAtMainStepNr > Config.subsetMaxStep) {
        Config.subsetMaxStep = startAtMainStepNr
    }

    // filename; will also be used for filename-based access to spreadsheets
    let spreadsheetName = spreadSheetFileName(filenamePrefix, 'Input', companyShortName, filenameSuffix)

    /** HOOK: if we only do Repairs AND want to update Production
     * function tries to connect to existing spreadsheet by ID provided
     * in Companies JSON
     * otherwise it'll look up spreadsheet by filename and allow overwriting
     * TODO: reverse boolean Logic
     */

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
        // Previous Company Outcome
        // new 2021 approach: import directly from Outcome Sheet
        // [Labels Column, Results Column]
        externalFormula = [
            `=IMPORTRANGE("${Company.urlPrevOutputSheet}","${tabPrevOutcome}!A:A")`,
            `=IMPORTRANGE("${Company.urlPrevOutputSheet}","${tabPrevOutcome}!${Company.columnPrevOutcomeStart}:${Company.columnPrevOutcomeEnd}")`,
        ]

        // Import only once; false := do not overwrite
        // TODO: for performance reasons, this Sheet should be hard-coded
        Sheet = insertSheetIfNotExist(SS, importedOutcomeTabName, false)

        if (Sheet !== null) {
            Sheet.insertRowsAfter(999, 800)
            fillSheetWithImportRanges(Sheet, importedOutcomeTabName, externalFormula)
        }

        // Previous SOURCES
        externalFormula = [`=IMPORTRANGE("${Company.urlPrevInputSheet}","${tabPrevSources}!A:Z")`]

        // Import only once; false := do not overwrite
        // TODO: for performance reasons, this Sheet could behard-coded
        Sheet = insertSheetIfNotExist(SS, importedSourcesTabName, false)
        if (Sheet !== null) {
            fillSheetWithImportRanges(Sheet, importedSourcesTabName, externalFormula)
            produceSourceSheet(Sheet, false)
        }
    }

    // --- // creates sources page // --- //
    // won't overwrite
    if (!doRepairsOnly && !addNewStep) {
        Sheet = insertSheetIfNotExist(SS, sourcesTabName, false)
        if (Sheet !== null) {
            produceSourceSheet(Sheet, true)
        }
    }

    // -- // For Company Feedback Steps // --- //
    /** add Company Feedback tab in which returned company feedback will be copied by hand
     * returned Company feedback is parsed with `datapipe` and written to
     * a master feedback collector Spreadsheet
     * see Notion documentation: Company Feedback Process
     * see datapipe/wiki
     */
    if (includeFeedback && !doRepairsOnly) {
        let doOverwriteSheet = false // flag for overwriting or not
        console.log('producing / updating Feedback Tab')
        insertCompanyFeedbackSheet(
            SS,
            Config.feedbackForms.compFeedbackSheetName,
            Company,
            Indicators,
            doOverwriteSheet
        )
    }

    let hasOpCom = Company.hasOpCom // does company have a Operating Company
    let isNewCompany = Company.isPrevScored ? false : true // is Company new to this Index

    let companyNumberOfServices = Company.services.length

    // --- // MAIN Process // --- //
    let Category
    // for each Indicator Category (G/F/P) do

    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {
        Category = Indicators.indicatorCategories[i]

        console.log('--- Starting ' + Category.labelLong)

        // adds all Indicator sheets of one Category
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

    console.log('PROCESS: end Input main')

    // clean up - if empty Sheet exists, delete
    removeEmptySheet(SS)

    console.log('FILE: Input Spreadsheet created for ' + companyShortName)
    return fileID
}
