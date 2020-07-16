// ---------------------HELPER FUNCTIONS---------------------------------------------

function setScoringSheetHeader(activeRow, activeCol, sheet, companyShortName, thisSubStepLabel, blocks) {

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

    sheet.setFrozenRows(1)

    return activeRow + 1
}

// --- BEGIN setScoringCompanyHeader() --- //
function setScoringCompanyHeader(activeRow, activeCol, sheet, Indicator, nrOfIndSubComps, indicatorCat, companyObj, blocks) {

    Logger.log(" - " + "in company header " + Indicator.labelShort)

    var currentCell = sheet.getRange(activeRow, activeCol)
    var columnLabel

    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue(Indicator.labelShort)
            .setBackground(indicatorCat.classColor)
            .setFontWeight("bold")
            .setVerticalAlignment("middle")
            .setHorizontalAlignment("center")
        activeCol += 1
    }

    // --- // Company Elements // --- //

    // group 
    var thisColor = "#d9d9d9" // grey TODO: outsource to Config

    for (var g = 0; g < nrOfIndSubComps; g++) {
        currentCell = sheet.getRange(activeRow, activeCol)
        columnLabel = "Group\n" + companyObj.label.current

        if (nrOfIndSubComps > 1) {
            columnLabel = columnLabel + "\n" + indicatorCat.components[g].labelLong
        }

        currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

        activeCol += 1
    }

    // opcom
    for (var g = 0; g < nrOfIndSubComps; g++) {
        currentCell = sheet.getRange(activeRow, activeCol)
        columnLabel = "OperatingCo\n"

        if (companyObj.hasOpCom == true) {
            columnLabel = columnLabel + companyObj.opComLabel
        } else {
            columnLabel = columnLabel + " N/A "
        }

        if (nrOfIndSubComps > 1) {
            columnLabel = columnLabel + "\n" + indicatorCat.components[g].labelLong
        }

        currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

        activeCol += 1
    }

    // --- // --- Services --- // --- //
    for (var s = 0; s < companyObj.services.length; s++) {
        for (var g = 0; g < nrOfIndSubComps; g++) {
            currentCell = sheet.getRange(activeRow, activeCol)
            columnLabel = companyObj.services[s].label.current

            if (nrOfIndSubComps > 1) {
                columnLabel = columnLabel + "\n" + indicatorCat.components[g].labelLong
            }

            currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

            activeCol += 1
        }
    }
    return activeRow + 1
}

// generic : imports both,element level evaluation results and comments
function importElementBlock(activeRow, activeCol, sheet, StepComp, thisSubStepID, Indicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks, integrateOutputs) {

    var stepCompID = StepComp.id

    var firstRow = activeRow
    var firstCol = activeCol + 1

    Logger.log("Element Data Type: " + stepCompID)

    Logger.log(" - " + "in " + StepComp.type + " " + Indicator.labelShort)

    var urlDC = CompanyObj.urlCurrentDataCollectionSheet

    // for each element
    for (var elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {

        var tempCol = activeCol
        var currentCell = sheet.getRange(activeRow, tempCol)

        // row label / first Column
        // skip first Column for subsequent steps    
        if (blocks === 1) {
            var rowLabel = StepComp.rowLabel + Indicator.elements[elemNr].labelShort
            currentCell.setBackground("#FFFFFF")
            currentCell.setFontWeight("normal")
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
            var compCellName = defineNamedRange(indexPrefix, "DC", thisSubStepID, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "group", stepCompID)

            // adding formula
            var formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            currentCell.setFormula(formula)
            currentCell.setBackground("#FFFFFF")
            currentCell.setFontWeight("normal")
            tempCol += 1
        }

        // for opCom + Indicator Subcomponents
        for (var k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)
            currentCell.setBackground("#FFFFFF")
            currentCell.setFontWeight("normal")


            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            if (companyHasOpCom) {
                // setting up formula that compares values
                var compCellName = defineNamedRange(indexPrefix, "DC", thisSubStepID, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", stepCompID)

                var formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
                currentCell.setFormula(formula)

            } else {
                currentCell.setValue(" ⨯ ").setHorizontalAlignment("center")
            }
            tempCol += 1
        }

        // for n Services + Indicator Subcomponents
        for (var s = 0; s < CompanyObj.services.length; s++) {

            for (k = 0; k < nrOfIndSubComps; k++) {
                currentCell = sheet.getRange(activeRow, tempCol)

                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }

                // setting up formula that compares values
                var compCellName = defineNamedRange(indexPrefix, "DC", thisSubStepID, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[s].id, stepCompID)

                var formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
                currentCell.setFormula(formula)
                currentCell.setBackground("#FFFFFF")
                currentCell.setFontWeight("normal")

                tempCol += 1
            }
        }

        activeRow += 1
    }

    var thisBlock = sheet.getRange(firstRow, firstCol, activeRow - firstRow, tempCol - firstCol)

    // for debugging blocks

    // if (StepComp.clipWrap) {
    //     thisBlock.setBackground("red")
    //     thisBlock.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)
    // } else {
    //     thisBlock.setBackground("green")
    //     thisBlock.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
    // }
    thisBlock.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)

    return activeRow
}


