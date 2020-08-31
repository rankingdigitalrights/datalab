/* global
        addDataStoreSheetHeaderResults, addDataStoreSheetHeaderScoring, importDataStoreRow, importDataStoreBlock, importDataStoreBlockScoring, importDataStoreScoringLevelScores, defineNamedRange, importRangeFormula
*/


// eslint-disable-next-line no-unused-vars
function dataStoreSingleStepResults(Sheet, Indicators, SubStep, Company, hasOpCom, integrateOutputs, urlDC, lastRow, indexPref) {

    // console.log("--- Begin Data Layer Single (Sub)Step: " + subStepNr)

    let subStepID = SubStep.altStepID ? SubStep.altStepID : SubStep.subStepID

    let activeRow = lastRow

    // console.log("--- Beginning Substep " + subStepID)

    if (activeRow === 1) {
        activeRow = addDataStoreSheetHeaderResults(Sheet, activeRow)
        // console.log(" - company header added for " + subStepID)
    }


    let indCatLength = Indicators.indicatorCategories.length

    let Category, catLength, catLabel, stepCompID, StepComp, stepCompType, Indicator, indLabelShort

    // For all Indicator Categories
    for (let c = 0; c < indCatLength; c++) {

        Category = Indicators.indicatorCategories[c]
        catLength = Category.indicators.length
        // console.log("Category: " + Category)
        // console.log("Category.indicators.length: " + catLength)
        catLabel = Category.labelShort

        // console.log(" --- begin Indicator Category: " + catLabel)

        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)

        // For all Indicators

        for (let i = 0; i < catLength; i++) {

            Indicator = Category.indicators[i]
            indLabelShort = Indicator.labelShort
            // console.log("begin Indicator: " + indLabelShort)

            // for all components of the current Research Step
            for (let stepCompNr = 0; stepCompNr < SubStep.components.length; stepCompNr++) {

                StepComp = SubStep.components[stepCompNr]
                stepCompType = StepComp.type
                // console.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

                switch (stepCompType) {

                    // imports researcher name from x.0 step
                    case "subStepHeader":
                        // stepCompID = StepComp.id
                        // activeRow = importDataStoreRow(activeRow, Sheet, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, null, null, Company, hasOpCom, integrateOutputs, urlDC, urlSC)
                        // console.log(Indicator.labelShort + stepCompType + " added ")
                        break

                        // case "evaluation":
                    case "reviewResults":
                    case "importPreviousResults":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreBlockResults(Sheet, activeRow, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, Company, hasOpCom, integrateOutputs, urlDC, indexPref)
                        // console.log(Indicator.labelShort + stepCompType + " added ")
                        break

                    case "comments":
                    case "reviewComments":
                    case "importPreviousComments":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreBlockResults(Sheet, activeRow, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, Company, hasOpCom, integrateOutputs, urlDC, indexPref)
                        // console.log(Indicator.labelShort + stepCompType + " added ")
                        break

                    case "sources":
                    case "importPreviousSources":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreRowResults(activeRow, Sheet, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, null, null, Company, hasOpCom, integrateOutputs, urlDC, false, indexPref)
                        // console.log(Indicator.labelShort + " sources added")
                        break

                    default:
                        // console.log(" - ignoring " + stepCompType)
                        break

                }
            } // END Substep Components

        } // END INDICATOR
    } // END INDICATOR CATEGORY

    lastRow = activeRow

    return lastRow

}

// END MAIN Step & function



