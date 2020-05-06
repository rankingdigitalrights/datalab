// --- // Top-Level Headings // --- //

/* 
global
    Styles,
    defineNamedRangeStringImport,
    indexPrefix
*/

function addMainSheetHeader(Sheet, Category, Indicator, Company, activeRow, activeCol, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNrOfServices, includeRGuidanceLink, collapseRGuidance) {

    activeRow = addIndicatorGuidance(Sheet, Category, Indicator, activeRow, activeCol, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNrOfServices, includeRGuidanceLink, collapseRGuidance)

    activeRow = addMainCompanyHeader(Sheet, Category, Company, activeRow, companyNrOfServices)

    Sheet.setFrozenRows(activeRow)

    return activeRow += 2
}

// Indicator Guidance for researchers

function addIndicatorGuidance(Sheet, Category, Indicator, activeRow, activeCol, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNrOfServices, includeRGuidanceLink, collapseRGuidance) {

    // TODO probably move all formatting params to JSON

    let row = activeRow
    let col = activeCol

    let maxColHeadings = (2 + bridgeCompColumnsNr) + 1
    if (companyNrOfServices == 1 && !hasOpCom) {
        maxColHeadings -= 1
    }

    let indTitle = "▶ " + Indicator.labelShort + ". " + Indicator.labelLong

    if (Indicator.description.length > 1) {
        indTitle = indTitle + ": " + Indicator.description
    }

    // Indicator Heading
    Sheet.getRange(row, col)
        .setValue(indTitle)
        // .setFontWeight("bold")
        .setFontSize(18)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setFontFamily("Oswald")
        .setWrap(true)

    Sheet.setRowHeight(row, 40)
    Sheet.getRange(row, col, 1, numberOfColumns)
        .merge()
        .setBackground(Styles.colors.blue).setFontColor("white")

    // Sheet.setFrozenRows(1)

    row += 1

    let startRow

    if (includeRGuidanceLink) {
        // General Instruction
        Sheet.getRange(row, col)
            .setValue("Please read the indicator-specific guidance and discussions before starting the research!")
            .setFontWeight("bold")
            .setFontSize(9)
            .setHorizontalAlignment("left")
            .setVerticalAlignment("middle")
            .setFontFamily("Roboto Mono")
            .setWrap(true)
            .setFontColor("#ea4335")
        // .setFontColor("chocolate")

        Sheet.setRowHeight(row, 40)
        Sheet.getRange(row, col, 1, numberOfColumns)
            .merge()
            .setBackground("WhiteSmoke")

        row += 1
        startRow = row // for grouping
    } else {
        startRow = row // for grouping
        row += 1
    }

    let indStart = row
    let values = []

    Indicator.elements.forEach((element) => {
        values.push(
            [(element.labelShort + ":"), element.description]
        )
        Sheet.getRange(row, 2, 1, maxColHeadings)
            .merge()
            .setWrap(true)
            .setVerticalAlignment("top")
        row += 1
    })

    let indEnd = row

    Sheet.getRange(indStart, col, values.length, 2)
        .setValues(values)
        .setFontSize(10)
        .setFontFamily("Roboto")
        .setHorizontalAlignment("left")

    Sheet.getRange(indStart, col, values.length, 1)
        .setHorizontalAlignment("right")
        .setFontWeight("bold")
        .setVerticalAlignment("top")
        .setFontFamily("Roboto Mono")

    let lastRow = row

    if (includeRGuidanceLink) {
        row += 1
        let indicatorLink = "https://rankingdigitalrights.org/2019-indicators/#" + Indicator.labelShort

        // TODO: Parameterize

        Sheet.getRange(row, 1)
            .setValue("Research Guidance:")
            .setFontWeight("bold")
            .setHorizontalAlignment("right")
            .setFontFamily("Roboto Mono")

        Sheet.getRange(row, 2, 1, maxColHeadings).merge().setWrap(true)
            .setValue(indicatorLink)

        row += 1
        lastRow = row // for grouping
    }

    let block = Sheet.getRange(2, 1, lastRow - 1, numberOfColumns)

    block.shiftRowGroupDepth(1)

    if (collapseRGuidance) {
        block.collapseGroups()
    }

    row += 1

    Sheet.getRange(startRow, 1, row - startRow, numberOfColumns).setBackground("WhiteSmoke")

    Sheet.getRange(row, activeCol, 1, numberOfColumns).setBorder(true, null, true, null, null, null, "black", null)

    // Sheet.setFrozenRows(lastRow)
    // row += 2

    activeRow = row
    return activeRow
}


