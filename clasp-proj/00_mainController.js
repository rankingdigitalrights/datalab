var companyShortName = "apple" // in alignment with <company>.json

var indexPrefix = 'RDR2019'
var filenameSuffix = "v14"
var parentFolderID = "1_0ItAPEi3guFochAExacCl2bTN0abwax" // "2019 Back-end testing"
var folderName = 'SpreadsheetCreationTEST' // ID: 1RV4i1j8-aCMn0pYeIiz2SOdfDo9T_h6r

// var companies = ["apple", "baidu", "etisalat", "mtn", "verizon"] // will be / needs to be
function mainAllCompaniesDataCollectionSheets() {

	var stepsSubset = true
	var indicatorSubset = true

	  companiesVector.companies.forEach(function (thisCompany) {
		mainCreateSingleDataCollectionSheet(thisCompany, stepsSubset, indicatorSubset)
	  })
  }

function mainAllCompaniesScoringSheets() {

	var stepsSubset = true
	var indicatorSubset = true

	companiesVector.companies.forEach(function (thisCompany) {
		mainCreateSingleScoringSheet(thisCompany, stepsSubset, indicatorSubset)
	})
}


// --- // single Company-level calls // --- //

// --- Data Collection --- // 
/**
 * 
 * @param {*} company 
 * @param {*} stepsSubset 
 * @param {*} indicatorSubset 
 */
function mainCreateSingleDataCollectionSheet(company, stepsSubset, indicatorSubset) {

	createSpreadsheetDC(stepsSubset, indicatorSubset, company, filenameSuffix)
	// TODO return ID and add to control Spreadsheet
}

// --- Scoring --- //
function mainCreateSingleScoringSheet(company, stepsSubset, indicatorSubset) {
	createSpreadsheetSC(stepsSubset, indicatorSubset, company, filenameSuffix)
	// TODO return ID and add to controll Spreadsheet
}

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