// eslint-disable-next-line no-unused-vars
function dataStoreSingleStepElementScoring(Sheet, Indicators, SubStep, Company, hasOpCom, integrateOutputs, urlSC, lastRow, indexPref) {

    // console.log("--- Begin Data Layer Single (Sub)Step: " + subStepNr)

    let subStepID = SubStep.altStepID ? SubStep.altStepID : SubStep.subStepID
    //let subStepID=SubStep.subStepID

    let activeRow = lastRow

    // console.log("--- Beginning Substep " + subStepID)

    if (activeRow === 1) {
        activeRow = addDataStoreSheetHeaderScoring(Sheet, activeRow)
        // console.log(" - company header added for " + subStepID)
    }


    let indCatLength = Indicators.indicatorCategories.length

    let Category, catLength, catLabel, stepCompID, StepComp, stepCompType, Indicator, indLabelShort

    // For all Indicator Categories
    for (let c = 0; c < indCatLength; c++) {

        Category = Indicators.indicatorCategories[c]
        catLength = Category.indicators.length
        // console.log("Category: " + Category)
        // console.log("Category.indicators.length: " + catLength)
        catLabel = Category.labelShort

        // console.log(" --- begin Indicator Category: " + catLabel)

        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)

        // For all Indicators

        for (let i = 0; i < catLength; i++) {

            Indicator = Category.indicators[i]
            indLabelShort = Indicator.labelShort
            // console.log("begin Indicator: " + indLabelShort)

            // for all components of the current Research Step
            for (let stepCompNr = 0; stepCompNr < SubStep.components.length; stepCompNr++) {

                StepComp = SubStep.components[stepCompNr]
                stepCompType = StepComp.type
                // console.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

                switch (stepCompType) {

                    // imports researcher name from x.0 step
                    case "subStepHeader":
                        // stepCompID = StepComp.id
                        // activeRow = importDataStoreRow(activeRow, Sheet, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, null, null, Company, hasOpCom, integrateOutputs, urlDC, urlSC)
                        // console.log(Indicator.labelShort + stepCompType + " added ")
                        break


                    case "evaluation":
                    case "reviewResults":
                    case "importPreviousResults":
                        stepCompID = StepComp.id
                        activeRow = importDataStoreBlockScoring(Sheet, activeRow, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, Company, hasOpCom, integrateOutputs, urlSC, indexPref)
                        // console.log(Indicator.labelShort + " " + stepCompType + " added ")
                        break


                    default:
                        // console.log("--- WARN --- ignoring " + stepCompType)
                        break

                }
            } // END Substep Components

        } // END INDICATOR
    } // END INDICATOR CATEGORY

    lastRow = activeRow

    return lastRow

}

// eslint-disable-next-line no-unused-vars
function dataStoreSingleStepLevelScoring(Sheet, Indicators, SubStep, Company, hasOpCom, integrateOutputs, urlSC, lastRow, indexPref) {

    let subStepID = SubStep.altStepID ? SubStep.altStepID : SubStep.subStepID
    //let subStepID=SubStep.subStepID

    let activeRow = lastRow

    // console.log("--- Beginning Substep " + subStepID)

    if (activeRow === 1) {
        activeRow = addDataStoreSheetHeaderScoring(Sheet, activeRow)
        // console.log(" - company header added for " + subStepID)
    }


    let indCatLength = Indicators.indicatorCategories.length

    let Category, catLength, catLabel, stepCompID, StepComp, Indicator, indLabelShort

    for (let c = 0; c < indCatLength; c++) {

        Category = Indicators.indicatorCategories[c]
        catLength = Category.indicators.length
        // console.log("Category: " + Category)
        // console.log("Category.indicators.length: " + catLength)
        catLabel = Category.labelShort

        // console.log(" --- begin Indicator Category: " + catLabel)

        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)

        // For all Indicators

        for (let i = 0; i < catLength; i++) {

            Indicator = Category.indicators[i]
            indLabelShort = Indicator.labelShort
            // console.log("begin Indicator: " + indLabelShort)


            activeRow = importDataStoreScoringLevelScores(Sheet, activeRow, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, Company, hasOpCom, integrateOutputs, urlSC, indexPref, "SL")


        } // END INDICATOR
    } // END INDICATOR CATEGORY


    lastRow = activeRow

    return lastRow

}

