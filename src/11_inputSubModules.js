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

function addMainStepHeader(Sheet, currentClass, CompanyObj, activeRow, SS, nrOfIndSubComps, companyNumberOfServices, thisMainStepNr, mainStepColor) {

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

        // if it has components it adds the label in the next row
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

    // if (centralConfig.freezeHead) {
    //     Sheet.setFrozenRows(activeRow) // freezes rows; define in config.json
    // }

    return activeRow

}

// function just creates a single row in which in the first column a label is added
function addExtraInstruction(currentStep, stepCNr, activeRow, activeCol, Sheet) {
    let cell = Sheet.getRange(activeRow, activeCol)
        // cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3) // setting background color
        .setValue(currentStep.components[stepCNr].label)
        .setBackground(currentStep.subStepColor)
        .setFontWeight("bold")
    return activeRow + 1
}

// TODO - obsolete description - a step header is a row in which in the first column the name and description of the step is listed
// and in the remaining columns a placeholderText is added
function addSubStepHeader(Sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    activeRow = activeRow + 1

    // sets up labels in the first column
    let cell = Sheet.getRange(activeRow, 1)
    let text = currentStep.label
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
    thisRange.setValue(thisFiller)
    thisRange.setFontStyle("italic")

    let cellName
    let thisCell
    let component

    let activeCol = thisFirstCol


    let stepCompType = currentStep.components[stepCNr].id

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

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "group", stepCompType)

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

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "opCom", stepCompType)

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

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1
            }
        }

    }

    return activeRow + 1

}

// addScoringOptions creates a dropdown list in each column for each subindicator
function addScoringOptions(Sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[stepCNr].dropdown).build()

    let stepCompType = currentStep.components[stepCNr].id

    // row labels
    for (let elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
        let activeCol = 1

        let thisElement = currentIndicator.elements[elemNr]

        let noteString = thisElement.labelShort + ": " + thisElement.description

        // setting up the labels
        let cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(currentStep.components[stepCNr].label + thisElement.labelShort)
            .setBackground(currentStep.subStepColor)
            .setNote(noteString)
        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // creates column(s) for overall company
            if (serviceNr == 1) {

                // loops through the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {

                    let thisCell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, thisElement.labelShort, component, CompanyObj.id, "group", stepCompType)


                    SS.setNamedRange(cellName, thisCell) // names cells
                    thisCell.setDataValidation(rule) // creates dropdown list
                    thisCell.setValue("not selected") // sets default for drop down list
                        .setFontWeight("bold") // bolds the answers
                    activeCol += 1
                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {
                    let thisCell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, thisElement.labelShort, component, CompanyObj.id, "opCom", stepCompType)

                    SS.setNamedRange(cellName, thisCell) // names cells
                    thisCell.setDataValidation(rule) // creates dropdown list
                        .setFontWeight("bold") // bolds the answers
                    if (CompanyObj.hasOpCom == false) {
                        thisCell.setValue("N/A") // if no OpCom, pre-select N/A
                    } else {
                        thisCell.setValue("not selected") // sets default for drop down list
                    }

                    activeCol += 1
                }
            }

            // creating all the service columns
            else {
                for (let k = 0; k < nrOfIndSubComps; k++) {
                    let thisCell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    let g = serviceNr - 3 // helper for Services

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, thisElement.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                    SS.setNamedRange(cellName, thisCell) // names cells
                    thisCell.setDataValidation(rule) // creates dropdown list
                        .setValue("not selected") // sets default for drop down list
                        .setFontWeight("bold") // bolds the answers
                    activeCol += 1
                }
            }
        }
    }

    activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}


// this function creates a cell for comments for each subindicator and names the ranges

function addComments(Sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {


    let stepCompType = currentStep.components[stepCNr].id

    // for (let i = 0; i < currentIndicator.elements.length; i++) {
    //     Sheet.setRowHeight(activeRow + i, 50)
    // } // increases height of row

    // loops through subindicators
    for (let elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
        let activeCol = 1

        // adding the labels
        let cell = Sheet.getRange(activeRow + elemNr, activeCol)
        cell.setValue(currentStep.components[stepCNr].label + currentIndicator.elements[elemNr].labelShort + currentStep.components[stepCNr].label2)
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

                    let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "group", stepCompType)

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

                    let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", stepCompType)

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

                    let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

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

function addBinaryEvaluation(Sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[stepCNr].dropdown).build()
    let thisStepComponent = currentStep.components[stepCNr]
    let stepCompType = currentStep.components[stepCNr].id
    let activeCol = 1

    // sets up the labels
    let cell = Sheet.getRange(activeRow, activeCol)
        .setValue(thisStepComponent.label)
        .setBackground(currentStep.subStepColor)
    if (thisStepComponent.type === "binaryReview") {
        cell.setFontWeight("bold").setFontStyle("italic").setHorizontalAlignment("center")
    }
    activeCol += 1

    for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // (((companyNumberOfServices+2)*nrOfIndSubComps)+1)

        // names the cells into which answers will be put
        if (serviceNr == 1) {
            // overall company
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "group", stepCompType)

                SS.setNamedRange(cellName, thisCell) // names cells
                thisCell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }

        // setting up the opCom row
        else if (serviceNr == 2) {
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "opCom", stepCompType)

                SS.setNamedRange(cellName, thisCell) // names cells
                thisCell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }

        // taking care of all the service columns
        else {
            for (let k = 0; k < nrOfIndSubComps; k++) {
                let thisCell = Sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                let g = serviceNr - 3
                let component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                SS.setNamedRange(cellName, thisCell) // names cells
                thisCell.setDataValidation(rule) // creates dropdown list
                    .setValue("not selected") // sets default for drop down list
                    .setFontWeight("bold") // bolds the answers
                activeCol += 1
            }
        }
    }

    return activeRow + 1
}

