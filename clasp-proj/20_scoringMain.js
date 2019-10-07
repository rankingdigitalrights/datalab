// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

// --- CONFIG --- //

var firstScoringStep = 3 // TODO: move to config

var companyHasOpCom // TODO: move inside module

// --------------- This is the main caller ---------------- //
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

    var configObj = importLocalJSON("config")
    // var CompanyObj = importLocalJSON(companyShortName)
    var CompanyObj = companyObj // TODO this a JSON Obj now; adapt in scope
    var IndicatorsObj = importLocalJSON("indicators", indicatorSubset)
    var ResearchStepsObj = importLocalJSON("researchSteps", stepsSubset)

    var maxScoringStep = 4 // TODO turn into parameter

    companyHasOpCom = CompanyObj.opCom

    Logger.log(companyShortName + "opCom? - " + companyHasOpCom)

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

    var sheet = insertSheetIfNotExist(file, 'Outcome')
    if (!sheet) {
        sheet = file.getSheetByName('Outcome')
        sheet.clear()
        sheet = clearAllNamedRangesFromSheet(sheet)
    }



    firstSheet.hideSheet() // hide points - only possible after 2nd sheet exists

    var lastRow
    var numberOfColumns = (CompanyObj.numberOfServices + 2) * IndicatorsObj.indicatorClasses[0].components.length + 1

    // For all Research Steps
    // obvs limited to fixed Nr atm
    for (var stepNr = firstScoringStep; stepNr < maxScoringStep; stepNr++) {

        var thisStep = ResearchStepsObj.researchSteps[stepNr]
        Logger.log("stepNr: " + stepNr)

        var activeRow = 1
        var activeCol = 1

        // -- // add Step Header to top-left cell // -- //
        // TODO: refactor to components
        sheet.getRange(activeRow, activeCol).setValue(companyShortName).setFontWeight("bold").setBackground("#b7e1cd").setFontSize(14)

        sheet.getRange(activeRow, activeCol+1).setValue(thisStep.labelShort).setFontWeight("bold").setFontSize(14)

        sheet.setColumnWidth(activeCol, 200)

        // For all Indicator Categories
        for (var indCatNr = 0; indCatNr < IndicatorsObj.indicatorClasses.length; indCatNr++) {

            var thisCategory = IndicatorsObj.indicatorClasses[indCatNr]
            // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
            var nrOfIndSubComps = 1

            if (thisCategory.hasSubComponents == true) {
                nrOfIndSubComps = thisCategory.components.length
            }

            // For all Indicators
            for (var indicatNr = 0; indicatNr < thisCategory.indicators.length; indicatNr++) {

                var thisIndicator = thisCategory.indicators[indicatNr]

                Logger.log('begin Indicator: ' + thisIndicator.labelShort)

                // variable used for indicator average later

                var indicatorAverageCompanyElements = []
                var indicatorAverageServicesElements = []
                var indicatorAverageElements = []

                // set up header / TODO: remove from steps JSON. Not a component. This is Layout

                activeRow = activeRow + 1
                activeRow = setCompanyHeader(activeRow, activeCol, sheet, thisIndicator, nrOfIndSubComps, thisCategory, CompanyObj)
                Logger.log("Header row printed for " + thisIndicator.labelShort)

                // for all components of the current Research Step
                for (var stepCompNr = 0; stepCompNr < thisStep.components.length; stepCompNr++) {

                    Logger.log("beginn stepCompNr: " + stepCompNr)

                    var stepComponent = thisStep.components[stepCompNr].type


                    switch (stepComponent) {

                        case "elementDropDown":
                            activeRow = importElementData(activeRow, activeCol, sheet, thisStep, stepCompNr, thisIndicator, CompanyObj, nrOfIndSubComps, thisCategory)

                            Logger.log(stepComponent + " added for: " + thisIndicator.labelShort)
                            break

                        case "comments":
                            activeRow = importElementData(activeRow, activeCol, sheet, thisStep, stepCompNr, thisIndicator, CompanyObj, nrOfIndSubComps, thisCategory)

                            Logger.log(stepComponent + " added for: " + thisIndicator.labelShort)
                            break

                        case "sources":
                            activeRow = importSources(activeRow, activeCol, sheet, thisStep, stepCompNr, thisIndicator, CompanyObj, nrOfIndSubComps, thisCategory)
                            Logger.log("sources added for: " + thisIndicator.labelShort)
                            break

                        default:
                            sheet.appendRow(["!!!You missed a component!!!"])
                            break
                    }
                }

                activeRow = activeRow + 1

                // ADD SCORING AFTER ALL OTHER COMPONENTS
                activeRow = addElementScores(file, sheetMode, activeRow, activeCol, sheet, thisStep.labelShort, stepCompNr, thisIndicator, CompanyObj, nrOfIndSubComps, thisCategory)

                activeRow = addLevelScores(file, sheetMode, activeRow, activeCol, sheet, thisStep.labelShort, stepCompNr, thisIndicator, CompanyObj, nrOfIndSubComps, thisCategory, indicatorAverageCompanyElements, indicatorAverageServicesElements)

                activeRow = addCompositeScores(file, sheetMode, activeRow, activeCol, sheet, thisStep.labelShort, thisIndicator, CompanyObj, nrOfIndSubComps, indicatorAverageCompanyElements, indicatorAverageServicesElements, indicatorAverageElements)

                activeRow = addIndicatorScore(file, sheetMode, activeRow, activeCol, sheet, thisStep.labelShort, thisIndicator, CompanyObj, indicatorAverageElements)
            }
        }
    lastRow = activeRow
    sheet.getRange(1, 1, lastRow, numberOfColumns).setFontFamily("Roboto")

    }
    return fileID
}
