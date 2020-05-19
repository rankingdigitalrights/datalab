// addStepEvaluation creates a dropdown list in each column for each subindicator

function addStepEvaluation(SS, Sheet, Indicator, Company, activeRow, mainStepNr, Substep, stepCNr, Category, companyNrOfServices) {

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(Substep.components[stepCNr].dropdown).build()

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id

    let naText = Config.newElementLabelResult

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows, rangeCols

    let Cell, cellID, Element, noteString, cellValue, hasPredecessor, isRevised

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        Element = Elements[elemNr]

        hasPredecessor = Element.y2yResultRow ? true : false
        isRevised = Element.isRevised ? true : false

        // row labels

        activeCol = 1
        cellValue = StepComp.rowLabel + Element.labelShort

        noteString = Element.labelShort + ": " + Element.description

        cellValue += isRevised ? (" (rev.)") : !hasPredecessor ? (" (new)") : ""

        // setting up the labels
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
            cellID = defineNamedRange(indexPrefix, "DC", Substep.subStepID, Element.labelShort, "", Company.id, serviceLabel, stepCompID)

            if (serviceNr == 2 && Company.hasOpCom == false) {
                cellValue = "N/A" // if no OpCom, pre-select N/A
            } else {

                cellValue = "not selected" // default for drop down list

                if (hasPredecessor || (mainStepNr > 1 && stepCompID != "YY")) {
                    Cell.setDataValidation(rule) // creates dropdown list
                } else {
                    cellValue = naText
                }

            }

            Cell.setValue(cellValue)
            SS.setNamedRange(cellID, Cell) // names cells

            activeCol += 1
        }
    }

    rangeCols = activeCol
    rangeRows = elementsNr
    Sheet.getRange(rangeStartRow, rangeStartCol + 1, rangeRows, rangeCols)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")

    activeRow = activeRow + elementsNr
    return activeRow
}



// this function creates a cell for comments for each subindicator and names the ranges

function addComments(SS, Sheet, Indicator, Company, activeRow, currentStep, stepCNr, Category, companyNrOfServices) {

    let StepComp = currentStep.components[stepCNr]
    let stepCompID = StepComp.id

    // for (let i = 0; i < Indicator.elements.length; i++) {
    //     Sheet.setRowHeight(activeRow + i, 50)
    // } // increases height of row

    let Element, Cell, cellID

    // loops through subindicators
    for (let elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {
        let activeCol = 1

        Element = Indicator.elements[elemNr]

        // adding the labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
        // if (StepComp.rowLabel2) {
        //     StepComp.rowLabel = StepComp.rowLabel + " " + StepComp.rowLabel2
        // }
        Cell.setValue(StepComp.rowLabel + Element.labelShort)


        Cell.setBackground(currentStep.subStepColor) // colors Cell
        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) {

            // setting up the columns for the overall company
            if (serviceNr == 1) {

                Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                cellID = defineNamedRange(indexPrefix, "DC", currentStep.subStepID, Element.labelShort, "", Company.id, "group", stepCompID)

                SS.setNamedRange(cellID, Cell)

                activeCol += 1
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                cellID = defineNamedRange(indexPrefix, "DC", currentStep.subStepID, Element.labelShort, "", Company.id, "opCom", stepCompID)

                SS.setNamedRange(cellID, Cell)
                activeCol += 1

            }

            // setting up columns for all the services
            else {

                Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let g = serviceNr - 3 // helper for Services

                cellID = defineNamedRange(indexPrefix, "DC", currentStep.subStepID, Element.labelShort, "", Company.id, Company.services[g].id, stepCompID)

                SS.setNamedRange(cellID, Cell)

                activeCol += 1
            }
        }
    }

    activeRow = activeRow + Indicator.elements.length
    return activeRow
}

// this function adds an element drop down list to a single row

function addBinaryEvaluation(SS, Sheet, currentIndicator, Company, activeRow, currentStep, stepCNr, Category, companyNrOfServices) {

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[stepCNr].dropdown).build()
    let thisStepComponent = currentStep.components[stepCNr]
    let stepCompID = currentStep.components[stepCNr].id
    let activeCol = 1

    // sets up the labels
    let cell = Sheet.getRange(activeRow, activeCol)
        .setValue(thisStepComponent.rowLabel)
        .setBackground(currentStep.subStepColor)
    if (thisStepComponent.type === "binaryEvaluation") {
        cell.setFontWeight("bold").setFontStyle("italic").setHorizontalAlignment("center").setFontSize(12)
    }
    activeCol += 1

    for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) { // (((companyNrOfServices+2)*nrOfIndSubComps)+1)

        if (serviceNr == 1) {
            // company group
            let thisCell = Sheet.getRange(activeRow, activeCol)

            let cellName = defineNamedRange(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, "", Company.id, "group", stepCompID)

            SS.setNamedRange(cellName, thisCell) // names cells
            thisCell.setDataValidation(rule) // creates dropdown list
                .setValue("not selected") // sets default for drop down list
                .setFontWeight("bold") // bolds the answers

            activeCol += 1

        }

        // opCom column
        else if (serviceNr == 2) {

            let thisCell = Sheet.getRange(activeRow, activeCol)

            let cellName = defineNamedRange(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, "", Company.id, "opCom", stepCompID)

            SS.setNamedRange(cellName, thisCell) // names cells
            thisCell.setDataValidation(rule) // creates dropdown list
                .setValue("not selected") // sets default for drop down list
                .setFontWeight("bold") // bolds the answers

            activeCol += 1

        }

        // service columns
        else {

            let thisCell = Sheet.getRange(activeRow, activeCol)

            let cellName = defineNamedRange(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, "", Company.id, Company.services[g].id, stepCompID)

            SS.setNamedRange(cellName, thisCell) // names cells
            thisCell.setDataValidation(rule) // creates dropdown list
                .setValue("not selected") // sets default for drop down list
                .setFontWeight("bold") // bolds the answers

            activeCol += 1
        }
    }

    Sheet.getRange(activeRow, 2, 1, activeCol)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")

    return activeRow + 1
}

// ## TODO Component Level functions ## //

// the sources step adds a single row in which the sources of each column can be listed

function addSources(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, Category, companyNrOfServices) {
    let activeCol = 1

    let stepCompID = Substep.components[stepCNr].id

    let Cell, cellID

    // adding rowLabel
    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(Substep.components[stepCNr].rowLabel)
        .setBackground(Substep.subStepColor)
    activeCol += 1

    for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) {

        // TODO: fix Cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            Cell = Sheet.getRange(activeRow, activeCol)

            cellID = defineNamedRange(indexPrefix, "DC", Substep.subStepID, Indicator.labelShort, "", Company.id, "group", stepCompID)

            SS.setNamedRange(cellID, Cell)

            activeCol += 1


        } else if (serviceNr == 2) {
            // opCom
            Cell = Sheet.getRange(activeRow, activeCol)

            cellID = defineNamedRange(indexPrefix, "DC", Substep.subStepID, Indicator.labelShort, "", Company.id, "opCom", stepCompID)

            SS.setNamedRange(cellID, Cell)

            activeCol += 1

        } else {
            // services
            Cell = Sheet.getRange(activeRow, activeCol)

            let g = serviceNr - 3 // helper for Services

            cellID = defineNamedRange(indexPrefix, "DC", Substep.subStepID, Indicator.labelShort, "", Company.id, Company.services[g].id, stepCompID)

            SS.setNamedRange(cellID, Cell)

            activeCol += 1
        }

    }

    Sheet.getRange(activeRow, 2, 1, activeCol).setHorizontalAlignment("center")

    return activeRow + 1
}