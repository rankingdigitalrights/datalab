// --- Spreadsheet Casting: Company Scoring Sheet --- //

// Works only for a single ATOMIC step right now //

// --- for easier use, define company name here (based on lookup from config or according json file) --- //

var companyFileName = "verizon"

// --------------- This is the main caller ---------------- //

function mainScoringSheet() {
  Logger.log('begin main Scoring');

  //importing the JSON objects which contain the parameters
  // TODO: parameterize for easier usability
  var configObj = importJsonConfig();
  var CompanyObj = importJsonCompany();
  var IndicatorsObj = importJsonIndicator();
  var ResearchStepsObj = importResearchSteps();

  // creating a blank spreadsheet
  var file = SpreadsheetApp.create(companyFileName + 'Scoring' + '_' + 'Prototype');

  // creates Outcome  page
  var sheet = file.getActiveSheet();
  var pointsTab = sheet.setName('Points');
  pointsTab.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"]);
  pointsTab.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude"]);
  pointsTab.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude"]);

  sheet = file.insertSheet('Outcome');

  // outermost for loop will be the steps
  for (var currentStep = 0; currentStep < ResearchStepsObj.researchSteps.length; currentStep++) {
    var activeRow = 1;
    var activeCol = 1; // this will need to be a complicated formula later!

    sheet.setColumnWidth(activeCol, 200);

    // looping through all the indicator categories
    for (var currentIndicatorCat = 0; currentIndicatorCat < IndicatorsObj.indicatorType.length; currentIndicatorCat++) {

      // loop going through all the indicators
      for (var currentIndicator = 0; currentIndicator < IndicatorsObj.indicatorType[currentIndicatorCat].indicators.length; currentIndicator++) {

        var numberOfSubComponents = 1;
        if (IndicatorsObj.indicatorType[currentIndicatorCat].hasSubComponents == true) { numberOfSubComponents = IndicatorsObj.indicatorType[currentIndicatorCat].components.length; }

        // for loop going through all the elements of the current research step
        for (var currentStepComponent = 0; currentStepComponent < ResearchStepsObj.researchSteps[currentStep].components.length; currentStepComponent++) {

          if (currentStepComponent == 0) {
            activeRow = activeRow + 1;
            activeRow = setCompanyHeader(activeRow, activeCol, sheet, IndicatorsObj.indicatorType[currentIndicatorCat].indicators[currentIndicator], IndicatorsObj.indicatorType[currentIndicatorCat], CompanyObj);
          }

          if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == 'elementDropDown') {
            activeRow = importElementDropDown(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorType[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfSubComponents, IndicatorsObj.indicatorType[currentIndicatorCat]);
          }

          if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == 'comments') {
            activeRow = importComments(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorType[currentIndicatorCat].indicators[currentIndicator], CompanyObj);
          }

          if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == 'sources') {
            activeRow = importSources(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorType[currentIndicatorCat].indicators[currentIndicator], CompanyObj);
          }

          if (currentStepComponent == ResearchStepsObj.researchSteps[currentStep].components.length - 1) {
            // add scoring row
            activeRow = activeRow + 1;
            activeRow = addScoring(file, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorType[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfSubComponents, IndicatorsObj.indicatorType[currentIndicatorCat]);
          }
        }

      }
    }
  }

}

// ---------------------HELPER FUNCTIONS---------------------------------------------
function setCompanyHeader(activeRow, activeCol, sheet, currentIndicator, indicatorType, companyObj) {

  var currentCell = sheet.getRange(activeRow, activeCol);
  currentCell.setValue(currentIndicator.labelShort);
  currentCell.setBackgroundRGB(237, 179, 102);
  currentCell.setFontWeight('bold');
  activeCol = activeCol + 1;

  // adding the company and subcompanies, etc
  var numberOfSubComponents = 1;
  if (indicatorType.hasSubComponents == true) { numberOfSubComponents = indicatorType.components.length; }

  for (var g = 0; g < numberOfSubComponents; g++) {
    var currentCell = sheet.getRange(activeRow, activeCol);
    var label = 'Group\n' + companyObj.label.current;
    if (numberOfSubComponents > 1) { label = label + '-' + indicatorType.components[g].labelLong; }
    label = label.toString();
    currentCell.setValue(label);
    currentCell.setWrap(true);
    currentCell.setBackgroundRGB(157, 179, 176);

    activeCol = activeCol + 1;
  }

  for (var g = 0; g < numberOfSubComponents; g++) {
    var currentCell = sheet.getRange(activeRow, activeCol);
    var label = 'OpCom\n';
    if (companyObj.opCom == true) { label = label + companyObj.opComLabel; }
    if (numberOfSubComponents > 1) { label = label + indicatorType.components[g].labelLong; }
    label = label.toString();
    currentCell.setValue(label);
    currentCell.setWrap(true);
    currentCell.setBackgroundRGB(157, 179, 176);

    activeCol = activeCol + 1;
  }

  for (k = 0; k < companyObj.numberOfServices; k++) {
    for (var g = 0; g < numberOfSubComponents; g++) {
      var currentCell = sheet.getRange(activeRow, activeCol);
      var label = companyObj.services[k].label.current + '\n';
      if (numberOfSubComponents > 1) { label = label + '-' + indicatorType.components[g].labelLong; }
      label = label.toString();
      currentCell.setValue(label);
      currentCell.setWrap(true);
      currentCell.setBackgroundRGB(157, 179, 176);

      activeCol = activeCol + 1;
    }
  }

  activeRow = activeRow + 1;
  return activeRow;
}

