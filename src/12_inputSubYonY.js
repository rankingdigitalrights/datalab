/* global
    centralConfig,
    indexPrefix,
    defineNamedRangeStringImport,
    columnToLetter
*/

// for binaryYYCheck 
// let compCell = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, "group")

// New Step 1; similar to Step 1.5 but integrated into old Step 1
// - has dropdown with evaluation options
// - compares result of step 0 review (yes/no/not selected)
// - and either pulls element results or picks "not selected"
function addEvaluationYonY(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices) {

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Step.components[stepCNr]

    let idYonY = StepComp.idYonY // "YY"
    let stepYonY = StepComp.stepYonY // "S07"
    let binaryEvalID = "MY"

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(StepComp.dropdown).build()

    let evaluationCell, prevResultCell

    let stepCompID = StepComp.id
    let idYonYType = StepComp.idYonYType

    let Cell, Element, noteString, cellID, subIndicator


    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        let activeCol = 1

        Element = Elements[elemNr]

        noteString = Element.labelShort + ": " + Element.description

        // Row Labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(StepComp.rowLabel + Element.labelShort)
            .setBackground(Step.subStepColor)
            .setNote(noteString)
        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // creates column(s) for overall company
            if (serviceNr == 1) {

                // loops through the number of components
                for (let k = 0; k < nrOfSubIndicators; k++) {

                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    subIndicator = nrOfSubIndicators != 1 ? Category.components[k].labelShort : ""

                    // Cell name formulas; output defined in 44_rangeNamingHelper.js
                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Element.labelShort, subIndicator, Company.id, "group", stepCompID)

                    evaluationCell = defineNamedRangeStringImport(indexPrefix, idYonY, stepYonY, Indicator.labelShort, subIndicator, Company.id, "group", binaryEvalID)

                    prevResultCell = defineNamedRangeStringImport(indexPrefix, idYonY, stepYonY, Element.labelShort, subIndicator, Company.id, "group", idYonYType)

                    // sets up formula that compares values
                    let colNrYonY = activeCol + ((serviceNr - 1) * nrOfSubIndicators) + k // calculates which column
                    let col = columnToLetter(colNrYonY)
                    let formula = "=IF(" + evaluationCell + "=\"yes\"" + "," + prevResultCell + ",\"not selected\")"

                    Cell.setFormula(formula.toString())

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
                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Element.labelShort, subIndicator, Company.id, "opCom", stepCompID)

                    //OpComp-specific "N/A" for Non-Telecommunication Companies   
                    if (Company.hasOpCom == false) {
                        Cell.setValue("N/A") // if no OpCom, pre-select N/A
                    } else {
                        subIndicator = nrOfSubIndicators != 1 ? Category.components[k].labelShort : ""
                        evaluationCell = defineNamedRangeStringImport(indexPrefix, idYonY, stepYonY, Indicator.labelShort, subIndicator, Company.id, "opCom", binaryEvalID)

                        prevResultCell = defineNamedRangeStringImport(indexPrefix, idYonY, stepYonY, Element.labelShort, subIndicator, Company.id, "opCom", idYonYType)

                        // sets up formula that compares values
                        let colNrYonY = activeCol + ((serviceNr - 1) * nrOfSubIndicators) + k // calculates which column
                        let col = columnToLetter(colNrYonY)
                        // TODO
                        let formula = "=IF(" + evaluationCell + "=\"yes\"" + "," + prevResultCell + ",\"not selected\")"

                        Cell.setFormula(formula.toString())

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

                    subIndicator = nrOfSubIndicators != 1 ? Category.components[k].labelShort : ""

                    // Cell name formulas; output defined in 44_rangeNamingHelper.js
                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Element.labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                    evaluationCell = defineNamedRangeStringImport(indexPrefix, idYonY, stepYonY, Indicator.labelShort, subIndicator, Company.id, Company.services[s].id, binaryEvalID)

                    prevResultCell = defineNamedRangeStringImport(indexPrefix, idYonY, stepYonY, Element.labelShort, subIndicator, Company.id, Company.services[s].id, idYonYType)

                    // sets up formula that compares values
                    let colNrYonY = activeCol + ((serviceNr - 1) * nrOfSubIndicators) + k // calculates which column
                    let col = columnToLetter(colNrYonY)
                    // TODO
                    let formula = "=IF(" + evaluationCell + "=\"yes\"" + "," + prevResultCell + ",\"not selected\")"

                    Cell.setFormula(formula.toString())

                    SS.setNamedRange(cellID, Cell) // names cells

                    // creates dropdown list & boldens
                    Cell.setDataValidation(rule).setFontWeight("bold")


                    activeCol += 1
                }
            }
        }
    }

    activeRow = activeRow + elementsNr
    return activeRow
}

