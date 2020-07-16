function scoringSingleStep(SS, Sheet, subStepNr, lastCol, Config, isPilotMode, hasFullScores, Indicators, sheetModeID, thisMainStep, CompanyObj, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, useIndicatorSubset, includeSources, includeNames, includeResults) {

    Logger.log("--- Begin Scoring Single (Sub)Step: " + subStepNr)

    var companyShortName = CompanyObj.label.current

    var thisSubStep = filterSingleSubstep(thisMainStep, thisMainStep.scoringSubStep)
    var thisSubStepID = thisSubStep.subStepID
    var thisSubStepLabel = thisSubStep.labelShort

    var firstCol = lastCol
    var activeCol = firstCol
    var activeRow = 1
    var lastRow

    Logger.log("--- Main Step has " + thisMainStep.substeps.length + " Substeps")
    Logger.log("--- Beginning Substep " + thisSubStepID)

    // set up header

    // TODO: remove from steps JSON. Not a component. This is Layout

    activeRow = setScoringSheetHeader(activeRow, activeCol, Sheet, companyShortName, thisSubStepLabel, blocks)

    // For all Indicator Categories
    for (var c = 0; c < Indicators.indicatorCategories.length; c++) {

        var thisIndCat = Indicators.indicatorCategories[c]
        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
        Logger.log("begin Indicator Category: " + thisIndCat.labelLong)
        var nrOfIndSubComps = 1

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

            Logger.log("begin Indicator: " + thisInd.labelShort)

            // variable used for indicator average later

            var indyLevelScoresCompany = []
            var indyLevelScoresServices = []
            var indyCompositeScores = []

            activeRow = setScoringCompanyHeader(activeRow, firstCol, Sheet, thisInd, nrOfIndSubComps, thisIndCat, CompanyObj, blocks)
            Logger.log(" - company header added for " + thisInd.labelShort)

            // --- // Main task // --- //

            var StepComp
            var stepCompType

            var thisSubStep = filterSingleSubstep(thisMainStep, thisMainStep.scoringSubStep)
            
            // for all components of the current Research Step
            for (var stepCompNr = 0; stepCompNr < thisSubStep.components.length; stepCompNr++) {

                StepComp = thisSubStep.components[stepCompNr]
                stepCompType = StepComp.type
                Logger.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

                switch (stepCompType) {

                    // import researcher name from x.0 step
                    case "subStepHeader":
                        if (includeNames) {

                            activeRow = importElementRow(activeRow, firstCol, Sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, integrateOutputs, isPilotMode)
                            Logger.log(" - SC - " + stepCompType + " added for: " + thisInd.labelShort)
                        }
                        break

                    case "reviewResults":
                        if (includeResults) {
                            activeRow = importElementBlock(activeRow, firstCol, Sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, integrateOutputs)
                            Logger.log(" - SC - " + stepCompType + " added for: " + thisInd.labelShort)
                        }
                        break

                    case "reviewComments":
                    case "comments":
                        activeRow = importElementBlock(activeRow, firstCol, Sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, integrateOutputs)
                        Logger.log(" - SC - " + stepCompType + " added for: " + thisInd.labelShort)
                        break

                    case "sources":
                        if (includeSources) {
                            activeRow = importElementRow(activeRow, firstCol, Sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, integrateOutputs)
                            Logger.log(" - SC - " + "sources added for: " + thisInd.labelShort)
                        }

                        break
                }
            }

            activeRow += 1

            // ADD SCORING AFTER ALL OTHER COMPONENTS

            if (hasFullScores) {
                activeRow = addElementScores(SS, sheetModeID, activeRow, firstCol, Sheet, thisSubStepID, stepCompNr, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, blocks, hasFullScores)
                Logger.log(" - " + "element scores added for " + thisInd.labelShort)

                activeRow = addLevelScores(SS, sheetModeID, activeRow, firstCol, Sheet, thisSubStepID, stepCompNr, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndCat, indyLevelScoresCompany, indyLevelScoresServices, blocks)
                Logger.log(" - " + "level scores added for " + thisInd.labelShort)

                activeRow = addCompositeScores(SS, sheetModeID, activeRow, firstCol, Sheet, thisSubStepID, thisInd, CompanyObj, nrOfIndSubComps, indyLevelScoresCompany, indyLevelScoresServices, indyCompositeScores, blocks)
                Logger.log(" - " + "composite scores added for " + thisInd.labelShort)


                if(indyCompositeScores.length==0) {
                    activeRow = addIndicatorScore(SS, sheetModeID, activeRow, firstCol, Sheet, thisSubStepID, thisInd, CompanyObj, indyCompositeScores, blocks)
                }
                else if(CompanyObj.type=="internet" || CompanyObj.id=="tAT1"||thisInd.labelShort.substring(0, 1)!="G") {
                    activeRow = addIndicatorScore(SS, sheetModeID, activeRow, firstCol, Sheet, thisSubStepID, thisInd, CompanyObj, indyCompositeScores, blocks)
                }

                else {
                    indyCompositeScores.push(indyCompositeScores[0])
                    activeRow = addIndicatorScore(SS, sheetModeID, activeRow, firstCol, Sheet, thisSubStepID, thisInd, CompanyObj, indyCompositeScores, blocks)
                }
                Logger.log(" - " + "indicator score added for " + thisInd.labelShort)

                activeRow = activeRow + 1
            } // END SUBSTEP COMPONENTS
        } // END INDICATOR
    } // END INDICATOR CATEGORY

    lastCol = numberOfColumns * blocks + 1

    Logger.log("Formatting Sheet")
    lastRow = activeRow

    Sheet.getRange(1, 1, lastRow, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
    // .setWrap(true)

    var hookFirstDataCol = firstCol
    if (blocks === 1) {
        hookFirstDataCol = firstCol + 1
    }
    Sheet.setColumnWidths(hookFirstDataCol, numberOfColumns, dataColWidth)
    Sheet.setColumnWidth(lastCol, 25)

    if (!hasOpCom) {
        var opComCol = hookFirstDataCol + 1
        Sheet.hideColumns(opComCol)
    }

    return lastCol += 1
}

// END MAIN Step & function
