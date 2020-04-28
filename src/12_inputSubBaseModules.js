// --- // Top-Level Headings // --- //

/* 
global
    Styles
*/
// Indicator Guidance for researchers

function addIndicatorGuidance(Sheet, currentClass, thisIndicator, activeRow, activeCol, nrOfIndSubComps, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNumberOfServices, includeRGuidanceLink, collapseRGuidance) {

    // TODO probably move all formatting params to JSON

    let row = activeRow
    let col = activeCol

    let cell

    let maxColHeadings = (2 + bridgeCompColumnsNr) * (nrOfIndSubComps) + 1
    if (companyNumberOfServices == 1 && !hasOpCom) {
        maxColHeadings -= 1
    }

    let indTitle = thisIndicator.labelShort + ". " + thisIndicator.labelLong
    if (thisIndicator.description.length > 1) {
        indTitle = indTitle + ": " + thisIndicator.description
    }

    // Indicator Heading
    cell = Sheet.getRange(row, col)
        .setValue(indTitle)
        // .setFontWeight("bold")
        .setFontSize(16)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setFontFamily("Oswald")
        .setWrap(true)

    Sheet.setRowHeight(row, 40)
    Sheet.getRange(row, col, 1, numberOfColumns).merge()
    Sheet.getRange(row, col, 1, numberOfColumns).setBackground(Styles.colors.blue).setFontColor("white")

    // Sheet.setFrozenRows(1)

    row += 1

    let startRow

    if (includeRGuidanceLink) {
        // General Instruction
        cell = Sheet.getRange(row, col)
            .setValue("▶ Please read the indicator-specific guidance and discussions before starting the research!")
            .setFontWeight("bold")
            .setFontSize(9)
            .setHorizontalAlignment("left")
            .setVerticalAlignment("middle")
            .setFontFamily("Roboto Mono")
            .setWrap(true)
            .setFontColor("#ea4335")
        // .setFontColor("chocolate")

        Sheet.setRowHeight(row, 40)
        Sheet.getRange(row, col, 1, numberOfColumns).merge()
        Sheet.getRange(row, col, 1, numberOfColumns).setBackground("WhiteSmoke")
        row += 1
        startRow = row // for grouping
    } else {
        startRow = row // for grouping
        row += 1
    }

    // Element Instructions
    cell = Sheet.getRange(row, 1)
        .setValue("Elements:")
        .setFontWeight("bold")
        .setHorizontalAlignment("right")
        .setVerticalAlignment("top")
        .setFontFamily("Roboto Mono")

    col += 1

    thisIndicator.elements.forEach((element) => {
        cell = Sheet.getRange(row, col)
            .setValue(element.labelShort + ": " + element.description)
            .setFontSize(10)
            .setFontFamily("Roboto")
            .setHorizontalAlignment("left")
        cell = Sheet.getRange(row, col, 1, maxColHeadings).merge().setWrap(true)
        row += 1
    })

    let lastRow = row

    if (includeRGuidanceLink) {
        row += 1
        let indicatorLink = "https://rankingdigitalrights.org/2019-indicators/#" + thisIndicator.labelShort

        // TODO: Parameterize

        cell = Sheet.getRange(row, 1)
            .setValue("Research Guidance:")
            .setFontWeight("bold")
            .setHorizontalAlignment("right")
            .setFontFamily("Roboto Mono")

        cell = Sheet.getRange(row, col, 1, maxColHeadings).merge().setWrap(true)
            .setValue(indicatorLink)

        row += 1
        lastRow = row // for grouping
    }

    let block = Sheet.getRange(2, 1, lastRow, numberOfColumns)

    block.shiftRowGroupDepth(1)

    if (collapseRGuidance) {
        block.collapseGroups()
    }

    row += 1

    Sheet.getRange(startRow, 1, row - startRow, numberOfColumns).setBackground("WhiteSmoke")

    Sheet.getRange(row, activeCol, 1, numberOfColumns).setBorder(null, null, true, null, null, null, "black", null)

    Sheet.setFrozenRows(lastRow)
    row += 2

    activeRow = row
    return activeRow
}

// Company + Services Header

