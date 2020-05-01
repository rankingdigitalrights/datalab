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

    let comparisonIndexPrefix = Config.prevIndexPrefix


    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Step.components[stepCNr]
    let stepCompID = Step.components[stepCNr].id

    let comparisonStep = StepComp.comparisonStep // "S07"
    let comparisonType = StepComp.comparisonType // "DC",

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

                    cellID = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, comparisonStep, Elements[elemNr].labelShort, subIndicator, Company.id, "group", stepCompID)

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

                    cellID = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, comparisonStep, Elements[elemNr].labelShort, subIndicator, Company.id, "opCom", stepCompID)

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

                    cellID = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, comparisonStep, Elements[elemNr].labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

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

    // let rule = SpreadsheetApp.newConditionalFormatRule()
    //     .whenTextEqualTo("No")
    //     .setBackground("#fa7661")
    //     .setRanges([range])
    //     .build()

    // let rules = Sheet.getConditionalFormatRules()
    // rules.push(rule)
    // Sheet.setConditionalFormatRules(rules)

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

    let comparisonIndexPrefix = Config.prevIndexPrefix

    let StepComp = Step.components[stepCNr]
    let stepCompID = Step.components[stepCNr].id

    // for stepwise formatting
    // TODO
    let Cell, cellID, subIndicator, cellValue, targetColumn

    let hasPredecessor

    let naText = isComments ? Config.newElementLabelComment : Config.newElementLabelResult

    // element-wise ~ row-wise

    let activeCol = 1

    // --- 1.) Row Labels --- //


    // serviceNr = column / service
    // ~ serviceNr = 0 -> Labels
    // ~ serviceNr = 1 Group
    // ~ serviceNr = 2 OpCom

    hasPredecessor = Indicator.previousIndicator ? true : false

    let targetRow = hasPredecessor ? (Indicator.y2yCompRow + (Indicator.previousLength * 2)) : null

    cellValue = StepComp.rowLabel

    Cell = Sheet.getRange(activeRow, activeCol)
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
                Cell = Sheet.getRange(activeRow, activeCol)

                subIndicator = ""
                if (nrOfSubIndicators != 1) {
                    subIndicator = Category.components[k].labelShort
                }

                cellID = defineNamedRangeStringImport(comparisonIndexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Indicator.labelShort, subIndicator, Company.id, "group", stepCompID)

                if (hasPredecessor) {
                    // calculates which column
                    targetColumn = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k
                    let col = columnToLetter(targetColumn)
                    cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + targetRow
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
                Cell = Sheet.getRange(activeRow, activeCol)

                // creating the name of Cell it will be compared to

                subIndicator = ""
                if (nrOfSubIndicators != 1) {
                    subIndicator = Category.components[k].labelShort
                }

                cellID = defineNamedRangeStringImport(comparisonIndexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Indicator.labelShort, subIndicator, Company.id, "opCom", stepCompID)

                if (hasPredecessor) {
                    // calculates which column
                    targetColumn = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k
                    let col = columnToLetter(targetColumn)
                    cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + targetRow
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
                Cell = Sheet.getRange(activeRow, activeCol)

                // finding the name of Cell that it will be compared too
                let s = serviceNr - 3
                subIndicator = ""
                if (nrOfSubIndicators != 1) {
                    subIndicator = Category.components[k].labelShort
                }

                cellID = defineNamedRangeStringImport(comparisonIndexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Indicator.labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                if (hasPredecessor) {
                    // calculates which column
                    targetColumn = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k
                    let col = columnToLetter(targetColumn)
                    cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + targetRow
                } else {
                    cellValue = naText
                }

                Cell.setValue(cellValue.toString())
                SS.setNamedRange(cellID, Cell)

                activeCol += 1
            }
        } // services END
    } // single row END

    Sheet.getRange(activeRow, 2, 1, activeCol).setHorizontalAlignment("center")

    activeRow += 1

    return activeRow
}

// regular x.5 comparison of step with previous year's outcome
// probably obsolete
// if not TODO: adapt to Step 0 pattern

function addComparisonYonY(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices) {

    let resultStepID = Step.resultStepID

    let comparisonIndexPrefix = Config.prevIndexPrefix

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Step.components[stepCNr]

    let stepCompID = "MR" // TODO: add to JSON
    let comparisonStep = "S07" // TODO: add to JSON
    let comparisonType = "DC" // TODO: add to JSON

    let prevYearCell

    let Cell, cellValue, Element, cellID, subIndicator, prevResultCell

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        activeCol = 1
        // serviceNr = column / service
        // ~ serviceNr = 0 -> Labels
        // ~ serviceNr = 1 Group
        // ~ serviceNr = 2 OpCom

        Element = Elements[elemNr]

        // Row Labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(StepComp.rowLabel + Element.labelShort)
            .setBackground(Step.subStepColor)
        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // TODO: address hard 3 with company JSON

            // setting up company column(s)
            if (serviceNr == 1) {

                // sets up as many columns as the indicator has components
                for (let k = 0; k < nrOfSubIndicators; k++) {
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    prevResultCell = defineNamedRangeStringImport(indexPrefix, "DC", resultStepID, Element.labelShort, subIndicator, Company.id, "group")

                    prevYearCell = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, comparisonStep, Element.labelShort, subIndicator, Company.id, "group", stepCompID)

                    // sets up cellValue that compares values
                    cellValue = "=IF(" + prevResultCell + "=" + prevYearCell + "," + "\"Yes\"" + "," + "\"No\"" + ")"
                    Cell.setValue(cellValue.toString())

                    activeCol += 1
                } // close nrOfSubIndicators for loop
            } // close serviceNr==1 if statement


            // setting up opCom column(s)
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
                    prevResultCell = defineNamedRangeStringImport(indexPrefix, "DC", resultStepID, Element.labelShort, subIndicator, Company.id, "opCom")

                    prevYearCell = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, comparisonStep, Element.labelShort, subIndicator, Company.id, "opCom", stepCompID)

                    // sets up cellValue that compares values
                    cellValue = "=IF(" + prevResultCell + "=" + prevYearCell + "," + "\"Yes\"" + "," + "\"No\"" + ")"

                    Cell.setValue(cellValue.toString())


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

                    prevResultCell = defineNamedRangeStringImport(indexPrefix, "DC", resultStepID, Element.labelShort, subIndicator, Company.id, Company.services[s].id)

                    prevYearCell = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, comparisonStep, Element.labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                    // sets up cellValue that compares values
                    cellValue = "=IF(" + prevResultCell + "=" + prevYearCell + "," + "\"Yes\"" + "," + "\"No\"" + ")"
                    Cell.setValue(cellValue.toString())

                    activeCol += 1
                }
            }
        }
    }

    // conditional formating so that the Cell turns red if the answer is no
    let Range = Sheet.getRange(activeRow, 2, elementsNr, 2 + (companyNumberOfServices + 2) * nrOfSubIndicators)

    Range.setHorizontalAlignment("center")

    let Rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("No").setBackground("#fa7661").setRanges([Range]).build()
    let Rules = Sheet.getConditionalFormatRules()
    Rules.push(Rule)
    Sheet.setConditionalFormatRules(Rules)


    activeRow = activeRow + elementsNr
    return activeRow
}
