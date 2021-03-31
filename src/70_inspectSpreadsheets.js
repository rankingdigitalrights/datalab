/** Collects all broken named range references (#REF) from a Input Spreadsheet
 * writes all broken ranges rowwise per Indicator
 * into monitoring Spreadsheet
 * use it to identify which atomic Steps/Indicators
 * need to be repaired for which Company
 */

/* global
    cleanCompanyName,
    openSpreadsheetByID,
    getISOtimeAsString,
    inspectInputSheet
*/

// eslint-disable-next-line no-unused-vars
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
    console.log('FLOW --- begin Inspection ' + companyShortName + ' --- // ---')
    inspectInputSheet(SS, ListSheetBroken)
}
