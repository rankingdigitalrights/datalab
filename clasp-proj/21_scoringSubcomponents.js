// ---------------------HELPER FUNCTIONS---------------------------------------------

function setSheetHeader(activeRow, activeCol, sheet, companyShortName, thisSubStepLabel, blocks) {

    // -- // add Step Header to top-left cell // -- //
    // TODO: refactor to components
    
    if (blocks == 1) {
        sheet.getRange(activeRow, activeCol)
            .setValue(companyShortName)
            .setFontWeight("bold")
            .setBackground("#b7e1cd")
            .setFontSize(14)
        sheet.setColumnWidth(activeCol, 200)
        activeCol += 1
    }

    sheet.getRange(activeRow, activeCol)
            .setValue(thisSubStepLabel)
            .setFontWeight("bold")
            .setFontSize(14)

    return activeRow += 1
}

// --- BEGIN setCompanyHeader() --- //
function setCompanyHeader(activeRow, activeCol, sheet, Indicator, nrOfIndSubComps, indicatorCat, companyObj, blocks) {

    Logger.log(' - ' + 'in company header ' + Indicator.labelShort)

    var currentCell = sheet.getRange(activeRow, activeCol)
    var columnLabel

    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue(Indicator.labelShort)
            .setBackground(indicatorCat.classColor)
            .setFontWeight('bold')
            .setVerticalAlignment("middle")
            .setHorizontalAlignment('center')
        activeCol += 1
    }

    // --- // Company Elements // --- //

    // group 
    var thisColor = "#d9d9d9" // grey TODO: outsource to config

    for (var g = 0; g < nrOfIndSubComps; g++) {
        currentCell = sheet.getRange(activeRow, activeCol)
        columnLabel = 'Group\n' + companyObj.label.current

        if (nrOfIndSubComps > 1) {
            columnLabel = columnLabel + '\n' + indicatorCat.components[g].labelLong
        }

        currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

        activeCol += 1
    }

    // opcom
    for (var g = 0; g < nrOfIndSubComps; g++) {
        currentCell = sheet.getRange(activeRow, activeCol)
        columnLabel = 'OperatingCo\n'

        if (companyObj.hasOpCom == true) {
            columnLabel = columnLabel + companyObj.opComLabel
        } else {
            columnLabel = columnLabel + " N/A "
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
            currentCell = sheet.getRange(activeRow, activeCol)
            columnLabel = companyObj.services[k].label.current

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

// generic : imports both,element level evaluation results and comments
function importElementData(activeRow, activeCol, sheet, currentStep, stepCNr, Indicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks, isLocalImport) {

    var stepCompType = currentStep.components[stepCNr].id

    Logger.log("Element Data Type: " + stepCompType)

    Logger.log(' - ' + 'in ' + currentStep.components[stepCNr].type + ' ' + Indicator.labelShort)

    var urlDC = CompanyObj.urlCurrentDataCollectionSheet

    // for each element
    for (var elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {

        var tempCol = activeCol
        var currentCell = sheet.getRange(activeRow, tempCol)

        // row label / first Column
        // skip first Column for subsequent steps    
        if (blocks === 1) {
            var rowLabel = currentStep.components[stepCNr].label + Indicator.elements[elemNr].labelShort
            currentCell.setValue(rowLabel.toString())
            currentCell.setWrap(true)
            tempCol += 1
        }

        var component = ""

        // result cells
        // for Group + Indicator Subcomponents
        for (var k = 0; k < nrOfIndSubComps; k++) {

            currentCell = sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            // setting up formula that compares values
            var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, 'group', stepCompType)

            // adding formula
            var formula = importRange(urlDC, compCellName, isLocalImport)
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
                var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, 'opCom', stepCompType)

                var formula = importRange(urlDC, compCellName, isLocalImport)
                currentCell.setFormula(formula)

            } else {
                currentCell.setValue(' ⨯ ').setHorizontalAlignment('center')
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
                var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                var formula = importRange(urlDC, compCellName, isLocalImport)
                currentCell.setFormula(formula)

                tempCol += 1
            }
        }

        activeRow += 1
    }

    return activeRow
}


// --- // Begin Sources // --- //

