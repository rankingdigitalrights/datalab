/* global
        addDataStoreSheetHeaderLong,
        importDataStoreRowLong,
        importDataStoreElementBlockLong
*/


function dataStoreSingleStepLong(Sheet, subStepNr, IndicatorsObj, thisSubStep, Company, hasOpCom, dataColWidth, useIndicatorSubset, integrateOutputs, urlDC) {

    Logger.log("--- Begin Data Layer Single (Sub)Step: " + subStepNr)


    var thisSubStepID = thisSubStep.subStepID

    Logger.log("Inserting Sheet " + subStepNr)

    var firstCol = 1
    var activeRow = 1
    var lastRow

    Logger.log("--- Beginning Substep " + thisSubStepID)

    activeRow = addDataStoreSheetHeaderLong(Sheet, activeRow)
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
                        activeRow = importDataStoreRowLong(activeRow, Sheet, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        // Logger.log(thisInd.labelShort + ' - SC - ' + stepCompType + " added ")
                        break


                    case "elementResults":
                        activeRow = importDataStoreElementBlockLong(Sheet, activeRow, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(thisInd.labelShort + " - SC - " + stepCompType + " added ")
                        break

                    case "elementComments":
                        activeRow = importDataStoreElementBlockLong(Sheet, activeRow, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(thisInd.labelShort + " - SC - " + stepCompType + " added ")
                        break

                    case "sources":
                        activeRow = importDataStoreRowLong(activeRow, Sheet, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(thisInd.labelShort + " - SC - " + "sources added")
                        break

                }
            }
        } // END INDICATOR
    } // END INDICATOR CATEGORY

    var lastCol = Sheet.getLastColumn()

    Logger.log("Formatting Sheet")
    lastRow = Sheet.getLastRow()

    Sheet.getRange(1, 1, lastRow, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
        .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)
    // .setWrap(true)

    var hookFirstDataCol = firstCol + 2
    Sheet.setColumnWidths(hookFirstDataCol, lastCol, dataColWidth)
    Sheet.setColumnWidth(lastCol + 1, 25)

}

// END MAIN Step & function