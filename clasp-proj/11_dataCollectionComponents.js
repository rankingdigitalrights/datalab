
// --- // Top-Level Headings // --- //

// Indicator Guidance for researchers

/**
 * 
 * @param {*} currentSheet 
 * @param {*} currentClass 
 * @param {*} thisIndicator 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} hasOpCom 
 * @param {*} numberOfColumns 
 */

function addIndicatorGuidance(currentSheet, currentClass, thisIndicator, activeRow, activeCol, numberOfIndicatorCatSubComponents, hasOpCom, numberOfColumns) {

    // TODO probably move all formatting params to JSON

    var row = activeRow
    var col = activeCol
    var thisRowAsRange

    var bridgeOpCom = 1
    if(hasOpCom) {bridgeOpCom = 0}

    var maxColHeadings = (2 + bridgeOpCom) *  (numberOfIndicatorCatSubComponents) + 1
    var maxRow = 1

    // Indicator Label row
    var cell = currentSheet.getRange(row, col)
    cell.setValue(thisIndicator.labelShort + ". " + thisIndicator.labelLong + ": " + thisIndicator.description)
    cell.setFontWeight("bold")
    cell.setFontSize(14)
    cell.setHorizontalAlignment("left")
    cell.setVerticalAlignment("middle")
    cell.setFontFamily("Oswald")
    cell.setWrap(true)

    currentSheet.setRowHeight(row, 40)
    currentSheet.getRange(row, col, maxRow, maxColHeadings).merge()
    currentSheet.getRange(row, col, maxRow, numberOfColumns).setBackground("lightgrey")

    row += 1

    // Instruction
    cell = currentSheet.getRange(row, col)
    cell.setValue("Please read the indicator-specific guidance and discussions before starting the research:")
    cell.setFontWeight("bold")
    cell.setFontSize(9)
    cell.setHorizontalAlignment("left")
    cell.setVerticalAlignment("middle")
    cell.setFontFamily("Roboto Mono")
    cell.setWrap(true)
    cell.setFontColor("chocolate")

    currentSheet.setRowHeight(row, 40)
    currentSheet.getRange(row, col, maxRow, maxColHeadings).merge()
    currentSheet.getRange(row, col, maxRow, numberOfColumns).setBackground("WhiteSmoke")

    row += 1

    // Indicator elements

    cell = currentSheet.getRange(row, col)
    // cell.setValue("Elements for " + thisIndicator.labelShort + ":")
    cell.setValue("Elements:")
    cell.setFontWeight("bold")
    cell.setHorizontalAlignment("right")
    cell.setFontFamily("Roboto Mono")

    col += 1

    thisIndicator.elements.forEach (function (element) {
        cell = currentSheet.getRange(row, col)
        cell.setValue(element.labelShort + ": " + element.description)
        cell.setFontSize(9)
        cell.setHorizontalAlignment("left")
        cell.setFontFamily("Roboto")
        row += 1
    })

    currentSheet.getRange(row-1, col-1, maxRow, numberOfColumns).setBorder(null, null, true, null, null, null, "black", null);

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
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} companyNumberOfServices 
 */

