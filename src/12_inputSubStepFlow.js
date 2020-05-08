/* 
global
    Config,    
    defineNamedRangeStringImport,
    indexPrefix
*/

// New Substep 1; similar to Substep 1.5 but integrated into old Substep 1
// - has dropdown with evaluation options
// - compares result of step 0 review (yes/no/not selected)
// - and either pulls element results or picks "not selected"
function addStepReview(SS, Sheet, Indicator, Company, activeRow, mainStepNr, Substep, stepCNr, Category, companyNumberOfServices) {

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
                cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, "group", stepCompID)

                if (hasPredecessor || mainStepNr > 1) {

                    evaluationCell = defineNamedRangeStringImport(indexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, "group", comparisonType)

                    prevResultCell = defineNamedRangeStringImport(compIndexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, "group", stepCompID)

                    // sets up cellValue that compares values

                    cellValue = "=IF(" + evaluationCell + "=\"yes\"" + "," + prevResultCell + "," + "\"" + yesAnswer + "\"" + ")"

                } else {
                    cellValue = naText
                }

                Cell.setValue(cellValue.toString())

                // creates dropdown list & boldens
                Cell.setDataValidation(rule).setFontWeight("bold")

                SS.setNamedRange(cellID, Cell) // names cells

                activeCol += 1

            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                Cell = Sheet.getRange(activeRow + elemNr, activeCol)
                // Cell name formulas; output defined in 44_rangeNamingHelper.js
                cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, "opCom", stepCompID)

                //OpComp-specific "N/A" for Non-Telecommunication Companies   
                if (Company.hasOpCom == false) {
                    Cell.setValue("N/A") // if no OpCom, pre-select N/A
                } else {

                    if (hasPredecessor || mainStepNr > 1) {

                        evaluationCell = defineNamedRangeStringImport(indexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, "opCom", comparisonType)

                        prevResultCell = defineNamedRangeStringImport(compIndexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, "opCom", stepCompID)

                        // sets up cellValue that compares values
                        cellValue = "=IF(" + evaluationCell + "=\"yes\"" + "," + prevResultCell + "," + "\"" + yesAnswer + "\"" + ")"
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

            // creating all the service columns
            else {
                Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                let s = serviceNr - 3 // helper for Services

                // Cell name formulas; output defined in 44_rangeNamingHelper.js
                cellID = defineNamedRangeStringImport(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, Company.services[s].id, stepCompID)

                if (hasPredecessor || mainStepNr > 1) {

                    evaluationCell = defineNamedRangeStringImport(indexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, Company.services[s].id, comparisonType)

                    prevResultCell = defineNamedRangeStringImport(compIndexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, Company.services[s].id, stepCompID)

                    // sets up cellValue that compares values
                    cellValue = "=IF(" + evaluationCell + "=\"yes\"" + "," + prevResultCell + "," + "\"" + yesAnswer + "\"" + ")"

                } else {
                    cellValue = naText
                }

                Cell.setValue(cellValue.toString())

                SS.setNamedRange(cellID, Cell) // names cells

                // creates dropdown list & boldens
                Cell.setDataValidation(rule).setFontWeight("bold")

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

// NEW: Binary evaluation of whole step

// this function adds an element drop down list to a single row

function addBinaryReview(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, currentClass, companyNumberOfServices) {

    activeRow += 1

    let subStepID = Substep.subStepID

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id
    let comparisonType = StepComp.comparisonType // "YY"
    let evaluationStep = StepComp.evaluationStep // the binary Review or Eval Substep which is evaluated

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(Substep.components[stepCNr].dropdown).build()
    let activeCol = 1

    let cellName

    // sets up the labels
    let Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(StepComp.rowLabel)
        .setBackground(Substep.subStepColor)
        .setFontWeight("bold")
        .setFontStyle("italic")
        .setHorizontalAlignment("center")
        .setFontSize(12)

    activeCol += 1

    for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // (((companyNumberOfServices+2)*nrOfIndSubComps)+1)

        if (serviceNr == 1) {
            // company group
            Cell = Sheet.getRange(activeRow, activeCol)

            cellName = defineNamedRangeStringImport(indexPrefix, comparisonType, evaluationStep, Indicator.labelShort, "", Company.id, "group", stepCompID)

            SS.setNamedRange(cellName, Cell) // names cells
            Cell.setDataValidation(rule) // creates dropdown list
                .setValue("not selected") // sets default for drop down list
                .setFontWeight("bold") // bolds the answers
            activeCol += 1
        }

        // opCom column
        else if (serviceNr == 2) {
            Cell = Sheet.getRange(activeRow, activeCol)

            cellName = defineNamedRangeStringImport(indexPrefix, comparisonType, evaluationStep, Indicator.labelShort, "", Company.id, "opCom", stepCompID)

            SS.setNamedRange(cellName, Cell) // names cells
            Cell.setDataValidation(rule) // creates dropdown list
                .setValue("not selected") // sets default for drop down list
                .setFontWeight("bold") // bolds the answers
            activeCol += 1
        }

        // service columns
        else {
            Cell = Sheet.getRange(activeRow, activeCol)

            cellName = defineNamedRangeStringImport(indexPrefix, comparisonType, evaluationStep, Indicator.labelShort, "", Company.id, Company.services[g].id, stepCompID)

            SS.setNamedRange(cellName, Cell) // names cells
            Cell.setDataValidation(rule) // creates dropdown list
                .setValue("not selected") // sets default for drop down list
                .setFontWeight("bold") // bolds the answers
            activeCol += 1
        }
    }

    Sheet.getRange(activeRow, 1, 1, activeCol)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")

    if (subStepID !== "S00") activeRow += 1

    return activeRow + 1
}
