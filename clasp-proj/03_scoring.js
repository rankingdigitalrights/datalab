// --- Spreadsheet Casting: Company Scoring Sheet --- //

// Works only for a single ATOMIC step right now //

// --- for easier use, define company name here (based on lookup from config or according json file) --- //

// --- CONFIG --- //

var companyFileName = "verizon"

var sheetMode = "SC"

// later move to central config //

// --------------- This is the main caller ---------------- //

function mainCreateScoringSheet(stepsSubset, indicatorSubset) {
  Logger.log('begin main Scoring');

  //importing the JSON objects which contain the parameters
  // TODO: parameterize for easier usability
  var configObj = importJsonConfig();
  var CompanyObj = importJsonCompany();
  var IndicatorsObj = importJsonIndicator(indicatorSubset);
  var ResearchStepsObj = importResearchSteps(stepsSubset);
  Logger.log("Obj: " + ResearchStepsObj);
  Logger.log("Obj.length: " + ResearchStepsObj.researchSteps.length);
  Logger.log("Obj: " + IndicatorsObj);

  // Mode A: creating a blank spreadsheet
  // var file = SpreadsheetApp.create(companyFileName + '_' + 'Scoring' + '_' + 'Prototype_v3');

  // Mode B: instead of creating a new sheet on every run, re-use
  // THIS IS DANGEROUS //
  // HIDDEN CACHE ADVENTURES ARE WAITING FOR YOU 
  var file = connectToSpreadsheetByName(companyFileName + '_' + sheetMode + '_' + 'Prototype_v3');

  // creates Outcome  page
  var sheet = file.getActiveSheet();
  sheet.clear();
  sheet = insertSheetIfNotExist(file, 'Points');

  // Scoring Scheme / Validation
  // TODO Refactor to module
  sheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"]);
  sheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude"]);
  sheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude"]);

  sheet = insertSheetIfNotExist(file, 'Outcome');
  sheet.clear();
  // For all Research Steps

  for (var currentStep = 0; currentStep < ResearchStepsObj.researchSteps.length; currentStep++) {

    // var currentStep = 0;

    Logger.log("currentStep: " + currentStep);
    var activeRow = 1;
    var activeCol = 1; // this will need to be a complicated formula later!

    sheet.getRange(activeRow, activeCol).setValue(ResearchStepsObj.researchSteps[currentStep].labelShort).setFontWeight("bold");

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
            activeRow = importElementResults(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClass[currentIndicatorCat]);
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
            activeRow = addElementScores(file, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClass[currentIndicatorCat]);
            Logger.log("scoring added for: " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort);

            activeRow = addLevelScores(file, activeRow);

            activeRow = addCompositeScores(file, activeRow);

            activeRow = addIndicatorScore(file, activeRow);

          }
        }

      }
    }
  }

}

// ---------------------HELPER FUNCTIONS---------------------------------------------

// --- BEGIN setCompanyHeader() --- //

