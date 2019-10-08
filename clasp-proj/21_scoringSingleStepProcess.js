function addSingleScoringStep(file, sheetName, subStepNr, lastCol, configObj, pilotMode, IndicatorsObj, sheetMode, thisMainStep, CompanyObj, numberOfColumns, companyHasOpCom, blocks) {

    var companyShortName = CompanyObj.label.current

    // var subStepsLength = thisMainStep.substeps.length
    var subStepsLength = 1
    // var sheetName = 'Outcome_' + thisSubStep.labelShort


    var thisSubStep = thisMainStep.substeps[subStepNr]
    var thisSubStepLabel = thisSubStep.labelShort

    Logger.log("Inserting Sheet " + sheetName)
    var sheet = insertSheetIfNotExist(file, sheetName, true)
    // if (sheet != null) {
    //     sheet.clear()
    //     sheet = clearAllNamedRangesFromSheet(sheet)
    // }

    var firstCol = lastCol
    var activeCol = firstCol
    var activeRow = 1
    var lastRow

    // var lastCol = numberOfColumns

    // --- // Begin sub-Step-Wise Procedure // --- //
    // for each substep
    // obvs limited to fixed Nr atm
    // for (subStepNr; subStepNr < subStepsLength + subStepNr; subStepNr++) {


    Logger.log("--- Main Step has " + thisMainStep.substeps.length + ' Substeps')
    Logger.log("--- Beginning Substep " + thisSubStepLabel)

    // set up header / TODO: remove from steps JSON. Not a component. This is Layout

    activeRow = setSheetHeader(activeRow, activeCol, sheet, companyShortName, thisSubStepLabel, blocks)

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
        for (var indyNr = 0; indyNr < thisCategory.indicators.length; indyNr++) {

            var thisIndicator = thisCategory.indicators[indyNr]

            Logger.log('begin Indicator: ' + thisIndicator.labelShort)

            // variable used for indicator average later

            var indyLevelScoresCompany = []
            var indyLevelScoresServices = []
            var indyCompositeScores = []
            
            activeRow = setCompanyHeader(activeRow, firstCol, sheet, thisIndicator, nrOfIndSubComps, thisCategory, CompanyObj, blocks)
            Logger.log(' - company header added for ' + thisIndicator.labelShort)

            // for all components of the current Research Step
            for (var stepCompNr = 0; stepCompNr < thisSubStep.components.length; stepCompNr++) {

                var stepComponent = thisSubStep.components[stepCompNr].type
                Logger.log(" - begin stepCompNr: " + stepCompNr + ' - ' + stepComponent)


                switch (stepComponent) {

                    case "elementResults":
                        activeRow = importElementData(activeRow, firstCol, sheet, thisSubStep, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory, blocks)
                        Logger.log(' - ' + stepComponent + " added for: " + thisIndicator.labelShort)
                        break

                    case "elementComments":
                        activeRow = importElementData(activeRow, firstCol, sheet, thisSubStep, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory, blocks)
                        Logger.log(' - ' + stepComponent + " added for: " + thisIndicator.labelShort)
                        break

                    case "sources":
                        activeRow = importSources(activeRow, firstCol, sheet, thisSubStep, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory, blocks)
                        Logger.log(' - ' + "sources added for: " + thisIndicator.labelShort)
                        break

                    // case "sources":
                    //     activeRow = importSources(activeRow, firstCol, sheet, thisSubStep, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory)
                    //     Logger.log(' - ' + "sources added for: " + thisIndicator.labelShort)
                    //     break

                    // default:
                    //     sheet.appendRow(["!!!You missed a component!!!\nThis means either \n a) a research step component is not covered by a switch-case statement, or \n b) there is a runtime error"])
                    //     break
                }
            }

            activeRow = activeRow + 1

            // ADD SCORING AFTER ALL OTHER COMPONENTS

            if (configObj.includeScoring) {
                activeRow = addElementScores(file, sheetMode, activeRow, firstCol, sheet, thisSubStepLabel, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory, blocks)
                Logger.log(' - ' + 'element scores added for ' + thisIndicator.labelShort)

                activeRow = addLevelScores(file, sheetMode, activeRow, firstCol, sheet, thisSubStepLabel, stepCompNr, thisIndicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, thisCategory, indyLevelScoresCompany, indyLevelScoresServices, blocks)
                Logger.log(' - ' + "level scores added for " + thisIndicator.labelShort)

                activeRow = addCompositeScores(file, sheetMode, activeRow, firstCol, sheet, thisSubStepLabel, thisIndicator, CompanyObj, nrOfIndSubComps, indyLevelScoresCompany, indyLevelScoresServices, indyCompositeScores, blocks)
                Logger.log(' - ' + "composite scores added for " + thisIndicator.labelShort)

                activeRow = addIndicatorScore(file, sheetMode, activeRow, firstCol, sheet, thisSubStepLabel, thisIndicator, CompanyObj, indyCompositeScores, blocks)
                Logger.log(' - ' + "indicator score added for " + thisIndicator.labelShort)

                activeRow = activeRow + 1
            } 

        } // END INDICATOR
    } // END INDICATOR CATEGORY
    // activeRow += 2
    lastCol = numberOfColumns * blocks + 1
    Logger.log(blocks + ". block" + " - " + firstCol + ":" + lastCol)
    // firstCol = lastCol + 2
    // } // END SUB STEP



    Logger.log("Formatting Sheet")
    lastRow = activeRow
    sheet.getRange(1, 1, lastRow, lastCol).setFontFamily("Roboto")
    sheet.setColumnWidth(lastCol, 25)

    return lastCol += 1
} // END MAIN Step & function
