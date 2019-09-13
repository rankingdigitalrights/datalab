// --- // Top-Level Headings // --- //

// Indicator Guidance for researchers

/**
 * 
 * @param {*} currentSheet 
 * @param {*} currentClass 
 * @param {*} thisIndicator 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} nrOfIndSubComps 
 * @param {*} hasOpCom 
 * @param {*} numberOfColumns 
 */

function addIndicatorGuidance(currentSheet, currentClass, thisIndicator, activeRow, activeCol, nrOfIndSubComps, hasOpCom, numberOfColumns) {

    // TODO probably move all formatting params to JSON

    var row = activeRow
    var col = activeCol
    var thisRowAsRange

    var bridgeOpCom = 1
    if (hasOpCom) {
        bridgeOpCom = 0
    }

    var maxColHeadings = (2 + bridgeOpCom) * (nrOfIndSubComps) + 1
    var maxRow = 1

    // Indicator Label row
    var cell = currentSheet.getRange(row, col)
        .setValue(thisIndicator.labelShort + ". " + thisIndicator.labelLong + ": " + thisIndicator.description)
        .setFontWeight("bold")
        .setFontSize(14)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setFontFamily("Oswald")
        .setWrap(true)

    currentSheet.setRowHeight(row, 40)
    currentSheet.getRange(row, col, maxRow, maxColHeadings).merge()
    currentSheet.getRange(row, col, maxRow, numberOfColumns).setBackground("lightgrey")

    row += 1

    // Instruction
    cell = currentSheet.getRange(row, col)
        .setValue("Please read the indicator-specific guidance and discussions before starting the research:")
        .setFontWeight("bold")
        .setFontSize(9)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setFontFamily("Roboto Mono")
        .setWrap(true)
        .setFontColor("chocolate")

    currentSheet.setRowHeight(row, 40)
    currentSheet.getRange(row, col, maxRow, maxColHeadings).merge()
    currentSheet.getRange(row, col, maxRow, numberOfColumns).setBackground("WhiteSmoke")

    row += 1

    // Indicator elements

    cell = currentSheet.getRange(row, col)
    // cell.setValue("Elements for " + thisIndicator.labelShort + ":")
        .setValue("Elements:")
        .setFontWeight("bold")
        .setHorizontalAlignment("right")
        .setFontFamily("Roboto Mono")

    col += 1

    thisIndicator.elements.forEach(function (element) {
        cell = currentSheet.getRange(row, col)
            .setValue(element.labelShort + ": " + element.description)
            .setFontSize(9)
            .setHorizontalAlignment("left")
            .setFontFamily("Roboto")
        row += 1
    })

    currentSheet.getRange(row - 1, col - 1, maxRow, numberOfColumns).setBorder(null, null, true, null, null, null, "black", null)

    activeRow = row
    return activeRow
}

// Company + Services Header

/**
 * 
 * @param {*} currentSheet 
 * @param {*} currentClass 
 * @param {*} CompanyObj 
 * @param {*} activeRow 
 * @param {*} file 
 * @param {*} nrOfIndSubComps 
 * @param {*} companyNumberOfServices 
 */

