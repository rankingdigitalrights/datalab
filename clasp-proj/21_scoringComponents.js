
// ---------------------HELPER FUNCTIONS---------------------------------------------

// --- BEGIN setCompanyHeader() --- //

/**
 * 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} Indicator 
 * @param {*} indicatorCat 
 * @param {*} companyObj 
 */

function setCompanyHeader(activeRow, activeCol, sheet, Indicator, nrOfIndSubComps, indicatorCat, companyObj) {

    var currentCell = sheet.getRange(activeRow, activeCol)
    currentCell.setValue(Indicator.labelShort)
        .setBackground(indicatorCat.classColor)
        .setFontWeight('bold')
        .setVerticalAlignment("middle")
        .setHorizontalAlignment('center')
    activeCol += 1

    // --- // Company Elements // --- //

    // group 

    var thisColor = "#d9d9d9" // grey

    for (var g = 0; g < nrOfIndSubComps; g++) {
        var currentCell = sheet.getRange(activeRow, activeCol)
        var columnLabel = 'Group\n' + companyObj.label.current

        if (nrOfIndSubComps > 1) {
            columnLabel = columnLabel + '\n' + indicatorCat.components[g].labelLong
        }

        currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

        activeCol += 1
    }

    // opcom

    for (var g = 0; g < nrOfIndSubComps; g++) {
        var currentCell = sheet.getRange(activeRow, activeCol)
        var columnLabel = 'OpCom\n'

        if (companyObj.opCom == true) {
            columnLabel = columnLabel + companyObj.opComLabel
        } else {
            columnLabel = columnLabel + " --- "
        }

        if (nrOfIndSubComps > 1) {
            columnLabel = columnLabel + '\n' + indicatorCat.components[g].labelLong
        }

        currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

        activeCol += 1
    }

    // --- // --- Services --- // --- //

    for (k = 0; k < companyObj.numberOfServices; k++) {
        for (var g = 0; g < nrOfIndSubComps; g++) {
            var currentCell = sheet.getRange(activeRow, activeCol)
            var columnLabel = companyObj.services[k].label.current

            if (nrOfIndSubComps > 1) {
                columnLabel = columnLabel + '\n' + indicatorCat.components[g].labelLong
            }

            currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

            activeCol += 1
        }
    }
    activeRow += 1
    return activeRow
}

/**
 * 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentStep 
 * @param {*} stepCompNr 
 * @param {*} Indicator 
 * @param {*} CompanyObj 
 * @param {*} nrOfIndSubComps 
 * @param {*} indicatorCat 
 */

function importElementData(activeRow, activeCol, sheet, currentStep, stepCompNr, Indicator, CompanyObj, nrOfIndSubComps, indicatorCat) {

    var stepCompType = currentStep.components[stepCompNr].type

    // if type = scores, omit suffix from range name
    if (stepCompType == "elementResults") {
        stepCompType = false
    }

    Logger.log('in ' + + ' section for ' + Indicator.labelShort)

    var companyHasOpCom = CompanyObj.opCom

    var urlDC = CompanyObj.urlCurrentDataCollectionSheet
    // for each element

    for (var elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {
        // row label

        var tempCol = activeCol
        var currentCell = sheet.getRange(activeRow, tempCol)
        var rowLabel = currentStep.components[stepCompNr].label + Indicator.elements[elemNr].labelShort
        currentCell.setValue(rowLabel.toString())
        currentCell.setWrap(true)
        tempCol += 1
        var component = ""
        
        // result cells
        // for Group + Indicator Subcomponents
        for (var k = 0; k < nrOfIndSubComps; k++) {

            currentCell = sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            // setting up formula that compares values
            var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, 'group', stepCompType)

            // adding formula
            var formula = importRange(urlDC, compCellName)
            currentCell.setFormula(formula)
            tempCol += 1
        }

        // for opCom + Indicator Subcomponents
        for (var k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            if (companyHasOpCom) {
                // setting up formula that compares values
                var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, 'opCom', stepCompType)

                var formula = importRange(urlDC, compCellName)
                currentCell.setFormula(formula)

            } else {
                currentCell.setValue(' - ').setHorizontalAlignment('center')
            }
            tempCol += 1
        }

        // for n Services + Indicator Subcomponents
        for (var g = 0; g < CompanyObj.services.length; g++) {

            for (k = 0; k < nrOfIndSubComps; k++) {
                currentCell = sheet.getRange(activeRow, tempCol)

                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }

                // setting up formula that compares values
                var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                var formula = importRange(urlDC, compCellName)
                currentCell.setFormula(formula)

                tempCol += 1
            }
        }

        activeRow += 1
    }

    return activeRow
}


