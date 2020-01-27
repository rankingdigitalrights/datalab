function dataStoreSingleStep(Sheet, subStepNr, IndicatorsObj, thisSubStep, Company, numberOfColumns, hasOpCom, dataColWidth, useIndicatorSubset, integrateOutputs, urlDC) {

    Logger.log("--- Begin Data Layer Single (Sub)Step: " + subStepNr)


    var thisSubStepID = thisSubStep.subStepID

    Logger.log("Inserting Sheet " + subStepNr)

    var firstCol = 1
    var activeRow = 1
    var lastRow

    Logger.log("--- Beginning Substep " + thisSubStepID)

    activeRow = addDataStoreSheetHeader(Sheet, Company, activeRow)
    Logger.log(" - company header added for " + thisSubStepID)

    var thisIndCat
    var thisIndCatLength

    // For all Indicator Categories
    for (var c = 0; c < IndicatorsObj.indicatorClasses.length; c++) {

        thisIndCat = IndicatorsObj.indicatorClasses[c]
        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
        Logger.log("begin Indicator Category: " + thisIndCat.labelLong)
        var nrOfIndSubComps = 1

        if (thisIndCat.hasSubComponents == true) {
            nrOfIndSubComps = thisIndCat.components.length
        }

        // TODO: Refactor to main caller

        if (useIndicatorSubset) {
            thisIndCatLength = 2
        } else {
            thisIndCatLength = thisIndCat.indicators.length
        }

        // For all Indicators
        var StepComp
        var stepCompType

        for (var i = 0; i < thisIndCatLength; i++) {

            var thisInd = thisIndCat.indicators[i]

            Logger.log("begin Indicator: " + thisInd.labelShort)

            // for all components of the current Research Step
            for (var stepCompNr = 0; stepCompNr < thisSubStep.components.length; stepCompNr++) {

                StepComp = thisSubStep.components[stepCompNr]
                stepCompType = StepComp.type
                Logger.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

                switch (stepCompType) {

                    // import researcher name from x.0 step
                    case "header":
                        activeRow = importDataStoreRow(activeRow, Sheet, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        // Logger.log(thisInd.labelShort + ' - SC - ' + stepCompType + " added ")
                        break


                    case "elementResults":
                        activeRow = importDataStoreElementBlock(Sheet, activeRow, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(thisInd.labelShort + " - SC - " + stepCompType + " added ")
                        break

                    case "elementComments":
                        activeRow = importDataStoreElementBlock(Sheet, activeRow, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(thisInd.labelShort + " - SC - " + stepCompType + " added ")
                        break

                    case "sources":
                        activeRow = importDataStoreRow(activeRow, Sheet, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(thisInd.labelShort + " - SC - " + "sources added")
                        break

                }
            }
        } // END INDICATOR
    } // END INDICATOR CATEGORY

    var lastCol = numberOfColumns + 2

    Logger.log("Formatting Sheet")
    lastRow = Sheet.getLastRow()

    Sheet.getRange(1, 1, lastRow, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
    // .setWrap(true)

    var hookFirstDataCol = firstCol + 2
    Sheet.setColumnWidths(hookFirstDataCol, numberOfColumns, dataColWidth)
    Sheet.setColumnWidth(lastCol, 25)

    // ToDo
    //     var thisBlock = Sheet.getRange(firstRow, firstCol, activeRow - firstRow, tempCol - firstCol)
    // thisBlock.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)

    // if (!hasOpCom) {
    //     var opComCol = hookFirstDataCol + 1
    //     Sheet.hideColumns(opComCol)
    // }

}

// END MAIN Step & function