function addTopHeader(currentSheet, currentClass, CompanyObj, activeRow, file, nrOfIndSubComps, companyNumberOfServices) {

    var activeCol = 1

    var rowRange = (activeRow + ':' + activeRow).toString()
    currentSheet.getRange(rowRange).setHorizontalAlignment('center') // alligns header row

    // -----------------------SETTING UP THE HEADER ROW------------------------
    // first celll is blank
    // currentSheet.getRange(activeRow, activeCol).setValue('')
    activeCol = activeCol + 1

    // Company (group) column(s)
    for (var i = 0; i < nrOfIndSubComps; i++) {
        var cell = currentSheet.getRange(activeRow, activeCol)
            .setValue(CompanyObj.groupLabel)
            .setBackground("#fff2cc") // sets color
            .setFontWeight('bold') // makes text bold
            .setVerticalAlignment("top")

        // if it has components it adds the label in the next row
        if (currentClass.hasSubComponents == true) {
            var currentCell = currentSheet.getRange(activeRow + 1, activeCol)
            currentCell.setValue(currentClass.components[i].labelLong)
            currentCell.setBackground("#fff2cc") // sets color
        } // close hasSubComponents if statement

        activeCol = activeCol + 1

    } // close nrOfIndSubComps for loop

    // setting up OpComCompany regardless of whether it has one
    // will just hide the column if it doesn't exist

    for (var i = 0; i < nrOfIndSubComps; i++) {

        var cell = currentSheet.getRange(activeRow, activeCol)
            .setValue(CompanyObj.opComLabel)
            .setBackground("#fff2cc")
            .setFontWeight('bold')
            .setVerticalAlignment("top")

        // hides opCom column(s) if opCom == false
        if (CompanyObj.opCom == false) {
            currentSheet.hideColumns(activeCol)
            cell.setValue('N/A')
        }

        // if the indicator has components it adds them in the next row
        if (currentClass.hasSubComponents == true) {
            var currentCell = currentSheet.getRange(activeRow + 1, activeCol)
                .setValue(currentClass.components[i].labelLong)
                .setBackground("#fff2cc") // sets color
        }

        activeCol = activeCol + 1
    }

    // for remaining collumns (services)
    for (var i = 0; i < companyNumberOfServices; i++) {
        for (var k = 0; k < nrOfIndSubComps; k++) {
            var cell = currentSheet.getRange(activeRow, activeCol)
                .setValue(CompanyObj.services[i].label.current)
                .setBackground("#b7e1cd")
                .setFontWeight('bold')
                .setVerticalAlignment("top")


            // if the indicator has components it adds them in the next row
            if (currentClass.hasSubComponents == true) {
                var currentCell = currentSheet.getRange(activeRow + 1, activeCol)
                    .setValue(currentClass.components[k].labelLong)
                    .setBackground("#b7e1cd") // sets color
            }
            activeCol = activeCol + 1
        }
    }

    currentSheet.setFrozenRows(activeRow) // freezes rows

    // if the indicator does indeed have components, it freezes the additional row in which they are
    if (currentClass.hasSubComponents == true) {
        currentSheet.setFrozenRows(activeRow + 1)
        rowRange = ((activeRow + 1) + ':' + (activeRow + 1)).toString()
        currentSheet.getRange(rowRange).setHorizontalAlignment('center')
        activeRow = activeRow + 1

    }

    return activeRow

}

/**
 * 
 * @param {*} currentStep 
 * @param {*} stepCNr 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} currentSheet 
 */

// function just creates a single row in which in the first column a label is added
function addInstruction(currentStep, stepCNr, activeRow, activeCol, currentSheet) {
    var cell = currentSheet.getRange(activeRow, activeCol)
        // cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3) // setting background color
        .setValue(currentStep.components[stepCNr].label) // adding text
        .setBackground(currentStep.legacyColor)
        .setFontWeight('bold') // bolding text
    return activeRow + 1
}

/**
 * 
 * @param {*} currentSheet 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} activeRow 
 * @param {*} file 
 * @param {*} currentStep 
 * @param {*} stepCNr 
 * @param {*} nrOfIndSubComps 
 * @param {*} companyNumberOfServices 
 */


// a step header is a row in which in the first column the name and description of the step is listed
// and in the remaining colums a filler is added
function addStepHeader(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, companyNumberOfServices) {

    activeRow = activeRow + 1

    // sets up labels in the first column
    var cell = currentSheet.getRange(activeRow, 1)
    var text = currentStep.label
    cell.setValue(text)
        .setBackground(currentStep.legacyColor)
        .setFontWeight('bold')
    cell = textUnderline(cell)

    var thisFiller = currentStep.components[stepCNr].filler
    const thisFirstCol = 2
    const thisLastCol = ((companyNumberOfServices + 2) * nrOfIndSubComps)
    // for remaining company, opCom, and services columns it adds the filler
    var thisRange = currentSheet.getRange(activeRow, thisFirstCol, 1, thisLastCol)
    thisRange.setValue(thisFiller)
    thisRange.setFontStyle("italic")

    return activeRow + 1

}

