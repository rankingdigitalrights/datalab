// --- // Main Controller // --- //
// --- //  Branch: Development  // --- //

/* global
    centralConfig,
    indicatorsVector,
    filterSingleIndicator,
    companiesVector,
    processInputSpreadsheet,
    createSpreadsheetOutput,
    createFeedbackForms,
    createAggregationOutput,
    createCompanyDataStore,
    processCompanyHealth,
    clearNamedRangesFromCompanySheet,
    openSpreadsheetByID,
    insertSheetIfNotExist,
    addFileIDtoControl,
    EditorsObj
*/

// global params init (def with initiateGlobalConfig())

/** --- main Prod vs Dev Toggle --- **/
var isProduction = false
/** --- main Prod vs Dev Toggle --- **/

var Config
var doRepairsOnly
var updateProduction = false
var includeFeedback = true
var addNewStep = false
var skipMainSteps // Global Config
var startAtMainStepNr = 0 // Global Config
var IndicatorsObj
var globalIndicatorsSubset
var indexPrefix
var filenamePrefix
var filenameSuffix
var rootFolderID
var rootFolderName // "2019 Back-End Dev"
var outputFolderName
var controlSpreadsheetID
var Styles

// HOOK: override global parameters here
function initiateGlobalConfig() {
    Config = centralConfig

    doRepairsOnly = false
    // skipMainSteps = false // TBD: not operation right now

    // --- INDICATOR SUBSETTING --- //
    // IMPORTANT: subsetting function now only accepts Array
    // IMPORTANT: disable useIndicatorSubset (i.e. here or locally in mainCaller)

    IndicatorsObj = indicatorsVector
    /* OR */
    // param has to be Array[]
    // IndicatorsObj = subsetIndicatorsObject(indicatorsVector, ["P1a", "P1b", "P2a", "P2b", "P3a", "P3b", "P4", "P5", "P6", "P7", "P8", "P9", "P10a", "P10b", "P11a", "P11b", "P12", "P13", "P14", "P15", "P16", "P17", "P18"])
    globalIndicatorsSubset = false
    // Indicator Labels:
    // ["G1","G2","G3","G4a","G4b","G4c","G4d","G4e","G5","G6a","G6b","F1a","F1b","F1c","F1d","F2a","F2b","F2c","F2d","F3a","F3b","F3c","F4a","F4b","F4c","F5a","F5b","F6","F7","F8","F9","F10","F11","F12","F13","P1a","P1b","P2a","P2b","P3a","P3b","P4","P5","P6","P7","P8","P9","P10a","P10b","P11a","P11b","P12","P13","P14","P15","P16","P17","P18"]

    indexPrefix = Config.indexPrefix
    filenamePrefix = Config.filenamePrefix
    filenameSuffix = isProduction ? Config.filenameSuffixProd : Config.filenameSuffixDev // Dev, "", Debug, QC
    outputFolderName = "2020 Dev Fallback Folder" // Specific folder defined in Main Callers
    rootFolderID = isProduction ? Config.rootFolderIDProd : Config.rootFolderIDDev
    rootFolderName = isProduction ? Config.rootFolderNameProd : Config.rootFolderIDDev
    controlSpreadsheetID = Config.controlSpreadsheetID
    Styles = Config.styles
}

// --- // MAIN CALLERS // --- //

// create Data Collection spreadsheets for all companies

function mainInputSheets() {

    initiateGlobalConfig()

    outputFolderName = isProduction ? Config.inputFolderNameProd : Config.inputFolderNameDev
    // filenameSuffix = "" // local override : Dev, "", Debug, QC
    let mainSheetMode = "Input" // for filename | TODO: move to Config
    let useStepsSubset = false // true := use subset; maxStep defined in Config.JSON
    let useIndicatorSubset = globalIndicatorsSubset // true := use subset

    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // .slice(0, 1) //   0 "Alibaba",
        // .slice(1, 2) //   1 "Amazon",
        .slice(2, 3) //   2 "América Móvil",
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

        fileID = processInputSpreadsheet(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })

}

// --- // add a new Main Research Step at position Sheet.lastRow()
function mainAddNewInputStep() {

    initiateGlobalConfig()

    updateProduction = false // IMPORTANT flag; if true then Company DC Sheet is grabbed by sheetID

    addNewStep = true // Just ignore: also caution - doesn't care if step already exists
    // also: Hook to skip steps
    startAtMainStepNr = addNewStep ? 3 : 0 // logical Order

    outputFolderName = isProduction ? Config.inputFolderNameProd : Config.inputFolderNameDev
    // filenameSuffix = "" // local override : Dev, "", Debug, QC
    let mainSheetMode = "Input" // for filename | TODO: move to Config
    let useStepsSubset = true // true := use subset; maxStep defined in Config.JSON
    let useIndicatorSubset = globalIndicatorsSubset // true := use subset

    const Companies = companiesVector.companies
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

        fileID = processInputSpreadsheet(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })

}

// create Scoring spreadsheets for all companies