// --- // Begin Sources // --- //

/**
 * 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentStep 
 * @param {*} stepCompNr 
 * @param {*} Indicator 
 * @param {*} CompanyObj 
 * @param {*} nrOfIndSubComps 
 * @param {*} indicatorCat 
 */

function importSources(activeRow, activeCol, sheet, currentStep, stepCompNr, Indicator, CompanyObj, nrOfIndSubComps, indicatorCat) {

    var stepCompType = currentStep.components[stepCompNr].type

    Logger.log('in ' + stepCompType + ' section for ' + Indicator.labelShort)

    if (stepCompType == "elementResults") {
        stepCompType = false
    }

    var companyHasOpCom = CompanyObj.opCom

    var urlDC = CompanyObj.urlCurrentDataCollectionSheet

    // row label
    var tempCol = activeCol
    var currentCell = sheet.getRange(activeRow, activeCol)
    var rowLabel = currentStep.components[stepCompNr].label
    currentCell.setValue(rowLabel.toString())
    currentCell.setWrap(true)
    tempCol += 1
    var component = ""

    // result cells
    // for Group + Indicator Subcomponents
    for (var k = 0; k < nrOfIndSubComps; k++) {
        currentCell = sheet.getRange(activeRow, tempCol)

        if (nrOfIndSubComps != 1) {
            component = indicatorCat.components[k].labelShort
        }

        // setting up formula that compares values
        var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, Indicator.labelShort, component, CompanyObj.id, 'group', stepCompType)

        // adding formula
        var formula = importRange(urlDC, compCellName)
        currentCell.setFormula(formula)
        tempCol += 1
    }

    // for opCom + Indicator Subcomponents
    for (var k = 0; k < nrOfIndSubComps; k++) {
        currentCell = sheet.getRange(activeRow, tempCol)

        if (nrOfIndSubComps != 1) {
            component = indicatorCat.components[k].labelShort
        }

        if (companyHasOpCom) {
            // setting up formula that compares values
            var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, Indicator.labelShort, component, CompanyObj.id, 'opCom', stepCompType)

            var formula = importRange(urlDC, compCellName)
            currentCell.setFormula(formula)

        } else {
            currentCell.setValue(' - ').setHorizontalAlignment('center')
        }
        tempCol += 1
    }

    // for n Services + Indicator Subcomponents
    for (var g = 0; g < CompanyObj.services.length; g++) {

        for (k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            // setting up formula that compares values
            var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.labelShort, Indicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

            var formula = importRange(urlDC, compCellName)
            currentCell.setFormula(formula)

            tempCol += 1
        }
    }

    activeRow += 1

    return activeRow
}

// --- // end Sources // --- //

// --- // Core function: SCORING // --- //

/**
 * 
 * @param {*} file 
 * @param {*} sheetMode 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentSteplabelShort 
 * @param {*} currentStepComponent 
 * @param {*} Indicator 
 * @param {*} CompanyObj 
 * @param {*} nrOfIndSubComps 
 * @param {*} indicatorCat 
 */

