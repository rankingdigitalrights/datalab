// --- // Main Controller // --- //
// --- //  Branch: Development  // --- //

/* global
    centralConfig, indicatorsVector, companiesVector, processInputSpreadsheet, createSpreadsheetOutput, createAggregationOutput, createCompanyDataStore, processCompanyHealth, openSpreadsheetByID, insertSheetIfNotExist, addFileIDtoControl, mainProtectFileOpenStepSingleCompany, createSubstepArray, mainUnProtectSingleCompany, mainProtectSingleCompany, deepCloneFolder, subsetIndicatorsObject, produceCompanyFeedbackForm
*/

// GLOBAL PARAMS init (definition happens with initiateGlobalConfig())

/** --- MAIN PROD vs Dev Toggle --- **/
const ISPRODUCTION = true // CAUTION: true := will allow access to Production folders & file names
/** --- MAIN PROD vs Dev Toggle --- **/

var Config
var doRepairsOnly
var updateProduction = false
var includeFeedback = false
var addNewStep = false
var startAtMainStepNr = 0 // Global Config
var IndicatorsObj
var indexPrefix
var filenamePrefix
var filenameSuffix
var rootFolderID
var rootFolderName // "2019 Back-End Dev"
var outputFolderName
var controlSpreadsheetID
var Styles
var includeFormatting = true

// HOOK: override global parameters here
function initiateGlobalConfig() {
    Config = centralConfig

    doRepairsOnly = false // global default; will be overwritten locally where necessary

    /** --- INDICATOR SUBSETTING --- //
     * IMPORTANT: subsetting function only accepts Array
     */
    /* EITHER default */
    IndicatorsObj = indicatorsVector
    /* OR ARRAY: use Array[] to subset */
    // IndicatorsObj = subsetIndicatorsObject(indicatorsVector, ["F8","F9","F10","F11","F12","F13","P1a","P1b","P2a","P2b","P3a","P3b","P4","P5","P6","P7","P8","P9","P10a","P10b","P11a","P11b","P12","P13","P14","P15","P16","P17","P18"])
    /* FIY: Indicator Labels:
    Batch 1:
    "G1","G2","G3","G4a","G4b","G4c","G4d","G4e","G5","G6a","G6b","F1a","F1b","F1c","F1d","F2a","F2b","F2c","F2d","F3a","F3b","F3c","F4a","F4b","F4c","F5a","F5b","F6","F7"
    Batch 2:
    "F8","F9","F10","F11","F12","F13","P1a","P1b","P2a","P2b","P3a","P3b","P4","P5","P6","P7","P8","P9","P10a","P10b","P11a","P11b","P12","P13","P14","P15","P16","P17","P18"
    */

    indexPrefix = Config.indexPrefix
    filenamePrefix = Config.filenamePrefix
    filenameSuffix = ISPRODUCTION ? Config.filenameSuffixProd : Config.filenameSuffixDev // [Dev, "", Debug, QC]
    outputFolderName = '2021 Index Dev' // Specific folder defined in Main Callers
    // TODO: adjust for 2021 Index
    rootFolderID = ISPRODUCTION ? Config.rootFolderIDProd : Config.rootFolderIDDev
    rootFolderName = ISPRODUCTION ? Config.rootFolderNameProd : Config.rootFolderIDDev
    controlSpreadsheetID = Config.controlSpreadsheetID // spreadsheet to which fileIds of new sheets are added
    Styles = Config.styles
}

// --- // MAIN CALLERS // --- //

