// --- Spreadsheet Casting: Company Data Collection Sheet --- //

// --- for easier use, define company name here (based on lookup from config or according json file) --- //

// --- CONFIG --- //

var importedOutcomeTabName = "2018 Outcome"

// --------------- This is the main caller ---------------- //

function createDCSheet(stepsSubset, indicatorSubset, companyShortName, filenameVersion) {
    Logger.log('begin main data collection')
    Logger.log("Name received: " + companyShortName)

    var sheetMode = "DC" // TODO

    //importing the JSON objects which contain the parameters
    // TODO: parameterize for easier usability
    var configObj = importJsonConfig()
    var CompanyObj = importJsonCompany(companyShortName)
    var IndicatorsObj = importJsonIndicator(indicatorSubset)
    var ResearchStepsObj = importResearchSteps(stepsSubset)

    // creating a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(companyShortName, sheetMode, filenameVersion)
    //   var file = SpreadsheetApp.create(spreadsheetName)
    var file = connectToSpreadsheetByName(spreadsheetName)

    // add previous year's outcome sheet

    // Formula for importing previous year's outcome
    var externalFormula = '=IMPORTRANGE("' + configObj.prevIndexSSID + '","' + CompanyObj.tabPrevYearsOutcome + '!' + 'A:Z' + '")'


    // first Sheet already exist, so set it to active and rename
    var firstSheet = file.getActiveSheet()
    firstSheet.setName(importedOutcomeTabName); // <-- will need to make this dynamic at some point
    var cell = firstSheet.getActiveCell()
    cell.setValue(externalFormula.toString())

    // creates sources page
    file.insertSheet('2019 Sources'); // <-- will need to make this dynamic at some point


    // INSERT FUNCTION MAKING SOURCES PAGE
    // TODO

    // fetch number of Services once
    var CompanyNumberOfServices = CompanyObj.services.length

    // MAKING ALL THE NECESSARY TABS and filling them
    // 1. the governance tabs

    for (var i = 0; i < IndicatorsObj.indicatorClass.length; i++) {
        populateByCategory(file, IndicatorsObj.indicatorClass[i], CompanyObj, ResearchStepsObj, CompanyNumberOfServices)
    }

    Logger.log('end main')
    return
}

// ## BEGIN Helper functions  ## //

// functions to convert column numbers to letters and vice versa
// for easier translation of column number to column letter in formulas
function columnToLetter(column) {
    var temp, letter = ''
    while (column > 0) {
        temp = (column - 1) % 26
        letter = String.fromCharCode(temp + 65) + letter
        column = (column - temp - 1) / 26
    }
    return letter
}

function letterToColumn(letter) {
    var column = 0, length = letter.length
    for (var i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1)
    }
    return column
}

// ## END Helper functions  ## //

// ## BEGIN High-level functions | main components ## //
// TODO: Explain in a few sentences what the whole function is doing
// List the parameters and where their values are coming from

function populateByCategory(file, indicatorClass, CompanyObj, ResearchStepsObj, CompanyNumberOfServices) {

    // counts the number of indicators of that typ and iterates over them
    // for each indicator
    // - create a new Sheet
    // - name the Sheet
    // -

    // iterates over each indicator in the current type
    for (var i = 0; i < indicatorClass.indicators.length; i++) {
        var sheet = file.insertSheet(); // creates sheet
        sheet.setName(indicatorClass.indicators[i].labelShort); // sets name of sheet to indicator

        // ## BEGIN of XY Section
        // TODO What is happing here
        // setting active row and an active column

        // checks whether this indicator has components. If yes then it is set to that number, else it is defaulted to 1
        var numberOfIndicatorCatSubComponents = 1
        if (indicatorClass.hasSubComponents == true) { numberOfIndicatorCatSubComponents = indicatorClass.components.length; } // if indicator has components add them

        // 
        var activeRow = 1
        var activeCol = 1

        activeRow = addTopHeader(sheet, indicatorClass, CompanyObj, activeRow, file, numberOfIndicatorCatSubComponents, CompanyNumberOfServices); // sets up header

        // setting up all the steps for all the indicators
        for (var currentStep = 0; currentStep < ResearchStepsObj.researchSteps.length; currentStep++) {
            for (var currentStepComponent = 0; currentStepComponent < ResearchStepsObj.researchSteps[currentStep].components.length; currentStepComponent++) {

                // stores first row of a step to use later in naming a step
                if (currentStepComponent == 0) { var firstRow = activeRow + 1; }

                // all these functions make the type of substep that the step object specifies at this point
                if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == "header") {
                    activeRow = addStepHeader(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, CompanyNumberOfServices)
                }

                else if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == "elementDropDown") { //resultsDropDown
                    activeRow = addScoringOptions(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices)
                }

                else if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == "miniElementDropDown") { //reviewDropDown
                    activeRow = addBinaryEvaluation(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices)
                }

                else if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == "comments") {
                    activeRow = addComments(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices)
                }

                else if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == "sources") {
                    activeRow = addSources(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices)
                }

                else if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == "miniheader") { // rename to something more explicit
                    activeRow = addInstruction(ResearchStepsObj.researchSteps[currentStep], currentStepComponent, activeRow, sheet)
                }

                else if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == "comparison") {
                    activeRow = addComparisonYonY(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices)
                }

                // if there are no more substeps, we store the final row and name the step
                if (currentStepComponent == ResearchStepsObj.researchSteps[currentStep].components.length - 1) {

                    var lastRow = activeRow
                    var maxCol = 1 + (CompanyNumberOfServices + 2) * numberOfIndicatorCatSubComponents; // calculates the max column

                    // we don't want the researchs' names, so move firstRow by 1

                    var range = sheet.getRange(firstRow + 1, 2, lastRow - firstRow - 1, maxCol - 1)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""

                    var stepNamedRange = defineNamedRangeStringImport(indexPrefix, 'DC', ResearchStepsObj.researchSteps[currentStep].labelShort, indicatorClass.indicators[i].labelShort, component, CompanyObj.id, "", "Step")

                    file.setNamedRange(stepNamedRange, range); // names an entire step
                }
            }
        }

    }
    // ## END of Section XY ## 
}






