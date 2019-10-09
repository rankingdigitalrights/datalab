// --- Spreadsheet Casting: Company Data Collection Sheet --- //

// --- CONFIG --- //

var importedOutcomeTabName = "2018 Outcome"

// --- //  This is the main caller // --- //

function createSpreadsheetDC(stepsSubset, indicatorSubset, companyObj, filenameSuffix, mainSheetMode) {
    Logger.log('begin main data collection')

    var sheetMode = mainSheetMode
    
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
    var doCollapseAll = configObj.collapseAllGroups
      
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
    var sourcesSheet = insertSheetIfNotExist(file, sourcesTabName, false)
    if (sourcesSheet !== null) {
        sourcesSheet.clear()
        sourcesSheet.appendRow(["Source reference number", "Document title", "URL", "Date of document\n(if applicable)", "Date accessed", "Saved source link (DEPRECATE)", "Internet Archive", "Has this policy changed from the previous year's Index?"])
        sourcesSheet.getRange(1, 1, 1, sourcesSheet.getLastColumn())
            .setFontWeight("bold")
            .setFontFamily("Roboto")
            .setVerticalAlignment("top")
            .setHorizontalAlignment("center")
            .setWrap(true)
            .setFontSize(12)
        sourcesSheet.setColumnWidths(1, sourcesSheet.getLastColumn(), 200)

    }

    var companyHasOpCom = CompanyObj.opCom

    // fetch number of Services once
    var companyNumberOfServices = CompanyObj.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        var currentClass = IndicatorsObj.indicatorClasses[i]

        Logger.log("Starting " + currentClass.labelLong)
        Logger.log("Passing over " + ResearchStepsObj.researchSteps.length + " Steps")
        populateDCSheetByCategory(file, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, localColWidth, companyHasOpCom, doCollapseAll)

        Logger.log("Completed " + currentClass.labelLong)
    }

    Logger.log('end DC main')

    // --- // PROTO // --- //
    // Feedback Collector comes here
    var pointsSheet = insertSheetIfNotExist(file, "Points", true)
    pointsSheet.clear()
    pointsSheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"])
    pointsSheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude"])
    pointsSheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude"])
    pointsSheet.hideSheet()

    var isLocalImport = true
    addSetOfScoringSteps(file, sheetMode, configObj, IndicatorsObj, ResearchStepsObj, CompanyObj, companyHasOpCom, isLocalImport)

    Logger.log(sheetMode + ' Spreadsheet created for ' + companyShortName)
    return fileID
}
