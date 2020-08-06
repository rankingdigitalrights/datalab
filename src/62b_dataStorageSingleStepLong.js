/* global
        addDataStoreSheetHeaderLong,
        importDataStoreRowLong,
        importDataStoreBlockLong
*/


function dataStoreSingleStepLong(Sheet, subStepNr, Indicators, SubStep, Company, hasOpCom, integrateOutputs, urlDC, urlSC, lastRow, indexPref) {

    console.log("--- Begin Data Layer Single (Sub)Step: " + subStepNr)

    let subStepID = SubStep.altStepID ? SubStep.altStepID : SubStep.subStepID

    let activeRow = lastRow

    console.log("--- Beginning Substep " + subStepID)

    if (activeRow === 1) {
        activeRow = addDataStoreSheetHeaderLong(Sheet, activeRow)
        console.log(" - company header added for " + subStepID)
    }


    let indCatLength = Indicators.indicatorCategories.length

    let Category, catLength, catLabel, stepCompID, StepComp, stepCompType, Indicator, indLabelShort

    // For all Indicator Categories
    for (let c = 0; c < indCatLength; c++) {

        Category = Indicators.indicatorCategories[c]
        catLength = Category.indicators.length
        console.log("Category: " + Category)
        console.log("Category.indicators.length: " + catLength)
        catLabel = Category.labelShort

        console.log(" --- begin Indicator Category: " + catLabel)

        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)

        // For all Indicators

        for (let i = 0; i < catLength; i++) {

            Indicator = Category.indicators[i]
            indLabelShort = Indicator.labelShort
            console.log("begin Indicator: " + indLabelShort)

            // for all components of the current Research Step
            for (let stepCompNr = 0; stepCompNr < SubStep.components.length; stepCompNr++) {

                StepComp = SubStep.components[stepCompNr]
                stepCompType = StepComp.type
                console.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

                switch (stepCompType) {

                    // imports researcher name from x.0 step
                    case "subStepHeader":
                        // stepCompID = StepComp.id
                        // activeRow = importDataStoreRowLong(activeRow, Sheet, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, null, null, Company, hasOpCom, integrateOutputs, urlDC, urlSC)
                        // console.log(Indicator.labelShort + stepCompType + " added ")
                        break


                    case "evaluation":
                    case "reviewResults":
                    case "importPreviousResults":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreBlockLong(Sheet, activeRow, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, Company, hasOpCom, integrateOutputs, urlDC, urlSC, indexPref)
                        console.log(Indicator.labelShort + stepCompType + " added ")
                        break

                    case "comments":
                    case "reviewComments":
                    case "importPreviousComments":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreBlockLong(Sheet, activeRow, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, Company, hasOpCom, integrateOutputs, urlDC, urlSC, indexPref)
                        console.log(Indicator.labelShort + stepCompType + " added ")
                        break

                    case "sources":
                    case "importPreviousSources":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreRowLong(activeRow, Sheet, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, null, null, Company, hasOpCom, integrateOutputs, urlDC, urlSC, false, indexPref)
                        console.log(Indicator.labelShort + " sources added")
                        break

                    default:
                        console.log(" - ignoring " + stepCompType)
                        break

                }
            } // END Substep Components

        } // END INDICATOR
    } // END INDICATOR CATEGORY

    lastRow = activeRow

    return lastRow

}

// END MAIN Step & function