// Imports previous year's outcome as Step 0
// assigns YYS07 ID to element results & comments
// TODO: make Prefix correct (i.e. "RDR19") & dynamic (from variable)
function importYonYResults(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices, isComments) {

    let Elements = Indicator.elements
    let elementsNr = Elements.length
    // TODO: temporary offset
    // re-implement with element.predecessorRow || predecessorElementID
    let offsetRowLastYear = isComments ? Indicator.y2yCompRow + elementsNr : Indicator.y2yCompRow

    let rangeStartRow = activeRow
    let rangeStartCol = 2
    let rangeEndRow
    let rangeEndCol = 1 + companyNumberOfServices + 2

    let stepCompID = Step.components[stepCNr].id

    let Cell, cellID

    let binaryEvalID = "MY"

    // element-wise ~ row-wise

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
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

                    cellID = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, "group", stepCompID)

                    // sets up formula that compares values
                    let value = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k // calculates which column
                    let col = columnToLetter(value)
                    // TODO

                    let formula = "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!$" + col + "$" + (offsetRowLastYear + elemNr)

                    Cell.setFormula(formula.toString())
                    SS.setNamedRange(cellID, Cell)

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

                    cellID = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, "opCom", stepCompID)

                    // creating formula that compares the two cells
                    let value = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k
                    // finds comparisson column
                    let col = columnToLetter(value)
                    // TODO

                    let formula = "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!$" + col + "$" + (offsetRowLastYear + elemNr)

                    Cell.setFormula(formula.toString())
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
                    let subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "YY", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                    // creating formula that will be placed in Cell
                    let value = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k // calculates which column
                    let col = columnToLetter(value)
                    // TODO

                    let formula = "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!$" + col + "$" + (offsetRowLastYear + elemNr)

                    Cell.setFormula(formula.toString())
                    SS.setNamedRange(cellID, Cell)

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

