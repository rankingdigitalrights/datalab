// --- Spreadsheet Casting: Company Scoring Sheet --- //

// Works only for a single ATOMIC step right now //

// --- for easier use, define company name here (based on lookup from config or according json file) --- //

var companyFileName = "verizon"

// --- CONFIG --- //

// later move to central config //

// --------------- This is the main caller ---------------- //

function mainCreateScoringSheet(subset) {
  Logger.log('begin main Scoring');

  //importing the JSON objects which contain the parameters
  // TODO: parameterize for easier usability
  var configObj = importJsonConfig();
  var CompanyObj = importJsonCompany();
  var IndicatorsObj = importJsonIndicator();
  var ResearchStepsObj = importResearchSteps(subset);
  Logger.log("Obj: " + ResearchStepsObj);
  Logger.log("Obj.length: " + ResearchStepsObj.researchSteps.length);
  Logger.log("Obj: " + IndicatorsObj);
  // creating a blank spreadsheet
  // var file = SpreadsheetApp.create(companyFileName + '_' + 'Scoring' + '_' + 'Prototype');

  // instead of creating a new sheet on every run, re-use
  // TODE: check if SS exists before connecting

  // THIS IS DANGEROUS //
  // HIDDEN CACHE ADVENTURES ARE WAITING FOR YOU 
  var file = connectToSpreadsheetByName(companyFileName + '_' + 'Scoring' + '_' + 'Prototype');

  // creates Outcome  page
  var sheet = file.getActiveSheet();
  sheet = insertSheetIfNotExist(file, 'Points');
  sheet.clear();
  sheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"]);
  sheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude"]);
  sheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude"]);

  sheet = insertSheetIfNotExist(file, 'Outcome');
  sheet.clear();

  // For all Research Steps
  // for (var currentStep = 0; currentStep < ResearchStepsObj.researchSteps.length; currentStep++) {
    
  var currentStep = 0;

    Logger.log("currentStep: " + currentStep);
    var activeRow = 1;
    var activeCol = 1; // this will need to be a complicated formula later!

    sheet.setColumnWidth(activeCol, 200);

    // For all Indicator Categories
    for (var currentIndicatorCat = 0; currentIndicatorCat < IndicatorsObj.indicatorClass.length; currentIndicatorCat++) {

      // For all Indicators
      for (var currentIndicator = 0; currentIndicator < IndicatorsObj.indicatorClass[currentIndicatorCat].indicators.length; currentIndicator++) {

        Logger.log("beginn Indicator: " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort);
        var numberOfIndicatorCatSubComponents = 1;

        if (IndicatorsObj.indicatorClass[currentIndicatorCat].hasSubComponents == true) {
          numberOfIndicatorCatSubComponents = IndicatorsObj.indicatorClass[currentIndicatorCat].components.length;
        }

        // for all components of the current Research Step
        for (var currentStepComponent = 0; currentStepComponent < ResearchStepsObj.researchSteps[currentStep].components.length; currentStepComponent++) {

          Logger.log("beginn currentStepComponent: " + currentStepComponent);

          if (currentStepComponent == 0) {
            activeRow = activeRow + 1;
            activeRow = setCompanyHeader(activeRow, activeCol, sheet, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], IndicatorsObj.indicatorClass[currentIndicatorCat], CompanyObj);
            Logger.log("Header row printed for " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort);
          }

          if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == 'elementDropDown') {
            activeRow = importElementDropDown(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClass[currentIndicatorCat]);
            Logger.log("results added for: " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort);
          }

          if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == 'comments') {
            activeRow = importComments(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj);
            Logger.log("comments added for: " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort);
          }

          if (ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type == 'sources') {
            activeRow = importSources(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj);
            Logger.log("sources added for: " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort);
          }

          if (currentStepComponent == ResearchStepsObj.researchSteps[currentStep].components.length - 1) {
            // add scoring row
            activeRow = activeRow + 1;
            activeRow = addScoring(file, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClass[currentIndicatorCat]);
            Logger.log("scoring added for: " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort);
          }
        }

      }
    }
  // }

}

// ---------------------HELPER FUNCTIONS---------------------------------------------

