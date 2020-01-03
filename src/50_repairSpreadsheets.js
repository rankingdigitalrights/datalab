// --- Spreadsheet Casting: Company Data Collection Sheet --- //

function repairInputSpreadsheets(Company, filenamePrefix, filenameSuffix, mainSheetMode) {
    Logger.log("--- // --- begin main data collection --- // ---")

    var companyShortName = cleanCompanyName(Company)

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

    var currentDate = getISOtimeAsString()

    var ListSheetBroken = insertSheetIfNotExist(SS, "BrokenRefs", true)
    var ListSheetFixed = insertSheetIfNotExist(SS, "FixedRefs", true)

    ListSheetBroken.clear()
    ListSheetBroken.appendRow(["last Run: ", currentDate])

    ListSheetFixed.clear()
    ListSheetFixed.appendRow(["last Run: ", currentDate])
    // if scoring sheet is integrated into DC, create Points sheet

    var hasOpCom = Company.hasOpCom

    // fetch number of Services once
    var companyNumberOfServices = Company.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        var currentClass = IndicatorsObj.indicatorClasses[i]

        repairDCSheetByCategory(SS, currentClass, Company, ResearchStepsObj, companyNumberOfServices, hasOpCom, includeRGuidanceLink, ListSheetBroken, ListSheetFixed)
    }

}