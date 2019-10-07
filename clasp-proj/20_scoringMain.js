// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

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

    var configObj = centralConfig // var configObj = importLocalJSON("config")
    var CompanyObj = companyObj // TODO this a JSON Obj now; adapt in scope
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var firstScoringStep = configObj.firstScoringStep
    var maxScoringStep = configObj.maxScoringStep

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

    var sheet = insertSheetIfNotExist(file, 'Outcome for CompFeedback', true)
    if (sheet != null) {
        sheet.clear()
        sheet = clearAllNamedRangesFromSheet(sheet)
    }

    firstSheet.hideSheet() // hide points - only possible after a 2nd sheet exists

    var lastRow

    // var to estimate max sheet width in terms of columns based on whether G has subcomponents. This is need for formatting the whole sheet at end of script. More performant than using getLastCol() esp. when executed per Sheet (think 45 indicators)

    var globalNrOfComponents = 1

    if (IndicatorsObj.indicatorClasses[0].components) {
        globalNrOfComponents = IndicatorsObj.indicatorClasses[0].components.length
    }

    var numberOfColumns = (CompanyObj.numberOfServices + 2) * globalNrOfComponents + 1

    // For all Research Steps
    // for each main step
    for (var mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        var thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]
        // setting up all the substeps for all the indicators

        Logger.log("main step : " + thisMainStep.step)
        // var subStepsLength = thisMainStep.substeps.length
        var subStepsLength = 1
        Logger.log("main step has # subsetps: " + thisMainStep.step)

        // --- // Begin sub-Step-Wise Procedure // --- //
        // for each substep
        // obvs limited to fixed Nr atm
        for (var subStepNr = 0; subStepNr < subStepsLength; subStepNr++) {

            var currentStep = thisMainStep.substeps[subStepNr]
            Logger.log("substep : " + currentStep.labelShort)

            var currentStepClength = currentStep.components.length

            var activeRow = 1
            var activeCol = 1

            // -- // add Step Header to top-left cell // -- //
            // TODO: refactor to components
            sheet.getRange(activeRow, activeCol).setValue(companyShortName).setFontWeight("bold").setBackground("#b7e1cd").setFontSize(14)

            sheet.getRange(activeRow, activeCol + 1).setValue(currentStep.labelShort).setFontWeight("bold").setFontSize(14)

            sheet.setColumnWidth(activeCol, 200)

            // For all Indicator Categories
            for (var indCatNr = 0; indCatNr < IndicatorsObj.indicatorClasses.length; indCatNr++) {

                var thisCategory = IndicatorsObj.indicatorClasses[indCatNr]
                // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
                Logger.log("begin Indicator Category: " + thisCategory.labelLong)
                var nrOfIndSubComps = 1

                if (thisCategory.hasSubComponents == true) {
                    nrOfIndSubComps = thisCategory.components.length
                }

                // For all Indicators
                for (var indicatNr = 0; indicatNr < thisCategory.indicators.length; indicatNr++) {

                    var thisIndicator = thisCategory.indicators[indicatNr]

                    Logger.log('begin Indicator: ' + thisIndicator.labelShort)

                    // variable used for indicator average later

                    var indyLevelScoresCompany = []
                    var indyLevelScoresServices = []
                    var indyCompositeScores = []

                    // set up header / TODO: remove from steps JSON. Not a component. This is Layout

                    activeRow = activeRow + 1
                    activeRow = setCompanyHeader(activeRow, activeCol, sheet, thisIndicator, nrOfIndSubComps, thisCategory, CompanyObj)
                    Logger.log(' - company header added for ' + thisIndicator.labelShort)

                    // for all components of the current Research Step
                    for (var stepCompNr = 0; stepCompNr < currentStep.components.length; stepCompNr++) {

                        var stepComponent = currentStep.components[stepCompNr].type
                        Logger.log(" - beginn stepCompNr: " + stepCompNr + ' - ' + stepComponent)


                        switch (stepComponent) {

                            case "elementResults":
                                activeRow = importElementData(activeRow, activeCol, sheet, currentStep, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory)
                                Logger.log(' - ' + stepComponent + " added for: " + thisIndicator.labelShort)
                                break

                            case "elementComments":
                                activeRow = importElementData(activeRow, activeCol, sheet, currentStep, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom,nrOfIndSubComps, thisCategory)
                                Logger.log(' - ' + stepComponent + " added for: " + thisIndicator.labelShort)
                                break

                            case "sources":
                                activeRow = importSources(activeRow, activeCol, sheet, currentStep, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory)
                                Logger.log(' - ' + "sources added for: " + thisIndicator.labelShort)
                                break
                            
                            // case "sources":
                            //     activeRow = importSources(activeRow, activeCol, sheet, currentStep, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory)
                            //     Logger.log(' - ' + "sources added for: " + thisIndicator.labelShort)
                            //     break

                            default:
                                sheet.appendRow(["!!!You missed a component!!!\nThis means either \n a) a research step component is not covered by a switch-case statement, or \n b) there is a runtime error"])
                                break
                        }
                    }
                    activeRow = activeRow + 1

                    // ADD SCORING AFTER ALL OTHER COMPONENTS

                    if(configObj.includeScoring) {
                    activeRow = addElementScores(file, sheetMode, activeRow, activeCol, sheet, currentStep.labelShort, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory)
                    Logger.log(' - ' + 'element scores added for ' + thisIndicator.labelShort)

                    activeRow = addLevelScores(file, sheetMode, activeRow, activeCol, sheet, currentStep.labelShort, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory, indyLevelScoresCompany, indyLevelScoresServices)
                    Logger.log(' - ' + "level scores added for " + thisIndicator.labelShort)

                    activeRow = addCompositeScores(file, sheetMode, activeRow, activeCol, sheet, currentStep.labelShort, thisIndicator, CompanyObj, nrOfIndSubComps, indyLevelScoresCompany, indyLevelScoresServices, indyCompositeScores)
                    Logger.log(' - ' + "composite scores added for " + thisIndicator.labelShort)

                    activeRow = addIndicatorScore(file, sheetMode, activeRow, activeCol, sheet, currentStep.labelShort, thisIndicator, CompanyObj, indyCompositeScores)
                    Logger.log(' - ' + "indicator score added for " + thisIndicator.labelShort)

                } else {
                    activeRow -= 1
                }

                } // END INDICATOR
            } // END INDICATOR CATEGORY
        } // END SUB STEP
    } // END MAIN STEP

    Logger.log("Formatting Sheet")
    lastRow = activeRow
    sheet.getRange(1, 1, lastRow, numberOfColumns).setFontFamily("Roboto")

    return fileID
}