// --- // Begin Sources // --- //

function importElementRow(activeRow, activeCol, sheet, StepComp, thisSubStepID, Indicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks, integrateOutputs, isPilotMode) {

    var stepCompID = StepComp.id

    var currentSubStepID = thisSubStepID
    // TODO - PILOT: adjusting substep number for Researcher Name import
    if (isPilotMode) {
        currentSubStepID = StepComp.importNameFrom
    }

    Logger.log(" - " + "in " + stepCompID + " " + Indicator.labelShort)

    if (stepCompID == "results") {
        stepCompID = false
    }

    var urlDC = CompanyObj.urlCurrentDataCollectionSheet

    var tempCol = activeCol
    var currentCell = sheet.getRange(activeRow, activeCol)

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        var rowLabel = StepComp.rowLabel
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
        var compCellName = defineNamedRange(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, CompanyObj.id, "group", stepCompID)

        // adding formula
        var formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
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
            var compCellName = defineNamedRange(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, CompanyObj.id, "opCom", stepCompID)

            var formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            currentCell.setFormula(formula)

        } else {
            currentCell.setValue(" ⨯ ").setHorizontalAlignment("center")
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
            var compCellName = defineNamedRange(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompID)

            var formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            currentCell.setFormula(formula)

            tempCol += 1
        }
    }

    activeRow += 1

    return activeRow
}

// --- // end Sources // --- //

// --- // Core function: SCORING // --- //

function addElementScores(SS, sheetModeID, activeRow, activeCol, sheet, currentStepLabelShort, currentStepComponent, Indicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks, hasFullScores) {

    Logger.log(" - " + "in element scoring for " + " " + Indicator.labelShort)

    // for cell reference between score and imported result

    var verticalDim
    if (hasFullScores) {
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
            var rowLabel = "Points for " + Indicator.elements[elemNr].labelShort
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
            var cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "group", scoringSuffix)
            SS.setNamedRange(cellName, currentCell)
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
                cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", scoringSuffix)
                SS.setNamedRange(cellName, currentCell)

            } else {

                currentCell.setValue(" ⨯ ").setHorizontalAlignment("center")

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
                cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, scoringSuffix)
                SS.setNamedRange(cellName, currentCell)
                tempCol += 1
            }

        }

        activeRow += 1
    }

    return activeRow + 1
}

// --- // Level Scoring // --- //