// function just creates a single row in which in the first column a label is added
function addInstruction(currentStep, currentStepComponent, activeRow, currentSheet) {
    var cell = currentSheet.getRange(activeRow, 1)
    cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3); // setting background color
    cell.setValue(currentStep.components[currentStepComponent].label); // adding text
    cell.setFontWeight('bold'); // bolding text
    cell.setWrap(true); // wrapping text
    activeRow = activeRow + 1
    return activeRow

}




// header of sheet function------------------------------------------------
function addTopHeader(currentSheet, indicatorClass, CompanyObj, activeRow, file, numberOfIndicatorCatSubComponents, CompanyNumberOfServices) {

    var activeCol = 1

    currentSheet.setColumnWidth(1, 300)
    for (var i = 2; i <= 20; i++) { currentSheet.setColumnWidth(i, 300 / numberOfIndicatorCatSubComponents); } // sets column width

    var cellName = (activeRow + ':' + activeCol)
    cellName = cellName.toString()
    currentSheet.getRange(cellName).setHorizontalAlignment('center'); // alligns header row



    // -----------------------SETTING UP THE HEADER ROW------------------------
    // first collum is blank
    currentSheet.getRange(activeRow, activeCol).setValue('')
    activeCol = activeCol + 1

    // overall Company column(s)
    for (var i = 0; i < numberOfIndicatorCatSubComponents; i++) {
        var cell = currentSheet.getRange(activeRow, activeCol)
        cell.setValue(CompanyObj.groupLabel); // adds text
        cell.setBackgroundRGB(252, 111, 125); // sets color
        cell.setFontWeight('bold'); // makes text bold
        cell.setWrap(true)

        // if it has components it adds the label in the next row
        if (indicatorClass.hasSubComponents == true) {
            var currentCell = currentSheet.getRange(activeRow + 1, activeCol)
            currentCell.setValue(indicatorClass.components[i].labelLong)
            currentCell.setBackgroundRGB(252, 111, 125); // sets color
            currentCell.setFontWeight('bold'); // makes text bold
            currentCell.setWrap(true)
        } // close hasSubComponents if statement

        activeCol = activeCol + 1

    } // close numberOfIndicatorCatSubComponents for loop

    // setting up OpComCompany regardless of whether it has one
    // will just hide the column if it doesn't exist

    for (var i = 0; i < numberOfIndicatorCatSubComponents; i++) {

        var cell = currentSheet.getRange(activeRow, activeCol)
        cell.setValue(CompanyObj.opComLabel)
        cell.setBackgroundRGB(252, 111, 125)
        cell.setFontWeight('bold')

        // hides opCom column(s) if opCom == false
        if (CompanyObj.opCom == false) {
            currentSheet.hideColumns(activeCol)
            cell.setValue('N/A')
        }

        cell.setWrap(true)

        // if the indicator has components it adds them in the next row
        if (indicatorClass.hasSubComponents == true) {
            var currentCell = currentSheet.getRange(activeRow + 1, activeCol)
            currentCell.setValue(indicatorClass.components[i].labelLong)
            currentCell.setBackgroundRGB(252, 111, 125); // sets color
            currentCell.setFontWeight('bold'); // makes text bold
            currentCell.setWrap(true)
        }

        activeCol = activeCol + 1
    }

    // for remaining collumns (services)
    for (var i = 0; i < CompanyNumberOfServices; i++) {
        for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
            var cell = currentSheet.getRange(activeRow, activeCol)
            cell.setValue(CompanyObj.services[i].label.current)
            cell.setBackgroundRGB(252, 111, 125)
            cell.setFontWeight('bold')
            cell.setWrap(true)

            // if the indicator has components it adds them in the next row
            if (indicatorClass.hasSubComponents == true) {
                var currentCell = currentSheet.getRange(activeRow + 1, activeCol)
                currentCell.setValue(indicatorClass.components[k].labelLong)
                currentCell.setBackgroundRGB(252, 111, 125); // sets color
                currentCell.setFontWeight('bold'); // makes text bold
                currentCell.setWrap(true)
            }
            activeCol = activeCol + 1
        }
    }

    currentSheet.setFrozenRows(activeRow); // freezes rows

    // if the indicator does indeed have components, it freezes the additional row in which they are
    if (indicatorClass.hasSubComponents == true) {
        currentSheet.setFrozenRows(activeRow + 1)
        var range = ((activeRow + 1) + ':' + (activeRow + 1))
        range = range.toString()
        currentSheet.getRange(range).setHorizontalAlignment('center')
        activeRow = activeRow + 1

    }

    return activeRow

}


