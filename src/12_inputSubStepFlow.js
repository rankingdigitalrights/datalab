/* 
global
    Config,    
    defineNamedRangeStringImport,
    indexPrefix
*/

// New Step 1; similar to Step 1.5 but integrated into old Step 1
// - has dropdown with evaluation options
// - compares result of step 0 review (yes/no/not selected)
// - and either pulls element results or picks "not selected"
function addStepReview(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfSubIndicators, Category, companyNumberOfServices) {

    let subStepID = Step.subStepID

    let comparisonIndexPrefix = subStepID === "S01" ? Config.prevIndexPrefix : indexPrefix

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Step.components[stepCNr]
    let stepCompID = StepComp.id

    let comparisonStep = StepComp.comparisonStep // "S07"
    let binaryStep = StepComp.binaryStep // the binary Review or Eval Step which is evaluated
    let comparisonType = StepComp.comparisonType // "DC",

    let binaryEvalCell, prevResultCell

    let binaryEvalID = "MY"

    // for linking to Named Range of Step 0
    // TODO: make a shared function() between importYonY & addStepReview

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows
    let rangeCols

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(StepComp.dropdown).build()

    let Cell, cellValue, Element, noteString, cellID, subIndicator, labelFormula

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        // 1.) Row Labels

        activeCol = 1
        Element = Elements[elemNr]
        noteString = Element.labelShort + ": " + Element.description
        labelFormula = StepComp.rowLabel + Element.labelShort

        if (Element.y2yResultRow) {
            labelFormula += (" (2020)")
        } else {
            labelFormula += (" (new)")
        }

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(labelFormula)
            .setBackground(Step.subStepColor)
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

                    binaryEvalCell = defineNamedRangeStringImport(indexPrefix, comparisonType, binaryStep, Indicator.labelShort, subIndicator, Company.id, "group", binaryEvalID)

                    prevResultCell = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, comparisonStep, Element.labelShort, subIndicator, Company.id, "group", stepCompID)

                    // sets up cellValue that compares values
                    cellValue = "=IF(" + binaryEvalCell + "=\"yes\"" + "," + prevResultCell + ",\"not selected\")"

                    Cell.setFormula(cellValue.toString())

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
                        subIndicator = nrOfSubIndicators != 1 ? Category.components[k].labelShort : ""
                        binaryEvalCell = defineNamedRangeStringImport(indexPrefix, comparisonType, binaryStep, Indicator.labelShort, subIndicator, Company.id, "opCom", binaryEvalID)

                        prevResultCell = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, comparisonStep, Element.labelShort, subIndicator, Company.id, "opCom", stepCompID)

                        // sets up cellValue that compares values
                        cellValue = "=IF(" + binaryEvalCell + "=\"yes\"" + "," + prevResultCell + ",\"not selected\")"

                        Cell.setFormula(cellValue.toString())

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
                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                    binaryEvalCell = defineNamedRangeStringImport(indexPrefix, comparisonType, binaryStep, Indicator.labelShort, subIndicator, Company.id, Company.services[s].id, binaryEvalID)

                    prevResultCell = defineNamedRangeStringImport(comparisonIndexPrefix, comparisonType, comparisonStep, Element.labelShort, subIndicator, Company.id, Company.services[s].id, stepCompID)

                    // sets up cellValue that compares values
                    cellValue = "=IF(" + binaryEvalCell + "=\"yes\"" + "," + prevResultCell + ",\"not selected\")"

                    Cell.setFormula(cellValue.toString())

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

// NEW: Binary evaluation of whole step

// this function adds an element drop down list to a single row

function addBinaryReview(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    activeRow += 1

    let subStepID = Step.subStepID

    let StepComp = Step.components[stepCNr]
    let stepCompID = Step.components[stepCNr].id
    let comparisonType = StepComp.comparisonType // "YY"
    let binaryStep = StepComp.binaryStep // the binary Review or Eval Step which is evaluated

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

                cellName = defineNamedRangeStringImport(indexPrefix, comparisonType, binaryStep, Indicator.labelShort, subIndicator, Company.id, "group", stepCompID)

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

                cellName = defineNamedRangeStringImport(indexPrefix, comparisonType, binaryStep, Indicator.labelShort, subIndicator, Company.id, "opCom", stepCompID)

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

                cellName = defineNamedRangeStringImport(indexPrefix, comparisonType, binaryStep, Indicator.labelShort, subIndicator, Company.id, Company.services[g].id, stepCompID)

                SS.setNamedRange(cellName, Cell) // names cells
                Cell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }
    }

    Sheet.getRange(activeRow, 1, 1, activeCol)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")

    if (subStepID !== "S00") activeRow += 1

    return activeRow + 1
}