function addMainStepHeader(Sheet, currentClass, CompanyObj, activeRow, nrOfIndSubComps, companyNumberOfServices, thisMainStepNr, mainStepColor) {

    let activeCol = 1

    let rowRange = (activeRow + ":" + activeRow).toString()
    Sheet.getRange(rowRange).setHorizontalAlignment("center") // aligns header row

    // -----------------------SETTING UP THE HEADER ROW------------------------
    // first cell: Main Step Label
    Sheet.getRange(activeRow, activeCol)
        .setValue("Step: " + thisMainStepNr)
        .setBackground(mainStepColor)
        .setFontFamily("Roboto Mono")
        .setFontWeight("bold")
        .setFontSize(12)
        // .setHorizontalAlignment("left")
        .setVerticalAlignment("top")
    activeCol += 1

    // Company (group) column(s)
    for (let i = 0; i < nrOfIndSubComps; i++) {
        let cell = Sheet.getRange(activeRow, activeCol)
            .setValue(CompanyObj.groupLabel)
            .setBackground("#fff2cc")
            .setFontWeight("bold")
            .setVerticalAlignment("top")

        // if it has components it adds the rowLabel in the next row
        if (currentClass.hasSubComponents == true) {
            let currentCell = Sheet.getRange(activeRow + 1, activeCol)
            currentCell.setValue(currentClass.components[i].labelLong)
            currentCell.setBackground("#fff2cc")
        }

        activeCol += 1

    } // close nrOfIndSubComps for loop

    // setting up OpComCompany regardless of whether it has one
    // will just hide the column if it doesn't exist

    for (let i = 0; i < nrOfIndSubComps; i++) {

        let cell = Sheet.getRange(activeRow, activeCol)
            .setValue(CompanyObj.opComLabel)
            .setBackground("#fff2cc")
            .setFontWeight("bold")
            .setVerticalAlignment("top")

        // hiding refactored to main process; set N/A if no OpCom
        if (CompanyObj.hasOpCom == false) {
            cell.setValue("Operating Company (N/A)")
        }

        // if the indicator has components it adds them in the next row
        if (currentClass.hasSubComponents == true) {
            let currentCell = Sheet.getRange(activeRow + 1, activeCol)
                .setValue(currentClass.components[i].labelLong)
                .setBackground("#fff2cc")
        }

        activeCol += 1
    }

    // for remaining columns (services)
    for (let i = 0; i < companyNumberOfServices; i++) {
        for (let k = 0; k < nrOfIndSubComps; k++) {
            let cell = Sheet.getRange(activeRow, activeCol)
                .setValue(CompanyObj.services[i].label.current)
                .setBackground("#b7e1cd")
                .setFontWeight("bold")
                .setVerticalAlignment("top")


            // if the indicator has components it adds them in the next row
            if (currentClass.hasSubComponents == true) {
                let currentCell = Sheet.getRange(activeRow + 1, activeCol)
                    .setValue(currentClass.components[k].labelLong)
                    .setBackground("#b7e1cd")
            }
            activeCol += 1
        }
    }

    // if the indicator does indeed have components, it freezes the additional row in which they are
    if (currentClass.hasSubComponents == true) {
        rowRange = ((activeRow + 1) + ":" + (activeRow + 1)).toString()
        Sheet.getRange(rowRange).setHorizontalAlignment("center")
        activeRow = activeRow + 1
    }

    // if (Config.freezeHead) {
    //     Sheet.setFrozenRows(activeRow) // freezes rows; define in config.json
    // }

    return activeRow

}

// function just creates a single row in which in the first column a rowLabel is added
function addExtraInstruction(currentStep, stepCNr, activeRow, activeCol, Sheet) {
    let cell = Sheet.getRange(activeRow, activeCol)
        // cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3) // setting background color
        .setValue(currentStep.components[stepCNr].rowLabel)
        .setBackground(currentStep.subStepColor)
        .setFontWeight("bold")
    return activeRow + 1
}

// TODO - obsolete description - a step header is a row in which in the first column the name and description of the step is listed
// and in the remaining columns a placeholderText is added
function addSubStepHeader(SS, Sheet, currentIndicator, CompanyObj, activeRow, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    activeRow = activeRow + 1

    // sets up labels in the first column
    let cell = Sheet.getRange(activeRow, 1)
    let text = currentStep.rowLabel
    cell.setValue(text)
        .setBackground(currentStep.subStepColor)
        .setFontWeight("bold")
    // cell = textUnderline(cell)

    // TODO
    // activeRow = addMainStepHeader(Sheet, currentClass, CompanyObj, activeRow, SS, nrOfIndSubComps, companyNumberOfServices) // sets up header

    let thisFiller = currentStep.components[stepCNr].placeholderText
    let thisFirstCol = 2
    let thisLastCol = ((companyNumberOfServices + 2) * nrOfIndSubComps)
    // for remaining company, opCom, and services columns it adds the placeholderText
    let thisRange = Sheet.getRange(activeRow, thisFirstCol, 1, thisLastCol)
        .setValue(thisFiller)
        .setFontStyle("italic")
        .setHorizontalAlignment("center")

    let cellName
    let thisCell
    let component

    let activeCol = thisFirstCol

    let stepCompID = currentStep.components[stepCNr].id

    for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

        // TODO: fix cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            for (let k = 0; k < nrOfIndSubComps; k++) {
                thisCell = Sheet.getRange(activeRow, 1 + serviceNr + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "group", stepCompID)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1

            }
        } else if (serviceNr == 2) {
            // opCom
            for (let k = 0; k < nrOfIndSubComps; k++) {
                thisCell = Sheet.getRange(activeRow, 1 + nrOfIndSubComps + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "opCom", stepCompID)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1

            }
        } else {
            // services
            for (let k = 0; k < nrOfIndSubComps; k++) {
                thisCell = Sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let g = serviceNr - 3 // helper for Services

                component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompID)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1
            }
        }

    }

    return activeRow + 1

}

