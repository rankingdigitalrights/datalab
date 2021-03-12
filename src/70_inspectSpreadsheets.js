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

function processCompanyHealth(ListSheetBroken, Company) {
    var companyShortName = cleanCompanyName(Company)
    console.log('--- // --- begin processing ' + companyShortName + ' --- // ---')

    // connect to Company Input Spreadsheet

    var SS = openSpreadsheetByID(Company.urlCurrentInputSheet)

    // skip if company spreadsheet does not exist
    if (SS === null) {
        console.log('!!!ERROR!!! : ' + companyShortName + ' does not exist. Skipping.')
        return null
    }

    var currentDate = getISOtimeAsString()

    ListSheetBroken.appendRow([currentDate, companyShortName, Company.urlCurrentInputSheet])

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    console.log('FLOW --- begin Inspection ' + companyShortName + ' --- // ---')

    inspectInputSheet(SS, ListSheetBroken)
}
