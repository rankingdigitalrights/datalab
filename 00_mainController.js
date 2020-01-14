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

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheet)

    })

}

// create Scoring spreadsheets for all companies

function mainAllCompaniesScoringSheets() {

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

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheet)

    })
}

// create Scoring spreadsheets for all companies

function mainAllFeedbackSheets() {

    var mainSheetMode = "Feedback"

    var useIndicatorSubset = false // true := use subset

    var Companies = companiesVector.companies
    // .slice(1,2) // Apple

    var fileID

    Companies.forEach(function (Company) {

        fileID = createFeedbackForms(useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheet)
    })
}

// create Scoring spreadsheets for all companies

function mainSummaryScoresProto() {

    // filename fragments defined in 
    // Config.summaryParams.spreadsheetName
    var mainSheetMode = "Summary Scores Dev"

    var useIndicatorSubset = false // true := use subset

    var scoringStepNr = 6

    var Companies = companiesVector.companies
    // .slice(0,3) // Amazon
    // .slice(1,2) // Apple
    // .slice(3,4) //

    var fileID = createAggregationSS(useIndicatorSubset, Companies, filenamePrefix, filenameSuffix, mainSheetMode, scoringStepNr)

    addFileIDtoControl(mainSheetMode, "PROTO", fileID, controlSpreadsheet)

    Logger.log("added " + mainSheetMode + ";fileID: " + fileID)
}

// create Scoring spreadsheets for all companies

function mainDataStore() {

    // filename fragments defined in 
    // Config.summaryParams.spreadsheetName
    var mainSheetMode = centralConfig.dataLayerParams.fileName

    var useStepsSubset = true // true := use subset
    var useIndicatorSubset = true // true := use subset

    var Companies = companiesVector.companies
    // .slice(1,2) // Apple

    var fileID

    Companies.forEach(function (Company) {

        fileID = createCompanyDataLayer(useStepsSubset, useIndicatorSubset, Company, filenamePrefix, filenameSuffix, mainSheetMode)

        Logger.log("received fileID: " + fileID)
        addFileIDtoControl(mainSheetMode, Company.label.current, fileID, controlSpreadsheet)

    })
}

// aggregate Inspection of Health (Named Ranges, ..., tbd)

function mainInspectHealth() {

    outputFolderName = "00_control_dev"

    var mainSheetMode = "Input" // for filename
    filenameSuffix = ""

    var Companies = companiesVector.companies
    // .slice(0,3) // Amazon
    // .slice(1,2) // Apple
    // .slice(3,4) //

    inspectHealth(Companies, filenamePrefix, filenameSuffix, mainSheetMode)

}


// --- // repairing // --- // 
function mainRepairCompaniesDataCollectionSheets() {

    var mainSheetMode = "Input" // for filename
    filenameSuffix = ""

    var Companies = companiesVector.companies
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

    Companies.forEach(function (Company) {
        repairInputSpreadsheets(Company, filenamePrefix, filenameSuffix, mainSheetMode)
    })

}

// --- // repairing // --- // 
function mainClearAllNamedRanges() {

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