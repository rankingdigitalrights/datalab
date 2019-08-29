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