function setCompanyHeader(activeRow, activeCol, sheet, currentIndicator, indicatorClass, companyObj) {

  var currentCell = sheet.getRange(activeRow, activeCol);
  currentCell.setValue(currentIndicator.labelShort);
  currentCell.setBackgroundRGB(237, 179, 102);
  currentCell.setFontWeight('bold');
  currentCell.setVerticalAlignment("middle");
  currentCell.setHorizontalAlignment('center');
  activeCol = activeCol + 1;

  // adding the company and subcompanies, etc

  var numberOfIndicatorCatSubComponents = 1;

  // --- // --- First Fork: Governance Subcomponents? --- // --- // 

  if (indicatorClass.hasSubComponents == true) {

    numberOfIndicatorCatSubComponents = indicatorClass.components.length;

  }

  // --- // --- Company Elements --- // --- //

  // group 

  for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
    var currentCell = sheet.getRange(activeRow, activeCol);
    var columnLabel = 'Group\n' + companyObj.label.current;

    if (numberOfIndicatorCatSubComponents > 1) {
      columnLabel = columnLabel + '\n' + indicatorClass.components[g].labelLong;
    }
    columnLabel = columnLabel.toString();

    currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

    activeCol = activeCol + 1;
  }

  // opcom

  for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
    var currentCell = sheet.getRange(activeRow, activeCol);
    var columnLabel = 'OpCom\n';

    if (companyObj.opCom == true) {
      columnLabel = columnLabel + companyObj.opComLabel;
    } else {
      columnLabel = columnLabel + " --- ";
    }

    if (numberOfIndicatorCatSubComponents > 1) {
      columnLabel = columnLabel + '\n' + indicatorClass.components[g].labelLong;
    }
    columnLabel = columnLabel.toString();

    currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

    activeCol = activeCol + 1;
  }

  // --- // --- Services --- // --- //

  for (k = 0; k < companyObj.numberOfServices; k++) {
    for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
      var currentCell = sheet.getRange(activeRow, activeCol);
      var columnLabel = companyObj.services[k].label.current;

      if (numberOfIndicatorCatSubComponents > 1) {
        columnLabel = columnLabel + '\n' + indicatorClass.components[g].labelLong;
      }
      columnLabel = columnLabel.toString();

      currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

      activeCol = activeCol + 1;
    }

  }

  activeRow = activeRow + 1;
  return activeRow;
}

function importElementResults(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass) {

  Logger.log('in results section for ' + currentIndicator.labelShort);

  var companyHasOpCom = CompanyObj.opCom;

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

    // for Group + Indicator Subcomponents
    for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

      currentCell = sheet.getRange(activeRow, tempCol);

      if (numberOfIndicatorCatSubComponents != 1) {
        component = indicatorClass.components[k].labelShort;
      }

      // setting up formula that compares values
      var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'group')

      // adding formula
      var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")';
      formula = formula.toString();
      currentCell.setFormula(formula);
      tempCol = tempCol + 1;
    }

    // for opCom + Indicator Subcomponents
    for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      if (companyHasOpCom) {
        // setting up formula that compares values
        var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'opCom')

        var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")';
        formula = formula.toString();
        currentCell.setFormula(formula);

      } else {
        currentCell.setValue('---');
      }
      tempCol = tempCol + 1;
    }

    // for n Services + Indicator Subcomponents
    for (var g = 0; g < CompanyObj.services.length; g++) {

      for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
        currentCell = sheet.getRange(activeRow, tempCol);

        // setting up formula that compares values
        var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id)

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

function addElementScores(file, activeRow, activeCol, sheet, currentStep, currentStepComponent, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass) {

  var firstRow = activeRow;
  var lastRow = activeRow + currentIndicator.elements.length;

  var companyHasOpCom = CompanyObj.opCom;


  // for each indicator element

  // set up labels column
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

      // Formula by calculating offset --> Refactor to generic method(currentCell,)
      var up = currentIndicator.elements.length * 2 + 2;
      var range = sheet.getRange(activeRow - up, tempCol);
      // currentCell.setValue(range.getA1Notation());
      var elementScoreFormula = elementScore(range);
      currentCell.setFormula(elementScoreFormula)

      // NAMING the cell

      // cell name formula; output defined in 44_rangeNamingHelper.js

      var component = "";
      if (numberOfIndicatorCatSubComponents != 1) {
        component = indicatorClass.components[k].labelShort;
      }

      var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'group', currentStepComponent.nameLabel);

      file.setNamedRange(cellName, currentCell);

      tempCol = tempCol + 1;
    }

    // atomic opCom scores
    for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol);

      if (companyHasOpCom) {

        // Formula by calculating offset --> Refactor
        var up = currentIndicator.elements.length * 2 + 2;
        var range = sheet.getRange(activeRow - up, tempCol);
        // currentCell.setValue(range.getA1Notation());
        var elementScoreFormula = elementScore(range);
        currentCell.setFormula(elementScoreFormula)

        // cell name formula; output defined in 44_rangeNamingHelper.js

        var component = "";
        if (numberOfIndicatorCatSubComponents != 1) {
          component = indicatorClass.components[k].labelShort;
        }

        var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "opCom", currentStepComponent.nameLabel);

        file.setNamedRange(cellName, currentCell);

      } else {

        currentCell.setValue('---')

      }

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

        // cell name formula; output defined in 44_rangeNamingHelper.js

        var component = "";
        if (numberOfIndicatorCatSubComponents != 1) {
          component = indicatorClass.components[k].labelShort;
        }

        var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStepComponent.nameLabel);

        file.setNamedRange(cellName, currentCell);

        tempCol = tempCol + 1;
      }

    }

    Logger.log("atomic scores added for " + currentIndicator.labelShort);

    activeRow = activeRow + 1;
  }

  return activeRow + 1;
}