function importElementDropDown(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfSubComponents, indicatorType) {

  Logger.log('in elementdropdown function');
  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
    var tempCol = activeCol;
    var currentCell = sheet.getRange(activeRow, tempCol);
    var label = currentStep.components[element].label + currentIndicator.elements[currentElementNr].labelShort;
    label = label.toString();
    currentCell.setValue(label);
    currentCell.setWrap(true);
    tempCol = tempCol + 1;

    // doing overall company
    for (k = 0; k < numberOfSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      // setting up formula that compares values
      var compCellName = ('RDR2019DC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
      if (numberOfSubComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
      compCellName = compCellName.toString();

      // adding formula
      var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")';
      formula = formula.toString();
      currentCell.setFormula(formula);
      tempCol = tempCol + 1;
    }

    // opCpm
    for (k = 0; k < numberOfSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      // setting up formula that compares values
      var compCellName = ('RDR2019DC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
      if (numberOfSubComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
      compCellName = compCellName.toString();

      var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")';
      formula = formula.toString();
      currentCell.setFormula(formula);
      tempCol = tempCol + 1;
    }

    // looping through the services now
    for (var g = 0; g < CompanyObj.services.length; g++) {

      for (k = 0; k < numberOfSubComponents; k++) {
        currentCell = sheet.getRange(activeRow, tempCol);

        // setting up formula that compares values
        var compCellName = ('RDR2019DC' + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
        if (numberOfSubComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
        compCellName = compCellName.toString();

        var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")';
        formula = formula.toString();
        currentCell.setFormula(formula);

        tempCol = tempCol + 1;
      }
    }

    activeRow = activeRow + 1;
  }

  return activeRow;
}

function importComments(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj) {
  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {

    // setting up the labels
    var currentCell = sheet.getRange(activeRow, activeCol);
    var label = currentStep.components[element].label + currentIndicator.elements[currentElementNr].labelShort + currentStep.components[element].label2;
    label = label.toString();
    currentCell.setValue(label);
    currentCell.setWrap(true);


    activeRow = activeRow + 1;
  }

  return activeRow;
}

function importSources(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj) {

  // setting up the label
  var currentCell = sheet.getRange(activeRow, activeCol);
  var label = currentStep.components[element].label;
  label = label.toString();
  currentCell.setValue(label);
  currentCell.setWrap(true);

  activeRow = activeRow + 1;
  return activeRow;
}


// --- Core function: SCORING --- //

function addScoring(file, activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfSubComponents, indicatorType) {

  var firstRow = activeRow;
  var lastRow = activeRow + currentIndicator.elements.length;

  // fore each indicator element
  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
    var tempCol = activeCol;
    var currentCell = sheet.getRange(activeRow, tempCol);
    var label = 'Points for ' + currentIndicator.elements[currentElementNr].labelShort;
    label = label.toString();
    currentCell.setValue(label);
    currentCell.setWrap(true);
    tempCol = tempCol + 1;

    // for each company
    // set score

    for (k = 0; k < numberOfSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      // formula you would use to import the real source value from the DC spreadsheet

      // setting up formula that compares values
      // var compCellName = ('RDR2019DC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
      // if (numberOfSubComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
      // compCellName = compCellName.toString();

      // var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")';
      // formula = formula.toString();
      // currentCell.setFormula(formula);

      // Formula by calculating offset --> Refactor to generic method(currentCell,)
      var up = currentIndicator.elements.length * 2 + 2;
      var range = sheet.getRange(activeRow - up, tempCol);
      // currentCell.setValue(range.getA1Notation());
      var elementScoreFormula = elementScore(range);
      currentCell.setFormula(elementScoreFormula)

      // naming the cell --> Refactor
      var cellName = ('RDR2019SC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
      if (numberOfSubComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort; }
      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);

      tempCol = tempCol + 1;
    }

    // atomic opCom scores
    for (k = 0; k < numberOfSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      // Formula by calculating offset --> Refactor
      var up = currentIndicator.elements.length * 2 + 2;
      var range = sheet.getRange(activeRow - up, tempCol);
      // currentCell.setValue(range.getA1Notation());
      var elementScoreFormula = elementScore(range);
      currentCell.setFormula(elementScoreFormula)

      // naming the cell
      var cellName = ('RDR2019SC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
      if (numberOfSubComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort; }
      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);

      tempCol = tempCol + 1;
    }

    // looping through the service scores
    for (var g = 0; g < CompanyObj.services.length; g++) {

      for (k = 0; k < numberOfSubComponents; k++) {
        currentCell = sheet.getRange(activeRow, tempCol);

        // Formula by calculating offset --> Refactor
        var up = currentIndicator.elements.length * 2 + 2;
        var range = sheet.getRange(activeRow - up, tempCol);
        // currentCell.setValue(range.getA1Notation());
        // var elementScoreFormula = '=LEN(' + range.getA1Notation() + ')';
        var elementScoreFormula = elementScore(range);
        currentCell.setFormula(elementScoreFormula)

        // naming the cell
        var cellName = ('RDR2019SC' + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
        if (numberOfSubComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort; }
        cellName = cellName.toString();
        file.setNamedRange(cellName, currentCell);

        tempCol = tempCol + 1;
      }

    }

    activeRow = activeRow + 1;
  }


  // adding in the averages
  activeRow = activeRow + 1;
  currentCell = sheet.getRange(activeRow, activeCol);
  currentCell.setValue("Level Score");
  currentCell.setFontWeight('bold');

  var tempCol = activeCol;
  tempCol = tempCol + 1;

  var indicatorAverageFormula = '=COUNTA('; // variable used for indicator average later

  // overall company averages
  for (k = 0; k < numberOfSubComponents; k++) {

    var currentCell = sheet.getRange(activeRow, tempCol);
    var serviceCells = [];

    for (var elementNr = 0; elementNr < currentIndicator.elements.length; elementNr++) {

      // finding the cell names that are used in calculating a company specific average
      var cellName = ('RDR2019SC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[elementNr].labelShort);
      if (numberOfSubComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort; }
      cellName = cellName.toString();
      serviceCells.push(cellName);
    }

    var localFormula = serviceScore(serviceCells);
    currentCell.setFormula(localFormula);

    // naming the cell
    var cellName = ('RDR2019SC' + CompanyObj.id + currentStep.labelShort + currentIndicator.labelShort + 'LevelScore');
    if (numberOfSubComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort; }
    cellName = cellName.toString();
    file.setNamedRange(cellName, currentCell);

    indicatorAverageFormula = indicatorAverageFormula + cellName + ','; // adding name to the formula


    tempCol = tempCol + 1;
  }

  // now calculating the average for the op Com
  for (k = 0; k < numberOfSubComponents; k++) {

    var currentCell = sheet.getRange(activeRow, tempCol);
    var serviceCells = [];

    for (var elementNr = 0; elementNr < currentIndicator.elements.length; elementNr++) {

      // getting the name of cells used in level score average
      var cellName = ('RDR2019SC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.elements[elementNr].labelShort);
      if (numberOfSubComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort; }
      cellName = cellName.toString();
      serviceCells.push(cellName);
    }

    var localFormula = serviceScore(serviceCells);
    currentCell.setFormula(localFormula);

    // setting the name of level score cell
    var cellName = ('RDR2019SC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.labelShort + 'LevelScore');
    if (numberOfSubComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort; }
    cellName = cellName.toString();
    file.setNamedRange(cellName, currentCell);

    indicatorAverageFormula = indicatorAverageFormula + cellName + ',';

    tempCol = tempCol + 1;
  }


  // --- SERVICE LEVEL SCORE --- //

  // looping through the services now
  for (var g = 0; g < CompanyObj.services.length; g++) {

    for (k = 0; k < numberOfSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      var serviceCells = [];

      for (var elementNr = 0; elementNr < currentIndicator.elements.length; elementNr++) {
        // getting the name of the cell needed to add to level score formula
        var cellName = ('RDR2019SC' + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.elements[elementNr].labelShort);
        if (numberOfSubComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort; }
        cellName = cellName.toString();
        serviceCells.push(cellName);
      }

      var localFormula = serviceScore(serviceCells);
      currentCell.setFormula(localFormula);

      // naming the level cell score
      var cellName = ('RDR2019SC' + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.labelShort + 'LevelScore');
      if (numberOfSubComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort; }
      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);

      indicatorAverageFormula = indicatorAverageFormula + cellName + ','; // adding it to the formula

      tempCol = tempCol + 1;

    }
  }
  // --- INDICATOR SCORE --- //
  // setting up label for Average Score
  activeRow = activeRow + 2;
  currentCell = sheet.getRange(activeRow, activeCol);
  currentCell.setValue("Indicator Average");
  currentCell.setFontWeight('bold');

  indicatorAverageFormula = indicatorAverageFormula + ')';
  indicatorAverageFormula = indicatorAverageFormula.toString();

  // plopping in the formula
  var averageCell = sheet.getRange(activeRow, activeCol + 1);
  averageCell.setFormula(indicatorAverageFormula);

  // naming the cell
  var cellName = ('RDR2019SC' + CompanyObj.id + currentStep.labelShort + currentIndicator.labelShort + 'AverageScore');
  cellName = cellName.toString();
  file.setNamedRange(cellName, currentCell);

  return activeRow;
}
