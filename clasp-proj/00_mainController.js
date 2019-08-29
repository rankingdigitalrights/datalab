var indexPrefix = 'RDR2019'
var companyShortName = "verizon" // in alignment with <company>.json
var filenameVersion = "v4"

function mainMainCaller () {
  var DCstepsSubset = false
  var SCstepsSubset = true
  var indicatorSubset = false
  // mainCreateDCSheet(DCstepsSubset, indicatorSubset, companyShortName, filenameVersion)
  mainCreateScoringSheet(SCstepsSubset, indicatorSubset, companyShortName, filenameVersion)
}

function mainPermissions () {
  var protectStep = 1
  var unprotectStep = false
  var allowedEditors = ["sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"]

  mainPermissionsCaller(companyShortName, filenameVersion, protectStep, unprotectStep, allowedEditors)
}