function addLevelScores(file, activeRow, activeCol, sheet, currentStep, currentStepComponent, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass) {

  //   // --- adding the level averages --- //

  // // set up labels

  // activeRow = activeRow + 1;
  // currentCell = sheet.getRange(activeRow, activeCol);
  // currentCell.setValue("Level Scores");
  // currentCell.setFontWeight('bold');

  // var tempCol = activeCol;
  // tempCol = tempCol + 1;

  // // variable used for indicator average later
  // var indicatorAverageCompanyElements = [];
  // var indicatorAverageServicesElements = [];

  // // --- Level Average Scores --- //

  // // Company Components //

  // // Group AVERAGE

  // for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {

  //   var currentCell = sheet.getRange(activeRow, tempCol);
  //   var serviceCells = [];

  //   for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {

  //     // finding the cell names that are used in calculating a company specific average

  //     var component = "";
  //     if (numberOfIndicatorCatSubComponents != 1) {
  //       component = indicatorClass.components[k].labelShort;
  //     }

  //     var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "group", currentStepComponent.nameLabel);

  //     serviceCells.push(cellName);
  //   }

  //   var levelFormula = serviceScore(serviceCells);
  //   currentCell.setFormula(levelFormula);
  //   currentCell.setNumberFormat("0.00");

  //   // naming the group level cell score
  //   var component = "";
  //   if (numberOfIndicatorCatSubComponents != 1) {
  //     component = indicatorClass.components[k].labelShort;
  //   }

  //   var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, "group", currentStepComponent.nameLabel);

  //   file.setNamedRange(cellName, currentCell);

  //   indicatorAverageCompanyElements.push(cellName); // adding name to the formula


  //   tempCol = tempCol + 1;
  // }

  // // OpCom AVERAGE

  // for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {

  //   var currentCell = sheet.getRange(activeRow, tempCol);

  //   if (companyHasOpCom) {
  //     var serviceCells = [];

  //     for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {

  //       // finding the cell names that are used in calculating a company specific average

  //       var component = "";
  //       if (numberOfIndicatorCatSubComponents != 1) {
  //         component = indicatorClass.components[k].labelShort;
  //       }

  //       var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "opCom", currentStepComponent.nameLabel);

  //       if (companyHasOpCom == true) {
  //         serviceCells.push(cellName);
  //       }
  //     }

  //     var levelFormula = serviceScore(serviceCells);
  //     currentCell.setFormula(levelFormula);
  //     currentCell.setNumberFormat("0.00");

  //     // naming the opCom level cell score
  //     var component = "";
  //     if (numberOfIndicatorCatSubComponents != 1) {
  //       component = indicatorClass.components[k].labelShort;
  //     }

  //     var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, "opCom", currentStepComponent.nameLabel);

  //     file.setNamedRange(cellName, currentCell);

  //     indicatorAverageCompanyElements.push(cellName)

  //   } else {

  //     currentCell.setValue('---');

  //   }
  //   tempCol = tempCol + 1;
  // }


  // // --- SERVICES --- //

  // // iterate over services

  // for (var g = 0; g < CompanyObj.services.length; g++) {

  //   for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
  //     currentCell = sheet.getRange(activeRow, tempCol);

  //     var serviceCells = [];

  //     for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {

  //       // finding the cell names that are used in calculating a company specific average

  //       var component = "";
  //       if (numberOfIndicatorCatSubComponents != 1) {
  //         component = indicatorClass.components[k].labelShort;
  //       }

  //       var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStepComponent.nameLabel);

  //       serviceCells.push(cellName);
  //     }

  //     var levelFormula = serviceScore(serviceCells);
  //     currentCell.setFormula(levelFormula);
  //     currentCell.setNumberFormat("0.00");

  //     // naming the service level cell score
  //     var component = "";
  //     if (numberOfIndicatorCatSubComponents != 1) {
  //       component = indicatorClass.components[k].labelShort;
  //     }

  //     var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStepComponent.nameLabel);

  //     file.setNamedRange(cellName, currentCell);

  //     indicatorAverageServicesElements.push(cellName)

  //     tempCol = tempCol + 1;

  //   }
  // }

  // Logger.log("level scores added for " + currentIndicator.labelShort);


  return activeRow + 1
}

