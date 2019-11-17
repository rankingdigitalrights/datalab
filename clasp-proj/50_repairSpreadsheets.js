// --- Spreadsheet Casting: Company Data Collection Sheet --- //

function repairSpreadsheetDC(useStepsSubset, useIndicatorSubset, CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {
    Logger.log('--- // --- begin main data collection --- // ---')

    var companyShortName
    if (CompanyObj.label.altFilename) {
        companyShortName = CompanyObj.label.altFilename
    } else {
        companyShortName = CompanyObj.label.current
    }

    var Config = centralConfig 
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector
    var includeRGuidanceLink = Config.includeRGuidanceLink
    var collapseRGuidance = Config.collapseRGuidance


    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)
    //   var File = SpreadsheetApp.create(spreadsheetName)
    var File = connectToSpreadsheetByName(spreadsheetName)

    var fileID = File.getId()
    Logger.log("File ID: " + fileID)

    var listSheetName = "BrokenRefs"
    var ListSheet = insertSheetIfNotExist(File, listSheetName, true)
    ListSheet.clear()
    // if scoring sheet is integrated into DC, create Points sheet

    var hasOpCom = CompanyObj.hasOpCom

    // fetch number of Services once
    var companyNumberOfServices = CompanyObj.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        var currentClass = IndicatorsObj.indicatorClasses[i]

        repairDCSheetByCategory(File, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, hasOpCom, includeRGuidanceLink, useIndicatorSubset, ListSheet)
    }

}
