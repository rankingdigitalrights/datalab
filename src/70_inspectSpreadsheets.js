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

function processCompanyHealth(ListSheetBroken, Company, filenamePrefix, filenameSuffix, mainSheetMode) {

    var companyShortName = cleanCompanyName(Company)
    Logger.log("--- // --- begin processing " + companyShortName + " --- // ---")

    var Indicators = IndicatorsObj
    var ResearchStepsObj = researchStepsVector
    var includeRGuidanceLink = Config.includeRGuidanceLink

    // connect to Company Input Spreadsheet

    var SS = openSpreadsheetByID(Company.urlCurrentDataCollectionSheet)

    // skip if company spreadsheet does not exist
    if (SS === null) {
        Logger.log("!!!ERROR!!! : " + companyShortName + " does not exist. Skipping.")
        return null
    }

    var currentDate = getISOtimeAsString()

    ListSheetBroken.appendRow([currentDate, companyShortName, Company.urlCurrentDataCollectionSheet])

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    Logger.log("FLOW --- begin Inspection " + companyShortName + " --- // ---")

    inspectInputSheet(SS, ListSheetBroken)

}
