// --- Spreadsheet Casting: Company Data Collection Sheet --- //

/* global
        cleanCompanyName,
        Config,
        IndicatorsObj,
        researchStepsVector,
        spreadSheetFileName,
        openSpreadsheetByID,
        getISOtimeAsString,
        inspectInputSheet
*/

function processCompanyHealth(ListSheetBroken, ListSheetFixed, Company, filenamePrefix, filenameSuffix, mainSheetMode, doRepairs) {

    var companyShortName = cleanCompanyName(Company)
    Logger.log("--- // --- begin processing " + companyShortName + " --- // ---")

    var Indicators = IndicatorsObj
    var ResearchStepsObj = researchStepsVector
    var includeRGuidanceLink = Config.includeRGuidanceLink

    // connect to Company Input Spreadsheet

    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    var SS = openSpreadsheetByID(Company.urlCurrentDataCollectionSheet)

    // skip if company spreadsheet does not exist
    if (SS === null) {
        Logger.log("!!!ERROR!!! : " + spreadsheetName + " does not exist. Skipping.")
        return null
    }

    var currentDate = getISOtimeAsString()

    ListSheetBroken.appendRow([currentDate, companyShortName])

    if (ListSheetFixed !== null) {
        ListSheetFixed.appendRow([currentDate, companyShortName])
    }

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    Logger.log("FLOW --- begin Inspection " + companyShortName + " --- // ---")

    inspectInputSheet(SS, ListSheetBroken)

    // processInputSheet(SS, Indicators, Company, ResearchStepsObj, includeRGuidanceLink, ListSheetBroken, ListSheetFixed, doRepairs)

}