// addScoringOptions creates a dropdown list in each column for each subindicator
function addScoringOptions(SS, Sheet, Indicator, Company, activeRow, Step, stepCNr, nrOfIndSubComps, Category, companyNumberOfServices) {

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(Step.components[stepCNr].dropdown).build()

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Step.components[stepCNr]
    let stepCompID = Step.components[stepCNr].id

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows, rangeCols, stepRange, dataRange

    let Cell, cellID, Element, subIndicator

    let activeCol

    // row labels
    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        activeCol = 1

        Element = Elements[elemNr]

        let noteString = Element.labelShort + ": " + Element.description

        // setting up the labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(StepComp.rowLabel + Element.labelShort)
            .setBackground(Step.subStepColor)
            .setNote(noteString)
        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

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
                    Cell.setDataValidation(rule) // creates dropdown list
                    Cell.setValue("not selected") // sets default for drop down list
                        .setFontWeight("bold") // bolds the answers
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
                    Cell.setDataValidation(rule) // creates dropdown list
                        .setFontWeight("bold") // bolds the answers
                    if (Company.hasOpCom == false) {
                        Cell.setValue("N/A") // if no OpCom, pre-select N/A
                    } else {
                        Cell.setValue("not selected") // sets default for drop down list
                    }

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
                    Cell.setDataValidation(rule) // creates dropdown list
                        .setValue("not selected") // sets default for drop down list
                        .setFontWeight("bold") // bolds the answers
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

function addComments(SS, Sheet, currentIndicator, CompanyObj, activeRow, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {


    let stepCompID = currentStep.components[stepCNr].id

    // for (let i = 0; i < currentIndicator.elements.length; i++) {
    //     Sheet.setRowHeight(activeRow + i, 50)
    // } // increases height of row

    // loops through subindicators
    for (let elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
        let activeCol = 1

        // adding the labels
        let cell = Sheet.getRange(activeRow + elemNr, activeCol)
        cell.setValue(currentStep.components[stepCNr].rowLabel + currentIndicator.elements[elemNr].labelShort + currentStep.components[stepCNr].label2)
        cell.setBackground(currentStep.subStepColor) // colors cell
        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // setting up the columns for the overall company
            if (serviceNr == 1) {

                // looping through the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {
                    let thisCell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "group", stepCompID)

                    SS.setNamedRange(cellName, thisCell)
                    activeCol += 1

                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // looping through the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {

                    let thisCell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", stepCompID)

                    SS.setNamedRange(cellName, thisCell)
                    activeCol += 1

                }
            }

            // setting up columns for all the services
            else {
                for (let k = 0; k < nrOfIndSubComps; k++) {

                    thisCell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    let g = serviceNr - 3 // helper for Services

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompID)

                    SS.setNamedRange(cellName, thisCell)
                    activeCol += 1

                }

            }

        }
    }


    activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}

// this function adds an element drop down list to a single row

function addBinaryEvaluation(SS, Sheet, currentIndicator, CompanyObj, activeRow, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

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

    for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // (((companyNumberOfServices+2)*nrOfIndSubComps)+1)

        if (serviceNr == 1) {
            // company group
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "group", stepCompID)

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
                    component = currentClass.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "opCom", stepCompID)

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
                    component = currentClass.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompID)

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

function addSources(SS, Sheet, currentIndicator, CompanyObj, activeRow, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {
    let activeCol = 1

    let stepCompID = currentStep.components[stepCNr].id


    // adding rowLabel
    let cell = Sheet.getRange(activeRow, activeCol)
        .setValue(currentStep.components[stepCNr].rowLabel)
        .setBackground(currentStep.subStepColor)
    activeCol += 1

    for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

        // TODO: fix cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, 1 + serviceNr + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "group", stepCompID)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1

            }
        } else if (serviceNr == 2) {
            // opCom
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, 1 + nrOfIndSubComps + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "opCom", stepCompID)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1

            }
        } else {
            // services
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let g = serviceNr - 3 // helper for Services

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompID)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1
            }
        }

    }

    return activeRow + 1
}
