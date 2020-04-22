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

    var IndCat
    var indCatLabel
    var indCatLength
    var nrOfIndSubComps = 1


    // For all Indicator Categories
    for (var c = 0; c < IndicatorsObj.indicatorCategories.length; c++) {

        IndCat = IndicatorsObj.indicatorCategories[c]
        indCatLabel = IndCat.labelShort
        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
        Logger.log("begin Indicator Category: " + IndCat.labelLong)

        if (IndCat.hasSubComponents == true) {
            nrOfIndSubComps = IndCat.components.length
        }

        // TODO: Refactor to main caller

        indCatLength
        if (useIndicatorSubset) {
            indCatLength = 2
        } else {
            indCatLength = IndCat.indicators.length
        }

        var Indicator
        var StepComp
        var stepCompType

        // For all Indicators
        for (var i = 0; i < indCatLength; i++) {

            Indicator = IndCat.indicators[i]

            Logger.log("begin Indicator: " + Indicator.labelShort)

            // for all components of the current Research Step
            for (var stepCompNr = 0; stepCompNr < thisSubStep.components.length; stepCompNr++) {

                StepComp = thisSubStep.components[stepCompNr]
                stepCompType = StepComp.type
                Logger.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

                switch (stepCompType) {

                    // import researcher name from x.0 step
                    case "header":
                        activeRow = importDataStoreRowWide(activeRow, Sheet, StepComp, thisSubStepID, Indicator, Company, hasOpCom, integrateOutputs, urlDC)
                        // Logger.log(Indicator.labelShort + ' - SC - ' + stepCompType + " added ")
                        break

                    case "elementResults":
                        activeRow = importDataStoreElementsBlockWide(Sheet, activeRow, StepComp, thisSubStepID, Indicator, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(Indicator.labelShort + " - SC - " + stepCompType + " added ")
                        break

                    case "elementComments":
                        activeRow = importDataStoreElementsBlockWide(Sheet, activeRow, StepComp, thisSubStepID, Indicator, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(Indicator.labelShort + " - SC - " + stepCompType + " added ")
                        break

                    case "sources":
                        activeRow = importDataStoreRowWide(activeRow, Sheet, StepComp, thisSubStepID, Indicator, Company, hasOpCom, integrateOutputs, urlDC)
                        Logger.log(Indicator.labelShort + " - SC - " + "sources added")
                        break
                }
            }
        } // END INDICATOR
    } // END INDICATOR CATEGORY

    lastRow = activeRow

    return lastRow

}

// END MAIN Step & function