// ## TODO Component Level functions ## //

function addComparisonYonY(Sheet, currentIndicator, CompanyObj, activeRow, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    // sets up column with discription
    for (let elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
        let activeCol = 1
        // serviceNr = column / service
        // ~ serviceNr = 0 -> Labels
        // ~ serviceNr = 1 Group
        // ~ serviceNr = 2 OpCom


        // sets up labels in the first column of the row
        let cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(currentStep.components[stepCNr].label + currentIndicator.elements[elemNr].labelShort)
            .setBackground(currentStep.subStepColor)
        activeCol += 1

        for (let serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // address hard 3 with company JSON

            // setting up company column(s)
            if (serviceNr == 1) {

                // sets up as many columns as the indicator has components
                for (let k = 0; k < nrOfIndSubComps; k++) {
                    let thisCell = Sheet.getRange(activeRow + elemNr, activeCol)

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    let compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.components[stepCNr].comparisonLabelShort, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "group")

                    // sets up formula that compares values
                    let value = currentIndicator.y2yCompColumn + ((serviceNr - 1) * nrOfIndSubComps) + k // calculates which column
                    let col = columnToLetter(value)
                    // TODO
                    let formula = "=IF(" + compCellName + "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!" + "$" + col + "$" + (currentIndicator.y2yCompRow + elemNr) + ",\"Yes\",\"No\")"

                    thisCell.setFormula(formula.toString())

                    activeCol += 1
                } // close nrOfIndSubComps for loop
            } // close serviceNr==1 if statement


            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {

                    // sets cell
                    let thisCell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // creating the name of cell it will be compared to

                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    let compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.components[stepCNr].comparisonLabelShort, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom")

                    // creating formula that compares the two cells
                    let value = currentIndicator.y2yCompColumn + ((serviceNr - 1) * nrOfIndSubComps) + k
                    // finds comparisson column
                    let col = columnToLetter(value)
                    // TODO
                    let formula = "=IF(" + compCellName + "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!" + "$" + col + "$" + (currentIndicator.y2yCompRow + elemNr) + ",\"Yes\",\"No\")"

                    thisCell.setFormula(formula.toString())


                    activeCol += 1
                } // close nrOfIndSubComps for loop
            } // close serviceNr==2 if statement


            // setting up services column(s9
            else {

                // looping thourough the number of components
                for (let k = 0; k < nrOfIndSubComps; k++) {

                    // setting cell
                    let thisCell = Sheet.getRange(activeRow + elemNr, activeCol)

                    // finding the name of cell that it will be compared too
                    let g = serviceNr - 3
                    let component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    let compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.components[stepCNr].comparisonLabelShort, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id)

                    // creating formula that will be placed in cell
                    let value = currentIndicator.y2yCompColumn + ((serviceNr - 1) * nrOfIndSubComps) + k // calculates which column
                    let col = columnToLetter(value)
                    // TODO
                    let formula = "=IF(" + compCellName + "=" + "'" + centralConfig.prevYearOutcomeTab + "'" + "!" + "$" + col + "$" + (currentIndicator.y2yCompRow + elemNr) + ",\"Yes\",\"No\")"

                    thisCell.setFormula(formula.toString())


                    activeCol += 1
                }
            }
        }
    }

    // adding the conditional formating so that the cell turns red if the answer is no
    let colMax = columnToLetter(2 + (companyNumberOfServices + 2) * nrOfIndSubComps)
    let rowMax = activeRow + currentIndicator.elements.length

    let range = Sheet.getRange(activeRow, 2, currentIndicator.elements.length, 2 + (companyNumberOfServices + 2) * nrOfIndSubComps)

    let rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("No").setBackground("#fa7661").setRanges([range]).build()
    let rules = Sheet.getConditionalFormatRules()
    rules.push(rule)
    Sheet.setConditionalFormatRules(rules)


    activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}

// the sources step adds a single row in which the sources of each column can be listed

function addSources(Sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {
    let activeCol = 1

    let stepCompType = currentStep.components[stepCNr].id


    // adding label
    let cell = Sheet.getRange(activeRow, activeCol)
        .setValue(currentStep.components[stepCNr].label)
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

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "group", stepCompType)

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

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "opCom", stepCompType)

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

                let cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1
            }
        }

    }

    return activeRow + 1
}
