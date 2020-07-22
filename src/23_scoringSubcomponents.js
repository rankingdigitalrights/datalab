// --- Scoring HELPER FUNCTIONS --- //

/* global
    indexPrefix,
    defineNamedRange,
    styleScoringIndicatorHeader,
    importRangeFormula,
    elementScoreFormula,
    levelScoreFormula,
    aggregateScoreFormula,
    applyCompositeScoringLogic
*/
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

    console.log("|--- company header " + Indicator.labelShort)

    let currentCell = sheet.getRange(activeRow, activeCol)
    let columnLabel

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
    let thisColor = "#d9d9d9" // grey TODO: outsource to Config

    for (let g = 0; g < nrOfIndSubComps; g++) {
        currentCell = sheet.getRange(activeRow, activeCol)
        columnLabel = "Group\n" + companyObj.label.current

        if (nrOfIndSubComps > 1) {
            columnLabel = columnLabel + "\n" + indicatorCat.components[g].labelLong
        }

        currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

        activeCol += 1
    }

    // opcom
    for (let g = 0; g < nrOfIndSubComps; g++) {
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
    for (let s = 0; s < companyObj.services.length; s++) {
        for (let g = 0; g < nrOfIndSubComps; g++) {
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
function importElementBlock(activeRow, activeCol, sheet, StepComp, thisSubStepID, Indicator, Company, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks, integrateOutputs) {

    let stepCompID = StepComp.id

    let firstRow = activeRow
    let firstCol = activeCol + 1

    let tempCol
    let component = ""
    let rowLabel, currentCell, compCellName, formula
    console.log("Element Data Type: " + stepCompID)

    console.log(" - " + "in " + StepComp.type + " " + Indicator.labelShort)

    let urlDC = Company.urlCurrentDataCollectionSheet

    // for each element
    for (let elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {

        tempCol = activeCol
        currentCell = sheet.getRange(activeRow, tempCol)

        // row label / first Column
        // skip first Column for subsequent steps    
        if (blocks === 1) {
            rowLabel = StepComp.rowLabel + Indicator.elements[elemNr].labelShort
            currentCell.setBackground("#FFFFFF")
            currentCell.setFontWeight("normal")
            currentCell.setValue(rowLabel.toString())
            currentCell.setWrap(true)
            tempCol += 1
        }

        // result cells
        // for Group + Indicator Subcomponents
        for (let k = 0; k < nrOfIndSubComps; k++) {

            currentCell = sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            // setting up formula that compares values
            compCellName = defineNamedRange(indexPrefix, "DC", thisSubStepID, Indicator.elements[elemNr].labelShort, component, Company.id, "group", stepCompID)

            // adding formula
            formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            currentCell.setFormula(formula)
            currentCell.setBackground("#FFFFFF")
            currentCell.setFontWeight("normal")
            tempCol += 1
        }

        // for opCom + Indicator Subcomponents
        for (let k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)
            currentCell.setBackground("#FFFFFF")
            currentCell.setFontWeight("normal")


            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            if (companyHasOpCom) {
                // setting up formula that compares values
                compCellName = defineNamedRange(indexPrefix, "DC", thisSubStepID, Indicator.elements[elemNr].labelShort, component, Company.id, "opCom", stepCompID)

                formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
                currentCell.setFormula(formula)

            } else {
                currentCell.setValue(" ⨯ ").setHorizontalAlignment("center")
            }
            tempCol += 1
        }

        // for n Services + Indicator Subcomponents
        for (let s = 0; s < Company.services.length; s++) {

            for (let k = 0; k < nrOfIndSubComps; k++) {
                currentCell = sheet.getRange(activeRow, tempCol)

                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }

                // setting up formula that compares values
                compCellName = defineNamedRange(indexPrefix, "DC", thisSubStepID, Indicator.elements[elemNr].labelShort, component, Company.id, Company.services[s].id, stepCompID)

                formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
                currentCell.setFormula(formula)
                currentCell.setBackground("#FFFFFF")
                currentCell.setFontWeight("normal")

                tempCol += 1
            }
        }

        activeRow += 1
    }

    let thisBlock = sheet.getRange(firstRow, firstCol, activeRow - firstRow, tempCol - firstCol)

    thisBlock.setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.DOTTED)

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

function importElementRow(activeRow, activeCol, sheet, StepComp, thisSubStepID, Indicator, Company, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks, integrateOutputs, isPilotMode) {

    let stepCompID = StepComp.id

    let currentSubStepID = thisSubStepID
    // TODO - PILOT: adjusting substep number for Researcher Name import
    if (isPilotMode) {
        currentSubStepID = StepComp.importNameFrom
    }

    console.log(" - " + "in " + stepCompID + " " + Indicator.labelShort)

    if (stepCompID == "results") {
        stepCompID = false
    }

    let urlDC = Company.urlCurrentDataCollectionSheet

    let tempCol = activeCol
    let currentCell = sheet.getRange(activeRow, activeCol)
    let component = ""
    let rowLabel, compCellName, formula

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        let rowLabel = StepComp.rowLabel
        currentCell.setValue(rowLabel)
        currentCell.setWrap(true)
        tempCol += 1
    }

    // result cells
    // for Group + Indicator Subcomponents
    for (let k = 0; k < nrOfIndSubComps; k++) {
        currentCell = sheet.getRange(activeRow, tempCol)

        if (nrOfIndSubComps != 1) {
            component = indicatorCat.components[k].labelShort
        }

        // setting up formula that compares values
        compCellName = defineNamedRange(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, "group", stepCompID)

        // adding formula
        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
        currentCell.setFormula(formula)
        tempCol += 1
    }

    // for opCom + Indicator Subcomponents
    for (let k = 0; k < nrOfIndSubComps; k++) {
        currentCell = sheet.getRange(activeRow, tempCol)

        if (nrOfIndSubComps != 1) {
            component = indicatorCat.components[k].labelShort
        }

        if (companyHasOpCom) {
            // setting up formula that compares values
            compCellName = defineNamedRange(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, "opCom", stepCompID)

            formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            currentCell.setFormula(formula)

        } else {
            currentCell.setValue(" ⨯ ").setHorizontalAlignment("center")
        }
        tempCol += 1
    }

    // for n Services + Indicator Subcomponents
    for (let g = 0; g < Company.services.length; g++) {

        for (let k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            // setting up formula that compares values
            compCellName = defineNamedRange(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, Company.services[g].id, stepCompID)

            formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            currentCell.setFormula(formula)

            tempCol += 1
        }
    }

    activeRow += 1

    return activeRow
}

// --- // end Sources // --- //

// --- // Core function: SCORING // --- //

function addElementScores(SS, sheetModeID, activeRow, activeCol, sheet, currentStepLabelShort, currentStepComponent, Indicator, Company, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks, hasFullScores) {

    console.log(" - " + "in element scoring for " + " " + Indicator.labelShort)

    // for cell reference between score and imported result

    let verticalDim
    if (hasFullScores) {
        verticalDim = 2
    } else {
        verticalDim = 1
    }

    let tempCol
    let component = ""
    let rowLabel, currentCell, cellName, compCellName, formula
    let range, elementScore

    let scoringSuffix = "SE"
    // for each indicator.Element

    for (let elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {

        tempCol = activeCol
        currentCell = sheet.getRange(activeRow, tempCol)

        // row label / first Column
        // skip first Column for subsequent steps    
        if (blocks === 1) {
            rowLabel = "Points for " + Indicator.elements[elemNr].labelShort
            currentCell.setValue(rowLabel.toString())
            currentCell.setWrap(true)
            tempCol += 1
        }

        let up = Indicator.elements.length * verticalDim + verticalDim

        // for each Indicator Sub Component (G: FC, PC)
        for (let k = 0; k < nrOfIndSubComps; k++) {

            // add score
            currentCell = sheet.getRange(activeRow, tempCol)
            // Formula by calculating offset --> Refactor to generic method(currentCell,)
            // console.log("let up: " + up)
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
            cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, Company.id, "group", scoringSuffix)
            SS.setNamedRange(cellName, currentCell)
            tempCol += 1
        }

        // atomic opCom scores
        for (let k = 0; k < nrOfIndSubComps; k++) {
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
                cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, Company.id, "opCom", scoringSuffix)
                SS.setNamedRange(cellName, currentCell)

            } else {

                currentCell.setValue(" ⨯ ").setHorizontalAlignment("center")

            }

            tempCol += 1
        }

        // looping through the service scores

        for (let g = 0; g < Company.services.length; g++) {

            for (let k = 0; k < nrOfIndSubComps; k++) {
                currentCell = sheet.getRange(activeRow, tempCol)
                // Formula by calculating offset --> Refactor

                range = sheet.getRange(activeRow - up, tempCol)
                // currentCell.setValue(range.getA1Notation())
                // let elementScore = '=LEN(' + range.getA1Notation() + ')'
                elementScore = elementScoreFormula(range)
                currentCell.setFormula(elementScore)
                currentCell.setNumberFormat("0.##")
                // cell name formula; output defined in 44_rangeNamingHelper.js
                component = ""
                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }
                cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.elements[elemNr].labelShort, component, Company.id, Company.services[g].id, scoringSuffix)
                SS.setNamedRange(cellName, currentCell)
                tempCol += 1
            }

        }

        activeRow += 1
    }

    return activeRow + 1
}