function importSingleRow(activeRow, activeCol, sheet, currentStep, stepCNr, Indicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks, isLocalImport, pilotMode) {

    var stepCompType = currentStep.components[stepCNr].id

    var currentSubStepID = currentStep.subStepID
    // TODO - PILOT: adjusting substep number for Researcher Name import
    if (pilotMode) {
        currentSubStepID = currentStep.components[stepCNr].importNameFrom
    }

    Logger.log(' - ' + 'in ' + stepCompType + ' ' + Indicator.labelShort)

    if (stepCompType == "elementResults") {
        stepCompType = false
    }

    var urlDC = CompanyObj.urlCurrentDataCollectionSheet

    var tempCol = activeCol
    var currentCell = sheet.getRange(activeRow, activeCol)

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        var rowLabel = currentStep.components[stepCNr].label
        currentCell.setValue(rowLabel)
        currentCell.setWrap(true)
        tempCol += 1
    }

    var component = ""

    // result cells
    // for Group + Indicator Subcomponents
    for (var k = 0; k < nrOfIndSubComps; k++) {
        currentCell = sheet.getRange(activeRow, tempCol)

        if (nrOfIndSubComps != 1) {
            component = indicatorCat.components[k].labelShort
        }

        // setting up formula that compares values
        var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, CompanyObj.id, 'group', stepCompType)

        // adding formula
        var formula = importRange(urlDC, compCellName, isLocalImport)
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
            var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, CompanyObj.id, 'opCom', stepCompType)

            var formula = importRange(urlDC, compCellName, isLocalImport)
            currentCell.setFormula(formula)

        } else {
            currentCell.setValue(' ⨯ ').setHorizontalAlignment('center')
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
            var compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

            var formula = importRange(urlDC, compCellName, isLocalImport)
            currentCell.setFormula(formula)

            tempCol += 1
        }
    }

    activeRow += 1

    return activeRow
}

// --- // end Sources // --- //

// --- // Core function: SCORING // --- //

function addElementScores(file, sheetMode, activeRow, activeCol, sheet, currentStepLabelShort, currentStepComponent, Indicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks,fullScoring) {

    Logger.log(' - ' + "in element scoring for " + ' ' + Indicator.labelShort)

    // for cell reference between score and imported result

    var verticalDim
    if (fullScoring) {
        verticalDim = 2
    } else {
        verticalDim = 1
    }

    var scoringSuffix = "SE"
    // for each indicator.Element

    for (var elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {

        var tempCol = activeCol
        var currentCell = sheet.getRange(activeRow, tempCol)

        // row label / first Column
        // skip first Column for subsequent steps    
        if (blocks === 1) {
            var rowLabel = 'Points for ' + Indicator.elements[elemNr].labelShort
            currentCell.setValue(rowLabel.toString())
            currentCell.setWrap(true)
            tempCol += 1
        }

        var up = Indicator.elements.length * verticalDim + verticalDim

        // for each Indicator Sub Component (G: FC, PC)
        for (var k = 0; k < nrOfIndSubComps; k++) {

            // add score
            currentCell = sheet.getRange(activeRow, tempCol)
            // Formula by calculating offset --> Refactor to generic method(currentCell,)
            // Logger.log("var up: " + up)
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
            var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, 'group', scoringSuffix)
            file.setNamedRange(cellName, currentCell)
            tempCol += 1
        }

        // atomic opCom scores
        for (var k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)

            if (companyHasOpCom) {

                // Formula by calculating offset --> Refactor

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
                cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", scoringSuffix)
                file.setNamedRange(cellName, currentCell)

            } else {

                currentCell.setValue(' ⨯ ').setHorizontalAlignment('center')

            }

            tempCol += 1
        }

        // looping through the service scores

        for (var g = 0; g < CompanyObj.services.length; g++) {

            for (var k = 0; k < nrOfIndSubComps; k++) {
                currentCell = sheet.getRange(activeRow, tempCol)
                // Formula by calculating offset --> Refactor

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
                cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, scoringSuffix)
                file.setNamedRange(cellName, currentCell)
                tempCol += 1
            }

        }

        activeRow += 1
    }

    return activeRow + 1
}

// --- // Level Scoring // --- //