// create Data Collection spreadsheets for Companies[]
// eslint-disable-next-line no-unused-vars
function mainInputSheets() {
    initiateGlobalConfig()

    includeFeedback = true // default: true; Sheet for parsed Company Feedback; needs to exist before Step 4

    outputFolderName = ISPRODUCTION ? Config.inputFolderNameProd : Config.inputFolderNameDev
    // filenameSuffix = "" // local override : Dev, "", Debug, QC
    let mainSheetMode = 'Input' // for filename | TODO: move to Config

    // HOOK 1 to not produce all Steps (i.e. stop before Step 4)
    Config.subsetMaxStep = 2 // TBC: logical and inclusive so will add S0-S3
    let useStepsSubset = true // true := will end with Config.subsetMaxStep globally defined in Config.JSON

    /** HOOK 2 for DEV: produce only a single Step
     * startAtMainStepNr = 7 // logical Order
     * Config.subsetMaxStep = startAtMainStepNr
     * useStepsSubset = true
     * */

    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3); //   2 "América Móvil",
        // .slice(3, 4) //   3 "Apple",
    // .slice(4, 5) //   4 "AT&T",
    // .slice(5, 6) //   5 "Axiata",
    // .slice(6, 7) //   6 "Baidu",
    // .slice(7, 8) //   7 "Bharti Airtel",
    // .slice(8, 9) //   8 "Deutsche Telekom",
    // .slice(9, 10) //   9 "Etisalat",
    // .slice(10, 11) //   10 "Facebook",
    // .slice(11, 12) //   11 "Google",
    // .slice(12, 13) //   12 "Kakao",
    .slice(13, 14) //   13 "Mail.Ru",
    // .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    // .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Yahoo",
    // .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    let fileID

    Companies.forEach(function (Company) {
        fileID = processInputSpreadsheet(useStepsSubset, Company, filenamePrefix, filenameSuffix)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)
    })
}

/** appends a Main Research Step at position Sheet.lastRow()
 * uses regular mainInputSheet module but skips front matter
 * @param addNewStep must be true
 * @param updateProduction should be true for Production Sheets
 */

// eslint-disable-next-line no-unused-vars
function mainAppendInputStep() {
    initiateGlobalConfig()

    // might make sense to add Steps in 1 run at to apply formatting in a 2nd run
    includeFormatting = true // toggle costly Sheet-level formatting updates
    updateProduction = true // IMPORTANT flag; if true then Company DC Sheet is grabbed by sheetID

    addNewStep = true // default; don't touch;

    // Hook to skip steps
    startAtMainStepNr = 3 // logical inclusive Order
    // Config.subsetMaxStep = startAtMainStepNr // unset if you want to have subsequent steps as well
    let useStepsSubset = true // true := use subset; Config.subsetMaxStep defined in Config.JSON

    outputFolderName = ISPRODUCTION ? Config.inputFolderNameProd : Config.inputFolderNameDev
    // filenameSuffix = "" // local override for filename: [Dev, "", Debug, QC]

    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        // .slice(3, 4) //   3 "Apple",
    // .slice(4, 5) //   4 "AT&T",
    // .slice(5, 6) //   5 "Axiata",
    // .slice(6, 7) //   6 "Baidu",
    // .slice(7, 8) //   7 "Bharti Airtel",
    // .slice(8, 9) //   8 "Deutsche Telekom",
    // .slice(9, 10) //   9 "Etisalat",
    // .slice(10, 11) //   10 "Facebook",
    // .slice(11, 12) //   11 "Google",
    // .slice(12, 13) //   12 "Kakao",
    .slice(13, 14) //   13 "Mail.Ru",
    // .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    // .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Yahoo",
    // .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    Companies.forEach(function (Company) {
        // Company.urlCurrentInputSheet = "1s9cJtf4ql19M42ygd-xd4UR7DQSh42ofxocXA_n9uHg" // Local override for Testing first

        processInputSpreadsheet(useStepsSubset, Company, filenamePrefix, filenameSuffix)
    })
}

/** REPAIRING
 * restores row labels, formatting (optional), and namedRanges (main task)
 * it will NEVER overwrite cells with user-entered labels
 * (unless @param doRepairsOnly is manually commented out);
 * see Notion & datalab Wiki;
 */