function addElementScores(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, currentStepComponent, Indicator, CompanyObj, nrOfIndSubComps, indicatorCat) {

    Logger.log("In Element Scoring for " + Indicator.labelShort)

    // for each indicator.Element

    // labels column
    for (var elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {
        var tempCol = activeCol
        var currentCell = sheet.getRange(activeRow, tempCol)
        var rowLabel = 'Points for ' + Indicator.elements[elemNr].labelShort
        currentCell.setValue(rowLabel.toString())
        currentCell.setWrap(true)
        tempCol += 1

        // for each Indicator Sub Component (G: FC, PC)
        for (var k = 0; k < nrOfIndSubComps; k++) {

            // add score
            currentCell = sheet.getRange(activeRow, tempCol)
            // Formula by calculating offset --> Refactor to generic method(currentCell,)
            var up = Indicator.elements.length * 2 + 2
            var range = sheet.getRange(activeRow - up, tempCol)
            // currentCell.setValue(range.getA1Notation())
            var elementScore = elementScoreFormula(range)
            currentCell.setFormula(elementScore)
            currentCell.setNumberFormat("0.##")

            // cell name formula; output defined in 44_rangeNamingHelper.js
            var component = ""
            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }
            var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, 'group', currentStepComponent.nameLabel)
            file.setNamedRange(cellName, currentCell)
            tempCol += 1
        }

        // atomic opCom scores
        for (var k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)

            if (companyHasOpCom) {

                // Formula by calculating offset --> Refactor
                up = Indicator.elements.length * 2 + 2
                range = sheet.getRange(activeRow - up, tempCol)
                // currentCell.setValue(range.getA1Notation())
                elementScore = elementScoreFormula(range)
                currentCell.setFormula(elementScore)
                currentCell.setNumberFormat("0.##")
                // cell name formula; output defined in 44_rangeNamingHelper.js
                component = ""
                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }
                cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", currentStepComponent.nameLabel)
                file.setNamedRange(cellName, currentCell)

            } else {

                currentCell.setValue(' - ').setHorizontalAlignment('center')

            }

            tempCol += 1
        }

        // looping through the service scores

        for (var g = 0; g < CompanyObj.services.length; g++) {

            for (var k = 0; k < nrOfIndSubComps; k++) {
                currentCell = sheet.getRange(activeRow, tempCol)
                // Formula by calculating offset --> Refactor
                up = Indicator.elements.length * 2 + 2
                range = sheet.getRange(activeRow - up, tempCol)
                // currentCell.setValue(range.getA1Notation())
                // var elementScore = '=LEN(' + range.getA1Notation() + ')'
                elementScore = elementScoreFormula(range)
                currentCell.setFormula(elementScore)
                currentCell.setNumberFormat("0.##")
                // cell name formula; output defined in 44_rangeNamingHelper.js
                component = ""
                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }
                cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStepComponent.nameLabel)
                file.setNamedRange(cellName, currentCell)
                tempCol += 1
            }

        }

        Logger.log('atomic scores added for ' + Indicator.elements[elemNr].labelShort)

        activeRow += 1
    }

    return activeRow + 1
}

// --- // Level Scoring // --- //

/**
 * 
 * @param {*} file 
 * @param {*} sheetMode 
 * @param {*} activeRow 
 * @param {*} activeCol 
 * @param {*} sheet 
 * @param {*} currentSteplabelShort 
 * @param {*} currentStepComponent 
 * @param {*} Indicator 
 * @param {*} CompanyObj 
 * @param {*} nrOfIndSubComps 
 * @param {*} indicatorCat 
 * @param {*} indicatorAverageCompanyElements 
 * @param {*} indicatorAverageServicesElements 
 */

