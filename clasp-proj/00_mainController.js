var indexPrefix = 'RDR2019'
var companyShortName = "verizon" // in alignment with <company>.json
var filenameVersion = "v5"
var parentFolderID = "1_0ItAPEi3guFochAExacCl2bTN0abwax" // "2019 Back-end testing"

function mainCreateDataCollectionSheet() {
	var stepsSubset = false
	var indicatorSubset = false
	mainCreateDCSheet(stepsSubset, indicatorSubset, companyShortName, filenameVersion)
}

function mainCreateScoringSheet() {
	var stepsSubset = true
	var indicatorSubset = false
	mainCreateScoringSheet(stepsSubset, indicatorSubset, companyShortName, filenameVersion)
}

function mainPermissions() {
	var sheetMode = 'DC'
	var protectSteps = ["S02"] // always use array
	var unprotectSteps = ["S01", "S01.5"] // always use array
	// var unprotectSteps = ["S02"] // always use array
	var allowedEditors = ["sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"] // always use array

	mainPermissionsCaller(indexPrefix, companyShortName, sheetMode, filenameVersion, protectSteps, unprotectSteps, allowedEditors)
}
