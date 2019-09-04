// --- Spreadsheet Casting: Company Scoring Sheet --- //

// Works only for a single ATOMIC step right now //

// --- for easier use, define company name here (based on lookup from config or according json file) --- //

// --- CONFIG --- //

var firstScoringStep = 0

var companyHasOpCom
// later move to central config //

// --------------- This is the main caller ---------------- //

function createSCSheet(stepsSubset, indicatorSubset, companyShortName, filenameVersion) {
  Logger.log('begin main Scoring')
  Logger.log("Name received: " + companyShortName)

  var sheetMode = "SC"

  // importing the JSON objects which contain the parameters
  // TODO: parameterize for easier usability
  var configObj = importJsonConfig()
  var CompanyObj = importJsonCompany(companyShortName)
  var IndicatorsObj = importJsonIndicator(indicatorSubset)
  var ResearchStepsObj = importResearchSteps(stepsSubset)
  Logger.log("Obj: " + ResearchStepsObj)
  Logger.log("Obj.length: " + ResearchStepsObj.researchSteps.length)
  Logger.log("Obj: " + IndicatorsObj)

  companyHasOpCom = CompanyObj.opCom

  Logger.log(companyShortName + "opCom? - " + companyHasOpCom)

  // Mode A: creating a blank spreadsheet
  // var filename = spreadSheetFileName(companyShortName, sheetMode, filenameVersion)

  // Mode B: instead of creating a new sheet on every run, re-use
  // THIS IS DANGEROUS //
  // HIDDEN CACHE ADVENTURES ARE WAITING FOR YOU //
  // i.e. Named Ranges are not reset upon casting

  var spreadsheetName = spreadSheetFileName(companyShortName, sheetMode, filenameVersion)

  var file = connectToSpreadsheetByName(spreadsheetName)

  // creates Outcome  page
  var sheet = file.getActiveSheet()
  sheet = insertSheetIfNotExist(file, 'Points')
  sheet.clear()

  // Scoring Scheme / Validation
  // TODO Refactor to module
  sheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"])
  sheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude"])
  sheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude"])

  sheet = insertSheetIfNotExist(file, 'Outcome')
  sheet.clear()
  sheet = clearAllNamedRangesFromSheet(sheet)

  // For all Research Steps
  for (var currentStep = firstScoringStep; currentStep < ResearchStepsObj.researchSteps.length; currentStep++) {

    Logger.log("currentStep: " + currentStep)

    // add Step to top-left cell
    var activeRow = 1
    var activeCol = 1

    sheet.getRange(activeRow, activeCol).setValue(ResearchStepsObj.researchSteps[currentStep].labelShort).setFontWeight("bold")

    sheet.setColumnWidth(activeCol, 200)

    // For all Indicator Categories
    for (var currentIndicatorCat = 0; currentIndicatorCat < IndicatorsObj.indicatorClass.length; currentIndicatorCat++) {

      // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
      var numberOfIndicatorCatSubComponents = 1

      if (IndicatorsObj.indicatorClass[currentIndicatorCat].hasSubComponents == true) {
        numberOfIndicatorCatSubComponents = IndicatorsObj.indicatorClass[currentIndicatorCat].components.length
      }

      // For all Indicators
      for (var currentIndicator = 0; currentIndicator < IndicatorsObj.indicatorClass[currentIndicatorCat].indicators.length; currentIndicator++) {

        Logger.log('beginn Indicator: ' + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort)

        // variable used for indicator average later

        var indicatorAverageCompanyElements = []
        var indicatorAverageServicesElements = []
        var indicatorAverageElements = []

        // set up header / TODO: remove from steps JSON. Not a component. This is Layout

        activeRow = activeRow + 1
        activeRow = setCompanyHeader(activeRow, activeCol, sheet, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], IndicatorsObj.indicatorClass[currentIndicatorCat], CompanyObj)
        Logger.log("Header row printed for " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort)

        // for all components of the current Research Step
        for (var currentStepComponent = 0; currentStepComponent < ResearchStepsObj.researchSteps[currentStep].components.length; currentStepComponent++) {

          Logger.log("beginn currentStepComponent: " + currentStepComponent)

          var stepComponent = ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type

          switch (stepComponent) {

            case "elementDropDown":
              activeRow = importElementResults(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClass[currentIndicatorCat])
              Logger.log("results added for: " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort)
              break

            case "comments":
              activeRow = importComments(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj)
              Logger.log("comments added for: " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort)
              break

            case "sources":
              activeRow = importSources(activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj)
              Logger.log("sources added for: " + IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator].labelShort)
              break

            default:
              sheet.appendRow(["!!!You missed a component!!!"])
              break
          }
        }

        activeRow = activeRow + 1

        // ADD SCORING AFTER ALL OTHER COMPONENTS
        activeRow = addElementScores(file, sheetMode, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep].labelShort, currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClass[currentIndicatorCat])

        activeRow = addLevelScores(file, sheetMode, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep].labelShort, currentStepComponent, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, IndicatorsObj.indicatorClass[currentIndicatorCat], indicatorAverageCompanyElements, indicatorAverageServicesElements)

        activeRow = addCompositeScores(file, sheetMode, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep].labelShort, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj, numberOfIndicatorCatSubComponents, indicatorAverageCompanyElements, indicatorAverageServicesElements, indicatorAverageElements)

        activeRow = addIndicatorScore(file, sheetMode, activeRow, activeCol, sheet, ResearchStepsObj.researchSteps[currentStep].labelShort, IndicatorsObj.indicatorClass[currentIndicatorCat].indicators[currentIndicator], CompanyObj, indicatorAverageElements)
      }
    }
  }
}

