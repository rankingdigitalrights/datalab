/* global
    Config,
    indexPrefix,
    defineNamedRangeStringImport,
    columnToLetter
*/


// Imports previous year's outcome as Step 0
// assigns YYS07 ID to element results & comments
// TODO: make Prefix correct (i.e. "RDR19") & dynamic (from variable)
function importYonYResults(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices, isComments) {

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Step.components[stepCNr]
    let stepCompID = Step.components[stepCNr].id

    // for stepwise formatting
    // TODO
    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows, rangeCols, stepRange, dataRange

    let Cell, cellID, Element, subIndicator, cellValue, targetColumn

    let hasPredecessor

    let naText = isComments ? Config.newElementLabelComment : Config.newElementLabelResult

    // element-wise ~ row-wise

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        // --- 1.) Row Labels --- //

        activeCol = 1
        // serviceNr = column / service
        // ~ serviceNr = 0 -> Labels
        // ~ serviceNr = 1 Group
        // ~ serviceNr = 2 OpCom

        Element = Elements[elemNr]
        hasPredecessor = isComments ? Element.y2yCommentRow : Element.y2yResultRow

        if (hasPredecessor) {
            cellValue = "=CONCATENATE(" + "\"" + StepComp.rowLabel + "\"" + "," + "REGEXEXTRACT(" + "'" + Config.prevYearOutcomeTab + "'!$A$" + (hasPredecessor) + ", " + "\"[A-Z]\\d+\.\\d+\"" + ")," + " \" (2019)\"" + ")"
        } else(
            cellValue = StepComp.rowLabel + Element.labelShort + " (new)"
        )

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Step.subStepColor)

        activeCol += 1

        // --- 2.) Cell Values --- // 
        /* element-wise procedure from labels column 1 over services (~columns) */

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // address hard-coded offeset 3 with company JSON

            // setting up company column(s)
            if (serviceNr == 1) {

                // sets up as many columns as the indicator has components
                for (let k = 0; k < nrOfSubIndicators; k++) {
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, "group", stepCompID)

                    if (hasPredecessor) {
                        // calculates which column
                        targetColumn = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k
                        let col = columnToLetter(targetColumn)
                        cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + hasPredecessor
                    } else {
                        cellValue = naText
                    }

                    Cell.setValue(cellValue.toString())
                    SS.setNamedRange(cellID, Cell) // TODO: make row-wise | step-wise assignment

                    activeCol += 1
                } // close nrOfSubIndicators for loop
            } // close serviceNr==1 if statement


            // setting up opCom column
            else if (serviceNr == 2) {

                // loops through the number of components
                for (let k = 0; k < nrOfSubIndicators; k++) {

                    // sets Cell
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // creating the name of Cell it will be compared to

                    subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, "opCom", stepCompID)

                    if (hasPredecessor) {
                        // calculates which column
                        targetColumn = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k
                        let col = columnToLetter(targetColumn)
                        cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + hasPredecessor
                    } else {
                        cellValue = naText
                    }

                    Cell.setValue(cellValue.toString())
                    SS.setNamedRange(cellID, Cell)

                    activeCol += 1
                } // close nrOfSubIndicators for loop
            } // close serviceNr==2 if statement


            // setting up services column(s9
            else {

                // looping thourough the number of components
                for (let k = 0; k < nrOfSubIndicators; k++) {

                    // setting Cell
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // finding the name of Cell that it will be compared too
                    let s = serviceNr - 3
                    subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                    if (hasPredecessor) {
                        // calculates which column
                        targetColumn = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k
                        let col = columnToLetter(targetColumn)
                        cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + hasPredecessor
                    } else {
                        cellValue = naText
                    }

                    Cell.setValue(cellValue.toString())
                    SS.setNamedRange(cellID, Cell)

                    activeCol += 1
                }
            } // services END
        } // single element END
    } // whole element-wise iteration END

    // adding the conditional formating so that the Cell turns red if the answer is no

    rangeCols = activeCol
    rangeRows = elementsNr

    let range = Sheet.getRange(activeRow, rangeStartCol + 1, rangeRows, rangeCols)
        .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)

    let rule = SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("No")
        .setBackground("#fa7661")
        .setRanges([range])
        .build()

    let rules = Sheet.getConditionalFormatRules()
    rules.push(rule)
    Sheet.setConditionalFormatRules(rules)

    //format Component block
    if (!isComments) {
        Sheet.getRange(rangeStartRow, rangeStartCol + 1, rangeRows, rangeCols)
            .setFontWeight("bold")
            .setHorizontalAlignment("center")
    }
    activeRow = activeRow + elementsNr
    return activeRow
}

