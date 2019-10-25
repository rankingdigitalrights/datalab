// for each indicator
// 
function addNotesSheet(File, IndicatorsObj, CompanyObj, ResearchStepsObj, companyNumberOfServices, serviceColWidth, hasOpCom) {

    var targetSheet = insertSheetIfNotExist(File, "CommentsTab", true)
    targetSheet.clear()
    targetSheet.appendRow(["Test", "Step"])
    // var sourceSheet = File.getSheetByName("G2")
    // var namedRNGs = sourceSheet.getNamedRanges()
    // Logger.log(namedRNGs)
    // var formula
    // namedRNGs.forEach(function(RNG) {
    //  formula= '=' + RNG.getName()
    //   targetSheet.appendRow([formula])
    // })


}