// a step header is a row in which in the first column the name and description of the step is listed
// and in the remaining colums a filler is added
function addStepHeader(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, CompanyNumberOfServices) {
    activeRow = activeRow + 1

    // sets up labels in the first column
    var cell = currentSheet.getRange(activeRow, 1)
    cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3)
    var text = currentStep.label
    cell.setValue(text)
    cell.setFontWeight('bold')

    // for remaining company, opCom, and services columns it adds the filler
    for (var i = 1; i < (((CompanyNumberOfServices + 2) * numberOfIndicatorCatSubComponents) + 1); i++) {
        var cell = currentSheet.getRange(activeRow, i + 1)
        cell.setValue(currentStep.components[currentStepComponent].filler)
    }

    activeRow = activeRow + 1
    return activeRow

}

// addScoringOptions creates a dropdown list in each column for each subindicator
function addScoringOptions(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices) {

    var rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[currentStepComponent].dropdown).build()

    // moving on to actual indicators
    // sets up column with discription
    for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
        var activeCol = 1

        // setting up the labels
        var cell = currentSheet.getRange(activeRow + currentElementNr, activeCol)
        cell.setValue(currentStep.components[currentStepComponent].label + currentIndicator.elements[currentElementNr].labelShort)
        cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3)
        activeCol = activeCol + 1

        for (var serviceNr = 1; serviceNr < (CompanyNumberOfServices + 3); serviceNr++) { // (((CompanyNumberOfServices+2)*numberOfIndicatorCatSubComponents)+1)

            // creates column(s) for overall company
            if (serviceNr == 1) {

                // loops through the number of components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

                    var thisCell = currentSheet.getRange(activeRow + currentElementNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = indicatorClass.components[k].labelShort
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
                        component = indicatorClass.components[k].labelShort
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
                        component = indicatorClass.components[k].labelShort
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

    activeRow = activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}


// this function creates a cell for comments for each subindicator and names the ranges

function addComments(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices) {


    for (var i = 0; i < currentIndicator.elements.length; i++) { currentSheet.setRowHeight(activeRow + i, 50); } // increases height of row

    // loops through subindicators
    for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
        var activeCol = 1

        // adding the labels
        var cell = currentSheet.getRange(activeRow + currentElementNr, activeCol)
        cell.setValue(currentStep.components[currentStepComponent].label + currentIndicator.elements[currentElementNr].labelShort + currentStep.components[currentStepComponent].label2)
        cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3); // colors cell
        activeCol = activeCol + 1

        for (var serviceNr = 1; serviceNr < (CompanyNumberOfServices + 3); serviceNr++) {

            // setting up the columns for the overall company
            if (serviceNr == 1) {

                // looping through the number of components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                    var thisCell = currentSheet.getRange(activeRow + currentElementNr, activeCol)
                    thisCell.setWrap(true)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = indicatorClass.components[k].labelShort
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
                    thisCell.setWrap(true)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = indicatorClass.components[k].labelShort
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
                    thisCell.setWrap(true)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var g = serviceNr - 3; // helper for Services

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = indicatorClass.components[k].labelShort
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
function addBinaryEvaluation(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices) {
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[currentStepComponent].dropdown).build()

    var activeCol = 1

    // sets up the labels
    var cell = currentSheet.getRange(activeRow, activeCol)
    cell.setValue(currentStep.components[currentStepComponent].label)
    cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3)
    activeCol = activeCol + 1

    for (var serviceNr = 1; serviceNr < (CompanyNumberOfServices + 3); serviceNr++) { // (((CompanyNumberOfServices+2)*numberOfIndicatorCatSubComponents)+1)

        // names the cells into which answers will be put
        if (serviceNr == 1) {
            // overall company
            for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                var thisCell = currentSheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = indicatorClass.components[k].labelShort
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
                    component = indicatorClass.components[k].labelShort
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
                    component = indicatorClass.components[k].labelShort
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

    activeRow = activeRow + 1
    return activeRow
}

// ## TODO Component Level functions ## //

function addComparisonYonY(sheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices) {

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
        cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3)
        activeCol = activeCol + 1

        for (var serviceNr = 1; serviceNr < (CompanyNumberOfServices + 3); serviceNr++) { // address hard 3 with company JSON

            // setting up company column(s)
            if (serviceNr == 1) {

                // sets up as many columns as the indicator has components
                for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                    var thisCell = sheet.getRange(activeRow + currentElementNr, activeCol)

                    var component = ""
                    if (numberOfIndicatorCatSubComponents != 1) {
                        component = indicatorClass.components[k].labelShort
                    }

                    var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.components[currentStepComponent].compShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "group")

                    // sets up formula that compares values
                    var value = currentIndicator.compCol + ((serviceNr - 1) * numberOfIndicatorCatSubComponents) + k; // calculates which column
                    var col = columnToLetter(value)
                    // TODO
                    var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + '$' + col + '$' + (currentIndicator.compRow + currentElementNr) + ',"Yes","No")'
                    // var formula = 'IF(' + compCellName + '=IMPORTRANGE("' + CompanyObj.urlPreviousYearResults + '","' + CompanyObj.tabPrevYearsOutcome + '!'
                    // formula = formula + col + (currentIndicator.compRow + currentElementNr)
                    // formula = formula + '"),"Yes","No")'
                    formula.toString()

                    thisCell.setValue(formula)

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
                        component = indicatorClass.components[k].labelShort
                    }

                    var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.components[currentStepComponent].compShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "opCom")

                    // creating formula that compares the two cells
                    var value = currentIndicator.compCol + ((serviceNr - 1) * numberOfIndicatorCatSubComponents) + k; // finds comparisson column
                    var col = columnToLetter(value)
                    // TODO
                    var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + '$' + col + '$' + (currentIndicator.compRow + currentElementNr) + ',"Yes","No")'
                    formula.toString()

                    thisCell.setFormula(formula)


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
                        component = indicatorClass.components[k].labelShort
                    }

                    var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.components[currentStepComponent].compShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id)

                    // creating formula that will be placed in cell
                    var value = currentIndicator.compCol + ((serviceNr - 1) * numberOfIndicatorCatSubComponents) + k; // calculates which column
                    var col = columnToLetter(value)
                    // TODO
                    var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + '$' + col + '$' + (currentIndicator.compRow + currentElementNr) + ',"Yes","No")'
                    formula.toString()

                    thisCell.setFormula(formula)


                    activeCol = activeCol + 1
                }
            }
        }
    }

    // adding the conditional formating so that the cell turns red if the answer is no
    var colMax = columnToLetter(2 + (CompanyNumberOfServices + 2) * numberOfIndicatorCatSubComponents)
    var rowMax = activeRow + currentIndicator.elements.length

    var range = sheet.getRange(activeRow, 2, currentIndicator.elements.length, 2 + (CompanyNumberOfServices + 2) * numberOfIndicatorCatSubComponents)

    var rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('No').setBackground("#fa7661").setRanges([range]).build()
    var rules = sheet.getConditionalFormatRules()
    rules.push(rule)
    sheet.setConditionalFormatRules(rules)


    activeRow = activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}

// the sources step adds a single row in which the sources of each column can be listed
function addSources(currentSheet, currentIndicator, CompanyObj, activeRow, file, currentStep, currentStepComponent, numberOfIndicatorCatSubComponents, indicatorClass, CompanyNumberOfServices) {
    var activeCol = 1

    // adding label
    var cell = currentSheet.getRange(activeRow, activeCol)
    cell.setValue(currentStep.components[currentStepComponent].label)
    cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3)
    activeCol = activeCol + 1

    for (var serviceNr = 1; serviceNr < (CompanyNumberOfServices + 3); serviceNr++) {

        // TODO: fix cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
                var thisCell = currentSheet.getRange(activeRow, 1 + serviceNr + k)
                thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = indicatorClass.components[k].labelShort
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
                thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = indicatorClass.components[k].labelShort
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

                thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var g = serviceNr - 3; // helper for Services

                var component = ""
                if (numberOfIndicatorCatSubComponents != 1) {
                    component = indicatorClass.components[k].labelShort
                }

                var cellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStep.components[currentStepComponent].nameLabel)

                file.setNamedRange(cellName, thisCell)
                activeCol = activeCol + 1
            }
        }

    }

    activeRow = activeRow + 1
    return activeRow
}