// ---------------------HELPER FUNCTIONS---------------------------------------------

// --- BEGIN setCompanyHeader() --- //

function setCompanyHeader(activeRow, activeCol, sheet, currentIndicator, indicatorClass, companyObj) {

  var currentCell = sheet.getRange(activeRow, activeCol)
  currentCell.setValue(currentIndicator.labelShort)
  currentCell.setBackgroundRGB(237, 179, 102)
  currentCell.setFontWeight('bold')
  currentCell.setVerticalAlignment("middle")
  currentCell.setHorizontalAlignment('center')
  activeCol = activeCol + 1

  // adding the company and subcompanies, etc

  var numberOfIndicatorCatSubComponents = 1

  // --- // --- First Fork: Governance Subcomponents? --- // --- // 

  if (indicatorClass.hasSubComponents == true) {

    numberOfIndicatorCatSubComponents = indicatorClass.components.length

  }

  // --- // --- Company Elements --- // --- //

  // group 

  for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
    var currentCell = sheet.getRange(activeRow, activeCol)
    var columnLabel = 'Group\n' + companyObj.label.current

    if (numberOfIndicatorCatSubComponents > 1) {
      columnLabel = columnLabel + '\n' + indicatorClass.components[g].labelLong
    }
    columnLabel = columnLabel.toString()

    currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

    activeCol = activeCol + 1
  }

  // opcom

  for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
    var currentCell = sheet.getRange(activeRow, activeCol)
    var columnLabel = 'OpCom\n'

    if (companyObj.opCom == true) {
      columnLabel = columnLabel + companyObj.opComLabel
    } else {
      columnLabel = columnLabel + " --- "
    }

    if (numberOfIndicatorCatSubComponents > 1) {
      columnLabel = columnLabel + '\n' + indicatorClass.components[g].labelLong
    }
    columnLabel = columnLabel.toString()

    currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

    activeCol = activeCol + 1
  }

  // --- // --- Services --- // --- //

  for (k = 0; k < companyObj.numberOfServices; k++) {
    for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
      var currentCell = sheet.getRange(activeRow, activeCol)
      var columnLabel = companyObj.services[k].label.current

      if (numberOfIndicatorCatSubComponents > 1) {
        columnLabel = columnLabel + '\n' + indicatorClass.components[g].labelLong
      }
      columnLabel = columnLabel.toString()

      currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

      activeCol = activeCol + 1
    }

  }

  activeRow = activeRow + 1
  return activeRow
}

