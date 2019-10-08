// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

// --------------- This is the Main Scoring Process Caller ---------------- //
/**
 * 
 * @param {boolean} stepsSubset Parameter: subset reserachSteps.json?
 * @param {boolean} indicatorSubset Parameter: subset indicators.json?
 * @param {string} companyShortName small caps short company name for <company>.json
 * @param {string} filenameSuffix arbitary String for versioning ("v8") or declaring ("test")
 */

function createSpreadsheetSC(stepsSubset, indicatorSubset, companyObj, filenameSuffix) {

    var sheetMode = "SC"

    var companyShortName = companyObj.label.current
    Logger.log('begin main Scoring for ' + companyShortName)
    Logger.log("creating " + sheetMode + ' Spreadsheet for ' + companyShortName)

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var configObj = centralConfig // var configObj = importLocalJSON("config")
    var CompanyObj = companyObj // TODO this a JSON Obj now; adapt in scope
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var pilotMode = configObj.pilotMode
    var firstScoringStep = configObj.firstScoringStep
    var maxScoringStep
    if(configObj.maxScoringStep) {
        maxScoringStep = configObj.maxScoringStep + 1
    } else {
        maxScoringStep = ResearchStepsObj.researchSteps.length
    }

    var companyHasOpCom = CompanyObj.opCom

    Logger.log(companyShortName + " opCom? - " + companyHasOpCom)

    // Mode A: creating a blank spreadsheet
    // var filename = spreadSheetFileName(companyShortName, sheetMode, filenameSuffix)

    // Mode B: instead of creating a new sheet on every run, re-use
    // THIS IS DANGEROUS //
    // HIDDEN CACHE ADVENTURES ARE WAITING FOR YOU //
    // i.e. Named Ranges are not reset upon casting

    var spreadsheetName = spreadSheetFileName(companyShortName, sheetMode, filenameSuffix)
    var file = connectToSpreadsheetByName(spreadsheetName)
    var fileID = file.getId()

    // creates Outcome  page
    var firstSheet = file.getSheets()[0]
    firstSheet.setName('Points')
    firstSheet.clear()

    // Scoring Scheme / Validation
    // TODO Refactor to module and values to i.e. config.JSON
    firstSheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"])
    firstSheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude"])
    firstSheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude"])

    // var to estimate max sheet width in terms of columns based on whether G has subcomponents. This is need for formatting the whole sheet at end of script. More performant than using getLastCol() esp. when executed per Sheet (think 45 indicators)

    var globalNrOfComponents = 1

    if (IndicatorsObj.indicatorClasses[0].components) {
        globalNrOfComponents = IndicatorsObj.indicatorClasses[0].components.length
    }

    var numberOfColumns = (CompanyObj.numberOfServices + 2) * globalNrOfComponents + 1

    // --- // MAIN Procedure // --- //
    // For all Research Steps
    // For each main step
    var sheetName
    var subStepNr

    if (pilotMode) {
        subStepNr = 1
        sheetName = configObj.notesSheetname
    } else {
        subStepNr = 0
        if (configObj.includeScoring) {
            sheetName = configObj.scoringSheetname
        } else {
            sheetName = configObj.feedbackSheetname
        }
    }

    var lastCol = 1
    var blocks = 1

    for (var mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        var thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]
        Logger.log("--- Main Step : " + thisMainStep.step + " ---")
        // var subStepsLength = thisMainStep.substeps.length

        // setting up all the substeps for all the indicators
        
        lastCol = addSingleMainScoringStep(file, sheetName, subStepNr, lastCol, configObj, pilotMode, IndicatorsObj, sheetMode, thisMainStep, CompanyObj, numberOfColumns, companyHasOpCom, blocks)
        blocks++

    } // END MAIN STEP



    firstSheet.hideSheet() // hide points - only possible after a 2nd sheet exists

    return fileID
}
