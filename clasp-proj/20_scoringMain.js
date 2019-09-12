// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

// --- CONFIG --- //

var firstScoringStep = 3 // TODO: move to config

var companyHasOpCom // TODO: move inside module

// later move to central config //

// --------------- This is the main caller ---------------- //

// TODO: type def

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


    Logger.log("ResearchStepsObj: " + ResearchStepsObj)
    Logger.log("ResearchStepsObj.length: " + ResearchStepsObj.researchSteps.length)
    Logger.log("IndicatorsObj: " + IndicatorsObj)

    var maxScoringStep = 5 // TODO turn into parameter

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

    // creates Outcome  page
    var sheet = file.getSheets()[0]
    sheet.setName('Points')
    sheet.clear()

    // Scoring Scheme / Validation
    // TODO Refactor to module
    sheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"])
    sheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude"])
    sheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude"])

    sheet = insertSheetIfNotExist(file, 'Outcome')
    sheet.clear()
    sheet = clearAllNamedRangesFromSheet(sheet)

    // For all Research Steps
    for (var currentStep = firstScoringStep; currentStep < maxScoringStep - 1; currentStep++) {

        Logger.log("currentStep: " + currentStep)

        // -- // add Step Header to top-left cell // -- //
        // TODO: refactor to components
        var activeRow = 1
        var activeCol = 1

        sheet.getRange(activeRow, activeCol).setValue(companyShortName).setFontWeight("bold").setBackground("#b7e1cd").setFontSize(14)

        sheet.getRange(activeRow, activeCol+1).setValue(ResearchStepsObj.researchSteps[currentStep].labelShort).setFontWeight("bold").setFontSize(14)

        sheet.setColumnWidth(activeCol, 200)

        // For all Indicator Categories
        for (var currentIndicatorCat = 0; currentIndicatorCat < IndicatorsObj.indicatorClasses.length; currentIndicatorCat++) {

            // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
            var numberOfIndicatorCatSubComponents = 1

            if (IndicatorsObj.indicatorClasses[currentIndicatorCat].hasSubComponents == true) {
                numberOfIndicatorCatSubComponents = IndicatorsObj.indicatorClasses[currentIndicatorCat].components.length
            }

            // For all Indicators
            for (var currentIndicator = 0; currentIndicator < IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators.length; currentIndicator++) {

                Logger.log('begin Indicator: ' + IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator].labelShort)

                // variable used for indicator average later

                var indicatorAverageCompanyElements = []
                var indicatorAverageServicesElements = []
                var indicatorAverageElements = []

                // set up header / TODO: remove from steps JSON. Not a component. This is Layout

                activeRow = activeRow + 1
                activeRow = setCompanyHeader(activeRow, activeCol, sheet, IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator], IndicatorsObj.indicatorClasses[currentIndicatorCat], CompanyObj)
                Logger.log("Header row printed for " + IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator].labelShort)

                // for all components of the current Research Step
                for (var currentStepComponent = 0; currentStepComponent < ResearchStepsObj.researchSteps[currentStep].components.length; currentStepComponent++) {

                    Logger.log("beginn currentStepComponent: " + currentStepComponent)

                    var stepComponent = ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type

                    switch (stepComponent) {

                        case "elementDropDown":
                            activeRow = importElementResults(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClasses[currentIndicatorCat])
                            Logger.log("results added for: " + IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator].labelShort)
                            break

                        case "comments":
                            activeRow = importComments(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator], CompanyObj)
                            Logger.log("comments added for: " + IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator].labelShort)
                            break

                        case "sources":
                            activeRow = importSources(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator], CompanyObj)
                            Logger.log("sources added for: " + IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator].labelShort)
                            break

                        default:
                            sheet.appendRow(["!!!You missed a component!!!"])
                            break
                    }
                }

                activeRow = activeRow + 1

                // ADD SCORING AFTER ALL OTHER COMPONENTS
                activeRow = addElementScores(file, sheetMode, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep].labelShort, currentStepComponent, IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClasses[currentIndicatorCat])

                activeRow = addLevelScores(file, sheetMode, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep].labelShort, currentStepComponent, IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClasses[currentIndicatorCat], indicatorAverageCompanyElements, indicatorAverageServicesElements)

                activeRow = addCompositeScores(file, sheetMode, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep].labelShort, IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, indicatorAverageCompanyElements, indicatorAverageServicesElements, indicatorAverageElements)

                activeRow = addIndicatorScore(file, sheetMode, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep].labelShort, IndicatorsObj.indicatorClasses[currentIndicatorCat].indicators[currentIndicator], CompanyObj, indicatorAverageElements)
            }
        }
    }
}