function addTopHeader(currentSheet, currentClass, CompanyObj, activeRow, file, numberOfIndicatorCatSubComponents, companyNumberOfServices) {

    var activeCol = 1

    var rowRange = (activeRow + ':' + activeRow).toString()
    currentSheet.getRange(rowRange).setHorizontalAlignment('center'); // alligns header row

    // -----------------------SETTING UP THE HEADER ROW------------------------
    // first celll is blank
    // currentSheet.getRange(activeRow, activeCol).setValue('')
    activeCol = activeCol + 1

    // Company (group) column(s)
    for (var i = 0; i < numberOfIndicatorCatSubComponents; i++) {
        var cell = currentSheet.getRange(activeRow, activeCol)
        cell.setValue(CompanyObj.groupLabel)
        cell.setBackground("#fff2cc") // sets color
        cell.setFontWeight('bold') // makes text bold
        cell.setVerticalAlignment("top")

        // if it has components it adds the label in the next row
        if (currentClass.hasSubComponents == true) {
            var currentCell = currentSheet.getRange(activeRow + 1, activeCol)
            currentCell.setValue(currentClass.components[i].labelLong)
            currentCell.setBackground("#fff2cc") // sets color
        } // close hasSubComponents if statement

        activeCol = activeCol + 1

    } // close numberOfIndicatorCatSubComponents for loop

    // setting up OpComCompany regardless of whether it has one
    // will just hide the column if it doesn't exist

    for (var i = 0; i < numberOfIndicatorCatSubComponents; i++) {

        var cell = currentSheet.getRange(activeRow, activeCol)
        cell.setValue(CompanyObj.opComLabel)
        cell.setBackground("#fff2cc")
        cell.setFontWeight('bold')
        cell.setVerticalAlignment("top")

        // hides opCom column(s) if opCom == false
        if (CompanyObj.opCom == false) {
            currentSheet.hideColumns(activeCol)
            cell.setValue('N/A')
        }

        // if the indicator has components it adds them in the next row
        if (currentClass.hasSubComponents == true) {
            var currentCell = currentSheet.getRange(activeRow + 1, activeCol)
            currentCell.setValue(currentClass.components[i].labelLong)
            currentCell.setBackground("#fff2cc"); // sets color
        }

        activeCol = activeCol + 1
    }

    // for remaining collumns (services)
    for (var i = 0; i < companyNumberOfServices; i++) {
        for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
            var cell = currentSheet.getRange(activeRow, activeCol)
            cell.setValue(CompanyObj.services[i].label.current)
            cell.setBackground("#b7e1cd")
            cell.setFontWeight('bold')
            cell.setVerticalAlignment("top")


            // if the indicator has components it adds them in the next row
            if (currentClass.hasSubComponents == true) {
                var currentCell = currentSheet.getRange(activeRow + 1, activeCol)
                currentCell.setValue(currentClass.components[k].labelLong)
                currentCell.setBackground("#b7e1cd"); // sets color
            }
            activeCol = activeCol + 1
        }
    }

    currentSheet.setFrozenRows(activeRow); // freezes rows

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
 * @param {*} currentStepComponent 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} currentSheet 
 */

// function just creates a single row in which in the first column a label is added
function addInstruction(currentStep, currentStepComponent, activeRow, activeCol, currentSheet) {
    var cell = currentSheet.getRange(activeRow, activeCol)
    // cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3); // setting background color
    cell.setValue(currentStep.components[currentStepComponent].label); // adding text
    cell.setBackground(currentStep.legacyColor)
    cell.setFontWeight('bold'); // bolding text
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
 * @param {*} currentStepComponent 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} companyNumberOfServices 
 */