// --- BEGIN setCompanyHeader() --- //

function setCompanyHeader(activeRow, activeCol, sheet, currentIndicator, indicatorClass, companyObj) {

  var currentCell = sheet.getRange(activeRow, activeCol);
  currentCell.setValue(currentIndicator.labelShort);
  currentCell.setBackgroundRGB(237, 179, 102);
  currentCell.setFontWeight('bold');
  activeCol = activeCol + 1;

  // adding the company and subcompanies, etc

  var numberOfIndicatorCatSubComponents = 1;

  // --- // First Fork: Governance Subcomponents? // --- // 

  if (indicatorClass.hasSubComponents == true) {

    numberOfIndicatorCatSubComponents = indicatorClass.components.length;

  }

  // --- // Company Elements // --- //

  for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
    var currentCell = sheet.getRange(activeRow, activeCol);
    var columnLabel = 'Group\n' + companyObj.label.current;

    if (numberOfIndicatorCatSubComponents > 1) { columnLabel = columnLabel + '\n' + indicatorClass.components[g].labelLong; }
    columnLabel = columnLabel.toString();

    currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

    activeCol = activeCol + 1;
  }

  for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
    var currentCell = sheet.getRange(activeRow, activeCol);
    var columnLabel = 'OpCom\n';
    if (companyObj.opCom == true) { columnLabel = columnLabel + companyObj.opComLabel; } else {
      columnLabel = columnLabel + " --- ";
    }

    if (numberOfIndicatorCatSubComponents > 1) { columnLabel = columnLabel + '\n' + indicatorClass.components[g].labelLong; }
    columnLabel = columnLabel.toString();

    currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

    activeCol = activeCol + 1;
  }

  // --- // Services // --- //

  for (k = 0; k < companyObj.numberOfServices; k++) {
    for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
      var currentCell = sheet.getRange(activeRow, activeCol);
      var columnLabel = companyObj.services[k].label.current;

      if (numberOfIndicatorCatSubComponents > 1) { columnLabel = columnLabel + '\n' + indicatorClass.components[g].labelLong; }
      columnLabel = columnLabel.toString();

      currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

      activeCol = activeCol + 1;
    }

  }

  activeRow = activeRow + 1;
  return activeRow;
}

// --- END setCompanyHeader() --- //

function importElementDropDown(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass) {

  Logger.log('in results section for ' + currentIndicator.labelShort);


  // for each element

  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
    var tempCol = activeCol;
    var currentCell = sheet.getRange(activeRow, tempCol);
    var rowLabel = currentStep.components[element].label + currentIndicator.elements[currentElementNr].labelShort;
    rowLabel = rowLabel.toString();
    currentCell.setValue(rowLabel);
    currentCell.setWrap(true);
    tempCol = tempCol + 1;
    var component = "";

    // for each group
    for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

      currentCell = sheet.getRange(activeRow, tempCol);
      
      

      if (numberOfIndicatorCatSubComponents != 1) {
        component = indicatorClass.components[k].labelShort;
      }

      // setting up formula that compares values
      var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'group')

      // adding formula
      var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")';
      formula = formula.toString();
      currentCell.setFormula(formula);
      tempCol = tempCol + 1;
    }

    // for each opCom
    for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      // setting up formula that compares values
      var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'opCom')

      var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")';
      formula = formula.toString();
      currentCell.setFormula(formula);
      tempCol = tempCol + 1;
    }

    // services
    for (var g = 0; g < CompanyObj.services.length; g++) {

      for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
        currentCell = sheet.getRange(activeRow, tempCol);

        // setting up formula that compares values
        var compCellName = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id)

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
    var rowLabel = currentStep.components[element].label + currentIndicator.elements[currentElementNr].labelShort + currentStep.components[element].label2;
    rowLabel = rowLabel.toString();
    currentCell.setValue(rowLabel);
    currentCell.setWrap(true);


    activeRow = activeRow + 1;
  }

  return activeRow;
}

