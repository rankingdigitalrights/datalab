/** main Process to produce Company Feedback Sheets
 * for documentation see Notion
 * TODO: adjust for 2021 / verify (main: change to how
 * language JSON './json/JSON_elemMetadata.js' is produced)
 *
 * Copies a Company Feedback Frontmatter Template Sheet (by ID);
 * then appends Company Results and Feedback Form Elements
 * (input rows for companies)
 * @param Config.feedbackForms.masterTemplateUrl Company Feedback Master Template
 * @param Config.feedbackForms.outputFolderIdProd for Output folder
 */

/* global
    Config, cleanCompanyName, ISPRODUCTION, spreadSheetFileName, IndicatorsObj, researchStepsVector, openSpreadsheetByID, filenameSuffix, filenamePrefix, copyMasterSpreadsheet, removeEmptySheet, appendTOC, prefillFeedbackPage, insertSheetIfNotExist, importFBSourcesSheet
*/

// eslint-disable-next-line no-unused-vars
function produceCompanyFeedbackForm(Company, makeDataOwner) {
    let companyShortName = cleanCompanyName(Company)

    let Indicators = IndicatorsObj
    let ResearchSteps = researchStepsVector

    let mainSheetMode = 'Feedback'

    // --- // Feedback Parameters // --- //
    let outputParams = Config.feedbackForms

    let thisFilenameSuffix = filenameSuffix + ' Source'
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, thisFilenameSuffix)

    // template spreadsheet
    let masterFileId = outputParams.masterTemplateUrl
    // TODO: move Dev folderID to Config
    // target folder ID
    let outputFolderId = ISPRODUCTION ? outputParams.outputFolderIdProd : outputParams.outputFolderIdDev

    console.log('--- --- START: creating ' + mainSheetMode + ' Spreadsheet for ' + Company.label.current)

    // define SS name
    // connect to Spreadsheet if it already exists (Danger!), otherwise make a COPY of Master Template, rename, and return new file

    let SS =
        Company.urlCurrentFeedbackSheet && ISPRODUCTION
            ? openSpreadsheetByID(Company.urlCurrentFeedbackSheet)
            : copyMasterSpreadsheet(masterFileId, outputFolderId, spreadsheetName, makeDataOwner)

    let fileID = SS.getId()

    console.log('SS ID: ' + fileID)

    let MainStep = ResearchSteps.researchSteps[outputParams.feedbackStep]

    let doOverwrite = true

    // imports current Company Sources tab from Company Input Sheet
    importFBSourcesSheet(SS, outputParams.sourcesSheetName, Company, doOverwrite)

    // --- // Legacy: creates helper sheet for YonY comments editing // --- //

    // let Sheet = insertSheetIfNotExist(SS, outputParams.yearOnYearHelperTabName, false)
    // if (Sheet !== null) {
    //     produceYonYCommentsSheet(Sheet, false)
    // }

    let Category, Indicator
    let sheetOverwrite = true // HOOK / Caution
    let ankerSheetPos, sheetPos
    let sheetName

    // for each Category
    for (let catNr = 0; catNr < Indicators.indicatorCategories.length; catNr++) {
        Category = Indicators.indicatorCategories[catNr]

        // anker for proper placement of Category Frontmatter Tabs
        ankerSheetPos = SS.getSheetByName(Category.labelLong).getIndex()
        // sheetPos = parseInt(ankerSheetPos)
        console.log('|--- intitial sheetPos: ' + sheetPos)

        /** for each Indicator
         * TODO: Reconsider producing the Indicator Frontmatter in the Template doc. Would allow for easier formatting / adjustments / language updates / fixing row heights for Excel export.
         * then: just append results
         * injects a new sheet
         * add indicator language, imports Step 3 results and
         * adds
         */
        for (let indNr = 0; indNr < Category.indicators.length; indNr++) {
            Indicator = Category.indicators[indNr]
            sheetName = Indicator.labelShort
            console.log(`|---- START Processing ${sheetName}`)
            console.log('|------- sheetPos: ' + (ankerSheetPos + indNr))
            // inserts the sheet at Category Anchor + IndicatorNr
            Sheet = insertSheetIfNotExist(SS, sheetName, sheetOverwrite, ankerSheetPos + indNr)

            // creates Indicator Frontmatter, review results and Comppany Input Fields
            prefillFeedbackPage(Sheet, Company, Indicator, MainStep, outputParams)
            console.log(`|---- END Processing ${sheetName}`)
        }
    }

    // add Indicator Tab Links to Table of Contents
    let Sheet = SS.getSheetByName('Contents')
    appendTOC(SS, Sheet, Indicators)

    removeEmptySheet(SS)

    return fileID
}