// --- // Level Scoring // --- //

function addLevelScores(SS, sheetModeID, activeRow, activeCol, sheet, currentStepLabelShort, currentStepComponent, Indicator, Company, companyHasOpCom, nrOfIndSubComps, indicatorCat, levelScoresCompany, levelScoresServices, levelScoresMobile, blocks) {

    console.log(" - " + "in level scoring for " + " " + Indicator.labelShort)
    // --- adding the level averages --- //

    let scoringSuffix = "SL"

    let currentCell = sheet.getRange(activeRow, activeCol)

    let tempCol = activeCol
    let component, cellName, levelFormula

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue("Level Scores")
        currentCell.setFontWeight("bold")
        tempCol += 1
    }

    let indyLabel = Indicator.labelShort
    let Elements = Indicator.elements
    let elementsLength = Elements.length
    let Element, elementLabel

    let Services = Company.services
    let servicesLength = Services.length
    let Service, serviceId

    let companyId = Company.id

    // --- Level Average Scores --- //

    // Company Components //

    // Group AVERAGE

    for (let k = 0; k < nrOfIndSubComps; k++) {

        currentCell = sheet.getRange(activeRow, tempCol)
        let serviceCells = []

        for (let elemNr = 0; elemNr < elementsLength; elemNr++) {

            Element = Elements[elemNr]
            elementLabel = Element.labelShort

            component = ""

            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, elementLabel, component, companyId, "group", "SE")

            serviceCells.push(cellName)
        }

        levelFormula = levelScoreFormula(serviceCells)
        currentCell.setFormula(levelFormula)
        currentCell.setNumberFormat("0.##")
        // naming the group level cell score
        component = ""
        if (nrOfIndSubComps != 1) {
            component = indicatorCat.components[k].labelShort
        }
        cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, indyLabel, component, companyId, "group", scoringSuffix)

        SS.setNamedRange(cellName, currentCell)

        levelScoresCompany.push(cellName) // adding name to the formula

        tempCol += 1
    }

    // OpCom AVERAGE

    for (let k = 0; k < nrOfIndSubComps; k++) {

        currentCell = sheet.getRange(activeRow, tempCol)

        if (companyHasOpCom) {
            let serviceCells = []

            for (let elemNr = 0; elemNr < elementsLength; elemNr++) {
                Element = Elements[elemNr]
                elementLabel = Element.labelShort

                // finding the cell names that are used in calculating a company specific average
                component = ""
                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }
                cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, elementLabel, component, companyId, "opCom", "SE")
                if (companyHasOpCom == true) {
                    serviceCells.push(cellName)
                }
            }

            levelFormula = levelScoreFormula(serviceCells)
            currentCell.setFormula(levelFormula)
            currentCell.setNumberFormat("0.##")
            // naming the opCom level cell score
            component = ""
            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, indyLabel, component, companyId, "opCom", scoringSuffix)
            SS.setNamedRange(cellName, currentCell)
            levelScoresCompany.push(cellName)

        } else {

            currentCell.setValue(" N/A ").setHorizontalAlignment("center")

        }
        tempCol += 1
    }

    // --- SERVICES --- //
    // iterate over services
    for (let s = 0; s < servicesLength; s++) {

        Service = Services[s]
        serviceId = Service.id

        for (let k = 0; k < nrOfIndSubComps; k++) {

            currentCell = sheet.getRange(activeRow, tempCol)

            let serviceCells = []

            for (let elemNr = 0; elemNr < elementsLength; elemNr++) {

                Element = Elements[elemNr]
                elementLabel = Element.labelShort

                component = ""

                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }

                cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, elementLabel, component, companyId, serviceId, "SE")

                serviceCells.push(cellName)
            }

            levelFormula = levelScoreFormula(serviceCells)
            currentCell.setFormula(levelFormula)
            currentCell.setNumberFormat("0.##")

            // naming the service level cell score
            component = ""
            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, indyLabel, component, companyId, serviceId, scoringSuffix)

            SS.setNamedRange(cellName, currentCell)

            // TODO: if else push subtype
            if (Service.type === "mobile") {
                levelScoresMobile.push(cellName)
            } else {
                levelScoresServices.push(cellName)
            }

            tempCol += 1
        }
    }
    return activeRow + 1
}