function importElementResults(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass) {

  Logger.log('in results section for ' + currentIndicator.labelShort)

  var companyHasOpCom = CompanyObj.opCom

  // for each element

  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
    var tempCol = activeCol
    var currentCell = sheet.getRange(activeRow, tempCol)
    var rowLabel = currentStep.components[element].label + currentIndicator.elements[currentElementNr].labelShort
    rowLabel = rowLabel.toString()
    currentCell.setValue(rowLabel)
    currentCell.setWrap(true)
    tempCol = tempCol + 1
    var component = ""

    // for Group + Indicator Subcomponents
    for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

      currentCell = sheet.getRange(activeRow, tempCol)

      if (numberOfIndicatorCatSubComponents != 1) {
        component = indicatorClass.components[k].labelShort
      }

      // setting up formula that compares values
      var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'group')

      // adding formula
      var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")'
      formula = formula.toString()
      currentCell.setFormula(formula)
      tempCol = tempCol + 1
    }

    // for opCom + Indicator Subcomponents
    for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol)

      if (companyHasOpCom) {
        // setting up formula that compares values
        var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'opCom')

        var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")'
        formula = formula.toString()
        currentCell.setFormula(formula)

      } else {
        currentCell.setValue('---')
      }
      tempCol = tempCol + 1
    }

    // for n Services + Indicator Subcomponents
    for (var g = 0; g < CompanyObj.services.length; g++) {

      for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
        currentCell = sheet.getRange(activeRow, tempCol)

        // setting up formula that compares values
        var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id)

        var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + compCellName + '")'
        formula = formula.toString()
        currentCell.setFormula(formula)

        tempCol = tempCol + 1
      }
    }

    activeRow = activeRow + 1
  }

  return activeRow
}

function importComments(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj) {
  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {

    // setting up the labels
    var currentCell = sheet.getRange(activeRow, activeCol)
    var rowLabel = currentStep.components[element].label + currentIndicator.elements[currentElementNr].labelShort + currentStep.components[element].label2
    rowLabel = rowLabel.toString()
    currentCell.setValue(rowLabel)
    currentCell.setWrap(true)


    activeRow = activeRow + 1
  }

  return activeRow
}

function importSources(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj) {

  // setting up the columnLabel
  var currentCell = sheet.getRange(activeRow, activeCol)
  var rowLabel = currentStep.components[element].label
  rowLabel = rowLabel.toString()
  currentCell.setValue(rowLabel)
  currentCell.setWrap(true)

  activeRow = activeRow + 1
  return activeRow
}

// --- Core function: SCORING --- //

