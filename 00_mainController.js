// --- // Main Controller // --- //
// --- //  Branch: Development  // --- //

/* global
    centralConfig,
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

var Config
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
    indexPrefix = Config.indexPrefix
    filenamePrefix = "2020 - Dev -" // end with " -"
    filenameSuffix = " (Alpha)" // Dev, "", Debug, QC
    outputFolderName = "2020 Dev Fallback Folder" // Specific folder defined in Main Callers
    rootFolderID = Config.rootFolderID
    rootFolderName = Config.rootFolderName
    controlSpreadsheetID = Config.controlSpreadsheetID
    Styles = Config.styles
}

// --- // MAIN CALLERS // --- //

// create Data Collection spreadsheets for all companies

function mainInputSheets() {

    let doClearNamedRanges = false // CAUTION

    initiateGlobalConfig()
    outputFolderName = "2020 - Dev - Input"
    // filenameSuffix = "" // Dev, "", Debug, QC
    let mainSheetMode = "Input" // for filename
    let useStepsSubset = true // true := use subset
    let useIndicatorSubset = true // true := use subset


    const Companies = companiesVector.companies
        // .slice(0, 0) // on purpose to prevent script from running.
        // Pilot Order //
        // .slice(1, 4) // Subset #1 1:2
        // .slice(3,6) // Subset #2 3:5
        // .slice(6,9) // Subset #3 6:8
        // .slice(0, 2)
        // .slice(0, 1) //   0 "Amazon",
        // .slice(1, 2) //   1 "Alibaba",
        //   2 "América Móvil",
        .slice(3, 4) //   3 "Apple",
    //   4 "AT&T",
    //   5 "Axiata",
    //   6 "Baidu",
    //   7 "Bharti Airtel",
    //   8 "Deutsche Telekom",
    //   9 "Etisalat",
    //   10 "Facebook",
    //   11 "Google",
    //   12 "Kakao",
    //   13 "Mail.Ru",
    //   14 "Microsoft",
    //   15 "MTN",
    //   16 "Ooredoo",
    //   17 "Orange",
    //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    //   20 "Telenor",
    //   21 "Tencent",
    //   22 "Twitter",
    //   23 "Verizon Media",
    //   24 "Vodafone",
    //   25 "Yandex"

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
    let useStepsSubset = true // true := use subset
    let useIndicatorSubset = false // true := use subset

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
        .slice(1, 9)

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
function mainClearAllNamedRanges() {

    initiateGlobalConfig()
    var mainSheetMode = "Input" // for filename

    var Companies = companiesVector.companies
        // .slice(0, 0)
        // .slice(0,1) // Amazon
        .slice(1, 2) // Apple
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

}
