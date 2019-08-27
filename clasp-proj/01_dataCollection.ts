// --- Spreadsheet Casting: Company Data Collection Sheet --- //

// --- for easier use, define company name here (based on lookup from config or according json file) --- //

var companyFileName = "verizonLabels"
var importedOutcomeTabName = "2018 Outcome";

// --------------- This is the main caller ---------------- //

function mainCreateDCSheet(subset) {
  Logger.log('begin main DC');

  //importing the JSON objects which contain the parameters
  // TODO: parameterize for easier usability
  var configObj = importJsonConfig();
  var CompanyObj = importJsonCompany();
  var IndicatorsObj = importJsonIndicator();
  var ResearchStepsObj = importResearchSteps(subset);

  // creating a blank spreadsheet
  var file = SpreadsheetApp.create(companyFileName + '_DC' + '_' + 'Prototype');

  // add previous year's outcome sheet

  // Formula for importing previous year's outcome
  var externalFormula = '=IMPORTRANGE("' + configObj.prevIndexSSID + '","' + CompanyObj.tabPrevYearsOutcome + '!' + 'A:Z' + '")';


  // first Sheet already exist, so set it to active and rename
  var firstSheet = file.getActiveSheet();
  firstSheet.setName(importedOutcomeTabName); // <-- will need to make this dynamic at some point
  var cell = firstSheet.getActiveCell();
  cell.setValue(externalFormula.toString());

  // creates sources page
  file.insertSheet('2019 Sources'); // <-- will need to make this dynamic at some point


  // INSERT FUNCTION MAKING SOURCES PAGE
  // TODO

  // fetch number of Services once
  var CompanyNumberOfServices = CompanyObj.services.length;

  // MAKING ALL THE NECESSARY TABS and filling them
  // 1. the governance tabs

  for (var i = 0; i < IndicatorsObj.indicatorClass.length; i++) {
    populateByCategory(file, IndicatorsObj.indicatorClass[i], CompanyObj, ResearchStepsObj, CompanyNumberOfServices);
  }

  Logger.log('end main');
  return;
}

// ## BEGIN Helper functions  ## //

// functions to convert column numbers to letters and vice versa
// for easier translation of column number to column letter in formulas
function columnToLetter(column) {
  var temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function letterToColumn(letter) {
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++) {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
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
    var numberOfSubComponents = 1;
    if (indicatorClass.hasSubComponents == true) { numberOfSubComponents = indicatorClass.components.length; } // if indicator has components add them

    // 
    var activeRow = 1;
    var activeCol = 1;

    activeRow = addTopHeader(sheet, indicatorClass, CompanyObj, activeRow, file, numberOfSubComponents, CompanyNumberOfServices); // sets up header

    // setting up all the steps for all the indicators
    for (var currentStep = 0; currentStep < ResearchStepsObj.researchSteps.length; currentStep++) {
      for (var k = 0; k < ResearchStepsObj.researchSteps[currentStep].components.length; k++) {

        // stores first row of a step to use later in naming a step
        if (k == 0) { var firstRow = activeRow + 1; }

        // all these functions make the type of substep that the step object specifies at this point
        if (ResearchStepsObj.researchSteps[currentStep].components[k].type == "header") {
          activeRow = addStepHeader(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], k, numberOfSubComponents, CompanyNumberOfServices);
        }

        else if (ResearchStepsObj.researchSteps[currentStep].components[k].type == "elementDropDown") { //resultsDropDown
          activeRow = addScoringOptions(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], k, numberOfSubComponents, indicatorClass, CompanyNumberOfServices);
        }

        else if (ResearchStepsObj.researchSteps[currentStep].components[k].type == "miniElementDropDown") { //reviewDropDown
          activeRow = addBinaryEvaluation(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], k, numberOfSubComponents, indicatorClass, CompanyNumberOfServices);
        }

        else if (ResearchStepsObj.researchSteps[currentStep].components[k].type == "comments") {
          activeRow = comments(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], k, numberOfSubComponents, indicatorClass, CompanyNumberOfServices);
        }

        else if (ResearchStepsObj.researchSteps[currentStep].components[k].type == "sources") {
          activeRow = sourcesStep(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], k, numberOfSubComponents, indicatorClass, CompanyNumberOfServices);
        }

        else if (ResearchStepsObj.researchSteps[currentStep].components[k].type == "miniheader") { // rename to something more explicit
          activeRow = addInstruction(ResearchStepsObj.researchSteps[currentStep], k, activeRow, sheet);
        }

        else if (ResearchStepsObj.researchSteps[currentStep].components[k].type == "comparison") {
          activeRow = comparison(sheet, indicatorClass.indicators[i], CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], k, numberOfSubComponents, indicatorClass, CompanyNumberOfServices);
        }

        // if there are no more substeps, we store the final row and name the step
        if (k == ResearchStepsObj.researchSteps[currentStep].components.length - 1) {

          var lastRow = activeRow;
          var maxCol = 1 + (CompanyNumberOfServices + 2) * numberOfSubComponents; // calculates the max column

          // we don't want the researchs' names, so move firstRow by 1

          var range = sheet.getRange(firstRow + 1, 2, lastRow - firstRow - 1, maxCol - 1);

          var stepNamedRange = ('RDR2019DC' + CompanyObj.id + ResearchStepsObj.researchSteps[currentStep].labelShort + indicatorClass.indicators[i].labelShort);
          stepNamedRange = stepNamedRange.toString();

          file.setNamedRange(stepNamedRange, range); // names an entire step
        }
      }
    }

  }
  // ## END of Section XY ## 
}