function addLevelScores(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, currentStepComponent, Indicator, CompanyObj, nrOfIndSubComps, indicatorCat, indicatorAverageCompanyElements, indicatorAverageServicesElements) {

    // --- adding the level averages --- //

    // set up labels

    var currentCell = sheet.getRange(activeRow, activeCol)
    currentCell.setValue('Level Scores')
    currentCell.setFontWeight('bold')

    var tempCol = activeCol
    tempCol += 1

    // --- Level Average Scores --- //

    // Company Components //

    // Group AVERAGE

    for (var k = 0; k < nrOfIndSubComps; k++) {

        currentCell = sheet.getRange(activeRow, tempCol)
        var serviceCells = []

        for (var elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {

            // finding the cell names that are used in calculating a company specific average

            var component = ""
            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }
            var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "group", currentStepComponent.nameLabel)
            serviceCells.push(cellName)
        }

        var levelFormula = levelScoreFormula(serviceCells)
        currentCell.setFormula(levelFormula)
        currentCell.setNumberFormat("0.##")
        // naming the group level cell score
        var component = ""
        if (nrOfIndSubComps != 1) {
            component = indicatorCat.components[k].labelShort
        }
        var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.labelShort, component, CompanyObj.id, "group", currentStepComponent.nameLabel)
        file.setNamedRange(cellName, currentCell)
        indicatorAverageCompanyElements.push(cellName); // adding name to the formula
        tempCol += 1
    }

    // OpCom AVERAGE

    for (k = 0; k < nrOfIndSubComps; k++) {

        var currentCell = sheet.getRange(activeRow, tempCol)

        if (companyHasOpCom) {
            var serviceCells = []

            for (var elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {

                // finding the cell names that are used in calculating a company specific average
                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }
                var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", currentStepComponent.nameLabel)
                if (companyHasOpCom == true) {
                    serviceCells.push(cellName)
                }
            }

            var levelFormula = levelScoreFormula(serviceCells)
            currentCell.setFormula(levelFormula)
            currentCell.setNumberFormat("0.##")
            // naming the opCom level cell score
            var component = ""
            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.labelShort, component, CompanyObj.id, "opCom", currentStepComponent.nameLabel)
            file.setNamedRange(cellName, currentCell)
            indicatorAverageCompanyElements.push(cellName)

        } else {

            currentCell.setValue(' - ').setHorizontalAlignment('center')

        }
        tempCol += 1
    }


    // --- SERVICES --- //

    // iterate over services

    for (var g = 0; g < CompanyObj.services.length; g++) {

        for (k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)
            var serviceCells = []
            for (var elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {
                // finding the cell names that are used in calculating a company specific average
                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }
                var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStepComponent.nameLabel)
                serviceCells.push(cellName)
            }

            var levelFormula = levelScoreFormula(serviceCells)
            currentCell.setFormula(levelFormula)
            currentCell.setNumberFormat("0.##")

            // naming the service level cell score
            var component = ""
            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, currentStepComponent.nameLabel)

            file.setNamedRange(cellName, currentCell)

            indicatorAverageServicesElements.push(cellName)

            tempCol += 1

        }
    }

    Logger.log("level scores added for " + Indicator.labelShort)

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
 * @param {*} Indicator 
 * @param {*} CompanyObj 
 * @param {*} nrOfIndSubComps 
 * @param {*} indicatorAverageCompanyElements 
 * @param {*} indicatorAverageServicesElements 
 * @param {*} indicatorAverageElements 
 */

function addCompositeScores(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, Indicator, CompanyObj, nrOfIndSubComps, indicatorAverageCompanyElements, indicatorAverageServicesElements, indicatorAverageElements) {

    activeRow += 1

    var currentCell = sheet.getRange(activeRow, activeCol)
    currentCell.setValue("Composite Scores")
    currentCell.setFontWeight('bold')
    currentCell = sheet.getRange(activeRow, activeCol + 1)

    // --- Composite Company --- //

    var scoringComponent = "A"

    currentCell.setFormula(compositeScoreFormula(indicatorAverageCompanyElements))

    var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.labelShort, scoringComponent, CompanyObj.id, "", "Cmp")
    file.setNamedRange(cellName, currentCell)

    // apply scoring Logic
    currentCell = checkScoringLogic(Indicator, scoringComponent, currentCell, cellName, indicatorAverageElements)

    Logger.log("composite company score added for " + Indicator.labelShort)

    // --- Composite Services --- //

    scoringComponent = "B"

    var servicesCompositeCell = sheet.getRange(activeRow, activeCol + 1 + (2 * nrOfIndSubComps)) // 2 := group + opCom cols

    servicesCompositeCell.setFormula(compositeScoreFormula(indicatorAverageServicesElements))

    cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.labelShort, scoringComponent, CompanyObj.id, "", "Cmp")

    file.setNamedRange(cellName, servicesCompositeCell)
    // apply scoring Logic
    currentCell = checkScoringLogic(Indicator, scoringComponent, servicesCompositeCell, cellName, indicatorAverageElements)

    Logger.log("composite company score added for " + Indicator.labelShort)

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
 * @param {*} Indicator 
 * @param {*} CompanyObj 
 * @param {*} indicatorAverageElements 
 */

function addIndicatorScore(file, sheetMode, activeRow, activeCol, sheet, currentSteplabelShort, Indicator, CompanyObj, indicatorAverageElements) {

    activeRow += 1

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

    var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentSteplabelShort, Indicator.labelShort, component, CompanyObj.id, "", "Ind")

    file.setNamedRange(cellName, currentCell)

    Logger.log("indicator score added for " + Indicator.labelShort)

    // --- INDICATOR END --- //

    return activeRow + 1
}