// eslint-disable-next-line no-unused-vars
function mainRepairInputSheets() {
    // IMPORTANT: if SS is protected, run function with data@rdr
    // otherwise permission will be denied

    initiateGlobalConfig()

    includeFormatting = false // HOOK toggle off costly Sheet-level formatting

    startAtMainStepNr = 1 // HOOK: which Step to repair - LOGICAL Order
    Config.subsetMaxStep = 2 // HOOK: only repair 1 Step // unset if you want to have subsequent steps as well
    let useStepsSubset = true // true := use subset; maxStep defined in Config.JSON

    doRepairsOnly = true // don't touch; global
    updateProduction = true // DANGER; global HOOK; allows to open production Sheets by ID

    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        // .slice(3, 4) //   3 "Apple",
    // .slice(4, 5) //   4 "AT&T",
    // .slice(5, 6) //   5 "Axiata",
    // .slice(6, 7) //   6 "Baidu",
    // .slice(7, 8) //   7 "Bharti Airtel",
    // .slice(8, 9) //   8 "Deutsche Telekom",
    // .slice(9, 10) //   9 "Etisalat",
    // .slice(10, 11) //   10 "Facebook",
    // .slice(11, 12) //   11 "Google",
    // .slice(12, 13) //   12 "Kakao",
    // .slice(13, 14) //   13 "Mail.Ru",
    // .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    // .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Verizon Media",
    // .slice(24, 25) //   24 "Vodafone",
    .slice(25, 26) //   25 "Yandex"

    Companies.forEach(function (Company) {
        // Company.urlCurrentInputSheet = "1s9cJtf4ql19M42ygd-xd4UR7DQSh42ofxocXA_n9uHg" // Local override for Testing first
        processInputSpreadsheet(useStepsSubset, Company, filenamePrefix, filenameSuffix)
    })
}

// create Company Scoring Spreadsheets for Companies[]
// eslint-disable-next-line no-unused-vars
function mainScoringSheets() {
    initiateGlobalConfig()

    outputFolderName = ISPRODUCTION ? Config.outputFolderNameProd : Config.outputFolderNameDev

    let addNewStep = false // TODO: GW - remove or rename & document
    let stepsToAdd = [0, 1, 2, 3, 5, 6, 7] // [0, 1, 2, 3, 5, 6, 7]

    // Config.subsetMaxStep = 4 // HOOK to only produce a few steps

    let isYoyMode = false // TODO: GW - remove or rename & document
    let yoySteps = [2, 3, 5, 6, 7] // TODO: GW - remove or rename  & document

    let Companies = [
        // companiesVector.companies[0],
        companiesVector.companies[1],
        companiesVector.companies[3],
        companiesVector.companies[6],
        companiesVector.companies[10],
        companiesVector.companies[11],
        companiesVector.companies[12],
        companiesVector.companies[13],
        companiesVector.companies[14],
        companiesVector.companies[18],
        companiesVector.companies[21],
        companiesVector.companies[22],
        companiesVector.companies[23],
        companiesVector.companies[25]
    ]

    let fileID

    Companies.forEach(function (Company) {
        // Company.urlCurrentInputSheet = "1jzKtnnEb_OXqiMYbHwY3MtjhSvtTVCK0gqHGXtx0DV4" // Local override for Testing first
        fileID = createSpreadsheetOutput(
            Company,
            filenamePrefix,
            filenameSuffix,
            isYoyMode,
            yoySteps,
            addNewStep,
            stepsToAdd
        )

        addFileIDtoControl('Output', Company.label.current, fileID, controlSpreadsheetID)
    })
}

/** main Process to produce Company Feedback Sheets
 * for documentation see Notion
 * TODO: adjust for 2021
 * copies a Company Feedback Frontmatter Template Sheet (by ID);
 * then appends results and Feedback Form Elements (input rows for companies)
 * @param Config.feedbackForms.masterTemplateUrl Company Feedback Master Template
 * @param Config.feedbackForms.outputFolderIdProd for Output folder
 */

// CAUTION: Needs existing Folder & Folder Id (outputFolderIdProd)

