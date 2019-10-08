// --- Spreadsheet Casting: Company Data Collection Sheet --- //

// --- CONFIG --- //

var importedOutcomeTabName = "2018 Outcome"

// --- //  This is the main caller // --- //

function createSpreadsheetDC(stepsSubset, indicatorSubset, companyObj, filenameSuffix) {
    Logger.log('begin main data collection')

    var sheetMode = "DC" // TODO
    var sourcesTabName = "Sources"
    var companyShortName = companyObj.label.current

    Logger.log("creating " + sheetMode + ' Spreadsheet for ' + companyShortName)

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var configObj = centralConfig // var configObj = importLocalJSON("config")
    var CompanyObj = companyObj // TODO this a JSON Obj now; adapt in scope
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var localColWidth = configObj.serviceColWidth
    var doCollapse = configObj.collapseGroups
      
    // connect to existing spreadsheet or creat a blank spreadsheet
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
        firstSheet.setName(importedOutcomeTabName)
        var cell = firstSheet.getActiveCell()
        cell.setValue(externalFormula.toString())
    } else {
        firstSheet.setName(sourcesTabName)
    }

    // --- // creates sources page // --- //
    var sourcesSheet = insertSheetIfNotExist(file, sourcesTabName, true)
    sourcesSheet.clear()
    sourcesSheet.appendRow(["Source reference number","Document title","URL","Date of document\n(if applicable)","Date accessed","Saved source link (DEPRECATE)","Internet Archive", "Has this policy changed from the previous year's Index?"])
    sourcesSheet.getRange(1,1,1,sourcesSheet.getLastColumn())
        .setFontWeight("bold")
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
        .setHorizontalAlignment("center")
        .setWrap(true)
        .setFontSize(12)
    sourcesSheet.setColumnWidths(1,sourcesSheet.getLastColumn(), 200)

    var hasOpCom = CompanyObj.opCom

    // fetch number of Services once
    var companyNumberOfServices = CompanyObj.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        var currentClass = IndicatorsObj.indicatorClasses[i]

        Logger.log("Starting " + currentClass.labelLong)
        Logger.log("Passing over " + ResearchStepsObj.researchSteps.length + " Steps")
        populateDCSheetByCategory(file, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, localColWidth, hasOpCom, doCollapse)

        Logger.log("Completed " + currentClass.labelLong)
    }

    Logger.log('end DC main')

    // --- // PROTO // --- //
    // Feedback Collector comes here
    addNotesSheet(file, IndicatorsObj, CompanyObj, ResearchStepsObj, companyNumberOfServices, localColWidth, hasOpCom)
    
    Logger.log(sheetMode + ' Spreadsheet created for ' + companyShortName)
    return fileID
}
