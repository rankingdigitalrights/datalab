/* global
    Config,
    indexPrefix,
    defineNamedRange,
    columnToLetter
*/


// Imports previous year's outcome as Substep 0

function importYonYResults(SS, Sheet, Indicator, category, Company, activeRow, Substep, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices, isComments) {

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

    let hasPredecessor, isRevised
    let subIndOffset = 0
    let subCatLabel = ""
    let hasSubindicator = (category == "G") ? true : false


    let naText = isComments ? Config.newElementLabelComment : Config.newElementLabelResult

    // element-wise ~ row-wise

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        // --- 1.) Row Labels --- //

        activeCol = 1

        Element = Elements[elemNr]
        hasPredecessor = isComments ? Element.y2yCommentRow : Element.y2yResultRow
        isRevised = Element.isRevised ? true : false

        if (hasSubindicator) {
            Element.prevSubInd ? subCatLabel = "\" (" + Element.prevSubInd + ")\"" : ""
            if (Element.prevSubInd == "P") {
                subIndOffset = 1
            } else {
                subIndOffset = 0
            }
        }

        if (hasPredecessor) {
            cellValue = "=CONCATENATE(" + "\"" + StepComp.rowLabel + "\"" + "," + "REGEXEXTRACT(" + "'" + Config.prevYearOutcomeTab + "'!$A$" + (hasPredecessor) + ", " + "\"[A-Z]\\d+\\.\\d+\"" + ")," +
                subCatLabel + ")"

        } else {
            cellValue = StepComp.rowLabel + Element.labelShort
            cellValue += isRevised ? (" (rev.)") : !hasPredecessor ? (" (new)") : ""
        }

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)

        if (!isComments) {
            Cell.setFontWeight("bold")
        }

        activeCol += 1

        // --- 2.) Cell Values --- // 
        /* element-wise procedure from labels column 1 over services (~columns) */

        let serviceLabel

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // address hard-coded offeset 3 with company JSON

            if (serviceNr == 1) {
                serviceLabel = "group"
            } else if (serviceNr == 2) {
                serviceLabel = "opCom"
            } else {
                let s = serviceNr - 3
                serviceLabel = Company.services[s].id
            }

            // looping thourough the number of components

            // setting Cell
            Cell = Sheet.getRange(activeRow + elemNr, activeCol)

            // finding the name of Cell that it will be compared too
            subIndicator = ""

            cellID = defineNamedRange(comparisonIndexPrefix, comparisonType, prevStep, Elements[elemNr].labelShort, subIndicator, Company.id, serviceLabel, stepCompID)

            if (hasPredecessor) {
                // calculates which column
                targetColumn = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators)
                let col = columnToLetter(targetColumn, subIndOffset)
                cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + hasPredecessor
            } else {
                cellValue = naText
            }

            Cell.setValue(cellValue.toString())
            SS.setNamedRange(cellID, Cell)

            activeCol += 1
        } // services END
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

// TODO: What to do about G Sources for mixed Subindicator Compositions?

