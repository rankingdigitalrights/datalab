// --- Spreadsheet Casting: Company Data Collection Sheet --- //

/* global
        cleanCompanyName,
        centralConfig,
        indicatorsVector,
        researchStepsVector,
        spreadSheetFileName,
        createSpreadsheet,
        getISOtimeAsString,
        processInputSheet
*/

function processHealthSingleSpreadsheet(ListSheetBroken, ListSheetFixed, Company, filenamePrefix, filenameSuffix, mainSheetMode, doRepairs) {

    var companyShortName = cleanCompanyName(Company)
    Logger.log("--- // --- begin repairing " + companyShortName + " --- // ---")

    var Config = centralConfig
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector
    var includeRGuidanceLink = Config.includeRGuidanceLink

    // connect to Company Input Spreadsheet

    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    var companySS = createSpreadsheet(spreadsheetName, false)

    // skip if company spreadsheet does not exist
    if (companySS === null) {
        Logger.log("!!!ERROR!!! : " + spreadsheetName + " does not exist. Skipping.")
        return null
    }

    var currentDate = getISOtimeAsString()

    ListSheetBroken.appendRow([companyShortName, currentDate])

    if (ListSheetFixed !== null) {
        ListSheetFixed.appendRow([companyShortName, currentDate])
    }

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    processInputSheet(companySS, IndicatorsObj, Company, ResearchStepsObj, includeRGuidanceLink, ListSheetBroken, ListSheetFixed, doRepairs)

}