// a step header is a row in which in the first column the name and description of the step is listed
// and in the remaining colums a filler is added
function addStepHeader(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, companyNumberOfServices) {

    activeRow = activeRow + 1

    // sets up labels in the first column
    var cell = currentSheet.getRange(activeRow, 1)
    var text = currentStep.label
    cell.setValue(text)
    cell.setBackground(currentStep.legacyColor)
    cell.setFontWeight('bold')
    cell = textUnderline(cell)

    // for remaining company, opCom, and services columns it adds the filler
    for (var i = 1; i < (((companyNumberOfServices + 2) * numberOfIndicatorCatSubComponents) + 1); i++) {
        var cell = currentSheet.getRange(activeRow, i + 1)
        cell.setValue(currentStep.components[currentStepComponent].filler)
    }

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
 * @param {*} currentStepComponent 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

// addScoringOptions creates a dropdown list in each column for each subindicator
function addScoringOptions(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices) {

    var rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[currentStepComponent].dropdown).build()

    // moving on to actual indicators
    // sets up column with discription
    for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
        var activeCol = 1

        // setting up the labels
        var cell = currentSheet.getRange(activeRow + currentElementNr, activeCol)
        cell.setValue(currentStep.components[currentStepComponent].label + currentIndicator.elements[currentElementNr].labelShort)
        cell.setBackground(currentStep.legacyColor)
        activeCol = activeCol + 1

        for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // (((companyNumberOfServices+2)*numberOfIndicatorCatSubComponents)+1)

            // creates column(s) for overall company
            if (serviceNr == 1) {

                // loops through the number of components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

                    var thisCell = currentSheet.getRange(activeRow + currentElementNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'group', currentStep.components[currentStepComponent].nameLabel)


                    file.setNamedRange(cellName, thisCell); // names cells
                    thisCell.setDataValidation(rule); // creates dropdown list
                    thisCell.setValue('not selected'); // sets default for drop down list
                    thisCell.setFontWeight('bold'); // bolds the answers
                    activeCol = activeCol + 1
                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                    var thisCell = currentSheet.getRange(activeRow + currentElementNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'opCom', currentStep.components[currentStepComponent].nameLabel)

                    file.setNamedRange(cellName, thisCell); // names cells
                    thisCell.setDataValidation(rule); // creates dropdown list
                    thisCell.setValue('not selected'); // sets default for drop down list
                    thisCell.setFontWeight('bold'); // bolds the answers
                    activeCol = activeCol + 1
                }
            }

            // creating all the service columns
            else {
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                    var thisCell = currentSheet.getRange(activeRow + currentElementNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var g = serviceNr - 3; // helper for Services

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStep.components[currentStepComponent].nameLabel)

                    file.setNamedRange(cellName, thisCell); // names cells
                    thisCell.setDataValidation(rule); // creates dropdown list
                    thisCell.setValue('not selected'); // sets default for drop down list
                    thisCell.setFontWeight('bold'); // bolds the answers
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
 * @param {*} currentStepComponent 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

function addComments(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices) {


    for (var i = 0; i < currentIndicator.elements.length; i++) { currentSheet.setRowHeight(activeRow + i, 50); } // increases height of row

    // loops through subindicators
    for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
        var activeCol = 1

        // adding the labels
        var cell = currentSheet.getRange(activeRow + currentElementNr, activeCol)
        cell.setValue(currentStep.components[currentStepComponent].label + currentIndicator.elements[currentElementNr].labelShort + currentStep.components[currentStepComponent].label2)
        cell.setBackground(currentStep.legacyColor); // colors cell
        activeCol = activeCol + 1

        for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // setting up the columns for the overall company
            if (serviceNr == 1) {

                // looping through the number of components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                    var thisCell = currentSheet.getRange(activeRow + currentElementNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'group', currentStep.components[currentStepComponent].nameLabel)

                    file.setNamedRange(cellName, thisCell)
                    activeCol = activeCol + 1

                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // looping through the number of components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

                    var thisCell = currentSheet.getRange(activeRow + currentElementNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'opCom', currentStep.components[currentStepComponent].nameLabel)

                    file.setNamedRange(cellName, thisCell)
                    activeCol = activeCol + 1

                }
            }

            // setting up columns for all the services
            else {
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

                    thisCell = currentSheet.getRange(activeRow + currentElementNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var g = serviceNr - 3; // helper for Services

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStep.components[currentStepComponent].nameLabel)

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
 * @param {*} currentStepComponent 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

function addBinaryEvaluation(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices) {

    var rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[currentStepComponent].dropdown).build()

    var activeCol = 1

    // sets up the labels
    var cell = currentSheet.getRange(activeRow, activeCol)
    cell.setValue(currentStep.components[currentStepComponent].label)
    cell.setBackground(currentStep.legacyColor)
    activeCol = activeCol + 1

    for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // (((companyNumberOfServices+2)*numberOfIndicatorCatSubComponents)+1)

        // names the cells into which answers will be put
        if (serviceNr == 1) {
            // overall company
            for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                var thisCell = currentSheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, "group", currentStep.components[currentStepComponent].nameLabel)

                file.setNamedRange(cellName, thisCell); // names cells
                thisCell.setDataValidation(rule); // creates dropdown list
                thisCell.setValue('not selected'); // sets default for drop down list
                thisCell.setFontWeight('bold'); // bolds the answers
                activeCol = activeCol + 1
            }
        }

        // setting up the opCom row
        else if (serviceNr == 2) {
            for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                var thisCell = currentSheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, "opCom", currentStep.components[currentStepComponent].nameLabel)

                file.setNamedRange(cellName, thisCell); // names cells
                thisCell.setDataValidation(rule); // creates dropdown list
                thisCell.setValue('not selected'); // sets default for drop down list
                thisCell.setFontWeight('bold'); // bolds the answers
                activeCol = activeCol + 1
            }
        }

        // taking care of all the service columns
        else {
            for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                var thisCell = currentSheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var g = serviceNr - 3
                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStep.components[currentStepComponent].nameLabel)

                file.setNamedRange(cellName, thisCell); // names cells
                thisCell.setDataValidation(rule); // creates dropdown list
                thisCell.setValue('not selected'); // sets default for drop down list
                thisCell.setFontWeight('bold'); // bolds the answers
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
 * @param {*} currentStepComponent 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

