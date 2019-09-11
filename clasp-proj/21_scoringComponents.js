
// ---------------------HELPER FUNCTIONS---------------------------------------------

// --- BEGIN setCompanyHeader() --- //

/**
 * 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentIndicator 
 * @param {*} indicatorClasses 
 * @param {*} companyObj 
 */

function setCompanyHeader(activeRow, activeCol, sheet, currentIndicator, indicatorClasses, companyObj) {

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

    if (indicatorClasses.hasSubComponents == true) {

        numberOfIndicatorCatSubComponents = indicatorClasses.components.length

    }

    // --- // --- Company Elements --- // --- //

    // group 

    for (var g = 0; g < numberOfIndicatorCatSubComponents; g++) {
        var currentCell = sheet.getRange(activeRow, activeCol)
        var columnLabel = 'Group\n' + companyObj.label.current

        if (numberOfIndicatorCatSubComponents > 1) {
            columnLabel = columnLabel + '\n' + indicatorClasses.components[g].labelLong
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
            columnLabel = columnLabel + '\n' + indicatorClasses.components[g].labelLong
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
                columnLabel = columnLabel + '\n' + indicatorClasses.components[g].labelLong
            }
            columnLabel = columnLabel.toString()

            currentCell = styleScoringIndicatorHeader(currentCell, columnLabel)

            activeCol = activeCol + 1
        }

    }

    activeRow = activeRow + 1
    return activeRow
}

/**
 * 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentStep 
 * @param {*} element 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} indicatorClasses 
 */

function importElementResults(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClasses) {

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
                component = indicatorClasses.components[k].labelShort
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

/**
 * 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentStep 
 * @param {*} element 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 */

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

/**
 * 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentStep 
 * @param {*} element 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 */

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

/**
 * 
 * @param {*} file 
 * @param {*} sheetMode 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentSteplabelShort 
 * @param {*} currentStepComponent 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} indicatorClasses 
 */

function addElementScores(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, currentStepComponent, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClasses) {

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
                component = indicatorClasses.components[k].labelShort
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
                    component = indicatorClasses.components[k].labelShort
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
                    component = indicatorClasses.components[k].labelShort
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

/**
 * 
 * @param {*} file 
 * @param {*} sheetMode 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentSteplabelShort 
 * @param {*} currentStepComponent 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} indicatorClasses 
 * @param {*} indicatorAverageCompanyElements 
 * @param {*} indicatorAverageServicesElements 
 */

function addLevelScores(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, currentStepComponent, currentIndicator, CompanyObj, numberOfIndicatorCatSubComponents, indicatorClasses, indicatorAverageCompanyElements, indicatorAverageServicesElements) {

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
                component = indicatorClasses.components[k].labelShort
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
            component = indicatorClasses.components[k].labelShort
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
                    component = indicatorClasses.components[k].labelShort
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
                component = indicatorClasses.components[k].labelShort
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
                    component = indicatorClasses.components[k].labelShort
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
                component = indicatorClasses.components[k].labelShort
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

/**
 * 
 * @param {*} file 
 * @param {*} sheetMode 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentSteplabelShort 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} numberOfIndicatorCatSubComponents 
 * @param {*} indicatorAverageCompanyElements 
 * @param {*} indicatorAverageServicesElements 
 * @param {*} indicatorAverageElements 
 */

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

/**
 * 
 * @param {*} file 
 * @param {*} sheetMode 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentSteplabelShort 
 * @param {*} currentIndicator 
 * @param {*} CompanyObj 
 * @param {*} indicatorAverageElements 
 */

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
