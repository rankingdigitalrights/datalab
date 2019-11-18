// --- Spreadsheet Casting: Company Data Collection Sheet --- //

// --- //  This is the main caller // --- //

function createSpreadsheetDC(useStepsSubset, useIndicatorSubset, companyObj, filenamePrefix, filenameSuffix, mainSheetMode) {
    Logger.log('--- // --- begin main data collection --- // ---')

    var sheetMode = mainSheetMode

    var sourcesTabName = "Sources"

    var companyShortName
    if (companyObj.label.altFilename) {
        companyShortName = companyObj.label.altFilename
    } else {
        companyShortName = companyObj.label.current
    }

    Logger.log("--- // --- creating " + sheetMode + ' Spreadsheet for ' + companyShortName + " --- // ---")

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var configObj = centralConfig // var configObj = importLocalJSON("config")
    var CompanyObj = companyObj // TODO this a JSON Obj now; adapt in scope
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var serviceColWidth = configObj.serviceColWidth
    var doCollapseAll = configObj.collapseAllGroups
    var integrateOutputs = configObj.integrateOutputs
    var includeScoring = configObj.includeScoring
    var importedOutcomeTabName = configObj.prevYearOutcomeTab
    var includeRGuidanceLink = configObj.includeRGuidanceLink
    var collapseRGuidance = configObj.collapseRGuidance


    // connect to existing spreadsheet or creat a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(filenamePrefix, sheetMode, companyShortName, filenameSuffix)
    //   var file = SpreadsheetApp.create(spreadsheetName)
    var file = connectToSpreadsheetByName(spreadsheetName)

    var fileID = file.getId()
    Logger.log("File ID: " + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    var externalFormula = '=IMPORTRANGE("' + configObj.prevIndexSSID + '","' + CompanyObj.tabPrevYearsOutcome + '!' + 'A:Z' + '")'

    // if an empty Sheet exists, track and delete later
    var emptySheet = file.getSheetByName("Sheet1")
    var hasEmptySheet

    if (emptySheet) {
        hasEmptySheet = true
    } else {
        hasEmptySheet = false
    }

    var newSheet
    
    // if set in configObj, import previous Index Outcome
    if (centralConfig.YearOnYear) {
        newSheet = insertSheetIfNotExist(file, importedOutcomeTabName, false)
        if (newSheet !== null) {
            fillPrevOutcomeSheet(newSheet, importedOutcomeTabName)
        }
    }

    // --- // creates sources page // --- //

    newSheet = insertSheetIfNotExist(file, sourcesTabName, false)
    if (newSheet !== null) {
        fillSourceSheet(newSheet, sourcesTabName)
    }

    // if scoring sheet is integrated into DC, create Points sheet

    if (integrateOutputs && includeScoring) {
        var pointsSheet = insertSheetIfNotExist(file, "Points", false)
        if (pointsSheet !== null) {
            fillPointsSheet(pointsSheet, "Points")
            pointsSheet.hideSheet()
        }
    }

    // if existing, remove first empty sheet
    if (hasEmptySheet) {
        file.deleteSheet(emptySheet)
    }

    var hasOpCom = CompanyObj.hasOpCom

    // fetch number of Services once
    var companyNumberOfServices = CompanyObj.services.length

    // --- // MAIN TASK // --- //
    // for each Indicator Class do

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        var currentClass = IndicatorsObj.indicatorClasses[i]

        Logger.log("Starting " + currentClass.labelLong)
        Logger.log("Passing over " + ResearchStepsObj.researchSteps.length + " Steps")

        populateDCSheetByCategory(file, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, serviceColWidth, hasOpCom, doCollapseAll, includeRGuidanceLink, collapseRGuidance)

        Logger.log("Completed " + currentClass.labelLong)
    }

    Logger.log('end DC main')

    // TODO: vectorize more output here
    if (integrateOutputs) {
        Logger.log("Adding Extra Sheet (Scoring / Feedback / Notes")
        var isLocalImport = integrateOutputs
        addSetOfScoringSteps(file, "SC", configObj, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, isLocalImport)

        Logger.log("Extra Sheet added")
    }


    Logger.log(sheetMode + ' Spreadsheet created for ' + companyShortName)
    return fileID
}