// eslint-disable-next-line no-unused-vars
function mainFeedbackSheets() {
    initiateGlobalConfig()

    let makeDataOwner = true // default: true; should new file be owned by Data@?

    // outputFolderName = "2020 - Dev - Feedback"
    let Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        // .slice(3, 4) //   3 "Apple",
        // .slice(4, 5) //   4 "AT&T",
        // .slice(5, 6) //   5 "Axiata",
        // .slice(6, 7) //   6 "Baidu",
        // .slice(7, 8) //   7 "Bharti Airtel",
        // .slice(8, 9) //   8 "Deutsche Telekom",
        // .slice(9, 10) //   9 "Etisalat",
        // .slice(10, 11) //   10 "Facebook",
        // .slice(11, 12) //   11 "Google",
        // .slice(12, 13) //   12 "Kakao",
        // .slice(13, 14) //   13 "Mail.Ru",
        // .slice(14, 15) //   14 "Microsoft",
        // .slice(15, 16) //   15 "MTN",
        // .slice(16, 17) //   16 "Ooredoo",
        // .slice(17, 18) //   17 "Orange",
        // .slice(18, 19) //   18 "Samsung",
        // .slice(19, 20) //   19 "Telefónica",
        // .slice(20, 21) //   20 "Telenor",
        // .slice(21, 22) //   21 "Tencent",
        // .slice(22, 23) //   22 "Twitter",
        // .slice(23, 24) //   23 "Verizon Media",
        // .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    Companies.forEach(function (Company) {
        let fileID = produceCompanyFeedbackForm(Company, makeDataOwner)

        addFileIDtoControl('Company Feedback', Company.label.current, fileID, controlSpreadsheetID)
    })
}

/** create Aggregation / Summary Scores Spreadsheet
 * for a particular Main Step with and without
 * --- Element-Level data
 * TODO: verify that removal of Substep 3.2 does not break Step 3 Scores
 * needs @param scoringStepNr to define Main Scoring Step
 * adjust @param filenameSuffix and
 *        @param outputFolderName
 * for Outpust as needed; no global config as of now
 */

// eslint-disable-next-line no-unused-vars
function mainAggregationSheets() {
    // filename fragments defined in
    // Config.summaryParams.spreadsheetName
    initiateGlobalConfig()
    filenameSuffix = ' Dev' // HOOK  - Local Override - DANGER
    outputFolderName = '2021 - Dev - Summary' // HOOK
    let mainSheetMode = 'Summary Scoress'

    // 2020 decision: for performance reasons import from Outcome Sheets directly
    let includeCompanyOutcomeSheets = false // default: false

    let scoringStepNr = 2 // Summary Scores always only produces one single Step

    let isYoyMode = true // TODO: GW - remove or document and rename

    // let Companies = companiesVector.companies
    let Companies = [
        companiesVector.companies[0],
        // companiesVector.companies[1],
        // companiesVector.companies[3],
        // companiesVector.companies[6],
        // companiesVector.companies[10],
        // companiesVector.companies[11],
        // companiesVector.companies[12],
        // companiesVector.companies[13],
        // companiesVector.companies[14],
        // companiesVector.companies[18],
        // companiesVector.companies[21],
        companiesVector.companies[22],
        companiesVector.companies[23],
        companiesVector.companies[25]
    ]
        // .slice(5, 7) // Axiata & Baidu,
        // .slice(1, 9) // no Amazon
        // .slice(1, 3) // for debugging
        // .slice(0,3) // Amazon
        // .slice(0, 1) // Alibaba
        // .slice(3, 4) // Apple

    let fileID = createAggregationOutput(
        Companies,
        filenamePrefix,
        filenameSuffix,
        mainSheetMode,
        scoringStepNr,
        includeCompanyOutcomeSheets,
        isYoyMode // TODO: GW - remove or document and  rename
    )

    // addFileIDtoControl(mainSheetMode, "PROTO", fileID, controlSpreadsheetID)

    console.log('|--- added ' + mainSheetMode + ';fileID: ' + fileID)
}