// eslint-disable-next-line no-unused-vars
function dataStoreSingleStepCompositeScoring(Sheet, Indicators, SubStep, Company, hasOpCom, integrateOutputs, urlSC, lastRow, indexPref) {

    let subStepID = SubStep.altStepID ? SubStep.altStepID : SubStep.subStepID
    //let subStepID=SubStep.subStepID

    let activeRow = lastRow

    // console.log("--- Beginning Substep " + subStepID)

    if (activeRow === 1) {
        activeRow = addDataStoreSheetHeaderScoring(Sheet, activeRow)
        // console.log(" - company header added for " + subStepID)
    }


    let indCatLength = Indicators.indicatorCategories.length

    let Category, catLength, catLabel, Indicator, indLabelShort

    for (let c = 0; c < indCatLength; c++) {

        Category = Indicators.indicatorCategories[c]
        catLength = Category.indicators.length
        // console.log("Category: " + Category)
        // console.log("Category.indicators.length: " + catLength)
        catLabel = Category.labelShort

        // console.log(" --- begin Indicator Category: " + catLabel)

        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)

        // For all Indicators

        for (let i = 0; i < catLength; i++) {

            Indicator = Category.indicators[i]
            indLabelShort = Indicator.labelShort
            // console.log("begin Indicator: " + indLabelShort)


            Indicator = Category.indicators[i]
            indLabelShort = Indicator.labelShort
            // console.log("begin Indicator: " + indLabelShort)

            let importID = Indicator.labelShort

            let rowLabels = []
            let rowCells = []
            let blockCells = []
            let component = ""
            let compCellName
            let formula

            let c = ""
            let subStepLabel = subStepID.substring(3, 4)
            if (indexPref == "RDR19") {
                subStepLabel = "0"
            }

            rowLabels.push(subStepID.substring(2, 3), subStepLabel, catLabel, indLabelShort, c, "score")
            rowCells = rowLabels.slice() //ES5 way to deep-copy; no Array.from()

            rowCells = rowLabels.slice()
            rowCells.push("Company", "")
            compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "", "GSC")
            formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
            rowCells.push(compCellName, formula)
            rowCells.push("")

            blockCells.push(rowCells)

            rowCells = rowLabels.slice() //ES5 way to deep-copy; no Array.from()

            rowCells = rowLabels.slice()
            rowCells.push("Company", "")
            compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "", "OSC")
            formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
            rowCells.push(compCellName, formula)
            rowCells.push("")

            blockCells.push(rowCells)

            rowCells = rowLabels.slice() //ES5 way to deep-copy; no Array.from()

            rowCells = rowLabels.slice()
            rowCells.push("Company", "")
            compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "", "SSC")
            formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
            rowCells.push(compCellName, formula)
            rowCells.push("")

            blockCells.push(rowCells)

            // --- write block --- //

            let nrOfRows = blockCells.length
            let nrOfCols = blockCells[0].length
            Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols)
                .setValues(blockCells)

            activeRow = activeRow + nrOfRows

        } // END INDICATOR
    } // END INDICATOR CATEGORY


    lastRow = activeRow

    return lastRow

}

// eslint-disable-next-line no-unused-vars
function dataStoreSingleStepIndicatorScoring(Sheet, Indicators, SubStep, Company, hasOpCom, integrateOutputs, urlSC, lastRow, indexPref) {

    let subStepID = SubStep.altStepID ? SubStep.altStepID : SubStep.subStepID
    //let subStepID=SubStep.subStepID

    let activeRow = lastRow

    // console.log("--- Beginning Substep " + subStepID)

    if (activeRow === 1) {
        activeRow = addDataStoreSheetHeaderScoring(Sheet, activeRow)
        // console.log(" - company header added for " + subStepID)
    }


    let indCatLength = Indicators.indicatorCategories.length

    let Category, catLength, catLabel, Indicator, indLabelShort

    for (let c = 0; c < indCatLength; c++) {

        Category = Indicators.indicatorCategories[c]
        catLength = Category.indicators.length
        // console.log("Category: " + Category)
        // console.log("Category.indicators.length: " + catLength)
        catLabel = Category.labelShort

        // console.log(" --- begin Indicator Category: " + catLabel)

        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)

        // For all Indicators

        for (let i = 0; i < catLength; i++) {

            Indicator = Category.indicators[i]
            indLabelShort = Indicator.labelShort
            // console.log("begin Indicator: " + indLabelShort)

            let importID = Indicator.labelShort

            let rowLabels = []
            let rowCells = []
            let blockCells = []
            let component = ""
            let compCellName
            let formula

            let c = ""
            let subStepLabel = subStepID.substring(3, 4)
            if (indexPref == "RDR19") {
                subStepLabel = "0"
            }

            rowLabels.push(subStepID.substring(2, 3), subStepLabel, catLabel, indLabelShort, c, "score")
            rowCells = rowLabels.slice() //ES5 way to deep-copy; no Array.from()

            rowCells = rowLabels.slice()
            rowCells.push("Company", "")
            compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "", "SI")
            formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
            rowCells.push(compCellName, formula)
            rowCells.push("")
            blockCells.push(rowCells)


            // --- write block --- //

            let nrOfRows = blockCells.length
            let nrOfCols = blockCells[0].length
            Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols)
                .setValues(blockCells)

            activeRow = activeRow + nrOfRows


        } // END INDICATOR
    } // END INDICATOR CATEGORY


    lastRow = activeRow

    return lastRow

}
