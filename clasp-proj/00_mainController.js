var companyShortName = "apple" // in alignment with <company>.json

var indexPrefix = 'RDR2019'
var filenameVersion = "v7"
var parentFolderID = "1_0ItAPEi3guFochAExacCl2bTN0abwax" // "2019 Back-end testing"
// var parentFolderID = "1RV4i1j8-aCMn0pYeIiz2SOdfDo9T_h6r" // "Spreadsheet creation TEST"
var folderName = 'SpreadsheetCreationTEST'

function mainCreateDataCollectionSheet() {
	var stepsSubset = false
	var indicatorSubset = true

	Logger.log("pre-global " + companyShortName)

	createDCSheet(stepsSubset, indicatorSubset, companyShortName, filenameVersion)
	// TODO return ID and add to controll Spreadsheet
}

function mainCreateScoringSheet() {
	var stepsSubset = true
	var indicatorSubset = true

	Logger.log("pre-global " + companyShortName)
	createSCSheet(stepsSubset, indicatorSubset, companyShortName, filenameVersion)
	// TODO return ID and add to controll Spreadsheet
}

function mainPermissions() {
	var sheetMode = 'DC'

	// should be in sync with mainCreateDataCollectionSheet()
	var stepsSubset = false
	var indicatorSubset = true

	Logger.log("pre-global " + companyShortName)
	var protectSteps = ["S02"] // always use array
	var unprotectSteps = ["S01", "S01.5"] // always use array
	// var unprotectSteps = ["S02"] // always use array
	var allowedEditors = ["sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org",
		"lisa.gutermuth@gmail.com"] // always use array

	mainPermissionsCaller(indexPrefix, companyShortName, sheetMode, filenameVersion, protectSteps, unprotectSteps, allowedEditors, stepsSubset, indicatorSubset)
}