// create Data Store spreadsheets for Companies[]
// eslint-disable-next-line no-unused-vars
function mainDataStore() {
    // TODO: implement DataMode 'sources' or integrate sources into results (pragmatic solution)
    let DataMode = ['results', 'changes', "transpose", "scores"] // ["results", "transpose", "scores","changes"]

    initiateGlobalConfig()
    outputFolderName = Config.dataStoreParams.outputFolderName

    filenameSuffix = ' v2' // current default; critical for versioning in sync with `datapipe`
    // TODO: bump up to v4 once sources tab is added and adjust in datapipe;

    let mainSheetMode = Config.dataStoreParams.fileName // "Data Store"; obsolete

    // Config.subsetMaxStep = 3 // add all steps? for production no reason not to
    let stepsToAdd = [0, 1]

    let Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        // .slice(3, 4) //   3 "Apple",
    // .slice(4, 5) //   4 "AT&T",
    // .slice(5, 6) //   5 "Axiata",
    // .slice(6, 7) //   6 "Baidu",
    // .slice(7, 8) //   7 "Bharti Airtel",
    // .slice(8, 9) //   8 "Deutsche Telekom",
    // .slice(9, 10) //   9 "Etisalat",
    // .slice(10, 11) //   10 "Facebook",
    // .slice(11, 12) //   11 "Google",
    // .slice(12, 13) //   12 "Kakao",
    // .slice(13, 14) //   13 "Mail.Ru",
    // .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    // .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Verizon Media",
    // .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    let fileID

    Companies.forEach(function (Company) {
        fileID = createCompanyDataStore(Company, filenamePrefix, filenameSuffix, mainSheetMode, DataMode, stepsToAdd)

        console.log('received fileID: ' + fileID)
        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)
    })
}

/** gathers Input Spreadsheets "Health Status" (aka broken Named Ranges #REF)
 * writes to @param controlSpreadsheetID in tab @param ListSheetBroken
 */

// eslint-disable-next-line no-unused-vars
function mainInspectInputSheets() {
    initiateGlobalConfig()
    // IMPORTANT FLAG

    let controlSpreadsheet = openSpreadsheetByID(controlSpreadsheetID)
    let ListSheetBroken = insertSheetIfNotExist(controlSpreadsheet, 'Input - Broken Refs', true)
    // ListSheetBroken.clear()

    let Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        // .slice(3, 4) //   3 "Apple",
        // .slice(4, 5) //   4 "AT&T",
        // .slice(5, 6) //   5 "Axiata",
        // .slice(6, 7) //   6 "Baidu",
        // .slice(7, 8) //   7 "Bharti Airtel",
        // .slice(8, 9) //   8 "Deutsche Telekom",
        // .slice(9, 10) //   9 "Etisalat",
        // .slice(10, 11) //   10 "Facebook",
    // .slice(11, 12) //   11 "Google",
    // .slice(12, 13) //   12 "Kakao",
    // .slice(13, 14) //   13 "Mail.Ru",
    // .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    // .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Yahoo",
    // .slice(24, 25) //   24 "Vodafone",
    .slice(25, 26) //   25 "Yandex"

    Companies.forEach((Company) => {
        processCompanyHealth(ListSheetBroken, Company)
    })
}

// Automating Backup of Index Data Production folde
// CAUTION: not fully functional yet
// TODO: finalize to streamline daily backup of Index Data
// eslint-disable-next-line no-unused-vars
function DevMainBackupFolder() {
    initiateGlobalConfig()

    let sourceFolderId = Config.rootFolderIDProd
    let targetFolderId = Config.backupFolderID

    deepCloneFolder(sourceFolderId, targetFolderId)
}

// MAIN PERMISSIONS SECTION //
// TODO: GW - Document, starting in Notion //
// addendum: it's documented in the Wiki so just revise
// i.e. the code for convert Protections to Warnings

