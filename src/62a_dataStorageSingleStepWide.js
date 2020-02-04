function dataStoreSingleStepWide(Sheet, subStepNr, IndicatorsObj, thisSubStep, Company, hasOpCom, useIndicatorSubset, integrateOutputs, urlDC, lastRow) {

    Logger.log("--- Begin Data Layer Single (Sub)Step: " + subStepNr)

    var thisSubStepID = thisSubStep.subStepID

    Logger.log("Inserting Sheet " + subStepNr)

    var activeRow = lastRow

    Logger.log("--- Beginning Substep " + thisSubStepID)

    if (activeRow === 1) {
        activeRow = addDataStoreSheetHeaderWide(Sheet, Company, activeRow)
        Logger.log(" - company header added for " + thisSubStepID)
    }

    var thisIndCat
    var thisIndCatLength
    var nrOfIndSubComps = 1

    // For all Indicator Categories
    for (var c = 0; c < IndicatorsObj.indicatorClasses.length; c++) {

        thisIndCat = IndicatorsObj.indicatorClasses[c]
        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
        Logger.log("begin Indicator Category: " + thisIndCat.labelLong)

        if (thisIndCat.hasSubComponents == true) {
            nrOfIndSubComps = thisIndCat.components.length
        }

        // TODO: Refactor to main caller

        thisIndCatLength
        if (useIndicatorSubset) {
            thisIndCatLength = 2
        } else {
            thisIndCatLength = thisIndCat.indicators.length
        }

        // For all Indicators
        for (var i = 0; i < thisIndCatLength; i++) {

            var thisInd = thisIndCat.indicators[i]

            Logger.log("begin Indicator: " + thisInd.labelShort)

            var StepComp
            var stepCompType

            // for all components of the current Research Step
            for (var stepCompNr = 0; stepCompNr < thisSubStep.components.length; stepCompNr++) {

                StepComp = thisSubStep.components[stepCompNr]
                stepCompType = StepComp.type
                Logger.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

                switch (stepCompType) {

                    // import researcher name from x.0 step
                    case "header":
                        activeRow = importDataStoreRowWide(activeRow, Sheet, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        // Logger.log(thisInd.labelShort + ' - SC - ' + stepCompType + " added ")
                        break

                    case "elementResults":
                        activeRow = importDataStoreElementsBlockWide(Sheet, activeRow, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(thisInd.labelShort + " - SC - " + stepCompType + " added ")
                        break

                    case "elementComments":
                        activeRow = importDataStoreElementsBlockWide(Sheet, activeRow, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(thisInd.labelShort + " - SC - " + stepCompType + " added ")
                        break

                    case "sources":
                        activeRow = importDataStoreRowWide(activeRow, Sheet, StepComp, thisSubStepID, thisInd, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(thisInd.labelShort + " - SC - " + "sources added")
                        break
                }
            }
        } // END INDICATOR
    } // END INDICATOR CATEGORY

    lastRow = activeRow

    return lastRow

}

// END MAIN Step & function