// ## TODO Component Level functions ## //

function comparison(sheet, currentIndicator, CompanyObj, activeRow, file, currentStep, m, numberOfSubComponents, indicatorClass, CompanyNumberOfServices) {

  // sets up column with discription
  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
    var activeCol = 1;
    // k = column / service
    // ~ k = 0 -> Labels
    // ~ k = 1 Group
    // ~ k = 2 OpCom


    // sets up labels in the first column of the row
    var cell = sheet.getRange(activeRow + currentElementNr, activeCol);
    cell.setValue(currentStep.components[m].label + currentIndicator.elements[currentElementNr].labelShort);
    cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3);
    activeCol = activeCol + 1;

    for (var k = 1; k < (CompanyNumberOfServices + 3); k++) { // address hard 3 with company JSON

      // setting up company column(s)
      if (k == 1) {

        // sets up as many columns as the indicator has components
        for (var component = 0; component < numberOfSubComponents; component++) {
          var thisCell = sheet.getRange(activeRow + currentElementNr, activeCol);

          // setting up formula that compares values
          var compCellName = ('RDR2019DC' + CompanyObj.id + currentStep.components[m].comparisonLabelShort + currentIndicator.elements[currentElementNr].labelShort);
          if (numberOfSubComponents != 1) { compCellName = compCellName + indicatorClass.components[component].labelShort; }
          compCellName = compCellName.toString();
         
          // sets up formula that compares values
          var value = currentIndicator.compCol + ((k - 1) * numberOfSubComponents) + component; // calculates which column
          var col = columnToLetter(value);
          // TODO
          var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + col + (currentIndicator.compRow + currentElementNr) + ',"Yes","No")';
          // var formula = 'IF(' + compCellName + '=IMPORTRANGE("' + CompanyObj.urlPreviousYearResults + '","' + CompanyObj.tabPrevYearsOutcome + '!';
          // formula = formula + col + (currentIndicator.compRow + currentElementNr);
          // formula = formula + '"),"Yes","No")';
          formula.toString();

          thisCell.setValue(formula);

          activeCol = activeCol + 1;
        } // close numberOfSubComponents for loop
      } // close k==1 if statement


      // setting up opCom column(s)
      else if (k == 2) {

        // loops through the number of components
        for (var component = 0; component < numberOfSubComponents; component++) {

          // sets cell
          var thisCell = sheet.getRange(activeRow + currentElementNr, activeCol);

          // creating the name of cell it will be compared to
          var compCellName = ('RDR2019DC' + CompanyObj.id + 'opCom' + currentStep.components[m].comparisonLabelShort + currentIndicator.elements[currentElementNr].labelShort);
          if (numberOfSubComponents != 1) { compCellName = compCellName + indicatorClass.components[component].labelShort; }
          compCellName = compCellName.toString();

          // creating formula that compares the two cells
          var value = currentIndicator.compCol + ((k - 1) * numberOfSubComponents) + component; // finds comparisson column
          var col = columnToLetter(value);
          // TODO
          var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + col + (currentIndicator.compRow + currentElementNr) + ',"Yes","No")';
          formula.toString();

          thisCell.setFormula(formula);


          activeCol = activeCol + 1;
        } // close numberOfSubComponents for loop
      } // close k==2 if statement


      // setting up services column(s9
      else {

        // looping thourough the number of components
        for (var component = 0; component < numberOfSubComponents; component++) {

          // setting cell
          var thisCell = sheet.getRange(activeRow + currentElementNr, activeCol);

          // finding the name of cell that it will be compared too
          var compCellName = ('RDR2019DC' + CompanyObj.services[k - 3].id + currentStep.components[m].comparisonLabelShort + currentIndicator.elements[currentElementNr].labelShort);
          if (numberOfSubComponents != 1) { compCellName = compCellName + indicatorClass.components[component].labelShort; }
          compCellName = compCellName.toString();


          // creating formula that will be placed in cell
          var value = currentIndicator.compCol + ((k - 1) * numberOfSubComponents) + component; // calculates which column
          var col = columnToLetter(value);
          // TODO
          var formula = '=IF(' + compCellName + '=' + "'" + importedOutcomeTabName + "'" + '!' + col + (currentIndicator.compRow + currentElementNr) + ',"Yes","No")';
          formula.toString();

          thisCell.setFormula(formula);


          activeCol = activeCol + 1;
        }
      }
    }
  }

  // adding the conditional formating so that the cell turns red if the answer is no
  var colMax = columnToLetter(2 + (CompanyNumberOfServices + 2) * numberOfSubComponents);
  var rowMax = activeRow + currentIndicator.elements.length;

  var range = sheet.getRange(activeRow, 2, currentIndicator.elements.length, 2 + (CompanyNumberOfServices + 2) * numberOfSubComponents)

  var rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('No').setBackground("#fa7661").setRanges([range]).build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);


  activeRow = activeRow = activeRow + currentIndicator.elements.length;
  return activeRow;
}



