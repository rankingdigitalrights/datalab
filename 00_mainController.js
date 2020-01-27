// --- // Main Controller // --- //
// --- //  Branch: PILOT  // --- //

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
    connectToSpreadsheetByID,
    insertSheetIfNotExist,
    addFileIDtoControl,
*/

// global params init (def with initiateConfig())

var indexPrefix
var filenamePrefix
var filenameSuffix
var rootFolderID // "2019 Back-End Dev"
var outputFolderName
var controlSpreadsheetID

// --- // MAIN CALLERS // --- //

// create Data Collection spreadsheets for all companies

function mainAllCompaniesDataCollectionSheets() {

    initiateConfig()
    var mainSheetMode = "Input" // for filename
    var useStepsSubset = false // true := use subset
    var useIndicatorSubset = false // true := use subset

    var Companies = companiesVector.companies
        // .slice(0,0) // on purpose to prevent script from running.
        // .slice(0,3) // Subset #1
        // .slice(3,6) // Subset #2
        // .slice(6,9) // Subset #3

        // .slice(0,1) // Amazon
        .slice(1, 2) // Apple
    // .slice(2,3) // Deutsche Telekom
    // .slice(3,4) // Facebook
    // .slice(4,5) // Google
    // .slice(5,6) // Microsoft
    // .slice(6,7) // Telefonica
    // .slice(7,8) // Twitter
    // .slice(8,9) // Vodafone

    var fileID

    Companies.forEach(function (Company) {

        fileID = createSpreadsheetInput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })

}

// create Scoring spreadsheets for all companies

function mainAllCompaniesScoringSheets() {

    initiateConfig()
    var mainSheetMode = "Output"
    var useStepsSubset = false // true := use subset
    var useIndicatorSubset = true // true := use subset

    var Companies = companiesVector.companies
        // .slice(0,1) // Amazon
        .slice(1, 2) // Apple
    // .slice(3,4) //

    var fileID

    Companies.forEach(function (Company) {

        fileID = createSpreadsheetOutput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })
}

// create Scoring spreadsheets for all companies

function mainAllFeedbackSheets() {

    initiateConfig()
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

// create Scoring spreadsheets for all companies

function mainSummaryScoresProto() {

    // filename fragments defined in 
    // Config.summaryParams.spreadsheetName
    initiateConfig()
    outputFolderName = "2019 Pilot Summary Dev"
    var mainSheetMode = "Summary Scores"

    var useIndicatorSubset = false // true := use subset

    var scoringStepNr = 3

    var Companies = companiesVector.companies
        .slice(1, 9) // no Amazon
    // .slice(1, 3) // for debugging
    // .slice(0,3) // Amazon
    // .slice(1,2) // Apple
    // .slice(3,4) //

    var fileID = createAggregationOutput(useIndicatorSubset, Companies, filenamePrefix, filenameSuffix, mainSheetMode, scoringStepNr)

    addFileIDtoControl(mainSheetMode, "PROTO", fileID, controlSpreadsheetID)

    Logger.log("added " + mainSheetMode + ";fileID: " + fileID)
}

// create Scoring spreadsheets for all companies

function mainDataStore() {

    var isLongForm = false
    initiateConfig()
    filenameSuffix = "Dev Wide"
    outputFolderName = "2019 Pilot Data Store v2"
    // filename fragments defined in 
    // Config.summaryParams.spreadsheetName
    var mainSheetMode = centralConfig.dataStoreParams.fileName

    var useStepsSubset = true // true := use subset
    var useIndicatorSubset = true // true := use subset

    var Companies = companiesVector.companies
        .slice(1, 2) // Apple

    var fileID

    Companies.forEach(function (Company) {

        fileID = createCompanyDataStore(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode, isLongForm)

        Logger.log("received fileID: " + fileID)
        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheetID)

    })
}

// aggregate Inspection of Health (Named Ranges, ..., tbd)

function mainInspectHealth() {

    initiateConfig()
    // IMPORTANT FLAG
    var doRepairs = false // IMPORTANT FLAG

    var mainSheetMode = "Input" // for filename
    filenameSuffix = ""

    var controlSpreadsheet = connectToSpreadsheetByID(controlSpreadsheetID)
    var ListSheetBroken = insertSheetIfNotExist(controlSpreadsheet, "Input - Broken Refs", true)
    // ListSheetBroken.clear()
    var ListSheetFixed = null

    var Companies = companiesVector.companies

    Companies.forEach(function (Company) {
        processHealthSingleSpreadsheet(ListSheetBroken, ListSheetFixed, Company, filenamePrefix, filenameSuffix, mainSheetMode, doRepairs)
    })

}

// --- // repairing // --- // 
function mainRepairCompaniesDataCollectionSheets() {

    initiateConfig()
    // IMPORTANT FLAG
    var doRepairs = true // IMPORTANT FLAG

    var mainSheetMode = "Input" // for filename
    filenameSuffix = ""

    var controlSpreadsheet = connectToSpreadsheetByID(controlSpreadsheetID)
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
        .slice(3, 4) // Facebook
    // .slice(4,5) // Google
    // .slice(5,6) // Microsoft
    // .slice(6, 7) // Telefonica
    // .slice(7,8) // Twitter
    // .slice(8,9) // Vodafone

    Companies.forEach(function (Company) {
        processHealthSingleSpreadsheet(ListSheetBroken, ListSheetFixed, Company, filenamePrefix, filenameSuffix, mainSheetMode, doRepairs)
    })

}

// --- // USE WISELY // --- // 
function mainClearAllNamedRanges() {

    initiateConfig()
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

}

function initiateConfig() {

    indexPrefix = centralConfig.indexPrefix
    filenamePrefix = "2019 Pilot -"
    filenameSuffix = "Dev v2" // Dev, "", Debug, QC
    rootFolderID = centralConfig.rootFolderID // "2019 Back-End Dev"
    outputFolderName = "2019 Pilot Dev" // "2019 Pilot Data Store"

    controlSpreadsheetID = centralConfig.controlSpreadsheetID // 00_2019_Pilot_Dashboard
}