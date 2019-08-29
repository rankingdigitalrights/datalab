var indexPrefix = 'RDR2019'
var companyShortName = "verizon" // in alignment with <company>.json
var filenameVersion = "v4"

function mainMainCaller() {
	var DCstepsSubset = false
	var SCstepsSubset = true
	var indicatorSubset = false
	// mainCreateDCSheet(DCstepsSubset, indicatorSubset, companyShortName, filenameVersion)
	mainCreateScoringSheet(SCstepsSubset, indicatorSubset, companyShortName, filenameVersion)
}

function mainPermissions() {
	var sheetMode = 'DC'
	var protectSteps = ["S02"] // always use array
	// var unprotectSteps = ["S01", "S01.5"] // always use array
	var unprotectSteps = ["S02"] // always use array
	var allowedEditors = ["sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"] // always use array

	mainPermissionsCaller(indexPrefix, companyShortName, sheetMode, filenameVersion, protectSteps, unprotectSteps, allowedEditors)
}
