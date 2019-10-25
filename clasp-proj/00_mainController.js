// --- // Main Config // --- //
// --- Branch: PILOT --- //

// TODO: Move global parameters to config

var indexPrefix = "RDR19P"
var filenamePrefix = "2019 Pilot -"
var filenameSuffix = "Dev"
var rootFolderID = "1_0ItAPEi3guFochAExacCl2bTN0abwax" // "2019 Back-end testing"
var outputFolderName = "2019 Pilot Dev"

var controlSpreadsheet = "1PMEEmlueGgf69ZcUjIvS1iFjai9jt6eBd8yKbuZAxMI" // 00_2019_Pilot_Dashboard

// --- // Subset params // --- //

var useStepsSubset = true // true := use subset
var useIndicatorSubset = false // true := use subset

// --- // MAIN CALLER // --- //

// create Data Collection spreadsheets for all companies

function mainAllCompaniesDataCollectionSheets() {

	var mainSheetMode = "Input"

	var companies = companiesVector.companies
		// .slice(0,0) // on purpose to prevent script from running.
		// .slice(0,3) // Subset #1
		// .slice(3,6) // Subset #2
		// .slice(6,9) // Subset #3

		.slice(0,1) // Amazon
		// .slice(1,2) // Apple
		// .slice(2,3) // Deutsche Telekom
		// .slice(3,4) // Facebook
		// .slice(4,5) // Google
		// .slice(5,6) // Microsoft
		// .slice(6,7) // Telefonica
		// .slice(7,8) // Twitter
		// .slice(8,9) // Vodafone

	companies.forEach(function (thisCompany) {
		
		var fileID = createSpreadsheetDC(useStepsSubset, useIndicatorSubset, thisCompany, filenamePrefix, filenameSuffix, mainSheetMode)
		Logger.log("received fileID: " + fileID)
		addFileIDtoControl(mainSheetMode, thisCompany.label.current, fileID, controlSpreadsheet)
	})

}

// create Scoring spreadsheets for all companies

function mainAllCompaniesScoringSheets() {

	var mainSheetMode = "Output"

	var companies = companiesVector.companies
		.slice(0,1) // Amazon
		// .slice(1,2) // Apple
		// .slice(3,4) //

	companies.forEach(function (thisCompany) {
		var fileID = createSpreadsheetSC(useStepsSubset, useIndicatorSubset, thisCompany, filenamePrefix, filenameSuffix, mainSheetMode)
		Logger.log("received fileID: " + fileID)
		addFileIDtoControl(mainSheetMode, thisCompany.label.current, fileID, controlSpreadsheet)
	})
}


// create Scoring spreadsheets for all companies

function mainSummaryScoresProto() {

	var mainSheetMode = "Summary"

	var companies = companiesVector.companies
		// .slice(0,1) // Amazon
		// .slice(1,2) // Apple
		// .slice(3,4) //

		var fileID = createAggregationSS(useStepsSubset, useIndicatorSubset, companies, filenamePrefix, filenameSuffix, mainSheetMode)
		Logger.log("received fileID: " + fileID)
		addFileIDtoControl(mainSheetMode, "PROTO", fileID, controlSpreadsheet)
}

// --- // Permissions // --- //

// currently defunct

function mainPermissions() {
	var mainSheetMode = 'DC'

	// should be in sync with mainCreateDataCollectionSheet()
	var useStepsSubset = false
	var useIndicatorSubset = false

	// always use [array] for all of these parameters
	var protectSteps = ["S02"]
	var unprotectSteps = ["S01", "S01.5"]
	// var unprotectSteps = ["S02"]
	var allowedEditors = ["sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org",
		"lisa.gutermuth@gmail.com"]

	mainPermissionsCaller(indexPrefix, companyShortName, mainSheetMode, filenameSuffix, protectSteps, unprotectSteps, allowedEditors, useStepsSubset, useIndicatorSubset)
	// TODO to be connected with a main control spreadsheet
	// so it should return updated states
}
