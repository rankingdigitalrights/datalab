// --- // Main Controller // --- //
// --- //  Branch: Development  // --- //

/* global
    centralConfig, indicatorsVector, companiesVector, processInputSpreadsheet, createSpreadsheetOutput, createAggregationOutput, createCompanyDataStore, processCompanyHealth, openSpreadsheetByID, insertSheetIfNotExist, addFileIDtoControl, mainProtectFileOpenStepSingleCompany, createSubstepArray, mainUnProtectSingleCompany, mainProtectSingleCompany, deepCloneFolder, subsetIndicatorsObject, injectFeedbackForms
*/

// global params init (def with initiateGlobalConfig())

/** --- main Prod vs Dev Toggle --- **/
const ISPRODUCTION = false
/** --- main Prod vs Dev Toggle --- **/

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

    doRepairsOnly = false
    // skipMainSteps = false // TBD: not operation right now

    // --- INDICATOR SUBSETTING --- //
    // IMPORTANT: subsetting function now only accepts Array

    // IndicatorsObj = indicatorsVector
    /* OR: use Subset; (param has to be Array[]) */
    IndicatorsObj = subsetIndicatorsObject(indicatorsVector, ['F1a'])

    /* Indicator Labels:
    
    Batch 1:
    "G1","G2","G3","G4a","G4b","G4c","G4d","G4e","G5","G6a","G6b","F1a","F1b","F1c","F1d","F2a","F2b","F2c","F2d","F3a","F3b","F3c","F4a","F4b","F4c","F5a","F5b","F6","F7"
    
    Batch 2:
    "F8","F9","F10","F11","F12","F13","P1a","P1b","P2a","P2b","P3a","P3b","P4","P5","P6","P7","P8","P9","P10a","P10b","P11a","P11b","P12","P13","P14","P15","P16","P17","P18"
    */

    indexPrefix = Config.indexPrefix
    filenamePrefix = Config.filenamePrefix
    filenameSuffix = ISPRODUCTION ? Config.filenameSuffixProd : Config.filenameSuffixDev // Dev, "", Debug, QC
    outputFolderName = '2020 Dev Fallback Folder' // Specific folder defined in Main Callers
    rootFolderID = ISPRODUCTION ? Config.rootFolderIDProd : Config.rootFolderIDDev
    rootFolderName = ISPRODUCTION ? Config.rootFolderNameProd : Config.rootFolderIDDev
    controlSpreadsheetID = Config.controlSpreadsheetID
    Styles = Config.styles
}

// --- // MAIN CALLERS // --- //

// create Data Collection spreadsheets for all companies

// eslint-disable-next-line no-unused-vars
function mainInputSheets() {
    initiateGlobalConfig()

    includeFeedback = true // Sheet for parsed Company Feedback

    outputFolderName = ISPRODUCTION ? Config.inputFolderNameProd : Config.inputFolderNameDev
    // filenameSuffix = "" // local override : Dev, "", Debug, QC
    let mainSheetMode = 'Input' // for filename | TODO: move to Config
    let useStepsSubset = false // true := use subset; maxStep defined in Config.JSON

    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3); //   2 "América Móvil",
        .slice(3, 4) //   3 "Apple",
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
        fileID = processInputSpreadsheet(useStepsSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)
    })
}

// --- // add a new Main Research Step at position Sheet.lastRow()
// eslint-disable-next-line no-unused-vars
function mainAddNewInputStep() {
    initiateGlobalConfig()

    includeFormatting = false // toggle costly Sheet-level formatting updates

    updateProduction = true // IMPORTANT flag; if true then Company DC Sheet is grabbed by sheetID

    addNewStep = true // Just ignore: also caution - doesn't care if step already exists

    // also: Hook to skip steps
    startAtMainStepNr = 7 // logical Order
    Config.subsetMaxStep = startAtMainStepNr

    outputFolderName = ISPRODUCTION ? Config.inputFolderNameProd : Config.inputFolderNameDev
    // filenameSuffix = "" // local override : Dev, "", Debug, QC
    let mainSheetMode = 'Input' // for filename | TODO: move to Config
    let useStepsSubset = true // true := use subset; maxStep defined in Config.JSON

    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        .slice(3, 4) //   3 "Apple",
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
        // Company.urlCurrentInputSheet = "1s9cJtf4ql19M42ygd-xd4UR7DQSh42ofxocXA_n9uHg"

        processInputSpreadsheet(useStepsSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)
    })
}

// --- // repairing // --- //
// eslint-disable-next-line no-unused-vars
function mainRepairInputSheets() {
    // IMPORTANT: if SS is protected, run with data@

    initiateGlobalConfig()

    includeFormatting = false // toggle costly Sheet-level formatting updates

    startAtMainStepNr = 6 // logical Order

    Config.subsetMaxStep = startAtMainStepNr

    doRepairsOnly = true // don't touch

    updateProduction = true // DANGER

    let mainSheetMode = 'Input' // for filename | TODO: move to Config
    let useStepsSubset = true // true := use subset; maxStep defined in Config.JSON

    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        .slice(3, 4) //   3 "Apple",
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
        // Company.urlCurrentInputSheet = "1s9cJtf4ql19M42ygd-xd4UR7DQSh42ofxocXA_n9uHg"

        processInputSpreadsheet(useStepsSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)
    })
}

// create Scoring spreadsheets for all companies