// Company + Services Header

function addMainCompanyHeader(Sheet, Category, Company, activeRow, companyNrOfServices) {

    let activeCol = 1

    let rowRange = (activeRow + ":" + activeRow).toString()
    Sheet.getRange(rowRange).setHorizontalAlignment("center") // aligns header row

    let Cell

    // first cell: Main Step Label
    Sheet.getRange(activeRow, activeCol)
        .setValue("Company: " + Company.label.current)

    activeCol += 1

    // Company (group) column(s)
    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(Company.groupLabel)
        .setBackground("#fff2cc")

    activeCol += 1

    // setting up OpCom regardless of whether it has one
    // hide the column if it doesn't exist

    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(Company.opComLabel)
        .setBackground("#fff2cc")

    // hiding refactored to main process; set N/A if no OpCom
    if (Company.hasOpCom == false) {
        Cell.setValue("Operating Company (N/A)")
    }

    activeCol += 1

    // for remaining columns (services)
    for (let i = 0; i < companyNrOfServices; i++) {
        Sheet.getRange(activeRow, activeCol)
            .setValue(Company.services[i].label.current)
            .setBackground("#b7e1cd")
        activeCol += 1
    }

    let horizontalDim = 1 + 2 + companyNrOfServices
    Sheet.getRange(activeRow, 1, 1, horizontalDim)
        .setFontWeight("bold")
        .setVerticalAlignment("middle")
        .setFontSize(12)

    Sheet.setRowHeight(activeRow, 40)

    // if (Config.freezeHead) {
    //     Sheet.setFrozenRows(activeRow) // freezes rows; define in config.json
    // }

    return activeRow

}

function addMainStepHeader(Sheet, Category, Company, activeRow, companyNrOfServices, MainStep, mainStepColor) {

    let horizontalDim = 1 + 2 + companyNrOfServices

    Sheet.getRange(activeRow, 1, 1, horizontalDim)
        .merge()
        .setValue("Step " + MainStep.step + " - " + MainStep.rowLabel)
        .setFontSize(14)
        .setFontWeight("bold")
        .setBackground(mainStepColor)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setBorder(true, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    Sheet.setRowHeight(activeRow, 30)

    return activeRow + 1

}

function addSubStepHeader(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, companyNrOfServices) {

    // sets up labels in the first column
    let Cell = Sheet.getRange(activeRow, 1)
    Cell.setValue(Step.labelShort)
        .setBackground(Step.subStepColor)
        .setFontWeight("bold")
        .setFontSize(12)
        .setHorizontalAlignment("center")

    // Cell = textUnderline(Cell)

    // TODO
    // activeRow = addMainStepHeader(Sheet, Category, Company, activeRow, SS, nrOfIndSubComps, companyNrOfServices) // sets up header

    let thisFirstCol = 2
    let thisLastCol = (companyNrOfServices + 2)
    // for remaining company, opCom, and services columns it adds the placeholderText
    Cell = Sheet.getRange(activeRow, 2, 1, thisLastCol)
        .merge()
        .setValue(Step.components[stepCNr].rowLabel)
        .setFontStyle("italic")
        .setFontWeight("bold")
        .setFontSize(12)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setBorder(true, true, true, true, null, null, Step.subStepColor, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    Sheet.setRowHeight(activeRow, 30)

    return activeRow + 1

}

function addExtraInstruction(Step, stepCNr, activeRow, activeCol, Sheet, companyNrOfServices) {

    let horizontalDim = 1 + 2 + companyNrOfServices

    Sheet.insertRowsBefore(activeRow, 1)

    activeRow += 1

    Sheet.getRange(activeRow, 2, 1, horizontalDim - 1)
        .merge()
        .setValue(Step.components[stepCNr].rowLabel)
        .setFontStyle("italic")
        .setFontWeight("bold")
        .setFontSize(12)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setBorder(true, true, true, true, null, null, Step.subStepColor, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    Sheet.setRowHeight(activeRow, 30)

    return activeRow + 1
}

function addStepResearcherRow(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, companyNrOfServices) {

    activeRow += 1

    // sets up labels in the first column
    let Cell = Sheet.getRange(activeRow, 1)
    Cell.setValue(Step.components[stepCNr].rowLabel)
        .setBackground(Step.subStepColor)
        .setFontStyle("italic")
        .setFontWeight("bold")
        .setFontSize(11)
        .setHorizontalAlignment("center") // Cell = textUnderline(Cell)

    // TODO
    // activeRow = addMainStepHeader(Sheet, Category, Company, activeRow, SS, nrOfIndSubComps, companyNrOfServices) // sets up header

    let thisFiller = Step.components[stepCNr].placeholderText
    let thisFirstCol = 2
    let thisLastCol = ((companyNrOfServices + 2))
    // for remaining company, opCom, and services columns it adds the placeholderText
    Cell = Sheet.getRange(activeRow, thisFirstCol, 1, thisLastCol)
        .setValue(thisFiller)
        .setFontStyle("italic")
        .setHorizontalAlignment("center")

    let cellName
    let component = ""

    let activeCol = thisFirstCol

    let stepCompID = Step.components[stepCNr].id

    for (let col = 1; col < (companyNrOfServices + 3); col++) {

        // TODO: fix Cell reference for OpCom

        if (col == 1) {
            // main company
            Cell = Sheet.getRange(activeRow, 1 + col)

            // Cell name formula; output defined in 44_rangeNamingHelper.js

            cellName = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Indicator.labelShort, component, Company.id, "group", stepCompID)

            SS.setNamedRange(cellName, Cell)
            activeCol += 1

        } else if (col == 2) {
            // opCom
            Cell = Sheet.getRange(activeRow, 1 + col)

            // Cell name formula; output defined in 44_rangeNamingHelper.js

            cellName = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Indicator.labelShort, component, Company.id, "opCom", stepCompID)

            SS.setNamedRange(cellName, Cell)
            activeCol += 1
        } else {
            // services
            Cell = Sheet.getRange(activeRow, activeCol)

            // Cell name formula; output defined in 44_rangeNamingHelper.js

            let g = col - 3 // helper for Services

            cellName = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Indicator.labelShort, component, Company.id, Company.services[g].id, stepCompID)

            SS.setNamedRange(cellName, Cell)
            activeCol += 1
        }

    }

    return activeRow + 2

}

