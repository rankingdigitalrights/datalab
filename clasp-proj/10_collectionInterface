// --- Spreadsheet Casting: Company Data Collection Sheet --- //

// --- CONFIG --- //

var importedOutcomeTabName = "2018 Outcome"

// --- //  This is the main caller // --- //

/**
 * 
 * @param {boolean} stepsSubset Parameter: subset reserachSteps.json?
 * @param {boolean} indicatorSubset Parameter: subset indicators.json?
 * @param {string} companyShortName small caps short company name for <company>.json
 * @param {string} filenameSuffix arbitary String for versioning ("v8") or declaring ("test")
 */

function createSpreadsheetDC(stepsSubset, indicatorSubset, companyObj, filenameSuffix) {
    Logger.log('begin main data collection')

    var sheetMode = "DC" // TODO
    var sourcesTabName = "Sources"
    var colWidth = 280 //TODO: Move to central  style config

    var companyShortName = companyObj.label.current

    Logger.log("creating " + sheetMode + ' Spreadsheet for ' + companyShortName)

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    // var configObj = importLocalJSON("config")
    var configObj = centralConfig
    // var CompanyObj = importLocalJSON(companyShortName)
    var CompanyObj = companyObj // TODO this a JSON Obj now; adapt in scope
    // var IndicatorsObj = importLocalJSON("indicators", indicatorSubset)
    var IndicatorsObj = indicatorsVector
    // var ResearchStepsObj = importLocalJSON("researchSteps", stepsSubset)
    var ResearchStepsObj = researchStepsVector

    // creating a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(companyShortName, sheetMode, filenameSuffix)
    //   var file = SpreadsheetApp.create(spreadsheetName)
    var file = connectToSpreadsheetByName(spreadsheetName)

    var fileID = file.getId()
    Logger.log("File ID: " + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    var externalFormula = '=IMPORTRANGE("' + configObj.prevIndexSSID + '","' + CompanyObj.tabPrevYearsOutcome + '!' + 'A:Z' + '")'

    // first Sheet already exist, so set it to active and rename
    var firstSheet = file.getActiveSheet()

    if (centralConfig.YearOnYear) {
        firstSheet.setName(importedOutcomeTabName) // <-- will need to make this dynamic at some point
        var cell = firstSheet.getActiveCell()
        cell.setValue(externalFormula.toString())
    } else {
        firstSheet.setName(sourcesTabName)
    }

    // --- // creates sources page // --- //
    var sourcesSheet = insertSheetIfNotExist(file, sourcesTabName); // make this dynamic
    sourcesSheet.clear()

    var hasOpCom = CompanyObj.opCom

    // fetch number of Services once
    var companyNumberOfServices = CompanyObj.services.length

    // for each Indicator Class do

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        var currentClass = IndicatorsObj.indicatorClasses[i]

        Logger.log("Starting " + currentClass.labelLong)
        Logger.log("Passing over " + ResearchStepsObj.length + " Steps")
        populateDCSheetByCategory(file, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, colWidth, hasOpCom)

        Logger.log("Completed " + currentClass.labelLong)
    }

    Logger.log('end main')
    Logger.log(sheetMode + ' Spreadsheet created for ' + companyShortName)
    return fileID
}