/**
 * 
 * @param {*} currentSheet 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} activeRow 
 * @param {*} file 
 * @param {*} currentStep 
 * @param {*} stepCNr 
 * @param {*} nrOfIndSubComps 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

// addScoringOptions creates a dropdown list in each column for each subindicator
function addScoringOptions(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    var rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[stepCNr].dropdown).build()

    // row labels
    for (var elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
        var activeCol = 1

        var thisElement = currentIndicator.elements[elemNr]

        var noteString = thisElement.labelShort + ": " + thisElement.description

        // setting up the labels
        var cell = currentSheet.getRange(activeRow + elemNr, activeCol)
            .setValue(currentStep.components[stepCNr].label + thisElement.labelShort)
            .setBackground(currentStep.legacyColor)
            .setNote(noteString)
        activeCol = activeCol + 1

        for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // creates column(s) for overall company
            if (serviceNr == 1) {

                // loops through the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {

                    var thisCell = currentSheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, thisElement.labelShort, component, CompanyObj.id, 'group', currentStep.components[stepCNr].nameLabel)


                    file.setNamedRange(cellName, thisCell) // names cells
                    thisCell.setDataValidation(rule) // creates dropdown list
                    thisCell.setValue('not selected') // sets default for drop down list
                        .setFontWeight('bold') // bolds the answers
                    activeCol = activeCol + 1
                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {
                    var thisCell = currentSheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, thisElement.labelShort, component, CompanyObj.id, 'opCom', currentStep.components[stepCNr].nameLabel)

                    file.setNamedRange(cellName, thisCell) // names cells
                    thisCell.setDataValidation(rule) // creates dropdown list
                        .setValue('not selected') // sets default for drop down list
                        .setFontWeight('bold') // bolds the answers
                    activeCol = activeCol + 1
                }
            }

            // creating all the service columns
            else {
                for (var k = 0; k < nrOfIndSubComps; k++) {
                    var thisCell = currentSheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var g = serviceNr - 3 // helper for Services

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, thisElement.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStep.components[stepCNr].nameLabel)

                    file.setNamedRange(cellName, thisCell) // names cells
                    thisCell.setDataValidation(rule) // creates dropdown list
                        .setValue('not selected') // sets default for drop down list
                        .setFontWeight('bold') // bolds the answers
                    activeCol = activeCol + 1
                }
            }
        }
    }

    activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}


// this function creates a cell for comments for each subindicator and names the ranges

/**
 * 
 * @param {*} currentSheet 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} activeRow 
 * @param {*} file 
 * @param {*} currentStep 
 * @param {*} stepCNr 
 * @param {*} nrOfIndSubComps 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

function addComments(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {


    for (var i = 0; i < currentIndicator.elements.length; i++) {
        currentSheet.setRowHeight(activeRow + i, 50)
    } // increases height of row

    // loops through subindicators
    for (var elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
        var activeCol = 1

        // adding the labels
        var cell = currentSheet.getRange(activeRow + elemNr, activeCol)
        cell.setValue(currentStep.components[stepCNr].label + currentIndicator.elements[elemNr].labelShort + currentStep.components[stepCNr].label2)
        cell.setBackground(currentStep.legacyColor) // colors cell
        activeCol = activeCol + 1

        for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // setting up the columns for the overall company
            if (serviceNr == 1) {

                // looping through the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {
                    var thisCell = currentSheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, 'group', currentStep.components[stepCNr].nameLabel)

                    file.setNamedRange(cellName, thisCell)
                    activeCol = activeCol + 1

                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // looping through the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {

                    var thisCell = currentSheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, 'opCom', currentStep.components[stepCNr].nameLabel)

                    file.setNamedRange(cellName, thisCell)
                    activeCol = activeCol + 1

                }
            }

            // setting up columns for all the services
            else {
                for (var k = 0; k < nrOfIndSubComps; k++) {

                    thisCell = currentSheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var g = serviceNr - 3; // helper for Services

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStep.components[stepCNr].nameLabel)

                    file.setNamedRange(cellName, thisCell)
                    activeCol = activeCol + 1

                }

            }

        }
    }


    activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}

// this function adds an element drop down list to a single row

/**
 * 
 * @param {*} currentSheet 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} activeRow 
 * @param {*} file 
 * @param {*} currentStep 
 * @param {*} stepCNr 
 * @param {*} nrOfIndSubComps 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

function addBinaryEvaluation(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    var rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[stepCNr].dropdown).build()

    var activeCol = 1

    // sets up the labels
    var cell = currentSheet.getRange(activeRow, activeCol)
        .setValue(currentStep.components[stepCNr].label)
        .setBackground(currentStep.legacyColor)
    activeCol = activeCol + 1

    for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // (((companyNumberOfServices+2)*nrOfIndSubComps)+1)

        // names the cells into which answers will be put
        if (serviceNr == 1) {
            // overall company
            for (var k = 0; k < nrOfIndSubComps; k++) {
                var thisCell = currentSheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, "group", currentStep.components[stepCNr].nameLabel)

                file.setNamedRange(cellName, thisCell) // names cells
                thisCell.setDataValidation(rule) // creates dropdown list
                    .setValue('not selected') // sets default for drop down list
                    .setFontWeight('bold') // bolds the answers
                activeCol = activeCol + 1
            }
        }

        // setting up the opCom row
        else if (serviceNr == 2) {
            for (var k = 0; k < nrOfIndSubComps; k++) {
                var thisCell = currentSheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, "opCom", currentStep.components[stepCNr].nameLabel)

                file.setNamedRange(cellName, thisCell) // names cells
                thisCell.setDataValidation(rule) // creates dropdown list
                    .setValue('not selected') // sets default for drop down list
                    .setFontWeight('bold') // bolds the answers
                activeCol = activeCol + 1
            }
        }

        // taking care of all the service columns
        else {
            for (var k = 0; k < nrOfIndSubComps; k++) {
                var thisCell = currentSheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var g = serviceNr - 3
                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStep.components[stepCNr].nameLabel)

                file.setNamedRange(cellName, thisCell) // names cells
                thisCell.setDataValidation(rule) // creates dropdown list
                    .setValue('not selected') // sets default for drop down list
                    .setFontWeight('bold') // bolds the answers
                activeCol = activeCol + 1
            }
        }
    }

    return activeRow + 1
}

// ## TODO Component Level functions ## //

/**
 * 
 * @param {*} sheet 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} activeRow 
 * @param {*} currentStep 
 * @param {*} stepCNr 
 * @param {*} nrOfIndSubComps 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

function addComparisonYonY(sheet, currentIndicator, CompanyObj, activeRow, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    // sets up column with discription
    for (var elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
        var activeCol = 1
        // serviceNr = column / service
        // ~ serviceNr = 0 -> Labels
        // ~ serviceNr = 1 Group
        // ~ serviceNr = 2 OpCom


        // sets up labels in the first column of the row
        var cell = sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(currentStep.components[stepCNr].label + currentIndicator.elements[elemNr].labelShort)
            .setBackground(currentStep.legacyColor)
        activeCol = activeCol + 1

        for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // address hard 3 with company JSON

            // setting up company column(s)
            if (serviceNr == 1) {

                // sets up as many columns as the indicator has components
                for (var k = 0; k < nrOfIndSubComps; k++) {
                    var thisCell = sheet.getRange(activeRow + elemNr, activeCol)

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.components[stepCNr].comparisonLabelShort, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "group")

                    // sets up formula that compares values
                    var value = currentIndicator.compCol + ((serviceNr - 1) * nrOfIndSubComps) + k // calculates which column
                    var col = columnToLetter(value)
                    // TODO
                    var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + '$' + col + '$' + (currentIndicator.compRow + elemNr) + ',"Yes","No")'

                    thisCell.setFormula(formula.toString())

                    activeCol = activeCol + 1
                } // close nrOfIndSubComps for loop
            } // close serviceNr==1 if statement


            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {

                    // sets cell
                    var thisCell = sheet.getRange(activeRow + elemNr, activeCol)

                    // creating the name of cell it will be compared to

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.components[stepCNr].comparisonLabelShort, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom")

                    // creating formula that compares the two cells
                    var value = currentIndicator.compCol + ((serviceNr - 1) * nrOfIndSubComps) + k
                    // finds comparisson column
                    var col = columnToLetter(value)
                    // TODO
                    var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + '$' + col + '$' + (currentIndicator.compRow + elemNr) + ',"Yes","No")'

                    thisCell.setFormula(formula.toString())


                    activeCol = activeCol + 1
                } // close nrOfIndSubComps for loop
            } // close serviceNr==2 if statement


            // setting up services column(s9
            else {

                // looping thourough the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {

                    // setting cell
                    var thisCell = sheet.getRange(activeRow + elemNr, activeCol)

                    // finding the name of cell that it will be compared too
                    var g = serviceNr - 3
                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.components[stepCNr].comparisonLabelShort, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id)

                    // creating formula that will be placed in cell
                    var value = currentIndicator.compCol + ((serviceNr - 1) * nrOfIndSubComps) + k // calculates which column
                    var col = columnToLetter(value)
                    // TODO
                    var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + '$' + col + '$' + (currentIndicator.compRow + elemNr) + ',"Yes","No")'

                    thisCell.setFormula(formula.toString())


                    activeCol = activeCol + 1
                }
            }
        }
    }

    // adding the conditional formating so that the cell turns red if the answer is no
    var colMax = columnToLetter(2 + (companyNumberOfServices + 2) * nrOfIndSubComps)
    var rowMax = activeRow + currentIndicator.elements.length

    var range = sheet.getRange(activeRow, 2, currentIndicator.elements.length, 2 + (companyNumberOfServices + 2) * nrOfIndSubComps)

    var rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('No').setBackground("#fa7661").setRanges([range]).build()
    var rules = sheet.getConditionalFormatRules()
    rules.push(rule)
    sheet.setConditionalFormatRules(rules)


    activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}

// the sources step adds a single row in which the sources of each column can be listed

/**
 * 
 * @param {*} currentSheet 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} activeRow 
 * @param {*} file 
 * @param {*} currentStep 
 * @param {*} stepCNr 
 * @param {*} nrOfIndSubComps 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

function addSources(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {
    var activeCol = 1

    // adding label
    var cell = currentSheet.getRange(activeRow, activeCol)
        .setValue(currentStep.components[stepCNr].label)
        .setBackground(currentStep.legacyColor)
    activeCol = activeCol + 1

    for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

        // TODO: fix cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            for (var k = 0; k < nrOfIndSubComps; k++) {
                var thisCell = currentSheet.getRange(activeRow, 1 + serviceNr + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, 'group', currentStep.components[stepCNr].nameLabel)

                file.setNamedRange(cellName, thisCell)
                activeCol = activeCol + 1

            }
        } else if (serviceNr == 2) {
            // opCom
            for (var k = 0; k < nrOfIndSubComps; k++) {
                var thisCell = currentSheet.getRange(activeRow, 1 + nrOfIndSubComps + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, 'opCom', currentStep.components[stepCNr].nameLabel)

                file.setNamedRange(cellName, thisCell)
                activeCol = activeCol + 1

            }
        } else {
            // services
            for (var k = 0; k < nrOfIndSubComps; k++) {
                var thisCell = currentSheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var g = serviceNr - 3 // helper for Services

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStep.components[stepCNr].nameLabel)

                file.setNamedRange(cellName, thisCell)
                activeCol = activeCol + 1
            }
        }

    }

    return activeRow + 1
}
