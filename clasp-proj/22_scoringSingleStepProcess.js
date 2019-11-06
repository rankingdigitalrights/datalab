function scoringSingleStep(File, sheetName, subStepNr, lastCol, Config, isPilotMode, hasFullScores, IndicatorsObj, sheetModeID, thisMainStep, CompanyObj, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, useIndicatorSubset, includeSources, includeNames, includeResults) {

    Logger.log("--- Begin Scoring Single (Sub)Step: " + subStepNr)

    var companyShortName = CompanyObj.label.current

    var thisSubStep = thisMainStep.substeps[subStepNr]
    var thisSubStepID = thisSubStep.subStepID
    var thisSubStepLabel = thisSubStep.labelShort

    Logger.log("Inserting Sheet " + sheetName)
    var sheet = insertSheetIfNotExist(File, sheetName, false)
    if (sheet == null) {
        Logger.log("BREAK: Sheet for " + sheetName + " already exists. Skipping.")
        return lastCol
    }

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
    Logger.log("--- Beginning Substep " + thisSubStepID)

    // set up header / TODO: remove from steps JSON. Not a component. This is Layout

    activeRow = setSheetHeader(activeRow, activeCol, sheet, companyShortName, thisSubStepLabel, blocks)

    // For all Indicator Categories
    for (var c = 0; c < IndicatorsObj.indicatorClasses.length; c++) {

        var thisIndCat = IndicatorsObj.indicatorClasses[c]
        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
        Logger.log("begin Indicator Category: " + thisIndCat.labelLong)
        var nrOfIndSubComps = 1

        if (thisIndCat.hasSubComponents == true) {
            nrOfIndSubComps = thisIndCat.components.length
        }

        // TODO: Refactor to main caller
        
        var thisIndCatLength
        if (useIndicatorSubset) {
            thisIndCatLength = 2
        } else {
            thisIndCatLength = thisIndCat.indicators.length
        }

        // For all Indicators
        for (var i = 0; i < thisIndCatLength; i++) {

            var thisInd = thisIndCat.indicators[i]

            Logger.log('begin Indicator: ' + thisInd.labelShort)

            // variable used for indicator average later

            var indyLevelScoresCompany = []
            var indyLevelScoresServices = []
            var indyCompositeScores = []

            activeRow = setCompanyHeader(activeRow, firstCol, sheet, thisInd, nrOfIndSubComps, thisIndCat, CompanyObj, blocks)
            Logger.log(' - company header added for ' + thisInd.labelShort)

            // --- // Main task // --- //

            var StepComp
            var stepCompType

            // for all components of the current Research Step
            for (var stepCompNr = 0; stepCompNr < thisSubStep.components.length; stepCompNr++) {

                StepComp = thisSubStep.components[stepCompNr]
                stepCompType = StepComp.type
                Logger.log(" - begin stepCompNr: " + stepCompNr + ' - ' + stepCompType)

                switch (stepCompType) {

                    // import researcher name from x.0 step
                    case "header":
                        if (includeNames) {

                            activeRow = importElementRow(activeRow, firstCol, sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, integrateOutputs, isPilotMode)
                            Logger.log(' - SC - ' + stepCompType + " added for: " + thisInd.labelShort)
                        }
                        break

                    case "elementResults":
                        if (includeResults) {
                            activeRow = importElementBlock(activeRow, firstCol, sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, integrateOutputs)
                            Logger.log(' - SC - ' + stepCompType + " added for: " + thisInd.labelShort)
                        }
                        break

                    case "elementComments":
                        activeRow = importElementBlock(activeRow, firstCol, sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, integrateOutputs)
                        Logger.log(' - SC - ' + stepCompType + " added for: " + thisInd.labelShort)
                        break

                    case "sources":
                        if (includeSources) {
                            activeRow = importElementRow(activeRow, firstCol, sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, integrateOutputs)
                            Logger.log(' - SC - ' + "sources added for: " + thisInd.labelShort)
                        }

                        break
                }
            }

            activeRow += 1

            // ADD SCORING AFTER ALL OTHER COMPONENTS

            if (hasFullScores) {
                activeRow = addElementScores(File, sheetModeID, activeRow, firstCol, sheet, thisSubStepID, stepCompNr, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, hasFullScores)
                Logger.log(' - ' + 'element scores added for ' + thisInd.labelShort)

                activeRow = addLevelScores(File, sheetModeID, activeRow, firstCol, sheet, thisSubStepID, stepCompNr, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, indyLevelScoresCompany, indyLevelScoresServices, blocks)
                Logger.log(' - ' + "level scores added for " + thisInd.labelShort)

                activeRow = addCompositeScores(File, sheetModeID, activeRow, firstCol, sheet, thisSubStepID, thisInd, CompanyObj, nrOfIndSubComps, indyLevelScoresCompany, indyLevelScoresServices, indyCompositeScores, blocks)
                Logger.log(' - ' + "composite scores added for " + thisInd.labelShort)

                activeRow = addIndicatorScore(File, sheetModeID, activeRow, firstCol, sheet, thisSubStepID, thisInd, CompanyObj, indyCompositeScores, blocks)
                Logger.log(' - ' + "indicator score added for " + thisInd.labelShort)

                activeRow = activeRow + 1
            } // END SUBSTEP COMPONENTS
        } // END INDICATOR
    } // END INDICATOR CATEGORY
    // activeRow += 2
    lastCol = numberOfColumns * blocks + 1
    // Logger.log(blocks + ". block" + " - " + firstCol + ":" + lastCol)
    // firstCol = lastCol + 2
    // } // END SUB STEP

    Logger.log("Formatting Sheet")
    lastRow = activeRow

    sheet.getRange(1, 1, lastRow, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
        // .setWrap(true)


    var hookFirstDataCol = firstCol
    if (blocks === 1) {
        hookFirstDataCol = firstCol + 1
    }
    sheet.setColumnWidths(hookFirstDataCol, numberOfColumns, dataColWidth)
    sheet.setColumnWidth(lastCol, 25)

    if (!hasOpCom) {
        var opComCol = hookFirstDataCol + 1
        sheet.hideColumns(opComCol)
    }

    return lastCol += 1
} // END MAIN Step & function
