// --- // Main Config // --- //
// --- Branch: PILOT --- //

var indexPrefix = "RDR2019"
var filenameSuffix = "Pilot"
var parentFolderID = "1_0ItAPEi3guFochAExacCl2bTN0abwax" // "2019 Back-end testing"
var folderName = "Pilot Drafts" // ID: 1RV4i1j8-aCMn0pYeIiz2SOdfDo9T_h6r

var controlSpreadsheet = "1PMEEmlueGgf69ZcUjIvS1iFjai9jt6eBd8yKbuZAxMI" // 00_Test

// --- // Subset params // --- //

var stepsSubset = true // true := use subset
var indicatorSubset = true // true := use subset

// --- // MAIN CALLER // --- //

// create Data Collection spreadsheets for all companies

function mainAllCompaniesDataCollectionSheets() {

	var mainSheetMode = "DC"

	var companies = companiesVector.companies
		.slice(0,1) // Apple
		// .slice(1,2) // ATT
		// .slice(3,4) //

	companies.forEach(function (thisCompany) {
		
		var fileID = mainCreateSingleDataCollectionSheet(thisCompany, stepsSubset, indicatorSubset, mainSheetMode)
		Logger.log("received fileID: " + fileID)
		addFileIDtoControl(mainSheetMode, thisCompany.label.current, fileID, controlSpreadsheet)
	})

}

// create Scoring spreadsheets for all companies

function mainAllCompaniesScoringSheets() {

	var mainSheetMode = "SC"

	var companies = companiesVector.companies
		.slice(0,1) // Apple
		// .slice(1,2) // ATT
		// .slice(3,4) //

	companies.forEach(function (thisCompany) {
		var fileID = mainCreateSingleScoringSheet(thisCompany, stepsSubset, indicatorSubset, mainSheetMode)
		Logger.log("received fileID: " + fileID)
		addFileIDtoControl(mainSheetMode, thisCompany.label.current, fileID, controlSpreadsheet)
	})
}

/* ---------------------------------------------------- */
/* do not run these by hand */

// --- // single Company-level calls // --- //

// --- Data Collection --- // 

function mainCreateSingleDataCollectionSheet(companyObj, stepsSubset, indicatorSubset, mainSheetMode) {
	var fileID = createSpreadsheetDC(stepsSubset, indicatorSubset, companyObj, filenameSuffix, mainSheetMode)
	return fileID
}

// --- Scoring --- //

function mainCreateSingleScoringSheet(companyObj, stepsSubset, indicatorSubset, mainSheetMode) {
	var fileID = createSpreadsheetSC(stepsSubset, indicatorSubset, companyObj, filenameSuffix, mainSheetMode)
	return fileID
}


// --- // Permissions // --- //

// now defunct

function mainPermissions() {
	var sheetMode = 'DC'

	// should be in sync with mainCreateDataCollectionSheet()
	var stepsSubset = false
	var indicatorSubset = false

	// always use [array] for all of these parameters
	var protectSteps = ["S02"]
	var unprotectSteps = ["S01", "S01.5"]
	// var unprotectSteps = ["S02"]
	var allowedEditors = ["sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org",
		"lisa.gutermuth@gmail.com"]

	mainPermissionsCaller(indexPrefix, companyShortName, sheetMode, filenameSuffix, protectSteps, unprotectSteps, allowedEditors, stepsSubset, indicatorSubset)
	// TODO to be connected with a main control spreadsheet
	// so it should return updated states
}
