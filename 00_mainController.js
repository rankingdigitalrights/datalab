// --- // Main Config // --- //
// --- Branch: PILOT --- //

// TODO: Move global parameters to config

var indexPrefix = "RDR19P"
var filenamePrefix = "2019 Pilot -"
var filenameSuffix = "" // Dev, "", Debug, QC
var rootFolderID = "1_0ItAPEi3guFochAExacCl2bTN0abwax" // "2019 Back-End Dev"
var outputFolderName = "2019 Pilot Dev" // "2019 Pilot Data Store"

var controlSpreadsheet = "1PMEEmlueGgf69ZcUjIvS1iFjai9jt6eBd8yKbuZAxMI" // 00_2019_Pilot_Dashboard

// --- // MAIN CALLER // --- //

// create Data Collection spreadsheets for all companies

function mainAllCompaniesDataCollectionSheets() {

    var mainSheetMode = "Input" // for filename

    var useStepsSubset = false // true := use subset
    var useIndicatorSubset = false // true := use subset

    var companies = companiesVector.companies
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

    companies.forEach(function (Company) {
        var fileID = createSpreadsheetInput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)
        Logger.log("received fileID: " + fileID)
        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheet)
    })

}

// create Scoring spreadsheets for all companies

function mainAllCompaniesScoringSheets() {

    var mainSheetMode = "Output"

    var useStepsSubset = false // true := use subset
    var useIndicatorSubset = true // true := use subset

    var companies = companiesVector.companies
        // .slice(0,1) // Amazon
        .slice(1, 2) // Apple
    // .slice(3,4) //

    companies.forEach(function (Company) {
        var fileID = createSpreadsheetOutput(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)
        Logger.log("received fileID: " + fileID)
        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheet)
    })
}

// create Scoring spreadsheets for all companies

function mainAllFeedbackSheets() {

    var mainSheetMode = "Feedback"

    var useIndicatorSubset = false // true := use subset

    var companies = companiesVector.companies
    // .slice(1,2) // Apple

    companies.forEach(function (Company) {
        var fileID = createFeedbackForms(useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)
        Logger.log("received fileID: " + fileID)
        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheet)
    })
}

// create Scoring spreadsheets for all companies

function mainSummaryScoresProto() {

    // filename fragments defined in 
    // Config.summaryParams.spreadsheetName
    var mainSheetMode = "Summary Scores Testing"

    var useStepsSubset = true // true := use subset
    var useIndicatorSubset = true // true := use subset

    var scoringStepNr = 3

    var Companies = companiesVector.companies
    // .slice(0,3) // Amazon
    // .slice(1,2) // Apple
    // .slice(3,4) //

    var fileID = createAggregationSS(useStepsSubset, useIndicatorSubset, Companies, filenamePrefix, filenameSuffix, mainSheetMode, scoringStepNr)
    Logger.log("received fileID: " + fileID)
    addFileIDtoControl(mainSheetMode, "PROTO", fileID, controlSpreadsheet)
}

// create Scoring spreadsheets for all companies

function mainDataStore() {

    // filename fragments defined in 
    // Config.summaryParams.spreadsheetName
    var mainSheetMode = centralConfig.dataLayerParams.fileName

    var useStepsSubset = true // true := use subset
    var useIndicatorSubset = true // true := use subset

    var companies = companiesVector.companies
    // .slice(1,2) // Apple

    companies.forEach(function (Company) {

        var fileID = createCompanyDataLayer(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        Logger.log("received fileID: " + fileID)
        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheet)

    })
}


// --- // repairing // --- // 
function mainRepairCompaniesDataCollectionSheets() {

    var mainSheetMode = "Input" // for filename
    filenameSuffix = ""

    var companies = companiesVector.companies
        // .slice(0, 3) // Subset #1
        // .slice(3,6) // Subset #2
        // .slice(6,9) // Subset #3
        // .slice(0, 1) // Amazon
        .slice(1, 2) // Apple
    // .slice(2,3) // Deutsche Telekom
    // .slice(3,4) // Facebook
    // .slice(4,5) // Google
    // .slice(5,6) // Microsoft
    // .slice(6, 7) // Telefonica
    // .slice(7,8) // Twitter
    // .slice(8,9) // Vodafone

    companies.forEach(function (Company) {
        repairInputSpreadsheets(Company, filenamePrefix, filenameSuffix, mainSheetMode)
    })

}

// --- // repairing // --- // 
function mainClearAllNamedRanges() {

    var mainSheetMode = "Input" // for filename

    var companies = companiesVector.companies
        // .slice(0,1) // Amazon
        .slice(1, 2) // Apple
    // .slice(2,3) // Deutsche Telekom
    // .slice(3,4) // Facebook
    // .slice(4,5) // Google
    // .slice(5,6) // Microsoft
    // .slice(6,7) // Telefonica
    // .slice(7,8) // Twitter
    // .slice(8,9) // Vodafone

    companies.forEach(function (Company) {
        clearNamedRangesFromCompanySheet(Company, filenamePrefix, filenameSuffix, mainSheetMode)
    })

}