// eslint-disable-next-line no-unused-vars
function mainScoringSheets() {
    initiateGlobalConfig()

    outputFolderName = ISPRODUCTION ? Config.outputFolderNameProd : Config.outputFolderNameDev
    let addNewStep = false // TODO: GW - remove or rename
    let stepsToAdd = [6, 7] // TODO: GW - remove or rename

    // Config.subsetMaxStep = 4

    let isYoyMode = false // TODO: GW - remove or rename
    let yoySteps = [3, 5, 7] // TODO: GW - remove

    let mainSheetMode = 'Output'

    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        .slice(3, 4) //   3 "Apple",
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
        fileID = createSpreadsheetOutput(
            Company,
            filenamePrefix,
            filenameSuffix,
            mainSheetMode,
            isYoyMode,
            yoySteps,
            addNewStep,
            stepsToAdd
        )

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)
    })
}

/** New: Inject (append) Feedback Form Elements to Company-specific Feedback Template
 * @Param: Spreadsheet ID of Template defined in Company JSON
 */

// eslint-disable-next-line no-unused-vars
function mainFeedbackSheets() {
    initiateGlobalConfig()

    let makeDataOwner = true // should new file be owned by Data@?

    // outputFolderName = "2020 - Dev - Feedback"
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
        // .slice(23, 24) //   23 "Verizon Media",
        .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    Companies.forEach(function (Company) {
        let fileID = injectFeedbackForms(Company, makeDataOwner)

        addFileIDtoControl('Company Feedback', Company.label.current, fileID, controlSpreadsheetID)
    })
}

// create Summary Scores spreadsheets for all companies

// eslint-disable-next-line no-unused-vars
function mainAggregationSheets() {
    // filename fragments defined in
    // Config.summaryParams.spreadsheetName
    initiateGlobalConfig()
    filenameSuffix = ' Test' // DANGER
    outputFolderName = '2021 - Dev - Summary'
    let mainSheetMode = 'Summary Scores'

    let includeCompanyOutcomeSheets = false

    let scoringStepNr = 3 //

    let isYoyMode = false // TODO: GW - remove or rename

    let Companies = companiesVector.companies
        // .slice(5, 7) // Axiata & Baidu,
        // .slice(1, 9) // no Amazon
        // .slice(1, 3) // for debugging
        // .slice(0,3) // Amazon
        .slice(3, 4) // Apple

    let fileID = createAggregationOutput(
        Companies,
        filenamePrefix,
        filenameSuffix,
        mainSheetMode,
        scoringStepNr,
        includeCompanyOutcomeSheets,
        isYoyMode // TODO: GW - remove or rename
    )

    // addFileIDtoControl(mainSheetMode, "PROTO", fileID, controlSpreadsheetID)

    console.log('|--- added ' + mainSheetMode + ';fileID: ' + fileID)
}

// create Data Store spreadsheets for all companies
// Scores: ~2 minutes runtime? TBC
// eslint-disable-next-line no-unused-vars
function mainDataStore() {
    let DataMode = ['results', 'changes'] // ["results", "transpose", "scores","results","changes"]

    initiateGlobalConfig()
    outputFolderName = Config.dataStoreParams.outputFolderName

    filenameSuffix = ' v3'

    // filename fragments defined in Config.summaryParams.spreadsheetName
    let mainSheetMode = Config.dataStoreParams.fileName

    Config.subsetMaxStep = 7

    let Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        // .slice(2, 3) //   2 "América Móvil",
        .slice(3, 4) //   3 "Apple",
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
        fileID = createCompanyDataStore(Company, filenamePrefix, filenameSuffix, mainSheetMode, DataMode)

        console.log('received fileID: ' + fileID)
        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)
    })
}

// aggregate Input Spreadsheets Health Status (Named Ranges, ..., tbd)

// eslint-disable-next-line no-unused-vars
function mainInspectInputSheets() {
    initiateGlobalConfig()
    // IMPORTANT FLAG

    let controlSpreadsheet = openSpreadsheetByID(controlSpreadsheetID)
    let ListSheetBroken = insertSheetIfNotExist(controlSpreadsheet, 'Input - Broken Refs', true)
    // ListSheetBroken.clear()

    let Companies = companiesVector.companies
        // .slice(0, 12) // Batch 1
        // .slice(12, 24) // Batch 2
        // .slice(24,26) // Batch 3
        .slice(2, 12) //
    // .slice(4, 5) //   4 "AT&T",
    // .slice(6, 7) //   6 "Baidu",
    // .slice(7, 8) //   7 "Bharti Airtel",

    Companies.forEach((Company) => {
        processCompanyHealth(ListSheetBroken, Company)
    })
}

// not functional yet

// eslint-disable-next-line no-unused-vars
function DevMainBackupFolder() {
    initiateGlobalConfig()

    let sourceFolderId = Config.rootFolderIDProd
    let targetFolderId = Config.backupFolderID

    deepCloneFolder(sourceFolderId, targetFolderId)
}

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
    // .slice(23, 24) //   23 "Verizon Media",
    // .slice(24, 25) //   24 "Vodafone",
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
    //.slice(22, 23) //   22 "Twitter",
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

    let stepLabel = ['S04', 'S05'] // maybe better: match ResearchStepObj syntax := S01
    let subStepIDs = createSubstepArray(stepLabel)

    // let editors = EditorsObj[stepLabel]

    /* custom Core editors list for Steps 4++ */
    let editors = centralConfig.defaultViewers.concat('ahackl2130@gmail.com')

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
        // .slice(10, 11) //   10 "Facebook",
        // .slice(11, 12) //   11 "Google",
        .slice(12, 13) //   12 "Kakao",
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