// addStepEvaluation creates a dropdown list in each column for each subindicator
function addStepEvaluation(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfIndSubComps, Category, companyNrOfServices) {

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(Step.components[stepCNr].dropdown).build()

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Step.components[stepCNr]
    let stepCompID = Step.components[stepCNr].id

    let naText = Config.newElementLabelResult

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows, rangeCols, stepRange, dataRange

    let Cell, cellID, Element, subIndicator, labelFormula

    let activeCol

    // row labels
    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        activeCol = 1

        Element = Elements[elemNr]

        let hasPredecessor = Element.y2yResultRow ? true : false

        let noteString = Element.labelShort + ": " + Element.description

        labelFormula = StepComp.rowLabel + Element.labelShort

        if (!hasPredecessor) labelFormula += (" (new)")

        // setting up the labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(labelFormula)
            .setBackground(Step.subStepColor)
            .setFontWeight("bold")
            .setNote(noteString)

        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) {

            // creates column(s) for overall company
            if (serviceNr == 1) {

                // loops through the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {

                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    subIndicator = ""

                    if (nrOfIndSubComps != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Element.labelShort, subIndicator, Company.id, "group", stepCompID)

                    SS.setNamedRange(cellID, Cell) // names cells

                    if (hasPredecessor) {
                        Cell.setDataValidation(rule) // creates dropdown list
                        Cell.setValue("not selected") // sets default for drop down list
                    } else {
                        Cell.setValue(naText)
                    }

                    Cell.setFontWeight("bold") // bolds the answers
                    activeCol += 1
                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    subIndicator = ""
                    if (nrOfIndSubComps != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Element.labelShort, subIndicator, Company.id, "opCom", stepCompID)

                    SS.setNamedRange(cellID, Cell) // names cells

                    if (Company.hasOpCom === false) {
                        Cell.setValue("N/A") // if no OpCom, pre-select N/A
                    } else {
                        if (hasPredecessor) {
                            Cell.setDataValidation(rule) // creates dropdown list
                            Cell.setValue("not selected") // sets default for drop down list
                        } else {
                            Cell.setValue(naText)
                        }
                    }

                    Cell.setFontWeight("bold") // bolds the answers


                    activeCol += 1
                }
            }

            // creating all the service columns
            else {
                for (let k = 0; k < nrOfIndSubComps; k++) {
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    let g = serviceNr - 3 // helper for Services

                    subIndicator = ""
                    if (nrOfIndSubComps != 1) {
                        subIndicator = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Element.labelShort, subIndicator, Company.id, Company.services[g].id, stepCompID)

                    SS.setNamedRange(cellID, Cell) // names cells

                    if (hasPredecessor) {
                        Cell.setDataValidation(rule) // creates dropdown list
                        Cell.setValue("not selected") // sets default for drop down list
                    } else {
                        Cell.setValue(naText)
                    }

                    Cell.setFontWeight("bold") // bolds the answers
                    activeCol += 1
                }
            }
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