// function just creates a single row in which in the first column a label is added
function addInstruction(currentStep, m, activeRow, spread) {
  var cell = spread.getRange(activeRow, 1);
  cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3); // setting background color
  cell.setValue(currentStep.components[m].label); // adding text
  cell.setFontWeight('bold'); // bolding text
  cell.setWrap(true); // wrapping text
  activeRow = activeRow + 1;
  return activeRow;

}




// header of sheet function------------------------------------------------
function addTopHeader(spread, indicatorClass, CompanyObj, activeRow, file, numberOfSubComponents, CompanyNumberOfServices) {

  var activeCol = 1;

  spread.setColumnWidth(1, 300);
  for (var i = 2; i <= 20; i++) { spread.setColumnWidth(i, 300 / numberOfSubComponents); } // sets column width

  var cellName = (activeRow + ':' + activeRow);
  cellName = cellName.toString();
  spread.getRange(cellName).setHorizontalAlignment('center'); // alligns header row



  // -----------------------SETTING UP THE HEADER ROW------------------------
  // first collum is blank
  spread.getRange(activeRow, activeCol).setValue('');
  activeCol = activeCol + 1;

  // overall Company column(s)
  for (var i = 0; i < numberOfSubComponents; i++) {
    var cell = spread.getRange(activeRow, activeCol);
    cell.setValue(CompanyObj.groupLabel); // adds text
    cell.setBackgroundRGB(252, 111, 125); // sets color
    cell.setFontWeight('bold'); // makes text bold
    cell.setWrap(true);

    // if it has components it adds the label in the next row
    if (indicatorClass.hasSubComponents == true) {
      var currentCell = spread.getRange(activeRow + 1, activeCol);
      currentCell.setValue(indicatorClass.components[i].labelLong);
      currentCell.setBackgroundRGB(252, 111, 125); // sets color
      currentCell.setFontWeight('bold'); // makes text bold
      currentCell.setWrap(true);
    } // close hasSubComponents if statement

    activeCol = activeCol + 1;

  } // close numberOfSubComponents for loop

  for (var i = 0; i < numberOfSubComponents; i++) {
    // setting up OpComCompany regardless of whether it has one
    // will just hide the column if it doesn't exist
    var cell = spread.getRange(activeRow, activeCol);
    cell.setValue(CompanyObj.opComLabel);
    cell.setBackgroundRGB(252, 111, 125);
    cell.setFontWeight('bold');

    // hides opCom column(s) if opCom == false
    if (CompanyObj.opCom == false) {
      spread.hideColumns(activeCol);
      cell.setValue('N/A');
    }

    cell.setWrap(true);

    // if the indicator has components it adds them in the next row
    if (indicatorClass.hasSubComponents == true) {
      var currentCell = spread.getRange(activeRow + 1, activeCol);
      currentCell.setValue(indicatorClass.components[i].labelLong);
      currentCell.setBackgroundRGB(252, 111, 125); // sets color
      currentCell.setFontWeight('bold'); // makes text bold
      currentCell.setWrap(true);
    }

    activeCol = activeCol + 1;
  }

  // for remaining collumns
  for (var i = 0; i < CompanyNumberOfServices; i++) {
    for (var componentNr = 0; componentNr < numberOfSubComponents; componentNr++) {
      var cell = spread.getRange(activeRow, activeCol);
      cell.setValue(CompanyObj.services[i].label.current);
      cell.setBackgroundRGB(252, 111, 125);
      cell.setFontWeight('bold');
      cell.setWrap(true);

      // if the indicator has components it adds them in the next row
      if (indicatorClass.hasSubComponents == true) {
        var currentCell = spread.getRange(activeRow + 1, activeCol);
        currentCell.setValue(indicatorClass.components[componentNr].labelLong);
        currentCell.setBackgroundRGB(252, 111, 125); // sets color
        currentCell.setFontWeight('bold'); // makes text bold
        currentCell.setWrap(true);
      }
      activeCol = activeCol + 1;
    }
  }

  spread.setFrozenRows(activeRow); // freezes rows

  // if the indicator does indeed have components, it freezes the additional row in which they are
  if (indicatorClass.hasSubComponents == true) {
    spread.setFrozenRows(activeRow + 1);
    var range = ((activeRow + 1) + ':' + (activeRow + 1));
    range = range.toString();
    spread.getRange(range).setHorizontalAlignment('center');
    activeRow = activeRow + 1;

  }

  return activeRow;

}


