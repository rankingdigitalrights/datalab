/* global
        addDataStoreSheetHeaderLong,
        importDataStoreRowLong,
        importDataStoreBlockLong
*/


function dataStoreSingleStepLong(Sheet, subStepNr, Indicators, thisSubStep, Company, hasOpCom, useIndicatorSubset, integrateOutputs, urlDC, urlSC, lastRow) {

    Logger.log("--- Begin Data Layer Single (Sub)Step: " + subStepNr)

    var thisSubStepID = thisSubStep.subStepID

    var activeRow = lastRow

    Logger.log("--- Beginning Substep " + thisSubStepID)

    if (activeRow === 1) {
        activeRow = addDataStoreSheetHeaderLong(Sheet, activeRow)
        Logger.log(" - company header added for " + thisSubStepID)
    }


    var indCatLength = Indicators.indicatorCategories.length
    Logger.log("!!!indCatLength: " + indCatLength)

    var IndyClass
    var IndyClassLength
    var indCatLabelShort
    var nrOfIndSubComps = 1
    var stepCompID


    var StepComp
    var stepCompType
    var Indicator
    var indLabelShort

    // For all Indicator Categories
    for (var c = 0; c < indCatLength; c++) {

        IndyClass = Indicators.indicatorCategories[c]
        Logger.log("IndyClass: " + IndyClass)
        Logger.log("IndyClass.indicators.length: " + IndyClass.indicators.length)
        indCatLabelShort = IndyClass.labelShort

        Logger.log(" --- begin Indicator Category: " + indCatLabelShort)

        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)

        if (IndyClass.hasSubComponents) {
            nrOfIndSubComps = IndyClass.components.length
        }

        // TODO: Refactor to main caller


        if (useIndicatorSubset) {
            IndyClassLength = 2
        } else {
            IndyClassLength = IndyClass.indicators.length
        }

        Logger.log("!!!indCatLength: " + indCatLength)

        // For all Indicators

        for (var i = 0; i < IndyClassLength; i++) {

            Indicator = IndyClass.indicators[i]
            indLabelShort = Indicator.labelShort
            Logger.log("begin Indicator: " + indLabelShort)

            // for all components of the current Research Step
            for (var stepCompNr = 0; stepCompNr < thisSubStep.components.length; stepCompNr++) {

                StepComp = thisSubStep.components[stepCompNr]
                stepCompType = StepComp.type
                Logger.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

                switch (stepCompType) {

                    // imports researcher name from x.0 step
                    case "header":
                        // stepCompID = StepComp.id
                        // activeRow = importDataStoreRowLong(activeRow, Sheet, StepComp, stepCompID, thisSubStepID, Indicator, indCatLabelShort, indLabelShort, null, null, Company, hasOpCom, integrateOutputs, urlDC, urlSC)
                        // Logger.log(Indicator.labelShort + stepCompType + " added ")
                        break


                    case "elementResults":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreBlockLong(Sheet, activeRow, StepComp, stepCompID, thisSubStepID, Indicator, indCatLabelShort, indLabelShort, Company, hasOpCom, integrateOutputs, urlDC, urlSC)
                        Logger.log(Indicator.labelShort + stepCompType + " added ")
                        break

                    case "elementComments":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreBlockLong(Sheet, activeRow, StepComp, stepCompID, thisSubStepID, Indicator, indCatLabelShort, indLabelShort, Company, hasOpCom, integrateOutputs, urlDC, urlSC)
                        Logger.log(Indicator.labelShort + stepCompType + " added ")
                        break

                    case "sources":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreRowLong(activeRow, Sheet, StepComp, stepCompID, thisSubStepID, Indicator, indCatLabelShort, indLabelShort, null, null, Company, hasOpCom, integrateOutputs, urlDC, urlSC)
                        Logger.log(Indicator.labelShort + " sources added")
                        break

                }
            }

        } // END INDICATOR
    } // END INDICATOR CATEGORY

    lastRow = activeRow

    return lastRow

}

// END MAIN Step & function