function importYonYSources(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices, isComments) {

    let Elements = Indicator.elements
    let elementsNr = Elements.length
    // TODO: temporary offset
    // re-implement with element.predecessorRow || predecessorElementID
    let offsetRowLastYear = isComments ? Indicator.y2yCompRow + elementsNr : Indicator.y2yCompRow

    let rangeStartRow = activeRow
    let rangeStartCol = 2
    let rangeEndRow
    let rangeEndCol = 1 + companyNumberOfServices + 2

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

                    let formula = "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!$" + col + "$" + (offsetRowLastYear + elemNr)

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

                    let formula = "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!$" + col + "$" + (offsetRowLastYear + elemNr)

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

                    let formula = "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!$" + col + "$" + (offsetRowLastYear + elemNr)

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

// NEW: Binary evaluation of whole step

// this function adds an element drop down list to a single row

function addBinaryReview(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    let StepComp = Step.components[stepCNr]
    let stepCompID = Step.components[stepCNr].id
    let idYonY = StepComp.idYonY // "YY"
    let stepYonY = StepComp.stepYonY // "S07"

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(Step.components[stepCNr].dropdown).build()
    let activeCol = 1

    let cellName, subIndicator

    // sets up the labels
    let Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(StepComp.rowLabel)
        .setBackground(Step.subStepColor)
        .setFontWeight("bold")
        .setFontStyle("italic")
        .setHorizontalAlignment("center")
        .setFontSize(12)

    activeCol += 1

    for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // (((companyNumberOfServices+2)*nrOfIndSubComps)+1)

        if (serviceNr == 1) {
            // company group
            for (let k = 0; k < nrOfIndSubComps; k++) {
                Cell = Sheet.getRange(activeRow, activeCol)

                // Cell name formula; output defined in 44_rangeNamingHelper.js

                subIndicator = ""
                if (nrOfIndSubComps != 1) {
                    subIndicator = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, idYonY, stepYonY, Indicator.labelShort, subIndicator, Company.id, "group", stepCompID)

                SS.setNamedRange(cellName, Cell) // names cells
                Cell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }

        // opCom column
        else if (serviceNr == 2) {
            for (let k = 0; k < nrOfIndSubComps; k++) {
                Cell = Sheet.getRange(activeRow, activeCol)

                // Cell name formula; output defined in 44_rangeNamingHelper.js

                subIndicator = ""
                if (nrOfIndSubComps != 1) {
                    subIndicator = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, idYonY, stepYonY, Indicator.labelShort, subIndicator, Company.id, "opCom", stepCompID)

                SS.setNamedRange(cellName, Cell) // names cells
                Cell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }

        // service columns
        else {
            for (let k = 0; k < nrOfIndSubComps; k++) {
                Cell = Sheet.getRange(activeRow, activeCol)

                // Cell name formula; output defined in 44_rangeNamingHelper.js

                let g = serviceNr - 3
                subIndicator = ""
                if (nrOfIndSubComps != 1) {
                    subIndicator = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, idYonY, stepYonY, Indicator.labelShort, subIndicator, Company.id, Company.services[g].id, stepCompID)

                SS.setNamedRange(cellName, Cell) // names cells
                Cell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }
    }

    return activeRow + 1
}


// regular x.5 comparison of step with previous year's outcome
// probably obsolete
// if not TODO: adapt to Step 0 pattern

function addComparisonYonY(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices) {

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let offsetRowLastYear = Indicator.y2yCompRow

    let Cell, cellID

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        let activeCol = 1
        // serviceNr = column / service
        // ~ serviceNr = 0 -> Labels
        // ~ serviceNr = 1 Group
        // ~ serviceNr = 2 OpCom

        // Row Labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(Step.components[stepCNr].rowLabel + Elements[elemNr].labelShort)
            .setBackground(Step.subStepColor)
        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // TODO: address hard 3 with company JSON

            // setting up company column(s)
            if (serviceNr == 1) {

                // sets up as many columns as the indicator has components
                for (let k = 0; k < nrOfSubIndicators; k++) {
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    let subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, "group")

                    // sets up formula that compares values
                    let value = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k // calculates which column
                    let col = columnToLetter(value)
                    // TODO
                    let formula = "=IF(" + cellID + "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!" + "$" + col + "$" + (offsetRowLastYear + elemNr) + ",\"Yes\",\"No\")"

                    Cell.setFormula(formula.toString())

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

                    let subIndicator = ""
                    if (nrOfSubIndicators != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, "opCom")

                    // creating formula that compares the two cells
                    let value = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k
                    // finds comparisson column
                    let col = columnToLetter(value)
                    // TODO
                    let formula = "=IF(" + cellID + "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!" + "$" + col + "$" + (offsetRowLastYear + elemNr) + ",\"Yes\",\"No\")"

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

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.components[stepCNr].comparisonLabelShort, Elements[elemNr].labelShort, subIndicator, Company.id, Company.services[s].id)

                    // creating formula that will be placed in Cell
                    let value = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators) + k // calculates which column
                    let col = columnToLetter(value)
                    // TODO
                    let formula = "=IF(" + cellID + "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!" + "$" + col + "$" + (offsetRowLastYear + elemNr) + ",\"Yes\",\"No\")"

                    Cell.setFormula(formula.toString())


                    activeCol += 1
                }
            }
        }
    }

    // conditional formating so that the Cell turns red if the answer is no
    let colMax = columnToLetter(2 + (companyNumberOfServices + 2) * nrOfSubIndicators)
    let rowMax = activeRow + elementsNr

    let range = Sheet.getRange(activeRow, 2, elementsNr, 2 + (companyNumberOfServices + 2) * nrOfSubIndicators)

    let rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("No").setBackground("#fa7661").setRanges([range]).build()
    let rules = Sheet.getConditionalFormatRules()
    rules.push(rule)
    Sheet.setConditionalFormatRules(rules)


    activeRow = activeRow + elementsNr
    return activeRow
}