// a step header is a row in which in the first column the name and description of the step is listed
// and in the remaining colums a filler is added
function addStepHeader(spread, currentIndicator, CompanyObj, activeRow, file, currentStep, k, numberOfSubComponents, CompanyNumberOfServices) {
  activeRow = activeRow + 1;

  // sets up labels in the first column
  var cell = spread.getRange(activeRow, 1);
  cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3);
  var text = currentStep.label;
  cell.setValue(text);
  cell.setFontWeight('bold');

  // for remaining company, opCom, and services columns it adds the filler
  for (var i = 1; i < (((CompanyNumberOfServices + 2) * numberOfSubComponents) + 1); i++) {
    var cell = spread.getRange(activeRow, i + 1);
    cell.setValue(currentStep.components[k].filler);
  }

  activeRow = activeRow + 1;
  return activeRow;

}


// this function adds an element drop down list to a single row
function addBinaryEvaluation(spread, currentIndicator, CompanyObj, activeRow, file, currentStep, m, numberOfSubComponents, indicatorClass, CompanyNumberOfServices) {
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[m].dropdown).build();

  var activeCol = 1;

  // sets up the labels
  var cell = spread.getRange(activeRow, activeCol);
  cell.setValue(currentStep.components[m].label);
  cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3);
  activeCol = activeCol + 1;

  for (var k = 1; k < (CompanyNumberOfServices + 3); k++) { // (((CompanyNumberOfServices+2)*numberOfSubComponents)+1)

    // names the cells into which answers will be put
    if (k == 1) {
      // overall company
      for (var component = 0; component < numberOfSubComponents; component++) {
        var thisCell = spread.getRange(activeRow, activeCol);

        // creating the name for the cell
        var cellName = ('RDR2019DC' + CompanyObj.id + currentStep.labelShort);
        if (numberOfSubComponents != 1) {
          cellName = cellName + indicatorClass.components[component].labelShort;
        }

        cellName = cellName.toString();
        file.setNamedRange(cellName, thisCell); // names cells
        thisCell.setDataValidation(rule); // creates dropdown list
        thisCell.setValue('not selected'); // sets default for drop down list
        thisCell.setFontWeight('bold'); // bolds the answers
        activeCol = activeCol + 1;
      }
    }

    // setting up the opCom row
    else if (k == 2) {
      for (var component = 0; component < numberOfSubComponents; component++) {
        var thisCell = spread.getRange(activeRow, activeCol);

        // creating the name of the cell
        var cellName = ('RDR2019DC' + CompanyObj.id + 'opCom' + currentStep.labelShort);
        if (numberOfSubComponents != 1) {
          cellName = cellName + indicatorClass.components[component].labelShort;
        }

        cellName = cellName.toString();
        file.setNamedRange(cellName, thisCell); // names cells
        thisCell.setDataValidation(rule); // creates dropdown list
        thisCell.setValue('not selected'); // sets default for drop down list
        thisCell.setFontWeight('bold'); // bolds the answers
        activeCol = activeCol + 1;
      }
    }

    // taking care of all the service columns
    else {
      for (var component = 0; component < numberOfSubComponents; component++) {
        var thisCell = spread.getRange(activeRow, activeCol);

        // creating the name of the cell
        var cellName = ('RDR2019DC' + CompanyObj.services[k - 3].id + currentStep.labelShort);
        if (numberOfSubComponents != 1) { cellName = cellName + indicatorClass.components[component].labelShort; }

        cellName = cellName.toString();
        file.setNamedRange(cellName, thisCell); // names cells
        thisCell.setDataValidation(rule); // creates dropdown list
        thisCell.setValue('not selected'); // sets default for drop down list
        thisCell.setFontWeight('bold'); // bolds the answers
        activeCol = activeCol + 1;
      }
    }
  }

  activeRow = activeRow + 1;
  return activeRow;
}