function addCompositeScores(SS, sheetModeID, activeRow, activeCol, sheet, currentStepLabelShort, Indicator, Company, nrOfIndSubComps, levelScoresCompany, levelScoresServices, levelScoresMobile, CompositeScoreCells, blocks) {

    let addMobileComposite = levelScoresMobile.length > 0 ? true : false

    let serviceCompositesNr = addMobileComposite ? 2 : 1

    console.log("|--- composite scores for " + Indicator.labelShort)

    let scoringSuffix = "SC"

    activeRow += 1

    let currentCell = sheet.getRange(activeRow, activeCol)

    let tempCol = activeCol

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        currentCell.setValue("Composite Scores")
        currentCell.setFontWeight("bold")
        tempCol += 1
    }

    // --- Composite Company --- //

    let scoringComponent = "C"

    currentCell = sheet.getRange(activeRow, tempCol)
    currentCell.setFormula(aggregateScoreFormula(levelScoresCompany))

    let cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, scoringComponent, Company.id, "", scoringSuffix)
    SS.setNamedRange(cellName, currentCell)

    // apply scoring Logic
    currentCell = applyCompositeScoringLogic(Indicator, scoringComponent, currentCell, cellName, CompositeScoreCells)

    console.log(" - " + "composite company score added for " + Indicator.labelShort)

    // --- Composite Services --- //

    // Pre/Postpaid Mobile Composite Logic added //

    let levelScoreCells, Cell

    for (let comp = 0; comp < serviceCompositesNr; comp++) {

        scoringComponent = addMobileComposite && comp === 0 ? "M" : "S"

        levelScoreCells = scoringComponent === "M" ? levelScoresMobile : levelScoresServices

        let columnNr = tempCol + (2 * nrOfIndSubComps) + (2 * comp)
        Cell = sheet.getRange(activeRow, columnNr) // 2 := group + opCom cols

        Cell.setFormula(aggregateScoreFormula(levelScoreCells))

        cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, scoringComponent, Company.id, "", scoringSuffix)

        SS.setNamedRange(cellName, Cell)
        // apply scoring Logic
        Cell = applyCompositeScoringLogic(Indicator, scoringComponent, Cell, cellName, CompositeScoreCells)

        // Cell.setFontStyle("normal")
    }

    console.log(" - " + "composite services score added for " + Indicator.labelShort)
    console.log("|--- have CompositeScoreCells")
    console.log(CompositeScoreCells)

    return activeRow + 1
}

function addIndicatorScore(SS, sheetModeID, activeRow, activeCol, sheet, currentStepLabelShort, Indicator, Company, CompositeScoreCells, blocks) {

    console.log("|--- INDICATOR score for " + " " + Indicator.labelShort)

    activeRow += 1

    let scoringSuffix = "SI"

    let cellName
    let Cell = sheet.getRange(activeRow, activeCol)

    let tempCol = activeCol

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        Cell.setValue("Indicator Score")
        Cell.setFontWeight("bold")
        tempCol += 1
    }

    Cell = sheet.getRange(activeRow, tempCol)

    console.log(" - " + "Indicator Scoring Ranges - CompositeScoreCells[]:\n --- " + CompositeScoreCells)


    Cell.setFormula(aggregateScoreFormula(CompositeScoreCells))

    Cell.setFontStyle("normal")
    Cell.setFontWeight("bold")
    Cell.setNumberFormat("0.##")

    let component = ""

    cellName = defineNamedRange(indexPrefix, sheetModeID, currentStepLabelShort, Indicator.labelShort, component, Company.id, "", scoringSuffix)

    SS.setNamedRange(cellName, Cell)

    // --- INDICATOR END --- //

    return activeRow + 1
}
