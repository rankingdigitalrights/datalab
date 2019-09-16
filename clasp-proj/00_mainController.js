var indexPrefix = "RDR2019"
var filenameSuffix = "MLS"
var parentFolderID = "1_0ItAPEi3guFochAExacCl2bTN0abwax" // "2019 Back-end testing"
var folderName = "Spreadsheets Test" // ID: 1RV4i1j8-aCMn0pYeIiz2SOdfDo9T_h6r
var Controlsheet = "1PMEEmlueGgf69ZcUjIvS1iFjai9jt6eBd8yKbuZAxMI"

// create Data Collection spreadsheets for all companies

function mainAllCompaniesDataCollectionSheets() {

	var companies = companiesVector.companies
		// .slice(0,1) // uncomment for using less companies

	var stepsSubset = true
	var indicatorSubset = true

	companies.forEach(function (thisCompany) {
		var fileID = mainCreateSingleDataCollectionSheet(thisCompany, stepsSubset, indicatorSubset)
		Logger.log("received fileID: " + fileID)
		addFileIDtoControl("DC", thisCompany.label.current, fileID, Controlsheet)
	})

}

// create Data Collection spreadsheets for all companies

function mainAllCompaniesScoringSheets() {

	var companies = companiesVector.companies
		// .slice(4,5) // uncomment for using less companies

	var stepsSubset = true
	var indicatorSubset = true

	companies.forEach(function (thisCompany) {
		var fileID = mainCreateSingleScoringSheet(thisCompany, stepsSubset, indicatorSubset)
		Logger.log("received fileID: " + fileID)
		addFileIDtoControl("SC", thisCompany.label.current, fileID, Controlsheet)
	})
}


// --- // single Company-level calls // --- //

// --- Data Collection --- // 

function mainCreateSingleDataCollectionSheet(company, stepsSubset, indicatorSubset) {

	var fileID = createSpreadsheetDC(stepsSubset, indicatorSubset, company, filenameSuffix)
	return fileID
	// TODO return ID and add to control Spreadsheet
}

// --- Scoring --- //

function mainCreateSingleScoringSheet(company, stepsSubset, indicatorSubset) {
	var fileID = createSpreadsheetSC(stepsSubset, indicatorSubset, company, filenameSuffix)
	return fileID
	// TODO return ID and add to controll Spreadsheet
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
