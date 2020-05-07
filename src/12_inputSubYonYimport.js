/* global
    Config,
    indexPrefix,
    defineNamedRangeStringImport,
    columnToLetter
*/


// Imports previous year's outcome as Substep 0
// assigns YYS07 ID to element results & comments
// TODO: make Prefix correct (i.e. "RDR19") & dynamic (from variable)
function importYonYResults(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices, isComments) {

    let comparisonIndexPrefix = Config.prevIndexPrefix


    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id

    let prevStep = StepComp.prevStep // "S07"
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
            cellValue = "=CONCATENATE(" + "\"" + StepComp.rowLabel + "\"" + "," + "REGEXEXTRACT(" + "'" + Config.prevYearOutcomeTab + "'!$A$" + (hasPredecessor) + ", " + "\"[A-Z]\\d+\.\\d+\"" + ")," +
                "" + ")"
        } else(
            cellValue = StepComp.rowLabel + Element.labelShort + " (new)"
        )

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)

        if (!isComments) {
            Cell.setFontWeight("bold")
        }

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

                    cellID = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, prevStep, Elements[elemNr].labelShort, subIndicator, Company.id, "group", stepCompID)

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

                    cellID = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, prevStep, Elements[elemNr].labelShort, subIndicator, Company.id, "opCom", stepCompID)

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

                    cellID = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, prevStep, Elements[elemNr].labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

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