function addCompositeScores(file, activeRow, activeCol, sheet, currentStep, currentStepComponent, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass) {

  // // --- // --- Averages --- // --- //

  // var indicatorAverageElements = [];

  // // --- Composite Company --- //

  // activeRow = activeRow + 2;

  // currentCell = sheet.getRange(activeRow, activeCol);
  // currentCell.setValue("Composite Scores");
  // currentCell.setFontWeight('bold');
  // currentCell = sheet.getRange(activeRow, activeCol + 1);

  // var component = "A";

  // currentCell.setFormula(componentScore(indicatorAverageCompanyElements));
  // currentCell.setFontWeight('bold');
  // currentCell.setNumberFormat("0.##");

  // var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, "", "Cmp");

  // file.setNamedRange(cellName, currentCell);
  // indicatorAverageElements.push(cellName);
  // Logger.log("composite company score added for " + currentIndicator.labelShort);

  // // --- Composite Services --- //

  // component = "B";

  // secondCompositeCell = sheet.getRange(activeRow, activeCol + 1 + (2 * numberOfIndicatorCatSubComponents));

  // secondCompositeCell.setFormula(componentScore(indicatorAverageServicesElements));

  // secondCompositeCell.setFontWeight('bold');
  // secondCompositeCell.setNumberFormat("0.##");

  // var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, "", "Cmp");

  // file.setNamedRange(cellName, secondCompositeCell);
  // indicatorAverageElements.push(cellName);
  // Logger.log("composite company score added for " + currentIndicator.labelShort);

  return activeRow + 1

}

function addIndicatorScore(file, activeRow, activeCol, sheet, currentStep, currentStepComponent, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass) {

  // // --- INDICATOR SCORE --- //

  // // setting up label for Average Score
  // activeRow = activeRow + 2;
  // currentCell = sheet.getRange(activeRow, activeCol);
  // currentCell.setValue("Indicator Score");
  // currentCell.setFontWeight('bold');
  // currentCell = sheet.getRange(activeRow, activeCol + 1);

  // Logger.log(indicatorAverageElements);

  // currentCell.setFormula(indicatorScore(indicatorAverageElements));

  // currentCell.setFontWeight('bold');
  // currentCell.setNumberFormat("0.##");

  // // naming the level cell score
  // component = "";

  // var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStep.labelShort, currentIndicator.labelShort, component, CompanyObj.id, "", "Ind");

  // file.setNamedRange(cellName, currentCell);

  // Logger.log("indicator score added for " + currentIndicator.labelShort);

  // // --- INDICATOR END --- //

  return activeRow + 1
}