// addScoringOptions creates a dropdown list in each column for each subindicator
function addScoringOptions(spread, currentIndicator, CompanyObj, activeRow, file, currentStep, m, numberOfSubComponents, indicatorClass, CompanyNumberOfServices) {

  var rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[m].dropdown).build();

  // moving on to actual indicators
  // sets up column with discription
  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
    var activeCol = 1;

    // setting up the labels
    var cell = spread.getRange(activeRow + currentElementNr, activeCol);
    cell.setValue(currentStep.components[m].label + currentIndicator.elements[currentElementNr].labelShort);
    cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3);
    activeCol = activeCol + 1;

    for (var k = 1; k < (CompanyNumberOfServices + 3); k++) { // (((CompanyNumberOfServices+2)*numberOfSubComponents)+1)

      // creates column(s) for overall company
      if (k == 1) {

        // loops through the number of components
        for (var component = 0; component < numberOfSubComponents; component++) {

          var thisCell = spread.getRange(activeRow + currentElementNr, activeCol);

          // creating the future name of the cell
          var cellName = ('RDR2019DC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
          if (numberOfSubComponents != 1) {
            cellName = cellName + indicatorClass.components[component].labelShort;
          }

          cellName = cellName.toString();

          file.setNamedRange(cellName, thisCell); // names cells
          thisCell.setDataValidation(rule); // creates dropdown list
          thisCell.setValue('not selected'); // sets default for drop down list
          thisCell.setFontWeight('bold'); // bolds the answers
          activeCol = activeCol + 1;
        }
      }

      // setting up opCom column(s)
      else if (k == 2) {

        // loops through the number of components
        for (var component = 0; component < numberOfSubComponents; component++) {
          var thisCell = spread.getRange(activeRow + currentElementNr, activeCol);

          // creates name
          var cellName = ('RDR2019DC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
          if (numberOfSubComponents != 1) {
            cellName = cellName + indicatorClass.components[component].labelShort;
          }

          cellName = cellName.toString();
          file.setNamedRange(cellName, thisCell); // names cells
          thisCell.setDataValidation(rule); // creates dropdown list
          thisCell.setValue('not selected'); // sets default for drop down list
          thisCell.setFontWeight('bold'); // bolds the answers
          activeCol = activeCol + 1;
        }
      }

      // creating all the service columns
      else {
        for (var component = 0; component < numberOfSubComponents; component++) {
          var thisCell = spread.getRange(activeRow + currentElementNr, activeCol);

          // creating name of future namedRange
          var cellName = ('RDR2019DC' + CompanyObj.services[k - 3].id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
          if (numberOfSubComponents != 1) { cellName = cellName + indicatorClass.components[component].labelShort; }

          cellName = cellName.toString();
          file.setNamedRange(cellName, thisCell); // names cells
          thisCell.setDataValidation(rule); // creates dropdown list
          thisCell.setValue('not selected'); // sets default for drop down list
          thisCell.setFontWeight('bold'); // bolds the answers
          activeCol = activeCol + 1;
        }
      }
    }
  }

  activeRow = activeRow = activeRow + currentIndicator.elements.length;
  return activeRow;
}


// this function creates a cell for comments for each subindicator and names the ranges
function comments(spread, currentIndicator, CompanyObj, activeRow, file, currentStep, m, numberOfSubComponents, indicatorClass, CompanyNumberOfServices) {


  for (var i = 0; i < currentIndicator.elements.length; i++) { spread.setRowHeight(activeRow + i, 50); } // increases height of row

  // loops through subindicators
  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
    var activeCol = 1;

    // adding the labels
    var cell = spread.getRange(activeRow + currentElementNr, activeCol);
    cell.setValue(currentStep.components[m].label + currentIndicator.elements[currentElementNr].labelShort + currentStep.components[m].label2);
    cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3); // colors cell
    activeCol = activeCol + 1;

    for (var k = 1; k < (CompanyNumberOfServices + 3); k++) {

      // setting up the columns for the overall company
      if (k == 1) {

        // looping through the number of components
        for (var component = 0; component < numberOfSubComponents; component++) {
          var thisCell = spread.getRange(activeRow + currentElementNr, activeCol);
          thisCell.setWrap(true);

          // creating name of namedRange
          var cellName = ('RDR2019DC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort + currentStep.components[m].nameLabel);
          if (numberOfSubComponents != 1) { cellName = cellName + indicatorClass.components[component].labelShort; }
          cellName = cellName.toString();
          file.setNamedRange(cellName, thisCell);
          activeCol = activeCol + 1;

        }
      }

      // setting up opCom column(s)
      else if (k == 2) {

        // looping through the number of components
        for (var component = 0; component < numberOfSubComponents; component++) {

          var thisCell = spread.getRange(activeRow + currentElementNr, activeCol);
          thisCell.setWrap(true);

          // creating and setting name of namedRange
          var cellName = ('RDR2019DC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort + currentStep.components[m].nameLabel);
          if (numberOfSubComponents != 1) { cellName = cellName + indicatorClass.components[component].labelShort; }
          cellName = cellName.toString();
          file.setNamedRange(cellName, thisCell);
          activeCol = activeCol + 1;

        }
      }

      // setting up columns for all the services
      else {
        for (var component = 0; component < numberOfSubComponents; component++) {

          thisCell = spread.getRange(activeRow + currentElementNr, activeCol);
          thisCell.setWrap(true);

          // creating and setting name of namedRange
          var cellName = ('RDR2019DC' + CompanyObj.services[k - 3].id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort + currentStep.components[m].nameLabel);
          if (numberOfSubComponents != 1) { cellName = cellName + indicatorClass.components[component].labelShort; }
          cellName = cellName.toString();
          file.setNamedRange(cellName, thisCell);
          activeCol = activeCol + 1;

        }

      }

    }
  }


  activeRow = activeRow + currentIndicator.elements.length;
  return activeRow;
}

// the sources step adds a single row in which the sources of each column can be listed
function sourcesStep(spread, currentIndicator, CompanyObj, activeRow, file, currentStep, m, numberOfSubComponents, indicatorClass, CompanyNumberOfServices) {
  var activeCol = 1;

  // adding label
  var cell = spread.getRange(activeRow, activeCol);
  cell.setValue(currentStep.components[m].label);
  cell.setBackgroundRGB(currentStep.c1, currentStep.c2, currentStep.c3);
  activeCol = activeCol + 1;

  for (var k = 1; k < (CompanyNumberOfServices + 3); k++) {

    if (k == 1) {
      // main company
      for (var component = 0; component < numberOfSubComponents; component++) {
        var thisCell = spread.getRange(activeRow, 1 + k + component);
        thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side
        var cellName = ('RDR2019DC' + CompanyObj.id + currentStep.labelShort + currentIndicator.labelShort + currentStep.components[m].nameLabel);
        if (numberOfSubComponents != 1) { cellName = cellName + indicatorClass.components[component].labelShort; }
        cellName = cellName.toString();
        file.setNamedRange(cellName, thisCell);
        activeCol = activeCol + 1;

      }
    }

    else if (k == 2) {
      // opCom
      for (var component = 0; component < numberOfSubComponents; component++) {
        var thisCell = spread.getRange(activeRow, 1 + numberOfSubComponents + component);
        thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side
        var cellName = ('RDR2019DC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.labelShort + currentStep.components[m].nameLabel);
        if (numberOfSubComponents != 1) { cellName = cellName + indicatorClass.components[component].labelShort; }
        cellName = cellName.toString();
        file.setNamedRange(cellName, thisCell);
        activeCol = activeCol + 1;

      }
    }

    else {
      // services
      for (var component = 0; component < numberOfSubComponents; component++) {
        var thisCell = spread.getRange(activeRow, activeCol);

        thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side
        var cellName = ('RDR2019DC' + CompanyObj.services[k - 3].id + currentStep.labelShort + currentIndicator.labelShort + currentStep.components[m].nameLabel);
        if (numberOfSubComponents != 1) { cellName = cellName + indicatorClass.components[component].labelShort; }
        cellName = cellName.toString();
        file.setNamedRange(cellName, thisCell);
        activeCol = activeCol + 1;
      }
    }

  }

  activeRow = activeRow + 1;
  return activeRow;
}