function addComments(SS, Sheet, Indicator, Company, activeRow, currentStep, stepCNr, nrOfIndSubComps, Category, companyNrOfServices) {

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

                // looping through the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {
                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // Cell name formula; output defined in 44_rangeNamingHelper.js

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, Element.labelShort, component, Company.id, "group", stepCompID)

                    SS.setNamedRange(cellID, Cell)
                    activeCol += 1

                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // looping through the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {

                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // Cell name formula; output defined in 44_rangeNamingHelper.js

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, Element.labelShort, component, Company.id, "opCom", stepCompID)

                    SS.setNamedRange(cellID, Cell)
                    activeCol += 1

                }
            }

            // setting up columns for all the services
            else {
                for (let k = 0; k < nrOfIndSubComps; k++) {

                    Cell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    let g = serviceNr - 3 // helper for Services

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = Category.components[k].labelShort
                    }

                    cellID = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, Element.labelShort, component, Company.id, Company.services[g].id, stepCompID)

                    SS.setNamedRange(cellID, Cell)
                    activeCol += 1

                }

            }

        }
    }

    activeRow = activeRow + Indicator.elements.length
    return activeRow
}

// this function adds an element drop down list to a single row

function addBinaryEvaluation(SS, Sheet, currentIndicator, Company, activeRow, currentStep, stepCNr, nrOfIndSubComps, Category, companyNrOfServices) {

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
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, Company.id, "group", stepCompID)

                SS.setNamedRange(cellName, thisCell) // names cells
                thisCell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }

        // opCom column
        else if (serviceNr == 2) {
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, Company.id, "opCom", stepCompID)

                SS.setNamedRange(cellName, thisCell) // names cells
                thisCell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }

        // service columns
        else {
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let g = serviceNr - 3
                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, Company.id, Company.services[g].id, stepCompID)

                SS.setNamedRange(cellName, thisCell) // names cells
                thisCell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }
    }

    Sheet.getRange(activeRow, 2, 1, activeCol)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")

    return activeRow + 1
}

// ## TODO Component Level functions ## //

// the sources step adds a single row in which the sources of each column can be listed

function addSources(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfIndSubComps, Category, companyNrOfServices) {
    let activeCol = 1

    let stepCompID = Step.components[stepCNr].id

    let Cell, cellID

    // adding rowLabel
    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(Step.components[stepCNr].rowLabel)
        .setBackground(Step.subStepColor)
    activeCol += 1

    for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) {

        // TODO: fix Cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            for (let k = 0; k < nrOfIndSubComps; k++) {
                Cell = Sheet.getRange(activeRow, 1 + serviceNr + k)

                // Cell name formula; output defined in 44_rangeNamingHelper.js

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Indicator.labelShort, component, Company.id, "group", stepCompID)

                SS.setNamedRange(cellID, Cell)
                activeCol += 1

            }
        } else if (serviceNr == 2) {
            // opCom
            for (let k = 0; k < nrOfIndSubComps; k++) {
                Cell = Sheet.getRange(activeRow, 1 + nrOfIndSubComps + k)

                // Cell name formula; output defined in 44_rangeNamingHelper.js

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Indicator.labelShort, component, Company.id, "opCom", stepCompID)

                SS.setNamedRange(cellID, Cell)
                activeCol += 1

            }
        } else {
            // services
            for (let k = 0; k < nrOfIndSubComps; k++) {
                Cell = Sheet.getRange(activeRow, activeCol)

                // Cell name formula; output defined in 44_rangeNamingHelper.js

                let g = serviceNr - 3 // helper for Services

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                cellID = defineNamedRangeStringImport(indexPrefix, "DC", Step.subStepID, Indicator.labelShort, component, Company.id, Company.services[g].id, stepCompID)

                SS.setNamedRange(cellID, Cell)
                activeCol += 1
            }
        }

    }

    Sheet.getRange(activeRow, 2, 1, activeCol).setHorizontalAlignment("center")

    return activeRow + 1
}