function addElementScores(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, currentStepComponent, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass) {

  Logger.log("In Element Scoring for " + currentIndicator.labelShort)

  // for each indicator.Element

  // labels column
  for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
    var tempCol = activeCol
    var currentCell = sheet.getRange(activeRow, tempCol)
    var rowLabel = 'Points for ' + currentIndicator.elements[currentElementNr].labelShort
    rowLabel = rowLabel.toString()
    currentCell.setValue(rowLabel)
    currentCell.setWrap(true)
    tempCol = tempCol + 1

    // for each Indicator Sub Component (G: FC, PC)
    for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

      // add score
      currentCell = sheet.getRange(activeRow, tempCol)
      // Formula by calculating offset --> Refactor to generic method(currentCell,)
      var up = currentIndicator.elements.length * 2 + 2
      var range = sheet.getRange(activeRow - up, tempCol)
      // currentCell.setValue(range.getA1Notation())
      var elementScore = elementScoreFormula(range)
      currentCell.setFormula(elementScore)
      currentCell.setNumberFormat("0.##")

      // cell name formula; output defined in 44_rangeNamingHelper.js
      var component = ""
      if (numberOfIndicatorCatSubComponents != 1) {
        component = indicatorClass.components[k].labelShort
      }
      var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, 'group', currentStepComponent.nameLabel)
      file.setNamedRange(cellName, currentCell)
      tempCol = tempCol + 1
    }

    // atomic opCom scores
    for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol)

      if (companyHasOpCom) {

        // Formula by calculating offset --> Refactor
        up = currentIndicator.elements.length * 2 + 2
        range = sheet.getRange(activeRow - up, tempCol)
        // currentCell.setValue(range.getA1Notation())
        elementScore = elementScoreFormula(range)
        currentCell.setFormula(elementScore)
        currentCell.setNumberFormat("0.##")
        // cell name formula; output defined in 44_rangeNamingHelper.js
        component = ""
        if (numberOfIndicatorCatSubComponents != 1) {
          component = indicatorClass.components[k].labelShort
        }
        cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "opCom", currentStepComponent.nameLabel)
        file.setNamedRange(cellName, currentCell)

      } else {

        currentCell.setValue('---')

      }

      tempCol = tempCol + 1
    }

    // looping through the service scores

    for (var g = 0; g < CompanyObj.services.length; g++) {

      for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {
        currentCell = sheet.getRange(activeRow, tempCol)
        // Formula by calculating offset --> Refactor
        up = currentIndicator.elements.length * 2 + 2
        range = sheet.getRange(activeRow - up, tempCol)
        // currentCell.setValue(range.getA1Notation())
        // var elementScore = '=LEN(' + range.getA1Notation() + ')'
        elementScore = elementScoreFormula(range)
        currentCell.setFormula(elementScore)
        currentCell.setNumberFormat("0.##")
        // cell name formula; output defined in 44_rangeNamingHelper.js
        component = ""
        if (numberOfIndicatorCatSubComponents != 1) {
          component = indicatorClass.components[k].labelShort
        }
        cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStepComponent.nameLabel)
        file.setNamedRange(cellName, currentCell)
        tempCol = tempCol + 1
      }

    }

    Logger.log('atomic scores added for ' + currentIndicator.elements[currentElementNr].labelShort)

    activeRow = activeRow + 1
  }

  return activeRow + 1
}

function addLevelScores(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, currentStepComponent, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClass, indicatorAverageCompanyElements, indicatorAverageServicesElements) {

  // --- adding the level averages --- //

  // set up labels

  var currentCell = sheet.getRange(activeRow, activeCol)
  currentCell.setValue('Level Scores')
  currentCell.setFontWeight('bold')

  var tempCol = activeCol
  tempCol = tempCol + 1

  // --- Level Average Scores --- //

  // Company Components //

  // Group AVERAGE

  for (var k = 0; k < numberOfIndicatorCatSubComponents; k++) {

    currentCell = sheet.getRange(activeRow, tempCol)
    var serviceCells = []

    for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {

      // finding the cell names that are used in calculating a company specific average

      var component = ""
      if (numberOfIndicatorCatSubComponents != 1) {
        component = indicatorClass.components[k].labelShort
      }
      var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "group", currentStepComponent.nameLabel)
      serviceCells.push(cellName)
    }

    var levelFormula = levelScoreFormula(serviceCells)
    currentCell.setFormula(levelFormula)
    currentCell.setNumberFormat("0.##")
    // naming the group level cell score
    var component = ""
    if (numberOfIndicatorCatSubComponents != 1) {
      component = indicatorClass.components[k].labelShort
    }
    var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.labelShort, component, CompanyObj.id, "group", currentStepComponent.nameLabel)
    file.setNamedRange(cellName, currentCell)
    indicatorAverageCompanyElements.push(cellName); // adding name to the formula
    tempCol = tempCol + 1
  }

  // OpCom AVERAGE

  for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {

    var currentCell = sheet.getRange(activeRow, tempCol)

    if (companyHasOpCom) {
      var serviceCells = []

      for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {

        // finding the cell names that are used in calculating a company specific average
        var component = ""
        if (numberOfIndicatorCatSubComponents != 1) {
          component = indicatorClass.components[k].labelShort
        }
        var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, "opCom", currentStepComponent.nameLabel)
        if (companyHasOpCom == true) {
          serviceCells.push(cellName)
        }
      }

      var levelFormula = levelScoreFormula(serviceCells)
      currentCell.setFormula(levelFormula)
      currentCell.setNumberFormat("0.##")
      // naming the opCom level cell score
      var component = ""
      if (numberOfIndicatorCatSubComponents != 1) {
        component = indicatorClass.components[k].labelShort
      }

      var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.labelShort, component, CompanyObj.id, "opCom", currentStepComponent.nameLabel)
      file.setNamedRange(cellName, currentCell)
      indicatorAverageCompanyElements.push(cellName)

    } else {

      currentCell.setValue('---')

    }
    tempCol = tempCol + 1
  }


  // --- SERVICES --- //

  // iterate over services

  for (var g = 0; g < CompanyObj.services.length; g++) {

    for (k = 0; k < numberOfIndicatorCatSubComponents; k++) {
      currentCell = sheet.getRange(activeRow, tempCol)
      var serviceCells = []
      for (var currentElementNr = 0; currentElementNr < currentIndicator.elements.length; currentElementNr++) {
        // finding the cell names that are used in calculating a company specific average
        var component = ""
        if (numberOfIndicatorCatSubComponents != 1) {
          component = indicatorClass.components[k].labelShort
        }
        var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.elements[currentElementNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStepComponent.nameLabel)
        serviceCells.push(cellName)
      }

      var levelFormula = levelScoreFormula(serviceCells)
      currentCell.setFormula(levelFormula)
      currentCell.setNumberFormat("0.##")

      // naming the service level cell score
      var component = ""
      if (numberOfIndicatorCatSubComponents != 1) {
        component = indicatorClass.components[k].labelShort
      }

      var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStepComponent.nameLabel)

      file.setNamedRange(cellName, currentCell)

      indicatorAverageServicesElements.push(cellName)

      tempCol = tempCol + 1

    }
  }

  Logger.log("level scores added for " + currentIndicator.labelShort)

  return activeRow + 1
}

