// --- Spreadsheet Casting: Company Data Collection Sheet --- //

function repairSpreadsheetDC(useStepsSubset, useIndicatorSubset, CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {
    Logger.log("--- // --- begin main data collection --- // ---")

    var companyShortName = cleanCompanyName(CompanyObj)

    var Config = centralConfig
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector
    var includeRGuidanceLink = Config.includeRGuidanceLink
    var collapseRGuidance = Config.collapseRGuidance


    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)
    //   var SS = SpreadsheetApp.create(spreadsheetName)
    var SS = connectToSpreadsheetByName(spreadsheetName)

    var fileID = SS.getId()
    Logger.log("SS ID: " + fileID)


    var ListSheetBroken = insertSheetIfNotExist(SS, "BrokenRefs", true)
    var ListSheetFixed = insertSheetIfNotExist(SS, "FixedRefs", true)
    ListSheetBroken.clear()
    ListSheetFixed.clear()
    // if scoring sheet is integrated into DC, create Points sheet

    var hasOpCom = CompanyObj.hasOpCom

    // fetch number of Services once
    var companyNumberOfServices = CompanyObj.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        var currentClass = IndicatorsObj.indicatorClasses[i]

        repairDCSheetByCategory(SS, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, hasOpCom, includeRGuidanceLink, collapseRGuidance, useIndicatorSubset, ListSheetBroken, ListSheetFixed)
    }

}