function importYonYSources(SS, Sheet, Indicator, category, Company, activeRow, Substep, stepCNr, Category, companyNumberOfServices, isComments) {

    let comparisonIndexPrefix = Config.prevIndexPrefix

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id

    // for stepwise formatting
    // TODO
    let Cell, cellID, cellValue, targetColumn

    let hasPredecessor = Indicator.prevIndicator ? true : false
    let targetRow = hasPredecessor ? (Indicator.y2yCompRow + (Indicator.prevIndLength * 2)) : null

    let subIndOffset = 0
    let subCatLabel = ""
    let hasSubindicator = (category == "G") ? true : false // TODO: Category.hadSubComponents

    let naText = isComments ? Config.newElementLabelComment : Config.newElementLabelResult

    // for whole indicator

    let activeCol

    // --- 1.) Row Labels --- //

    activeCol = 1

    if (!hasSubindicator) {
        cellValue = StepComp.rowLabel
    } else {
        cellValue = StepComp.rowLabel + " (F | P)"
    }

    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(cellValue)
        .setBackground(Substep.subStepColor)

    activeCol += 1

    // --- 2.) Cell Values --- // 
    /* element-wise procedure from labels column 1 over services (~columns) */

    let serviceLabel

    for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // address hard-coded offset 3 with company JSON

        if (serviceNr == 1) {
            serviceLabel = "group"
        } else if (serviceNr == 2) {
            serviceLabel = "opCom"
        } else {
            let s = serviceNr - 3
            serviceLabel = Company.services[s].id
        }

        Cell = Sheet.getRange(activeRow, activeCol)

        cellID = defineNamedRange(comparisonIndexPrefix, "DC", "S07", Indicator.labelShort, "", Company.id, serviceLabel, stepCompID)

        if (hasPredecessor) {
            // calculates which column
            targetColumn = Indicator.y2yCompColumn + (serviceNr - 1)
            let col = columnToLetter(targetColumn, 0)

            if (!hasSubindicator) {

                cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + targetRow
            } else {

                let col2 = columnToLetter(targetColumn, 1)

                let cellA = "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + targetRow
                let cellB = "'" + Config.prevYearOutcomeTab + "'" + "!$" + col2 + "$" + targetRow

                cellValue = "=CONCATENATE(" + cellA + ",\" | \"," + cellB + ")"

            }

        } else {
            cellValue = naText
        }

        Cell.setValue(cellValue.toString())
        SS.setNamedRange(cellID, Cell)

        activeCol += 1

    } // single row END

    Sheet.getRange(activeRow, 2, 1, activeCol).setHorizontalAlignment("center")

    activeRow += 1

    return activeRow
}

// regular x.5 comparison of step with previous year's outcome
// probably obsolete
// if not TODO: adapt to Substep 0 pattern