function importYonYSources(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices, isComments) {

    let comparisonIndexPrefix = Config.prevIndexPrefix

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id

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
        .setBackground(Substep.subStepColor)

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

                cellID = defineNamedRangeStringImport(comparisonIndexPrefix, "DC", "S07", Indicator.labelShort, subIndicator, Company.id, "group", stepCompID)

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

                cellID = defineNamedRangeStringImport(comparisonIndexPrefix, "DC", "S07", Indicator.labelShort, subIndicator, Company.id, "opCom", stepCompID)

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

                cellID = defineNamedRangeStringImport(comparisonIndexPrefix, "DC", "S07", Indicator.labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

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
// if not TODO: adapt to Substep 0 pattern

function addComparisonYonY(SS, Sheet, Indicator, Company, mainStepNr, activeRow, Substep, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices) {




    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id // TODO: add to JSON

    let evaluationStep = StepComp.evaluationStep
    let prevStep = StepComp.prevStep

    let comparisonType = StepComp.comparisonType
    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    let naText = Config.newElementLabelResult

    let prevYearCell

    let Cell, cellValue, Element, noteString, cellID, subIndicator, prevResultCell, labelFormula

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        activeCol = 1
        // serviceNr = column / service
        // ~ serviceNr = 0 -> Labels
        // ~ serviceNr = 1 Group
        // ~ serviceNr = 2 OpCom

        Element = Elements[elemNr]

        let hasPredecessor = Element.y2yResultRow ? true : false

        noteString = Element.labelShort + ": " + Element.description

        labelFormula = StepComp.rowLabel + Element.labelShort

        if (!hasPredecessor) labelFormula += (" (new)")

        // Row Labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(labelFormula)
            .setBackground(Substep.subStepColor)
            .setFontWeight("bold")
            .setNote(noteString)

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

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, subIndicator, Company.id, "group", stepCompID)

                    if (hasPredecessor || mainStepNr > 1) {

                        prevResultCell = defineNamedRangeStringImport(indexPrefix, "DC", prevStep, Element.labelShort, subIndicator, Company.id, "group", comparisonType)

                        prevYearCell = defineNamedRangeStringImport(compIndexPrefix, "DC", evaluationStep, Element.labelShort, subIndicator, Company.id, "group", comparisonType)

                        // sets up cellValue that compares values
                        cellValue = "=IF(" + prevResultCell + "=" + prevYearCell + "," + "\"Yes\"" + "," + "\"No\"" + ")"

                    } else {
                        cellValue = naText
                    }

                    Cell.setValue(cellValue.toString())

                    SS.setNamedRange(cellID, Cell) // names cells

                    activeCol += 1
                } // close nrOfSubIndicators for loop
            } // close serviceNr==1 if statement


            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (let k = 0; k < nrOfSubIndicators; k++) {

                    // sets Cell
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, subIndicator, Company.id, "opCom", stepCompID)

                    //OpComp-specific "N/A" for Non-Telecommunication Companies   
                    if (Company.hasOpCom == false) {
                        Cell.setValue("N/A") // if no OpCom, pre-select N/A
                    } else {

                        if (hasPredecessor || mainStepNr > 1) {

                            prevResultCell = defineNamedRangeStringImport(indexPrefix, "DC", prevStep, Element.labelShort, subIndicator, Company.id, "opCom", comparisonType)

                            prevYearCell = defineNamedRangeStringImport(compIndexPrefix, "DC", evaluationStep, Element.labelShort, subIndicator, Company.id, "opCom", comparisonType)

                            // sets up cellValue that compares values
                            cellValue = "=IF(" + prevResultCell + "=" + prevYearCell + "," + "\"Yes\"" + "," + "\"No\"" + ")"

                        } else {
                            cellValue = naText
                        }

                        Cell.setValue(cellValue.toString())

                    }

                    SS.setNamedRange(cellID, Cell) // names cells

                    activeCol += 1
                }
            }


            // setting up services column(s9
            else {

                // looping thourough the number of components
                for (let k = 0; k < nrOfSubIndicators; k++) {

                    // setting Cell
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // finding the name of Cell that it will be compared too
                    let s = serviceNr - 3

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                    if (hasPredecessor || mainStepNr > 1) {

                        subIndicator = ""
                        if (nrOfSubIndicators != 1) {
                            subIndicator = Category.components[k].labelShort
                        }

                        prevResultCell = defineNamedRangeStringImport(indexPrefix, "DC", prevStep, Element.labelShort, subIndicator, Company.id, Company.services[s].id, comparisonType)

                        prevYearCell = defineNamedRangeStringImport(compIndexPrefix, "DC", evaluationStep, Element.labelShort, subIndicator, Company.id, Company.services[s].id, comparisonType)

                        // sets up cellValue that compares values
                        cellValue = "=IF(" + prevResultCell + "=" + prevYearCell + "," + "\"Yes\"" + "," + "\"No\"" + ")"

                    } else {
                        cellValue = naText
                    }

                    Cell.setValue(cellValue.toString())

                    SS.setNamedRange(cellID, Cell) // names cells

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

function addYonYReview(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices) {

    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id

    // for first review, check if Substep should review the outcome from a different Index; if yes, change compared Index Prefix 

    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    let prevStep = StepComp.prevStep // "S07"
    let evaluationStep = StepComp.evaluationStep // the binary Review or Eval Substep which is evaluated
    let comparisonType = StepComp.comparisonType // "DC",

    let evaluationCell, prevResultCell

    let yesAnswer = StepComp.mode === "YonY" ? "no change" : "not selected"

    let naText = Config.newElementLabelResult


    // for linking to Named Range of Substep 0
    // TODO: make a shared function() between importYonY & addStepReview

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows
    let rangeCols

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(StepComp.dropdown).build()

    let Cell, cellValue, Element, noteString, cellID, subIndicator, labelFormula

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        Element = Elements[elemNr]

        let hasPredecessor = Element.y2yResultRow ? true : false

        // 1.) Row Labels

        activeCol = 1
        labelFormula = StepComp.rowLabel + Element.labelShort

        noteString = Element.labelShort + ": " + Element.description

        if (!hasPredecessor) labelFormula += (" (new)")

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(labelFormula)
            .setBackground(Substep.subStepColor)
            .setFontWeight("bold")
            .setNote(noteString)

        activeCol += 1

        // 2.) Value Cells

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // creates column(s) for overall company
            if (serviceNr == 1) {

                // loops through the number of components
                for (let k = 0; k < nrOfSubIndicators; k++) {

                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    subIndicator = nrOfSubIndicators != 1 ? Category.components[k].labelShort : ""

                    // Cell name formulas; output defined in 44_rangeNamingHelper.js
                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, subIndicator, Company.id, "group", stepCompID)

                    if (hasPredecessor) {

                        evaluationCell = defineNamedRangeStringImport(indexPrefix, "DC", evaluationStep, Element.labelShort, subIndicator, Company.id, "group", comparisonType)

                        prevResultCell = defineNamedRangeStringImport(compIndexPrefix, "DC", prevStep, Element.labelShort, subIndicator, Company.id, "group", stepCompID)

                        // sets up cellValue that compares values

                        cellValue = "=IF(" + evaluationCell + "=\"yes\"" + "," + "\"" + yesAnswer + "\"" + "," + "\"not selected\"" + ")"

                    } else {
                        cellValue = naText
                    }

                    Cell.setValue(cellValue.toString())

                    // creates dropdown list & boldens
                    Cell.setDataValidation(rule).setFontWeight("bold")

                    SS.setNamedRange(cellID, Cell) // names cells

                    activeCol += 1
                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (let k = 0; k < nrOfSubIndicators; k++) {
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)
                    // Cell name formulas; output defined in 44_rangeNamingHelper.js
                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, subIndicator, Company.id, "opCom", stepCompID)

                    //OpComp-specific "N/A" for Non-Telecommunication Companies   
                    if (Company.hasOpCom == false) {
                        Cell.setValue("N/A") // if no OpCom, pre-select N/A
                    } else {

                        if (hasPredecessor) {

                            subIndicator = nrOfSubIndicators != 1 ? Category.components[k].labelShort : ""
                            evaluationCell = defineNamedRangeStringImport(indexPrefix, "DC", evaluationStep, Element.labelShort, subIndicator, Company.id, "opCom", comparisonType)

                            prevResultCell = defineNamedRangeStringImport(compIndexPrefix, "DC", prevStep, Element.labelShort, subIndicator, Company.id, "opCom", stepCompID)

                            // sets up cellValue that compares values
                            cellValue = "=IF(" + evaluationCell + "=\"yes\"" + "," + "\"" + yesAnswer + "\"" + "," + "\"not selected\"" + ")"

                        } else {
                            cellValue = naText
                        }

                        Cell.setValue(cellValue.toString())

                        // creates dropdown list & boldens
                        Cell.setDataValidation(rule).setFontWeight("bold")
                    }

                    SS.setNamedRange(cellID, Cell) // names cells

                    activeCol += 1
                }
            }

            // creating all the service columns
            else {
                for (let k = 0; k < nrOfSubIndicators; k++) {
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    let s = serviceNr - 3 // helper for Services

                    // Cell name formulas; output defined in 44_rangeNamingHelper.js
                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                    if (hasPredecessor) {

                        subIndicator = nrOfSubIndicators != 1 ? Category.components[k].labelShort : ""

                        evaluationCell = defineNamedRangeStringImport(indexPrefix, "DC", evaluationStep, Element.labelShort, subIndicator, Company.id, Company.services[s].id, comparisonType)

                        prevResultCell = defineNamedRangeStringImport(compIndexPrefix, "DC", prevStep, Element.labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                        // sets up cellValue that compares values
                        cellValue = "=IF(" + evaluationCell + "=\"yes\"" + "," + "\"" + yesAnswer + "\"" + "," + "\"not selected\"" + ")"

                    } else {
                        cellValue = naText
                    }

                    Cell.setValue(cellValue.toString())

                    SS.setNamedRange(cellID, Cell) // names cells

                    // creates dropdown list & boldens
                    Cell.setDataValidation(rule).setFontWeight("bold")

                    activeCol += 1
                } // service END
            } // services END
        } // single Element END
    } // whole Elements Iteration END

    activeRow = activeRow + elementsNr

    rangeCols = activeCol
    rangeRows = elementsNr

    Sheet.getRange(rangeStartRow, rangeStartCol + 1, rangeRows, rangeCols)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")

    return activeRow
}