function mainScoringSheets() {

    initiateGlobalConfig()
    outputFolderName = "2020 - Dev - Scores"
    let mainSheetMode = "Output"
    let useStepsSubset = false // true := use subset
    let useIndicatorSubset = false // true := use subset

    const Companies = companiesVector.companies
        //.slice(1, 9)
        .slice(1, 2) // Amazon
    // .slice(2, 3) // Apple


    let fileID

    Companies.forEach(function (Company) {

        fileID = createSpreadsheetOutput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })
}

/** New: Inject (append) Feedback Form Elements to Company-specific Feedback Template
 * @Param: Spreadsheet ID of Template defined in Company JSON
 */

function mainFeedbackSheets() {

    isProduction = true

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

        addFileIDtoControl("Company Feedback", Company.label.current, fileID, controlSpreadsheetID)
    })


}

// create Summary Scores spreadsheets for all companies

function mainAggregationSheets() {

    // filename fragments defined in 
    // Config.summaryParams.spreadsheetName
    initiateGlobalConfig()
    filenameSuffix = "Dev" // DANGER
    outputFolderName = "2020 - Dev - Summary"
    var mainSheetMode = "Summary Scores"

    var useIndicatorSubset = false // true := use subset

    var scoringStepNr = 6

    var Companies = companiesVector.companies
        .slice(1, 9) // no Amazon
    // .slice(1, 3) // for debugging
    // .slice(0,3) // Amazon
    // .slice(1, 2) // Apple
    // .slice(3,4) //

    var fileID = createAggregationOutput(useIndicatorSubset, Companies, filenamePrefix, filenameSuffix, mainSheetMode, scoringStepNr)

    addFileIDtoControl(mainSheetMode, "PROTO", fileID, controlSpreadsheetID)

    Logger.log("added " + mainSheetMode + ";fileID: " + fileID)
}

// create Data Store spreadsheets for all companies

function mainDataStore() {

    var includeWide = false
    initiateGlobalConfig()
    outputFolderName = "2020 - Dev - Data Store"

    filenameSuffix = "Test" // + long or wide is decided in main logic
    // filename fragments defined in 
    // Config.summaryParams.spreadsheetName
    var mainSheetMode = Config.dataStoreParams.fileName

    var useStepsSubset = false // true := use subset
    var useIndySubset = false // true := use subset

    var Companies = companiesVector.companies
        // .slice(1, 9) // exclude Amazon
        // .slice(1, 2) // Apple
        .slice(1, 9)

    var fileID

    Companies.forEach(function (Company) {

        fileID = createCompanyDataStore(useStepsSubset, useIndySubset, Company, filenamePrefix, filenameSuffix, mainSheetMode, includeWide)

        Logger.log("received fileID: " + fileID)
        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })
}

// aggregate Input Spreadsheets Health Status (Named Ranges, ..., tbd)

function mainInspectInputSheets() {

    initiateGlobalConfig()
    // IMPORTANT FLAG

    let controlSpreadsheet = openSpreadsheetByID(controlSpreadsheetID)
    let ListSheetBroken = insertSheetIfNotExist(controlSpreadsheet, "Input - Broken Refs", true)
    // ListSheetBroken.clear()
    let ListSheetFixed = null

    let Companies = companiesVector.companies
    // .slice(22, 26)
    // .slice(4, 5) //   4 "AT&T",
    // .slice(6, 7) //   6 "Baidu",
    // .slice(7, 8) //   7 "Bharti Airtel",

    Companies.forEach(Company => {
        processCompanyHealth(ListSheetBroken, Company)
    })

}

// --- // repairing // --- // 
function mainRepairInputSheets() {

    // IMPORTANT: if SS is protected, run with data@

    initiateGlobalConfig()

    startAtMainStepNr = 3 // logical Order

    Config.subsetMaxStep = startAtMainStepNr

    doRepairsOnly = true // don't touch

    updateProduction = true // DANGER

    let mainSheetMode = "Input" // for filename | TODO: move to Config
    let useStepsSubset = true // true := use subset; maxStep defined in Config.JSON
    let useIndicatorSubset = globalIndicatorsSubset // true := use subset

    let controlSpreadsheet = openSpreadsheetByID(controlSpreadsheetID)
    let ListSheetBroken = insertSheetIfNotExist(controlSpreadsheet, "Input - Broken Refs", true)
    // ListSheetBroken.clear()

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

    Companies.forEach(function (Company) {

        let fileID = processInputSpreadsheet(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        // processCompanyHealth(ListSheetBroken, Company, filenamePrefix, filenameSuffix, mainSheetMode)

    })


}

// not functional yet

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

    Companies.forEach(Company => mainProtectSingleCompany(Company))

}

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

    Companies.forEach(Company => mainUnProtectSingleCompany(Company))
}

function mainOpenStepCompanies() {
    // protects the sheets of a given company vector

    let stepLabel = ["S01"] // maybe better: match ResearchStepObj syntax := S01
    let substepArray = createSubstepArray(stepLabel)
    let editors = EditorsObj[stepLabel]

    Logger.log("array: " + substepArray)

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

    Companies.forEach(function (Company) {
        let companyNr = companiesVector.companies.indexOf(Company)
        let editors = []

        stepLabel.forEach(function (step) {
            editors.push(EditorsObj[step][companyNr])

        })

        Logger.log("editors:" + editors)

        mainProtectFileOpenStepSingleCompany(Company, substepArray, editors)
    })
}
