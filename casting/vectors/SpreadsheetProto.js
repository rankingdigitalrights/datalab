// This is the main caller

// This is the main caller

function main() {
  Logger.log('begin main');

  // creating a blank spreadsheet
  var file = SpreadsheetApp.create('CompanyObjPrototype');
  
  // creates sources page
  var sources = file.getActiveSheet();
  sources.setName('2019 Sources'); // <-- will need to make this dynamic at some point


  // INSERT FUNCTION MAKING SOURCES PAGE
  // TODO

  //importing the JSON objects which contain the parameters
  // TODO: parameterize for easier usability

  var CompanyObj = importJsonCompany();
  var Indicators = importJsonIndicator();
  var Steps = importResearchSteps();

  // MAKING ALL THE NECESSARY TABS and filling them
  // 1. the governance tabs
  
  for(i=0; i<Indicators.indicatorType.length;i++) {
    populateByCategory(file, Indicators.indicatorType[i], CompanyObj, Steps);
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

function populateByCategory(file, indicatortype, CompanyObj, Steps) {

  // counts the number of indicators of that typ and iterates over them
  // for each indicator
  // - create a new Sheet
  // - name the Sheet
  // -
  
  // iterates over each indicator in the current type
  for (var i = 0; i < indicatortype.indicators.length; i++) {
    var sheet = file.insertSheet(); // creates sheet
    sheet.setName(indicatortype.indicators[i].labelShort); // sets name of sheet to indicator

    // ## BEGIN of XY Section
    // TODO What is happing here
    // setting active row and an active column

    // checks whether this indicator has components. If yes then it is set to that number, else it is defaulted to 1
    var numberOfComponents = 1;
    if (indicatortype.hasComponents == true) { numberOfComponents = indicatortype.components.length; } // if indicator has components add them

    // 
    var activeRow = 1;
    var activeCol = 1;

    activeRow = addTopHeader(sheet, indicatortype, CompanyObj, activeRow, file, numberOfComponents); // sets up header

    // setting up all the steps for all the indicators
    for (var j = 0; j < Steps.researchSteps.length; j++) {
      for (var k = 0; k < Steps.researchSteps[j].components.length; k++) {
        
        // stores first row of a step to use later in naming a step
        if(k==0) { var firstRow = activeRow +1;}
        
        // all these functions make the type of substep that the step object specifies at this point
        if (Steps.researchSteps[j].components[k].type == "header") {
          activeRow = addStepHeader(sheet, indicatortype.indicators[i], CompanyObj, activeRow, file, Steps.researchSteps[j], k, numberOfComponents);
        }

        else if (Steps.researchSteps[j].components[k].type == "elementDropDown") { //resultsDropDown
          activeRow = addElementDropDown(sheet, indicatortype.indicators[i], CompanyObj, activeRow, file, Steps.researchSteps[j], k, numberOfComponents, indicatortype);
        }

        else if (Steps.researchSteps[j].components[k].type == "miniElementDropDown") { //reviewDropDown
          activeRow = addBinaryEvaluation(sheet, indicatortype.indicators[i], CompanyObj, activeRow, file, Steps.researchSteps[j], k, numberOfComponents, indicatortype);
        }

        else if (Steps.researchSteps[j].components[k].type == "comments") {
          activeRow = comments(sheet, indicatortype.indicators[i], CompanyObj, activeRow, file, Steps.researchSteps[j], k, numberOfComponents, indicatortype);
        }

        else if (Steps.researchSteps[j].components[k].type == "sources") {
          activeRow = sourcesStep(sheet, indicatortype.indicators[i], CompanyObj, activeRow, file, Steps.researchSteps[j], k, numberOfComponents, indicatortype);
        }

        else if (Steps.researchSteps[j].components[k].type == "miniheader") { // rename to something more explicit
          activeRow = addInstruction(Steps.researchSteps[j], k, activeRow, sheet);
        }

        else if (Steps.researchSteps[j].components[k].type == "comparison") {
          activeRow = comparison(sheet, indicatortype.indicators[i], CompanyObj, activeRow, file, Steps.researchSteps[j], k, numberOfComponents, indicatortype);
        }
        
        // if there are no more substeps, we store the final row and name the step
        if(k==Steps.researchSteps[j].components.length-1) {
          
          var lastRow = activeRow;
          var maxCol =1+(CompanyObj.numberOfServices+2)*numberOfComponents; // calculates the max column
          
          var range = sheet.getRange(firstRow, 2, lastRow-firstRow, maxCol-1);
          
          var name = ('RDR2019DC'+CompanyObj.id+Steps.researchSteps[j].labelShort+indicatortype.indicators[i].labelShort);
          name = name.toString();
          
          file.setNamedRange(name, range); // names an entire step
        }
      }
    }

  }
  // ## END of Section XY ## 
}


// ## TODO Component Level functions ## //

function comparison(sheet, indicator, CompanyObj, activeRow, file, step, m, numberOfComponents, indicatortype) {

  // sets up column with discription
  for (var j = 0; j < indicator.elements.length; j++) {
    var activeCol = 1;
    // k = column / service
    // ~ k = 0 -> Labels
    // ~ k = 1 Group
    // ~ k = 2 OpCom
    
    
    // sets up labels in the first column of the row
    var cell = sheet.getRange(activeRow + j, activeCol);
    cell.setValue(step.components[m].label + indicator.elements[j].labelShort);
    cell.setBackgroundRGB(step.c1, step.c2, step.c3);
    activeCol = activeCol + 1;

    for (var k = 1; k < (CompanyObj.numberOfServices + 3); k++) { // address hard 3 with company JSON

      // setting up company column(s)
        if (k == 1) {

          // sets up as many columns as the indicator has components
          for (var g = 0; g < numberOfComponents; g++) {
            var thisCell = sheet.getRange(activeRow + j, activeCol);

            // setting up formula that compares values
            var compCellName = ('RDR2019DC' + CompanyObj.id + step.components[m].compShort + indicator.elements[j].labelShort);
            if (numberOfComponents != 1) { compCellName = compCellName + indicatortype.components[g].labelShort; }
            compCellName = compCellName.toString();

            // sets up formula that compares values
            var value = indicator.compCol + ((k - 1) * numberOfComponents) + g; // calculates which column
            var col = columnToLetter(value);
            var formula = 'IF(' + compCellName + '=IMPORTRANGE("' + CompanyObj.url + '","' + CompanyObj.tab + '!';
            formula = formula + col + (indicator.compRow + j);
            formula = formula + '"),"Yes","No")';
            formula.toString();

            thisCell.setFormula(formula);

            activeCol = activeCol + 1;
          } // close numberOfComponents for loop
        } // close k==1 if statement

      
      // setting up opCom column(s)
        else if (k == 2) {
          
          // loops through the number of components
          for (var g = 0; g < numberOfComponents; g++) {
            
            // sets cell
            var thisCell = sheet.getRange(activeRow + j, activeCol);
            
            // creating the name of cell it will be compared to
            var compCellName = ('RDR2019DC' + CompanyObj.id + 'opCom' + step.components[m].compShort + indicator.elements[j].labelShort);
            if (numberOfComponents != 1) { compCellName = compCellName + indicatortype.components[g].labelShort; }
            compCellName = compCellName.toString();

            // creating formula that compares the two cells
            var value = indicator.compCol + ((k - 1) * numberOfComponents) + g; // finds comparisson column
            var col = columnToLetter(value);
            var formula = 'IF(' + compCellName + '=IMPORTRANGE("' + CompanyObj.url + '","' + CompanyObj.tab + '!';
            formula = formula + col + (indicator.compRow + j);
            formula = formula + '"),"Yes","No")';
            formula.toString();

            thisCell.setFormula(formula);


            activeCol = activeCol + 1;
          } // close numberOfComponents for loop
        } // close k==2 if statement

      
      // setting up services column(s9
        else {
          
          // looping thourough the number of components
          for (var g = 0; g < numberOfComponents; g++) {
            
            // setting cell
            var thisCell = sheet.getRange(activeRow + j, activeCol);
            
            // finding the name of cell that it will be compared too
            var compCellName = ('RDR2019DC' + CompanyObj.services[k - 3].id + step.components[m].compShort + indicator.elements[j].labelShort);
            if (numberOfComponents != 1) { compCellName = compCellName + indicatortype.components[g].labelShort; }
            compCellName = compCellName.toString();


            // creating formula that will be placed in cell
            var value = indicator.compCol + ((k - 1) * numberOfComponents) + g;
            var col = columnToLetter(value);
            var formula = 'IF(' + compCellName + '=IMPORTRANGE("' + CompanyObj.url + '","' + CompanyObj.tab + '!';
            formula = formula + col + (indicator.compRow + j);
            formula = formula + '"),"Yes","No")';
            formula.toString();

            thisCell.setFormula(formula);


            activeCol = activeCol + 1;
          }
        }
    }
  }

  // adding the conditional formating so that the cell turns red if the answer is no
  var colMax = columnToLetter(2 + (CompanyObj.numberOfServices + 2) * numberOfComponents);
  var rowMax = activeRow + indicator.elements.length;

  var range = sheet.getRange(activeRow, 2, indicator.elements.length, 2 + (CompanyObj.numberOfServices + 2) * numberOfComponents)

  var rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('No').setBackground("#fa7661").setRanges([range]).build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);


  activeRow = activeRow = activeRow + indicator.elements.length;
  return activeRow;
}



// function just creates a single row in which in the first column a label is added
function addInstruction(step, m, activeRow, spread) {
  var cell = spread.getRange(activeRow, 1);
  cell.setBackgroundRGB(step.c1, step.c2, step.c3); // setting background color
  cell.setValue(step.components[m].label); // adding text
  cell.setFontWeight('bold'); // bolding text
  cell.setWrap(true); // wrapping text
  activeRow = activeRow + 1;
  return activeRow;

}




// header of sheet function------------------------------------------------
function addTopHeader(spread, indicatortype, CompanyObj, activeRow, file, numberOfComponents) {

  var activeCol = 1;

  spread.setColumnWidth(1, 300);
  for (var i = 2; i <= 20; i++) { spread.setColumnWidth(i, 300 / numberOfComponents); } // sets column width

  var trial = (activeRow + ':' + activeRow);
  trial = trial.toString();
  spread.getRange(trial).setHorizontalAlignment('center'); // alligns header row



  // -----------------------SETTING UP THE HEADER ROW------------------------
  // first collum is blank
  spread.getRange(activeRow, activeCol).setValue('');
  activeCol = activeCol + 1;

  // overall Company column(s)
  for (var i = 0; i < numberOfComponents; i++) {
    var cell = spread.getRange(activeRow, activeCol);
    cell.setValue(CompanyObj.groupLabel); // adds text
    cell.setBackgroundRGB(252, 111, 125); // sets color
    cell.setFontWeight('bold'); // makes text bold
    cell.setWrap(true);

    // if it has components it adds the label in the next row
    if (indicatortype.hasComponents == true) {
      var currentCell = spread.getRange(activeRow + 1, activeCol);
      currentCell.setValue(indicatortype.components[i].labelLong);
      currentCell.setBackgroundRGB(252, 111, 125); // sets color
      currentCell.setFontWeight('bold'); // makes text bold
      currentCell.setWrap(true);
    } // close hasComponents if statement

    activeCol = activeCol + 1;

  } // close numberOfComponents for loop

  for (var i = 0; i < numberOfComponents; i++) {
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
    if (indicatortype.hasComponents == true) {
      var currentCell = spread.getRange(activeRow + 1, activeCol);
      currentCell.setValue(indicatortype.components[i].labelLong);
      currentCell.setBackgroundRGB(252, 111, 125); // sets color
      currentCell.setFontWeight('bold'); // makes text bold
      currentCell.setWrap(true);
    }

    activeCol = activeCol + 1;
  }

  // for remaining collumns
  for (var i = 0; i < CompanyObj.numberOfServices; i++) {
    for (var j = 0; j < numberOfComponents; j++) {
      var cell = spread.getRange(activeRow, activeCol);
      cell.setValue(CompanyObj.services[i].label.current);
      cell.setBackgroundRGB(252, 111, 125);
      cell.setFontWeight('bold');
      cell.setWrap(true);

      // if the indicator has components it adds them in the next row
      if (indicatortype.hasComponents == true) {
        var currentCell = spread.getRange(activeRow + 1, activeCol);
        currentCell.setValue(indicatortype.components[j].labelLong);
        currentCell.setBackgroundRGB(252, 111, 125); // sets color
        currentCell.setFontWeight('bold'); // makes text bold
        currentCell.setWrap(true);
      }
      activeCol = activeCol + 1;
    }
  }

  spread.setFrozenRows(activeRow); // freezes rows

  // if the indicator does indeed have components, it freezes the additional row in which they are
  if (indicatortype.hasComponents == true) {
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
function addStepHeader(spread, indicator, CompanyObj, activeRow, file, step, k, numberOfComponents) {
  activeRow = activeRow + 1;

  // sets up labels in the first column
  var cell = spread.getRange(activeRow, 1);
  cell.setBackgroundRGB(step.c1, step.c2, step.c3);
  var text = step.label;
  cell.setValue(text);
  cell.setFontWeight('bold');

  // for remaining company, opCom, and services columns it adds the filler
  for (var i = 1; i < (((CompanyObj.numberOfServices + 2) * numberOfComponents) + 1); i++) {
    var cell = spread.getRange(activeRow, i + 1);
    cell.setValue(step.components[k].filler);
  }

  activeRow = activeRow + 1;
  return activeRow;

}


// this function adds an element drop down list to a single row
function addBinaryEvaluation(spread, indicator, CompanyObj, activeRow, file, step, m, numberOfComponents, indicatortype) {
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(step.components[m].dropdown).build();

  var activeCol = 1;
  
  // sets up the labels
      var cell = spread.getRange(activeRow, activeCol);
      cell.setValue(step.components[m].label);
      cell.setBackgroundRGB(step.c1, step.c2, step.c3);
      activeCol = activeCol + 1;
  
  for (var k = 1; k < (CompanyObj.numberOfServices + 3); k++) { // (((CompanyObj.numberOfServices+2)*numberOfComponents)+1)

    // names the cells into which answers will be put
      if (k == 1) {
        // overall company
        for (var g = 0; g < numberOfComponents; g++) {
          var thisCell = spread.getRange(activeRow, activeCol);
          
          // creating the name for the cell
          var trial = ('RDR2019DC' + CompanyObj.id + step.labelShort);
          if (numberOfComponents != 1) {
            trial = trial + indicatortype.components[g].labelShort;
          }
          
          trial = trial.toString();
          file.setNamedRange(trial, thisCell); // names cells
          thisCell.setDataValidation(rule); // creates dropdown list
          thisCell.setValue('not selected'); // sets default for drop down list
          thisCell.setFontWeight('bold'); // bolds the answers
          activeCol = activeCol + 1;
        }
      }

    // setting up the opCom row
      else if (k == 2) {
        for (var g = 0; g < numberOfComponents; g++) {
          var thisCell = spread.getRange(activeRow, activeCol);
          
          // creating the name of the cell
          var trial = ('RDR2019DC' + CompanyObj.id + 'opCom' + step.labelShort);
          if (numberOfComponents != 1) {
            trial = trial + indicatortype.components[g].labelShort;
          }
          
          trial = trial.toString();
          file.setNamedRange(trial, thisCell); // names cells
          thisCell.setDataValidation(rule); // creates dropdown list
          thisCell.setValue('not selected'); // sets default for drop down list
          thisCell.setFontWeight('bold'); // bolds the answers
          activeCol = activeCol + 1;
        }
      }

    // taking care of all the service columns
      else {
        for (var g = 0; g < numberOfComponents; g++) {
          var thisCell = spread.getRange(activeRow, activeCol);
          
          // creating the name of the cell
          var trial = ('RDR2019DC' + CompanyObj.services[k - 3].id + step.labelShort);
          if (numberOfComponents != 1) { trial = trial + indicatortype.components[g].labelShort; }
          
          trial = trial.toString();
          file.setNamedRange(trial, thisCell); // names cells
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


// addelementDropDown creates a dropdown list in each column for each subindicator
function addElementDropDown(spread, indicator, CompanyObj, activeRow, file, step, m, numberOfComponents, indicatortype) {

  var rule = SpreadsheetApp.newDataValidation().requireValueInList(step.components[m].dropdown).build();

  // moving on to actual indicators
  // sets up column with discription
  for (var j = 0; j < indicator.elements.length; j++) {
    var activeCol = 1;
    
    // setting up the labels
        var cell = spread.getRange(activeRow + j, activeCol);
        cell.setValue(step.components[m].label + indicator.elements[j].labelShort);
        cell.setBackgroundRGB(step.c1, step.c2, step.c3);
        activeCol = activeCol + 1;
    
    for (var k = 1; k < (CompanyObj.numberOfServices + 3); k++) { // (((CompanyObj.numberOfServices+2)*numberOfComponents)+1)

      // creates column(s) for overall company
        if (k == 1) {
          
          // loops through the number of components
          for (var g = 0; g < numberOfComponents; g++) {
            
            var thisCell = spread.getRange(activeRow + j, activeCol);
            
            // creating the future name of the cell
            var trial = ('RDR2019DC' + CompanyObj.id + step.labelShort + indicator.elements[j].labelShort);
            if (numberOfComponents != 1) {
              trial = trial + indicatortype.components[g].labelShort;
            }
            
            trial = trial.toString();
            file.setNamedRange(trial, thisCell); // names cells
            thisCell.setDataValidation(rule); // creates dropdown list
            thisCell.setValue('not selected'); // sets default for drop down list
            thisCell.setFontWeight('bold'); // bolds the answers
            activeCol = activeCol + 1;
          }
        }

      // setting up opCom column(s)
        else if (k == 2) {
          
          // loops through the number of components
          for (var g = 0; g < numberOfComponents; g++) {
            var thisCell = spread.getRange(activeRow + j, activeCol);
            
            // creates name
            var trial = ('RDR2019DC' + CompanyObj.id + 'opCom' + step.labelShort + indicator.elements[j].labelShort);
            if (numberOfComponents != 1) {
              trial = trial + indicatortype.components[g].labelShort;
            }
            
            trial = trial.toString();
            file.setNamedRange(trial, thisCell); // names cells
            thisCell.setDataValidation(rule); // creates dropdown list
            thisCell.setValue('not selected'); // sets default for drop down list
            thisCell.setFontWeight('bold'); // bolds the answers
            activeCol = activeCol + 1;
          }
        }

      // creating all the service columns
        else {
          for (var g = 0; g < numberOfComponents; g++) {
            var thisCell = spread.getRange(activeRow + j, activeCol);
            
            // creating name of future namedRange
            var trial = ('RDR2019DC' + CompanyObj.services[k - 3].id + step.labelShort + indicator.elements[j].labelShort);
            if (numberOfComponents != 1) { trial = trial + indicatortype.components[g].labelShort; }
            
            trial = trial.toString();
            file.setNamedRange(trial, thisCell); // names cells
            thisCell.setDataValidation(rule); // creates dropdown list
            thisCell.setValue('not selected'); // sets default for drop down list
            thisCell.setFontWeight('bold'); // bolds the answers
            activeCol = activeCol + 1;
          }
        }
    }
  }

  activeRow = activeRow = activeRow + indicator.elements.length;
  return activeRow;
}


// this function creates a cell for comments for each subindicator and names the ranges
function comments(spread, indicator, CompanyObj, activeRow, file, step, m, numberOfComponents, indicatortype) {


  for (var i = 0; i < indicator.elements.length; i++) { spread.setRowHeight(activeRow + i, 50); } // increases height of row

  // loops through subindicators
  for (var j = 0; j < indicator.elements.length; j++) {
    var activeCol = 1;
    
    // adding the labels
    var cell = spread.getRange(activeRow + j, activeCol);
    cell.setValue(step.components[m].label + indicator.elements[j].labelShort + step.components[m].label2);
    cell.setBackgroundRGB(step.c1, step.c2, step.c3); // colors cell
    activeCol = activeCol + 1;
    
    for (var k = 1; k < (CompanyObj.numberOfServices + 3); k++) {
      
      // setting up the columns for the overall company
        if (k == 1) {
          
          // looping through the number of components
          for (var g = 0; g < numberOfComponents; g++) {
            var thisCell = spread.getRange(activeRow + j, activeCol);
            thisCell.setWrap(true);
            
            // creating name of namedRange
            var trial = ('RDR2019DC' + CompanyObj.id + step.labelShort + indicator.elements[j].labelShort + step.components[m].nameLabel);
            if (numberOfComponents != 1) { trial = trial + indicatortype.components[g].labelShort; }
            trial = trial.toString();
            file.setNamedRange(trial, thisCell);
            activeCol = activeCol + 1;

          }
        }
      
      // setting up opCom column(s)
        else if (k == 2) {
          
          // looping through the number of components
          for (var g = 0; g < numberOfComponents; g++) {
            
            var thisCell = spread.getRange(activeRow + j, activeCol);
            thisCell.setWrap(true);
            
            // creating and setting name of namedRange
            var trial = ('RDR2019DC' + CompanyObj.id + 'opCom' + step.labelShort + indicator.elements[j].labelShort + step.components[m].nameLabel);
            if (numberOfComponents != 1) { trial = trial + indicatortype.components[g].labelShort; }
            trial = trial.toString();
            file.setNamedRange(trial, thisCell);
                    activeCol = activeCol + 1;

          }
        }

      // setting up columns for all the services
        else {
          for (var g = 0; g < numberOfComponents; g++) {
            
            thisCell = spread.getRange(activeRow + j, activeCol);
            thisCell.setWrap(true);
            
            // creating and setting name of namedRange
            var trial = ('RDR2019DC' + CompanyObj.services[k - 3].id + step.labelShort + indicator.elements[j].labelShort + step.components[m].nameLabel);
            if (numberOfComponents != 1) { trial = trial + indicatortype.components[g].labelShort; }
            trial = trial.toString();
            file.setNamedRange(trial, thisCell);
              activeCol = activeCol + 1;

          }

        }
      
    }
  }


  activeRow = activeRow + indicator.elements.length;
  return activeRow;
}

// the sources step adds a single row in which the sources of each column can be listed
function sourcesStep(spread, indicator, CompanyObj, activeRow, file, step, m, numberOfComponents, indicatortype) {
  var activeCol = 1;
  
  // adding label
   var cell = spread.getRange(activeRow, activeCol);
   cell.setValue(step.components[m].label);
   cell.setBackgroundRGB(step.c1, step.c2, step.c3);
   activeCol = activeCol + 1;
  
  for (var k = 1; k < (CompanyObj.numberOfServices + 3); k++) {

      if (k == 1) {
        // main company
        for (var g = 0; g < numberOfComponents; g++) {
          var thisCell = spread.getRange(activeRow, 1 + k + g);
          thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side
          var trial = ('RDR2019DC' + CompanyObj.id + step.labelShort + indicator.labelShort + step.components[m].nameLabel);
          if (numberOfComponents != 1) { trial = trial + indicatortype.components[g].labelShort; }
          trial = trial.toString();
          file.setNamedRange(trial, thisCell);
                              activeCol = activeCol + 1;

        }
      }

      else if (k == 2) {
        // opCom
        for (var g = 0; g < numberOfComponents; g++) {
          var thisCell = spread.getRange(activeRow, 1 + numberOfComponents + g);
          thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side
          var trial = ('RDR2019DC' + CompanyObj.id + 'opCom' + step.labelShort + indicator.labelShort + step.components[m].nameLabel);
          if (numberOfComponents != 1) { trial = trial + indicatortype.components[g].labelShort; }
          trial = trial.toString();
          file.setNamedRange(trial, thisCell);
                              activeCol = activeCol + 1;

        }
      }

      else {
        // services
        for (var g = 0; g < numberOfComponents; g++) {
          var thisCell = spread.getRange(activeRow, activeCol); 
          
           thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side
          var trial = ('RDR2019DC' + CompanyObj.services[k - 3].id + step.labelShort + indicator.labelShort + step.components[m].nameLabel);
          if (numberOfComponents != 1) { trial = trial + indicatortype.components[g].labelShort; }
          trial = trial.toString();
          file.setNamedRange(trial, thisCell);
                                        activeCol = activeCol + 1;
        }
      }

  }

  activeRow = activeRow + 1;
  return activeRow;
}




//---------------------------JSON INFO----------------------------------------------
// all these function read in a jason file and them parse them so they are usable
function importJsonCompany() {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/verizon.json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}


function importJsonIndicator() {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/indicators.json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}

function importResearchSteps() {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/researchSteps.json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}