function addLevelScores(SS, sheetModeID, activeRow, activeCol, sheet, currentStepLabelShort, currentStepComponent, Indicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, indicatorCat, indyLevelScoresCompany, indyLevelScoresServices, blocks) {

    Logger.log(" - " + "in level scoring for " + " " + Indicator.labelShort)
    // --- adding the level averages --- //

    var scoringSuffix = "SL"

    var currentCell = sheet.getRange(activeRow, activeCol)

    var tempCol = activeCol

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue("Level Scores")
        currentCell.setFontWeight("bold")
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
            var cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "group", "SE")
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
        var cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, component, CompanyObj.id, "group", scoringSuffix)
        SS.setNamedRange(cellName, currentCell)
        indyLevelScoresCompany.push(cellName) // adding name to the formula
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
                var cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", "SE")
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

            var cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, component, CompanyObj.id, "opCom", scoringSuffix)
            SS.setNamedRange(cellName, currentCell)
            indyLevelScoresCompany.push(cellName)

        } else {

            currentCell.setValue(" N/A ").setHorizontalAlignment("center")

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
                var cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, "SE")
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

            var cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, scoringSuffix)

            SS.setNamedRange(cellName, currentCell)

            indyLevelScoresServices.push(cellName)

            tempCol += 1
        }
    }
    return activeRow + 1
}

function addCompositeScores(SS, sheetModeID, activeRow, activeCol, sheet, currentStepLabelShort, Indicator, CompanyObj, nrOfIndSubComps, indyLevelScoresCompany, indyLevelScoresServices, indyCompositeScores, blocks) {

    Logger.log(" - " + "in composite scoring for " + Indicator.labelShort)

    var scoringSuffix = "SC"

    activeRow += 1

    var currentCell = sheet.getRange(activeRow, activeCol)

    var tempCol = activeCol

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue("Composite Scores")
        currentCell.setFontWeight("bold")
        tempCol += 1
    }

    // --- Composite Company --- //

    var scoringComponent = "A"
    currentCell = sheet.getRange(activeRow, tempCol)
    currentCell.setFormula(aggregateScoreFormula(indyLevelScoresCompany))

    var cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, scoringComponent, CompanyObj.id, "", scoringSuffix)
    SS.setNamedRange(cellName, currentCell)

    // apply scoring Logic
    currentCell = checkScoringLogic(Indicator, scoringComponent, currentCell, cellName, indyCompositeScores)

    Logger.log(" - " + "composite company score added for " + Indicator.labelShort)

    // --- Composite Services --- //

    scoringComponent = "B"

    var servicesCompositeCell = sheet.getRange(activeRow, tempCol + (2 * nrOfIndSubComps)) // 2 := group + opCom cols

    servicesCompositeCell.setFormula(aggregateScoreFormulaServices(indyLevelScoresServices,CompanyObj))

    cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, scoringComponent, CompanyObj.id, "", scoringSuffix)

    SS.setNamedRange(cellName, servicesCompositeCell)
    // apply scoring Logic
    currentCell = checkScoringLogic(Indicator, scoringComponent, servicesCompositeCell, cellName, indyCompositeScores)

    currentCell.setFontStyle("normal")

    Logger.log(" - " + "composite services score added for " + Indicator.labelShort)

    return activeRow + 1
}

function addIndicatorScore(SS, sheetModeID, activeRow, activeCol, sheet, currentStepLabelShort, Indicator, CompanyObj, indyCompositeScores, blocks) {

    Logger.log(" - " + "in indicator scoring for " + " " + Indicator.labelShort)

    var scoringSuffix = "SI"

    activeRow += 1

    var currentCell = sheet.getRange(activeRow, activeCol)

    var tempCol = activeCol

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue("Indicator Score")
        currentCell.setFontWeight("bold")
        tempCol += 1
    }

    currentCell = sheet.getRange(activeRow, tempCol)

    Logger.log(" - " + "Indicator Scoring Ranges - indyCompositeScores[]:\n --- " + indyCompositeScores)

    if (Indicator.scoringScope=="group") {
        var cellName1 = cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, "A", CompanyObj.id, "", "SC")

        currentCell.setFormula("="+cellName1)

        Logger.log("in group, cellName1:"+cellName1)
    }

    else{
        currentCell.setFormula(aggregateScoreFormula(indyCompositeScores))
    }
    currentCell.setFontStyle("normal")
    currentCell.setFontWeight("bold")
    currentCell.setNumberFormat("0.##")


    // naming the level cell score
    var component = ""

    var cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, component, CompanyObj.id, "", scoringSuffix)

    SS.setNamedRange(cellName, currentCell)

    // --- INDICATOR END --- //

    return activeRow + 1
}