function addComparisonYonY(sheet, currentIndicator, CompanyObj, activeRow, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices) {

    // sets up column with discription
    for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
        var activeCol = 1
        // serviceNr = column / service
        // ~ serviceNr = 0 -> Labels
        // ~ serviceNr = 1 Group
        // ~ serviceNr = 2 OpCom


        // sets up labels in the first column of the row
        var cell = sheet.getRange(activeRow + currentElementNr, activeCol)
        cell.setValue(currentStep.components[currentStepComponent].label + currentIndicator.elements[currentElementNr].labelShort)
        cell.setBackground(currentStep.legacyColor)
        activeCol = activeCol + 1

        for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // address hard 3 with company JSON

            // setting up company column(s)
            if (serviceNr == 1) {

                // sets up as many columns as the indicator has components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                    var thisCell = sheet.getRange(activeRow + currentElementNr, activeCol)

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.components[currentStepComponent].comparisonLabelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "group")

                    // sets up formula that compares values
                    var value = currentIndicator.compCol + ((serviceNr - 1) * numberOfIndicatorCatSubComponents) + k; // calculates which column
                    var col = columnToLetter(value)
                    // TODO
                    var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + '$' + col + '$' + (currentIndicator.compRow + currentElementNr) + ',"Yes","No")'

                    thisCell.setFormula(formula.toString())

                    activeCol = activeCol + 1
                } // close numberOfIndicatorCatSubComponents for loop
            } // close serviceNr==1 if statement


            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

                    // sets cell
                    var thisCell = sheet.getRange(activeRow + currentElementNr, activeCol)

                    // creating the name of cell it will be compared to

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.components[currentStepComponent].comparisonLabelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "opCom")

                    // creating formula that compares the two cells
                    var value = currentIndicator.compCol + ((serviceNr - 1) * numberOfIndicatorCatSubComponents) + k; // finds comparisson column
                    var col = columnToLetter(value)
                    // TODO
                    var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + '$' + col + '$' + (currentIndicator.compRow + currentElementNr) + ',"Yes","No")'

                    thisCell.setFormula(formula.toString())


                    activeCol = activeCol + 1
                } // close numberOfIndicatorCatSubComponents for loop
            } // close serviceNr==2 if statement


            // setting up services column(s9
            else {

                // looping thourough the number of components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

                    // setting cell
                    var thisCell = sheet.getRange(activeRow + currentElementNr, activeCol)

                    // finding the name of cell that it will be compared too
                    var g = serviceNr - 3
                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.components[currentStepComponent].comparisonLabelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id)

                    // creating formula that will be placed in cell
                    var value = currentIndicator.compCol + ((serviceNr - 1) * numberOfIndicatorCatSubComponents) + k; // calculates which column
                    var col = columnToLetter(value)
                    // TODO
                    var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + '$' + col + '$' + (currentIndicator.compRow + currentElementNr) + ',"Yes","No")'

                    thisCell.setFormula(formula.toString())


                    activeCol = activeCol + 1
                }
            }
        }
    }

    // adding the conditional formating so that the cell turns red if the answer is no
    var colMax = columnToLetter(2 + (companyNumberOfServices + 2) * numberOfIndicatorCatSubComponents)
    var rowMax = activeRow + currentIndicator.elements.length

    var range = sheet.getRange(activeRow, 2, currentIndicator.elements.length, 2 + (companyNumberOfServices + 2) * numberOfIndicatorCatSubComponents)

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
 * @param {*} currentStepComponent 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} currentClass 
 * @param {*} companyNumberOfServices 
 */

function addSources(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices) {
    var activeCol = 1

    // adding label
    var cell = currentSheet.getRange(activeRow, activeCol)
    cell.setValue(currentStep.components[currentStepComponent].label)
    cell.setBackground(currentStep.legacyColor)
    activeCol = activeCol + 1

    for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

        // TODO: fix cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                var thisCell = currentSheet.getRange(activeRow, 1 + serviceNr + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, 'group', currentStep.components[currentStepComponent].nameLabel)

                file.setNamedRange(cellName, thisCell)
                activeCol = activeCol + 1

            }
        }

        else if (serviceNr == 2) {
            // opCom
            for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                var thisCell = currentSheet.getRange(activeRow, 1 + numberOfIndicatorCatSubComponents + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, 'opCom', currentStep.components[currentStepComponent].nameLabel)

                file.setNamedRange(cellName, thisCell)
                activeCol = activeCol + 1

            }
        }

        else {
            // services
            for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                var thisCell = currentSheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var g = serviceNr - 3; // helper for Services

                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = currentClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStep.components[currentStepComponent].nameLabel)

                file.setNamedRange(cellName, thisCell)
                activeCol = activeCol + 1
            }
        }

    }

    return activeRow + 1
}
