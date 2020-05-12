/* 
global
    Config,    
    defineNamedRange,
    indexPrefix
*/

// New Substep 1; similar to Substep 1.5 but integrated into old Substep 1
// - has dropdown with evaluation options
// - compares result of step 0 review (yes/no/not selected)
// - and either pulls element results or picks "not selected"
function addStepReview(SS, Sheet, Indicator, Company, isNewCompany, activeRow, mainStepNr, Substep, stepCNr, Category, companyNrOfServices) {

    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id
    let mode = Substep.mode

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
    let rule

    rule = SpreadsheetApp.newDataValidation().requireValueInList(StepComp.dropdown).build()

    let Cell, cellValue, Element, noteString, cellID, hasPredecessor, isRevised

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        Element = Elements[elemNr]

        hasPredecessor = Element.y2yResultRow ? true : false
        isRevised = Element.isRevised ? true : false

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

        let serviceLabel

        for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) {

            if (serviceNr == 1) {
                serviceLabel = "group"
            } else if (serviceNr == 2) {
                serviceLabel = "opCom"
            } else {
                let s = serviceNr - 3
                serviceLabel = Company.services[s].id
            }

            Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, serviceLabel, stepCompID)


            if (serviceNr == 2 && Company.hasOpCom == false) {
                cellValue = "N/A" // if no OpCom, pre-select N/A
            } else {

                if (hasPredecessor || mainStepNr > 1) {

                    reviewCell = defineNamedRange(indexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, serviceLabel, comparisonType)

                    prevResultCell = defineNamedRange(compIndexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, serviceLabel, stepCompID)

                    // sets up cellValue that compares values
                    cellValue = "=IF(" + reviewCell + "=\"yes\"" + "," + prevResultCell + "," + "\"" + yesAnswer + "\"" + ")"
                } else {
                    cellValue = naText
                }

                // creates dropdown list
                Cell.setDataValidation(rule)
            }

            Cell.setValue(cellValue.toString())
            SS.setNamedRange(cellID, Cell) // names cells

            activeCol += 1

        } // Element END
    } // Elements Iteration END

    activeRow = activeRow + elementsNr

    rangeCols = activeCol
    rangeRows = elementsNr

    Sheet.getRange(rangeStartRow, rangeStartCol + 1, rangeRows, rangeCols)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")

    return activeRow
}

function addCommentsReview(SS, Sheet, Indicator, Company, activeRow, mainStepNr, Substep, stepCNr, Category, companyNrOfServices) {

    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id
    let mode = Substep.mode

    // for first review, check if Substep should review the outcome from a different Index; if yes, change compared Index Prefix 

    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    let prevStep = StepComp.prevStep // "S07"
    let evaluationStep = StepComp.evaluationStep // the binary Review or Eval Substep which is evaluated
    let comparisonType = StepComp.comparisonType // "DC",

    let reviewCell, prevResultCell

    let yesAnswer = ""

    let naText = Config.newElementLabelResult


    // for linking to Named Range of Substep 0
    // TODO: make a shared function() between importYonY & addStepReview

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows
    let rangeCols
    let rule

    let Cell, cellValue, Element, cellID, hasPredecessor, isRevised

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        Element = Elements[elemNr]

        hasPredecessor = Element.y2yResultRow ? true : false
        isRevised = Element.isRevised ? true : false

        // 1.) Row Labels

        activeCol = 1
        cellValue = StepComp.rowLabel + Element.labelShort

        cellValue += isRevised ? (" (rev.)") : !hasPredecessor ? (" (new)") : ""

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)

        activeCol += 1

        let serviceLabel

        for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) {

            if (serviceNr == 1) {
                serviceLabel = "group"
            } else if (serviceNr == 2) {
                serviceLabel = "opCom"
            } else {
                let s = serviceNr - 3
                serviceLabel = Company.services[s].id
            }

            Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, serviceLabel, stepCompID)

            if (serviceNr == 2 && Company.hasOpCom == false) {
                cellValue = "N/A" // if no OpCom, pre-select N/A
            } else {
                reviewCell = defineNamedRange(indexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, serviceLabel, comparisonType)

                prevResultCell = defineNamedRange(compIndexPrefix, "DC", prevStep, Element.labelShort, "", Company.id, serviceLabel, stepCompID)

                // sets up cellValue that compares values
                cellValue = "=IF(" + reviewCell + "=\"yes\"" + "," + prevResultCell + "," + "\"" + yesAnswer + "\"" + ")"
            }

            Cell.setValue(cellValue)
            SS.setNamedRange(cellID, Cell) // names cells

            activeCol += 1

        } // Element END
    } // Elements Iteration END

    return activeRow + elementsNr
}


