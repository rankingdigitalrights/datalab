var companyShortName = "baidu" // in alignment with <company>.json

var indexPrefix = 'RDR2019'
var filenameSuffix = "v9"
var parentFolderID = "1_0ItAPEi3guFochAExacCl2bTN0abwax" // "2019 Back-end testing"
var folderName = 'SpreadsheetCreationTEST' // ID: 1RV4i1j8-aCMn0pYeIiz2SOdfDo9T_h6r

function mainCreateDataCollectionSheet() {
	var stepsSubset = true
	var indicatorSubset = true
	createDCSheet(stepsSubset, indicatorSubset, companyShortName, filenameSuffix)
	// TODO return ID and add to control Spreadsheet
}

function mainCreateScoringSheet() {
	var stepsSubset = true
	var indicatorSubset = true
	createSCSheet(stepsSubset, indicatorSubset, companyShortName, filenameSuffix)
	// TODO return ID and add to controll Spreadsheet
}

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