function addCompositeScores(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorAverageCompanyElements, indicatorAverageServicesElements, indicatorAverageElements) {

  activeRow = activeRow + 1

  var currentCell = sheet.getRange(activeRow, activeCol)
  currentCell.setValue("Composite Scores")
  currentCell.setFontWeight('bold')
  currentCell = sheet.getRange(activeRow, activeCol + 1)

  // --- Composite Company --- //

  var scoringComponent = "A"

  currentCell.setFormula(compositeScoreFormula(indicatorAverageCompanyElements))

  var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.labelShort, scoringComponent, CompanyObj.id, "", "Cmp")
  file.setNamedRange(cellName, currentCell)

  // apply scoring Logic
  currentCell = checkScoringLogic(currentIndicator, scoringComponent, currentCell, cellName, indicatorAverageElements)

  Logger.log("composite company score added for " + currentIndicator.labelShort)

  // --- Composite Services --- //

  scoringComponent = "B"

  var servicesCompositeCell = sheet.getRange(activeRow, activeCol + 1 + (2 * numberOfIndicatorCatSubComponents)) // 2 := group + opCom cols

  servicesCompositeCell.setFormula(compositeScoreFormula(indicatorAverageServicesElements))

  cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.labelShort, scoringComponent, CompanyObj.id, "", "Cmp")

  file.setNamedRange(cellName, servicesCompositeCell)
  // apply scoring Logic
  currentCell = checkScoringLogic(currentIndicator, scoringComponent, servicesCompositeCell, cellName, indicatorAverageElements)

  Logger.log("composite company score added for " + currentIndicator.labelShort)

  return activeRow + 1
}

function addIndicatorScore(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, currentIndicator, CompanyObj, indicatorAverageElements) {

  activeRow = activeRow + 1

  // --- INDICATOR SCORE --- //

  // setting up label for Average Score

  var currentCell = sheet.getRange(activeRow, activeCol)
  currentCell.setValue("Indicator Score")
  currentCell.setFontWeight('bold')
  currentCell = sheet.getRange(activeRow, activeCol + 1)

  Logger.log(indicatorAverageElements)

  currentCell.setFormula(indicatorScoreFormula(indicatorAverageElements))

  currentCell.setFontWeight('bold')
  currentCell.setNumberFormat("0.##")

  // naming the level cell score
  var component = ""

  var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, currentIndicator.labelShort, component, CompanyObj.id, "", "Ind")

  file.setNamedRange(cellName, currentCell)

  Logger.log("indicator score added for " + currentIndicator.labelShort)

  // --- INDICATOR END --- //

  return activeRow + 1
}