function addComparisonYonY(SS, Sheet, Indicator, Company, mainStepNr, activeRow, Substep, stepCNr, Category, companyNumberOfServices) {

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

    let Cell, cellValue, Element, noteString, cellID, prevResultCell

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        activeCol = 1
        // serviceNr = column / service
        // ~ serviceNr = 0 -> Labels
        // ~ serviceNr = 1 Group
        // ~ serviceNr = 2 OpCom

        Element = Elements[elemNr]

        let hasPredecessor = Element.y2yResultRow ? true : false
        let isRevised = Element.isRevised ? true : false

        noteString = Element.labelShort + ": " + Element.description

        cellValue = StepComp.rowLabel + Element.labelShort

        cellValue += isRevised ? (" (rev.)") : !hasPredecessor ? (" (new)") : ""

        // Row Labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)
            .setFontWeight("bold")
            .setNote(noteString)

        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // TODO: address hard 3 with company JSON

            // setting up company column(s)
            if (serviceNr == 1) {

                // sets up as many columns as the indicator has components
                Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, "group", stepCompID)

                if (hasPredecessor || mainStepNr > 1) {

                    prevResultCell = defineNamedRange(indexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, "group", comparisonType)

                    prevYearCell = defineNamedRange(compIndexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, "group", comparisonType)

                    // sets up cellValue that compares values
                    cellValue = "=IF(" + prevResultCell + "=" + prevYearCell + "," + "\"Yes\"" + "," + "\"No\"" + ")"

                } else {
                    cellValue = naText
                }

                Cell.setValue(cellValue.toString())

                SS.setNamedRange(cellID, Cell) // names cells

                activeCol += 1
            } // close serviceNr==1 if statement


            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // sets Cell
                Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, "opCom", stepCompID)

                //OpComp-specific "N/A" for Non-Telecommunication Companies   
                if (Company.hasOpCom == false) {
                    Cell.setValue("N/A") // if no OpCom, pre-select N/A
                } else {

                    if (hasPredecessor || mainStepNr > 1) {

                        prevResultCell = defineNamedRange(indexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, "opCom", comparisonType)

                        prevYearCell = defineNamedRange(compIndexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, "opCom", comparisonType)

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


            // setting up services column(s9
            else {

                // setting Cell
                Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                // finding the name of Cell that it will be compared too
                let s = serviceNr - 3

                cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, Company.services[s].id, stepCompID)

                if (hasPredecessor || mainStepNr > 1) {


                    prevResultCell = defineNamedRange(indexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, Company.services[s].id, comparisonType)

                    prevYearCell = defineNamedRange(compIndexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, Company.services[s].id, comparisonType)

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

    // conditional formating so that the Cell turns red if the answer is no
    let Range = Sheet.getRange(activeRow, 2, elementsNr, 2 + (companyNumberOfServices + 2))

    Range.setHorizontalAlignment("center")

    let Rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("No").setBackground("#fa7661").setRanges([Range]).build()
    let Rules = Sheet.getConditionalFormatRules()
    Rules.push(Rule)
    Sheet.setConditionalFormatRules(Rules)


    activeRow = activeRow + elementsNr
    return activeRow
}

function addYonYReview(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, Category, companyNumberOfServices) {

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

    let reviewCell, prevResultCell

    let yesAnswer = StepComp.mode === "YonY" ? "no change" : "not selected"

    let naText = Config.newElementLabelResult


    // for linking to Named Range of Substep 0
    // TODO: make a shared function() between importYonY & addStepReview

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows
    let rangeCols

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(StepComp.dropdown).build()

    let Cell, cellValue, Element, noteString, cellID

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        Element = Elements[elemNr]

        let hasPredecessor = Element.y2yResultRow ? true : false
        let isRevised = Element.isRevised ? true : false

        // 1.) Row Labels

        activeCol = 1
        cellValue = StepComp.rowLabel + Element.labelShort

        noteString = Element.labelShort + ": " + Element.description

        cellValue += isRevised ? (" (rev.)") : !hasPredecessor ? (" (new)") : ""

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)
            .setFontWeight("bold")
            .setNote(noteString)

        activeCol += 1

        // 2.) Value Cells

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // creates column(s) for overall company
            if (serviceNr == 1) {


                Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                // Cell name formulas; output defined in 44_rangeNamingHelper.js
                cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, "group", stepCompID)

                if (hasPredecessor) {

                    reviewCell = defineNamedRange(indexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, "group", comparisonType)

                    prevResultCell = defineNamedRange(compIndexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, "group", stepCompID)

                    // sets up cellValue that compares values

                    cellValue = "=IF(" + reviewCell + "=\"yes\"" + "," + "\"" + yesAnswer + "\"" + "," + "\"not selected\"" + ")"

                    Cell.setDataValidation(rule)
                } else {
                    cellValue = naText
                }

                Cell.setValue(cellValue.toString())
                    .setFontWeight("bold")

                // creates dropdown list & boldens

                SS.setNamedRange(cellID, Cell) // names cells

                activeCol += 1

            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                Cell = Sheet.getRange(activeRow + elemNr, activeCol)
                // Cell name formulas; output defined in 44_rangeNamingHelper.js
                cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, "opCom", stepCompID)

                //OpComp-specific "N/A" for Non-Telecommunication Companies   
                if (Company.hasOpCom == false) {
                    Cell.setValue("N/A") // if no OpCom, pre-select N/A
                } else {

                    if (hasPredecessor) {

                        reviewCell = defineNamedRange(indexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, "opCom", comparisonType)

                        prevResultCell = defineNamedRange(compIndexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, "opCom", stepCompID)

                        // sets up cellValue that compares values
                        cellValue = "=IF(" + reviewCell + "=\"yes\"" + "," + "\"" + yesAnswer + "\"" + "," + "\"not selected\"" + ")"
                        Cell.setDataValidation(rule)
                    } else {
                        cellValue = naText
                    }

                    Cell.setValue(cellValue.toString()).setFontWeight("bold")

                    // creates dropdown list & boldens
                }

                SS.setNamedRange(cellID, Cell) // names cells

                activeCol += 1

            }

            // creating all the service columns
            else {
                Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                let s = serviceNr - 3 // helper for Services

                cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, Company.services[s].id, stepCompID)

                if (hasPredecessor) {


                    reviewCell = defineNamedRange(indexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, Company.services[s].id, comparisonType)

                    prevResultCell = defineNamedRange(compIndexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, Company.services[s].id, stepCompID)

                    // sets up cellValue that compares values
                    cellValue = "=IF(" + reviewCell + "=\"yes\"" + "," + "\"" + yesAnswer + "\"" + "," + "\"not selected\"" + ")"
                    Cell.setDataValidation(rule)

                } else {
                    cellValue = naText
                }

                Cell.setValue(cellValue.toString()).setFontWeight("bold")

                SS.setNamedRange(cellID, Cell) // names cells

                // creates dropdown list & boldens

                activeCol += 1
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