function importSources(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj) {

  // setting up the columnLabel
  var currentCell = sheet.getRange(activeRow, activeCol);
  var rowLabel = currentStep.components[element].label;
  rowLabel = rowLabel.toString();
  currentCell.setValue(rowLabel);
  currentCell.setWrap(true);

  activeRow = activeRow + 1;
  return activeRow;
}


// --- Core function: SCORING --- //

function addScoring(file, activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass) {

  var firstRow = activeRow;
  var lastRow = activeRow + currentIndicator.elements.length;

  // for each indicator element

  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
    var tempCol = activeCol;
    var currentCell = sheet.getRange(activeRow, tempCol);
    var rowLabel = 'Points for ' + currentIndicator.elements[currentElementNr].labelShort;
    rowLabel = rowLabel.toString();
    currentCell.setValue(rowLabel);
    currentCell.setWrap(true);
    tempCol = tempCol + 1;

    // for each Indicator Sub Component (G: FC, PC)

    // set score

    for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      // formula you would use to import the real source value from the DC spreadsheet

      // setting up formula that compares values
      // var compCellName = (indexPrefix + 'DC' + CompanyObj.id + 'group' + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
      // if (numberOfIndicatorCatSubComponents != 1) { compCellName = compCellName + indicatorClass.components[k].labelShort; }
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

      // NAMING the cell

      // TODO: REFACTOR

      var cellName = (indexPrefix + 'SC' + CompanyObj.id + 'group' + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
      if (numberOfIndicatorCatSubComponents != 1) {
        cellName = cellName + indicatorClass.components[k].labelShort;
      }
      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);

      tempCol = tempCol + 1;
    }

    // atomic opCom scores
    for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      // Formula by calculating offset --> Refactor
      var up = currentIndicator.elements.length * 2 + 2;
      var range = sheet.getRange(activeRow - up, tempCol);
      // currentCell.setValue(range.getA1Notation());
      var elementScoreFormula = elementScore(range);
      currentCell.setFormula(elementScoreFormula)

      // naming the cell
      var cellName = (indexPrefix + 'SC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
      if (numberOfIndicatorCatSubComponents != 1) { 
        cellName = cellName + indicatorClass.components[k].labelShort;
      }
      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);

      tempCol = tempCol + 1;
    }

    // looping through the service scores

    for (var g = 0; g < CompanyObj.services.length; g++) {

      for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
        currentCell = sheet.getRange(activeRow, tempCol);

        // Formula by calculating offset --> Refactor
        var up = currentIndicator.elements.length * 2 + 2;
        var range = sheet.getRange(activeRow - up, tempCol);
        // currentCell.setValue(range.getA1Notation());
        // var elementScoreFormula = '=LEN(' + range.getA1Notation() + ')';
        var elementScoreFormula = elementScore(range);
        currentCell.setFormula(elementScoreFormula)

        // naming the cell
        var cellName = (indexPrefix + 'SC' + CompanyObj.id + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
        if (numberOfIndicatorCatSubComponents != 1) {
          cellName = cellName + indicatorClass.components[k].labelShort;
        }
        cellName = cellName.toString();
        file.setNamedRange(cellName, currentCell);

        tempCol = tempCol + 1;
      }

    }

    Logger.log("atomic scores added for " + currentIndicator.labelShort);

    activeRow = activeRow + 1;
  }


  // adding in the averages
  activeRow = activeRow + 1;
  currentCell = sheet.getRange(activeRow, activeCol);
  currentCell.setValue("Level Scores");
  currentCell.setFontWeight('bold');

  var tempCol = activeCol;
  tempCol = tempCol + 1;

  var indicatorAverageFormula = '=COUNTA('; // variable used for indicator average later

  // --- Company Components --- //

  // Group AVERAGE

  for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {

    var currentCell = sheet.getRange(activeRow, tempCol);
    var serviceCells = [];

    for (var elementNr = 0; elementNr < currentIndicator.elements.length; elementNr++) {

      // finding the cell names that are used in calculating a company specific average
      var cellName = (indexPrefix + 'SC' + CompanyObj.id + 'group' + currentStep.labelShort + currentIndicator.elements[elementNr].labelShort);
      if (numberOfIndicatorCatSubComponents != 1) { cellName = cellName + indicatorClass.components[k].labelShort; }
      cellName = cellName.toString();
      serviceCells.push(cellName);
    }

    var localFormula = serviceScore(serviceCells);
    currentCell.setFormula(localFormula);

    // naming the cell
    var cellName = (indexPrefix + 'SC' + CompanyObj.id + 'group' + currentStep.labelShort + currentIndicator.labelShort + 'ScoreLevel');
    if (numberOfIndicatorCatSubComponents != 1) { cellName = cellName + indicatorClass.components[k].labelShort; }
    cellName = cellName.toString();
    file.setNamedRange(cellName, currentCell);

    indicatorAverageFormula = indicatorAverageFormula + cellName + ','; // adding name to the formula


    tempCol = tempCol + 1;
  }

  // OpCom AVERAGE

  for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {

    var currentCell = sheet.getRange(activeRow, tempCol);
    var serviceCells = [];

    for (var elementNr = 0; elementNr < currentIndicator.elements.length; elementNr++) {

      // getting the name of cells used in level score average
      var cellName = (indexPrefix + 'SC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.elements[elementNr].labelShort + 'ScoreLevel');
      if (numberOfIndicatorCatSubComponents != 1) { cellName = cellName + indicatorClass.components[k].labelShort; }
      cellName = cellName.toString();
      serviceCells.push(cellName);
    }

    var localFormula = serviceScore(serviceCells);
    currentCell.setFormula(localFormula);

    // setting the name of level score cell
    var cellName = (indexPrefix + 'SC' + CompanyObj.id + 'opCom' + currentStep.labelShort + currentIndicator.labelShort + 'ScoreLevelCompany');
    if (numberOfIndicatorCatSubComponents != 1) { cellName = cellName + indicatorClass.components[k].labelShort; }
    cellName = cellName.toString();
    file.setNamedRange(cellName, currentCell);

    indicatorAverageFormula = indicatorAverageFormula + cellName + ',';

    tempCol = tempCol + 1;
  }


  // --- SERVICES --- //

  // iterate over services

  for (var g = 0; g < CompanyObj.services.length; g++) {

    for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      var serviceCells = [];

      for (var elementNr = 0; elementNr < currentIndicator.elements.length; elementNr++) {
        // getting the name of the cell needed to add to level score formula
        var cellName = (indexPrefix + 'SC' + CompanyObj.id + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.elements[elementNr].labelShort);
        if (numberOfIndicatorCatSubComponents != 1) { cellName = cellName + indicatorClass.components[k].labelShort; }
        cellName = cellName.toString();
        serviceCells.push(cellName);
      }

      var localFormula = serviceScore(serviceCells);
      currentCell.setFormula(localFormula);

      // naming the level cell score
      var cellName = (indexPrefix + 'SC' + CompanyObj.id + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.labelShort + 'ScoreLevel');
      if (numberOfIndicatorCatSubComponents != 1) { cellName = cellName + indicatorClass.components[k].labelShort; }
      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);

      indicatorAverageFormula = indicatorAverageFormula + cellName + ','; // adding it to the formula

      tempCol = tempCol + 1;

    }
  }

  Logger.log("level scores added for " + currentIndicator.labelShort);
  // --- INDICATOR SCORE --- //

  // setting up label for Average Score
  activeRow = activeRow + 2;
  currentCell = sheet.getRange(activeRow, activeCol);
  currentCell.setValue("Indicator Score");
  currentCell.setFontWeight('bold');
  currentCell = sheet.getRange(activeRow, activeCol + 1);

  indicatorAverageFormula = indicatorAverageFormula + ')';
  indicatorAverageFormula = indicatorAverageFormula.toString();

  // plopping in the formula
  // var averageCell = sheet.getRange(activeRow, activeCol + 1);
  currentCell.setFormula(indicatorAverageFormula);

  // naming the cell
  var cellName = (indexPrefix + 'SC' + CompanyObj.id + 'full' + currentStep.labelShort + currentIndicator.labelShort + 'IndicatorScore');
  cellName = cellName.toString();
  file.setNamedRange(cellName, currentCell);

  Logger.log("indicator score added for " + currentIndicator.labelShort);

  return activeRow + 1;
}