// eslint-disable-next-line no-unused-vars
function mainProtectCompanies() {
    // protects the sheets of a given company vector

    let Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        // .slice(3, 4) //   3 "Apple",
        // .slice(4, 5) //   4 "AT&T",
        // .slice(5, 6) //   5 "Axiata",
        // .slice(6, 7) //   6 "Baidu",
        // .slice(7, 8) //   7 "Bharti Airtel",
        // .slice(8, 9) //   8 "Deutsche Telekom",
        // .slice(9, 10) //   9 "Etisalat",
        // .slice(10, 11) //   10 "Facebook",
    // .slice(11, 12) //   11 "Google",
    // .slice(12, 13) //   12 "Kakao",
    // .slice(13, 14) //   13 "Mail.Ru",
    // .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Yahoo",
    //.slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    Companies.forEach((Company) => mainProtectSingleCompany(Company))
}

// eslint-disable-next-line no-unused-vars
function mainUnProtectCompanies() {
    // unprotects the sheets of a given company vector
    var Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        // .slice(3, 4) //   3 "Apple",
        // .slice(4, 5) //   4 "AT&T",
        // .slice(5, 6) //   5 "Axiata",
        // .slice(6, 7) //   6 "Baidu",
        // .slice(7, 8) //   7 "Bharti Airtel",
        // .slice(8, 9) //   8 "Deutsche Telekom",
        // .slice(9, 10) //   9 "Etisalat",
        // .slice(10, 11) //   10 "Facebook",
    // .slice(11, 12) //   11 "Google",
    // .slice(12, 13) //   12 "Kakao",
    // .slice(13, 14) //   13 "Mail.Ru",
    .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    // .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Verizon Media",
    // .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    Companies.forEach((Company) => mainUnProtectSingleCompany(Company))
}

// eslint-disable-next-line no-unused-vars
function mainOpenStepCompanies() {
    // protects the sheets of a given company vector

    initiateGlobalConfig()

    let doUpdateEditors = true // won't change File-level permission status otherwise

    let stepLabel = ['S02'] // maybe better: match ResearchStepObj syntax := S01
    let subStepIDs = createSubstepArray(stepLabel)

    // let editors = EditorsObj[stepLabel]

    /* custom Core editors list for Steps 4++ */
    let editors = 'wessenauer@rankingdigitalrights.org'

    console.log('array: ' + subStepIDs)

    let Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        // .slice(3, 4) //   3 "Apple",
        // .slice(4, 5) //   4 "AT&T",
        // .slice(5, 6) //   5 "Axiata",
        // .slice(6, 7) //   6 "Baidu",
        // .slice(7, 8) //   7 "Bharti Airtel",
        // .slice(8, 9) //   8 "Deutsche Telekom",
        // .slice(9, 10) //   9 "Etisalat",
        .slice(10, 11) //   10 "Facebook",
        // .slice(11, 12) //   11 "Google",
        // .slice(12, 13) //   12 "Kakao",
    // .slice(13, 14) //   13 "Mail.Ru",
    // .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    // .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Yahoo",
    // .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    Companies.forEach(function (Company) {
        /* TODO: enable overriding editors from Step 3 on */
        // let editors = []
        // let companyNr = companiesVector.companies.indexOf(Company);
        // stepLabel.forEach(function (step) {
        //     editors.push(EditorsObj[step][companyNr])

        // })
        console.log('editors:' + editors)

        mainProtectFileOpenStepSingleCompany(Company, subStepIDs, editors, IndicatorsObj, doUpdateEditors)
    })
}

// DANGER ZONE //
// --- // USE WISELY // --- //
/* function mainClearAllNamedRanges() {

    initiateGlobalConfig()
    var mainSheetMode = "Input" // for filename

    var Companies = companiesVector.companies
        .slice(0, 0)
    // .slice(0,1) // Amazon
    // .slice(1, 2) // Apple
    // .slice(2,3) // Deutsche Telekom
    // .slice(3,4) // Facebook
    // .slice(4,5) // Google
    // .slice(5,6) // Microsoft
    // .slice(6,7) // Telefonica
    // .slice(7,8) // Twitter
    // .slice(8,9) // Vodafone

    Companies.forEach(function (Company) {
        clearNamedRangesFromCompanySheet(Company, filenamePrefix, filenameSuffix, mainSheetMode)
    })

} */