function importYonYSources(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices, isComments) {

    let Elements = Indicator.elements
    let elementsNr = Elements.length
    // TODO: temporary offset
    // re-implement with element.predecessorRow || predecessorElementID
    let offsetRowLastYear = isComments ? Indicator.y2yCompRow + elementsNr : Indicator.y2yCompRow

    let rangeStartRow = activeRow
    let rangeStartCol = 2
    let rangeRows
    let rangeCols = 1 + companyNumberOfServices + 2

    // element-wise ~ row-wise

    let Cell

    for (let elemNr = 0; elemNr < 1; elemNr++) {
        let activeCol = 1
        // serviceNr = column / service
        // ~ serviceNr = 0 -> Labels
        // ~ serviceNr = 1 Group
        // ~ serviceNr = 2 OpCom


        // row labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(Step.components[stepCNr].rowLabel + Elements[elemNr].labelShort)
            .setBackground(Step.subStepColor)
        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // address hard-coded offeset 3 with company JSON

            // setting up company column(s)
            if (serviceNr == 1) {

                // sets up as many columns as the indicator has components
                for (let k = 0; k < nrOfSubIndicators; k++) {
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    let subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, "group")

                    // sets up formula that compares values
                    let value = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k // calculates which column
                    let col = columnToLetter(value)
                    // TODO

                    let formula = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + (offsetRowLastYear + elemNr)

                    Cell.setFormula(formula.toString())

                    activeCol += 1
                } // close nrOfSubIndicators for loop
            } // close serviceNr==1 if statement


            // setting up opCom column
            else if (serviceNr == 2) {

                // loops through the number of components
                for (let k = 0; k < nrOfSubIndicators; k++) {

                    // sets Cell
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // creating the name of Cell it will be compared to

                    let subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, "opCom")

                    // creating formula that compares the two cells
                    let value = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k
                    // finds comparisson column
                    let col = columnToLetter(value)
                    // TODO

                    let formula = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + (offsetRowLastYear + elemNr)

                    Cell.setFormula(formula.toString())


                    activeCol += 1
                } // close nrOfSubIndicators for loop
            } // close serviceNr==2 if statement


            // setting up services column(s9
            else {

                // looping thourough the number of components
                for (let k = 0; k < nrOfSubIndicators; k++) {

                    // setting Cell
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // finding the name of Cell that it will be compared too
                    let s = serviceNr - 3
                    let subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, Company.services[s].id)

                    // creating formula that will be placed in Cell
                    let value = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k // calculates which column
                    let col = columnToLetter(value)
                    // TODO

                    let formula = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + (offsetRowLastYear + elemNr)

                    Cell.setFormula(formula.toString())

                    activeCol += 1
                }
            }
        }
    }

    // adding the conditional formating so that the Cell turns red if the answer is no
    let colMax = columnToLetter(2 + (companyNumberOfServices + 2) * nrOfSubIndicators)
    let rowMax = activeRow + elementsNr

    let range = Sheet.getRange(activeRow, 2, elementsNr, 2 + (companyNumberOfServices + 2) * nrOfSubIndicators)

    let rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("No").setBackground("#fa7661").setRanges([range]).build()
    let rules = Sheet.getConditionalFormatRules()
    rules.push(rule)
    Sheet.setConditionalFormatRules(rules)

    range.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)

    activeRow = activeRow + elementsNr
    return activeRow
}