function addLevelScores(file, sheetMode, activeRow, activeCol, sheet, currentStepLabelShort, currentStepComponent, Indicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, indicatorCat, indyLevelScoresCompany, indyLevelScoresServices, blocks) {

    Logger.log(' - ' + "in level scoring for " + ' ' + Indicator.labelShort)
    // --- adding the level averages --- //

    var scoringSuffix = "SL"

    var currentCell = sheet.getRange(activeRow, activeCol)

    var tempCol = activeCol

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue('Level Scores')
        currentCell.setFontWeight('bold')
        tempCol += 1
    }    

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
            var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "group", "SE")
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
        var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.labelShort, component, CompanyObj.id, "group", scoringSuffix)
        file.setNamedRange(cellName, currentCell)
        indyLevelScoresCompany.push(cellName); // adding name to the formula
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
                var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", "SE")
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

            var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.labelShort, component, CompanyObj.id, "opCom", scoringSuffix)
            file.setNamedRange(cellName, currentCell)
            indyLevelScoresCompany.push(cellName)

        } else {

            currentCell.setValue(' N/A ').setHorizontalAlignment('center')

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
                var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, "SE")
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

            var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, scoringSuffix)

            file.setNamedRange(cellName, currentCell)

            indyLevelScoresServices.push(cellName)

            tempCol += 1
        }
    }
    return activeRow + 1
}

function addCompositeScores(file, sheetMode, activeRow, activeCol, sheet, currentStepLabelShort, Indicator, CompanyObj, nrOfIndSubComps, indyLevelScoresCompany, indyLevelScoresServices, indyCompositeScores, blocks) {

    Logger.log(' - ' + "in composite scoring for " + Indicator.labelShort)

    var scoringSuffix = "SC"

    activeRow += 1

    var currentCell = sheet.getRange(activeRow, activeCol)

    var tempCol = activeCol

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue('Composite Scores')
        currentCell.setFontWeight('bold')
        tempCol += 1
    }    

    // --- Composite Company --- //

    var scoringComponent = "A"
    currentCell = sheet.getRange(activeRow, tempCol)
    currentCell.setFormula(compositeScoreFormula(indyLevelScoresCompany))

    var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.labelShort, scoringComponent, CompanyObj.id, "", scoringSuffix)
    file.setNamedRange(cellName, currentCell)

    // apply scoring Logic
    currentCell = checkScoringLogic(Indicator, scoringComponent, currentCell, cellName, indyCompositeScores)

    Logger.log(' - ' + "composite company score added for " + Indicator.labelShort)

    // --- Composite Services --- //

    scoringComponent = "B"

    var servicesCompositeCell = sheet.getRange(activeRow, tempCol + (2 * nrOfIndSubComps)) // 2 := group + opCom cols

    servicesCompositeCell.setFormula(compositeScoreFormula(indyLevelScoresServices))

    cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.labelShort, scoringComponent, CompanyObj.id, "", scoringSuffix)

    file.setNamedRange(cellName, servicesCompositeCell)
    // apply scoring Logic
    currentCell = checkScoringLogic(Indicator, scoringComponent, servicesCompositeCell, cellName, indyCompositeScores)

    Logger.log(' - ' + "composite services score added for " + Indicator.labelShort)

    return activeRow + 1
}

function addIndicatorScore(file, sheetMode, activeRow, activeCol, sheet, currentStepLabelShort, Indicator, CompanyObj, indyCompositeScores, blocks) {

    Logger.log(' - ' + "in indicator scoring for " + ' ' + Indicator.labelShort)

    var scoringSuffix = "SI"

    activeRow += 1

    var currentCell = sheet.getRange(activeRow, activeCol)

    var tempCol = activeCol

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue("Indicator Score")
        currentCell.setFontWeight('bold')
        tempCol += 1
    }  

    currentCell = sheet.getRange(activeRow, tempCol)

    Logger.log(' - ' + "Indicator Scoring Ranges - indyCompositeScores[]:\n --- " + indyCompositeScores)

    currentCell.setFormula(indicatorScoreFormula(indyCompositeScores))

    currentCell.setFontWeight('bold')
    currentCell.setNumberFormat("0.##")

    // naming the level cell score
    var component = ""

    var cellName = defineNamedRangeStringImport(indexPrefix, sheetMode, currentStepLabelShort, Indicator.labelShort, component, CompanyObj.id, "", scoringSuffix)

    file.setNamedRange(cellName, currentCell)

    // --- INDICATOR END --- //

    return activeRow + 1
}
