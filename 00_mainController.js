// --- // Main Controller // --- //
// --- //  Branch: Development  // --- //

/* global
    centralConfig,
    indicatorsVector,
    filterSingleIndicator,
    companiesVector,
    createSpreadsheetInput,
    createSpreadsheetOutput,
    createFeedbackForms,
    createAggregationOutput,
    createCompanyDataStore,
    processHealthSingleSpreadsheet,
    clearNamedRangesFromCompanySheet,
    openSpreadsheetByID,
    insertSheetIfNotExist,
    addFileIDtoControl,
*/

// global params init (def with initiateGlobalConfig())

/** --- main Prod vs Dev Toggle --- **/
var isProduction = false
/** --- main Prod vs Dev Toggle --- **/

var Config
var IndicatorsObj
var indexPrefix
var filenamePrefix
var filenameSuffix
var rootFolderID
var rootFolderName // "2019 Back-End Dev"
var outputFolderName
var controlSpreadsheetID
var Styles


function initiateGlobalConfig() {
    Config = centralConfig

    IndicatorsObj = indicatorsVector
    // IndicatorsObj = filterSingleIndicator(indicatorsVector, "P11a")

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

    let doClearNamedRanges = false // CAUTION

    initiateGlobalConfig()
    outputFolderName = isProduction ? Config.inputFolderNameProd : Config.inputFolderNameDev
    // filenameSuffix = "" // local override : Dev, "", Debug, QC
    let mainSheetMode = "Input" // for filename
    let useStepsSubset = true // true := use subset
    let useIndicatorSubset = false // true := use subset

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
        .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Verizon Media",
    // .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    let fileID

    Companies.forEach(function (Company) {

        fileID = createSpreadsheetInput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode, doClearNamedRanges)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })

}

// create Scoring spreadsheets for all companies

function mainScoringSheets() {

    initiateGlobalConfig()
    outputFolderName = "2020 - Dev - Scores"
    let mainSheetMode = "Output"
    let useStepsSubset = false // true := use subset
    let useIndicatorSubset = true // true := use subset

    const Companies = companiesVector.companies
        .slice(1, 9)
    // .slice(0,1) // Amazon
    // .slice(1, 2) // Apple
    // .slice(3,4) //

    let fileID

    Companies.forEach(function (Company) {

        fileID = createSpreadsheetOutput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })
}

// create Feedback spreadsheets for all companies

function mainFeedbackSheets() {

    initiateGlobalConfig()
    outputFolderName = "2020 - Dev - Feedback"
    var mainSheetMode = "Feedback"

    var useIndicatorSubset = false // true := use subset

    var Companies = companiesVector.companies
    // .slice(1,2) // Apple

    var fileID

    Companies.forEach(function (Company) {

        fileID = createFeedbackForms(useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)
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
    var doRepairs = false // IMPORTANT FLAG

    var mainSheetMode = "Input" // for filename
    filenameSuffix = ""

    var controlSpreadsheet = openSpreadsheetByID(controlSpreadsheetID)
    var ListSheetBroken = insertSheetIfNotExist(controlSpreadsheet, "Input - Broken Refs", true)
    // ListSheetBroken.clear()
    var ListSheetFixed = null

    var Companies = companiesVector.companies
        // .slice(1, 2) // Apple
        .slice(22, 23)

    Companies.forEach(function (Company) {
        processHealthSingleSpreadsheet(ListSheetBroken, ListSheetFixed, Company, filenamePrefix, filenameSuffix, mainSheetMode, doRepairs)
    })

}

// --- // repairing // --- // 
function mainRepairInputSheets() {

    initiateGlobalConfig()
    // IMPORTANT FLAG
    var doRepairs = true // IMPORTANT FLAG

    var mainSheetMode = "Input" // for filename
    filenameSuffix = ""

    var controlSpreadsheet = openSpreadsheetByID(controlSpreadsheetID)
    var ListSheetBroken = insertSheetIfNotExist(controlSpreadsheet, "Input - Broken Refs", true)
    ListSheetBroken.clear()
    var ListSheetFixed

    if (doRepairs) {
        ListSheetFixed = insertSheetIfNotExist(controlSpreadsheet, "Input - Fixed Refs", true)
        // ListSheetFixed.clear()
    } else {
        ListSheetFixed = null
    }

    var Companies = companiesVector.companies
        // .slice(0,3) // Subset #1
        // .slice(3,6) // Subset #2
        // .slice(6,9) // Subset #3
        // .slice(0,1) // Amazon
        // .slice(1, 2) // Apple
        // .slice(2, 3) // Deutsche Telekom
        // .slice(3, 4) // Facebook
        // .slice(4,5) // Google
        // .slice(5,6) // Microsoft
        .slice(6, 7) // Telefonica
    // .slice(7,8) // Twitter
    // .slice(8,9) // Vodafone

    Companies.forEach(function (Company) {
        processHealthSingleSpreadsheet(ListSheetBroken, ListSheetFixed, Company, filenamePrefix, filenameSuffix, mainSheetMode, doRepairs)
    })

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

function mainProtectSheets() {
    for (let i = 0; i < companiesVector.companies.length; i++) {
        mainProtectSingleCompany(i)
    }
}