// NEW: Binary evaluation of whole step

// this function adds an element drop down list to a single row

function addBinaryReview(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, currentClass, companyNrOfServices) {

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

    for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) { // (((companyNrOfServices+2)*nrOfIndSubComps)+1)

        if (serviceNr == 1) {
            // company group
            Cell = Sheet.getRange(activeRow, activeCol)

            cellName = defineNamedRange(indexPrefix, comparisonType, evaluationStep, Indicator.labelShort, "", Company.id, "group", stepCompID)

            SS.setNamedRange(cellName, Cell) // names cells
            Cell.setDataValidation(rule) // creates dropdown list
                .setValue("not selected") // sets default for drop down list
                .setFontWeight("bold") // bolds the answers
            activeCol += 1
        }

        // opCom column
        else if (serviceNr == 2) {
            Cell = Sheet.getRange(activeRow, activeCol)

            cellName = defineNamedRange(indexPrefix, comparisonType, evaluationStep, Indicator.labelShort, "", Company.id, "opCom", stepCompID)

            SS.setNamedRange(cellName, Cell) // names cells
            Cell.setDataValidation(rule) // creates dropdown list
                .setValue("not selected") // sets default for drop down list
                .setFontWeight("bold") // bolds the answers
            activeCol += 1
        }

        // service columns
        else {
            Cell = Sheet.getRange(activeRow, activeCol)

            cellName = defineNamedRange(indexPrefix, comparisonType, evaluationStep, Indicator.labelShort, "", Company.id, Company.services[g].id, stepCompID)

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

function addTwoStepComparison(SS, Sheet, Indicator, Company, isNewCompany, mainStepNr, activeRow, Substep, stepCNr, companyNumberOfServices) {

    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id // TODO: add to JSON

    let evaluationStep = StepComp.evaluationStep
    let prevStep = StepComp.prevStep

    let isInternalEval = StepComp.isInternalEval

    let comparisonType = StepComp.comparisonType
    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    let naText = Config.newElementLabelResult

    let prevYearCell

    let Cell, cellValue, Element, subIndicator, noteString, cellID, prevResultCell

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

        // --- 2.) Cell Values --- // 

        let serviceLabel

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // TODO: address hard 3 with company JSON

            if (serviceNr == 1) {
                serviceLabel = "group"
            } else if (serviceNr == 2) {
                serviceLabel = "opCom"
            } else {
                let s = serviceNr - 3
                serviceLabel = Company.services[s].id
            }

            // setting Cell
            Cell = Sheet.getRange(activeRow + elemNr, activeCol)

            // finding the name of Cell that it will be compared too

            subIndicator = ""

            cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, subIndicator, Company.id, serviceLabel, stepCompID)

            if (serviceNr == 2 && Company.hasOpCom == false) {
                cellValue = "N/A" // if no OpCom, pre-select N/A
            } else {

                if (!isNewCompany || !isInternalEval) {

                    if (hasPredecessor || mainStepNr > 1) {

                        prevResultCell = defineNamedRange(indexPrefix, "DC", prevStep, Element.labelShort, subIndicator, Company.id, serviceLabel, comparisonType)

                        prevYearCell = defineNamedRange(compIndexPrefix, "DC", evaluationStep, Element.labelShort, subIndicator, Company.id, serviceLabel, comparisonType)

                        // sets up cellValue that compares values
                        cellValue = "=IF(" + prevResultCell + "=" + prevYearCell + "," + "\"Yes\"" + "," + "\"No\"" + ")"

                    } else {
                        cellValue = naText
                    }
                } else {
                    cellValue = Config.newCompanyLabelResult

                }
            }

            Cell.setValue(cellValue.toString())

            SS.setNamedRange(cellID, Cell) // names cells

            activeCol += 1

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
