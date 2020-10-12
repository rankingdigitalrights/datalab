// --- Scoring HELPER FUNCTIONS --- //

/* global
    defineNamedRange, styleScoringIndicatorHeader, importRangeFormula, elementScoreFormula, levelScoreFormula, aggregateScoreFormula, applyCompositeScoringLogic
*/

// eslint-disable-next-line no-unused-vars
function setScoringSheetHeader(activeRow, activeCol, Sheet, Company, companyShortName, MainStep, mainStepNr, subStepID, blocks,yoy) {

    // -- // add Step Header to top-left cell // -- //
    // TODO: refactor to components

    let stepSuffix=yoy&&mainStepNr!="S0"?" Adjusted":""

    if (blocks == 1) {
        Sheet.getRange(activeRow, activeCol)
            .setValue(companyShortName)
            .setFontWeight("bold")
            .setBackground("#b7e1cd")
            .setFontSize(14)
            .setNote(`Company Type: ${Company.type}`)
        Sheet.setColumnWidth(activeCol, 200)
        activeCol += 1
        
    }

    

    let stepLabel = mainStepNr

    if (MainStep.altYear) {
        stepLabel += ` - ${MainStep.altYear}`
    }

    stepLabel += ` (${subStepID})`

    Sheet.getRange(activeRow, activeCol)
        .setValue(stepLabel+stepSuffix)
        .setFontWeight("bold")
        .setFontSize(14)

    Sheet.setFrozenRows(1)

    return activeRow + 1
}

// --- BEGIN setScoringCompanyHeader() --- //
// eslint-disable-next-line no-unused-vars
function setScoringCompanyHeader(activeRow, activeCol, Sheet, Indicator, nrOfIndSubComps, Category, Company, blocks) {

    console.log("|--- company header " + Indicator.labelShort)

    let Cell = Sheet.getRange(activeRow, activeCol)
    let columnLabel
    let color = "#d9d9d9" // grey TODO: outsource to Config

    // skip first Column for subsequent steps    
    if (blocks === 1) {
        Cell.setValue(Indicator.labelShort)
            .setNote(`${Indicator.labelShort}: ${Indicator.labelLong}\n\n${Indicator.description}`)
            .setBackground(Category.classColor)
            .setFontWeight("bold")
            .setVerticalAlignment("middle")
            .setHorizontalAlignment("center")
            .setFontSize(14)
        activeCol += 1
    }

    // --- // Company Elements // --- //

    // group 

    color = "#fff2cc"

    for (let g = 0; g < nrOfIndSubComps; g++) {
        Cell = Sheet.getRange(activeRow, activeCol)
        columnLabel = "Group\n" + Company.label.current

        if (nrOfIndSubComps > 1) {
            columnLabel = columnLabel + "\n" + Category.components[g].labelLong
        }

        Cell = styleScoringIndicatorHeader(Cell, columnLabel, color)

        activeCol += 1
    }

    // opcom
    for (let g = 0; g < nrOfIndSubComps; g++) {
        Cell = Sheet.getRange(activeRow, activeCol)
        columnLabel = "OperatingCo\n"

        if (Company.hasOpCom == true) {
            columnLabel = columnLabel + Company.opComLabel
        } else {
            columnLabel = columnLabel + " N/A "
        }

        if (nrOfIndSubComps > 1) {
            columnLabel = columnLabel + "\n" + Category.components[g].labelLong
        }

        Cell = styleScoringIndicatorHeader(Cell, columnLabel, color)

        activeCol += 1
    }

    // --- // --- Services --- // --- //

    color = "#b7e1cd"
    let Service
    for (let s = 0; s < Company.services.length; s++) {

        Service = Company.services[s]
        for (let g = 0; g < nrOfIndSubComps; g++) {
            Cell = Sheet.getRange(activeRow, activeCol)
            columnLabel = `${Service.label.current}`

            if (nrOfIndSubComps > 1) {
                columnLabel = columnLabel + "\n" + Category.components[g].labelLong
            }

            Cell = styleScoringIndicatorHeader(Cell, columnLabel, color)

            activeCol += 1
        }
    }
    return activeRow + 1
}

// generic : imports both,element level evaluation results and comments
// eslint-disable-next-line no-unused-vars

function importElementBlock(activeRow, activeCol, Sheet, StepComp, subStepID, Indicator, Company, companyHasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs, indexPref) {

    let stepCompID = StepComp.id

    let firstRow = activeRow

    let tempCol
    let component = ""
    let rowLabel, Cell, compCellName, formula
    console.log("Element Data Type: " + stepCompID)

    console.log(" - " + "in " + StepComp.type + " " + Indicator.labelShort)

    let urlDC = Company.urlCurrentDataCollectionSheet

    let Elements, Element, notestring
    Elements = Indicator.elements

    // for each element
    for (let elemNr = 0; elemNr < Elements.length; elemNr++) {

        Element = Elements[elemNr]
        notestring = Element.labelShort + ": " + Element.description

        tempCol = activeCol
        Cell = Sheet.getRange(activeRow, tempCol)

        // row label / first Column
        // skip first Column for subsequent steps    
        if (blocks === 1) {
            rowLabel = StepComp.rowLabel + Indicator.elements[elemNr].labelShort
            Cell.setBackground("#FFFFFF")
                .setFontWeight("normal")
                .setValue(rowLabel.toString())
                .setWrap(true)

            if (stepCompID === "R") {
                Cell.setNote(notestring)
            }

            tempCol += 1
        }

        // result cells
        // for Group + Indicator Subcomponents
        for (let k = 0; k < nrOfIndSubComps; k++) {

            Cell = Sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = Category.components[k].labelShort
            }

            // setting up formula that compares values
            compCellName = defineNamedRange(indexPref, "DC", subStepID, Indicator.elements[elemNr].labelShort, component, Company.id, "group", stepCompID)

            // adding formula
            formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            Cell.setFormula(formula)
            Cell.setBackground("#FFFFFF")
            Cell.setFontWeight("normal")
            tempCol += 1
        }

        // for opCom + Indicator Subcomponents
        for (let k = 0; k < nrOfIndSubComps; k++) {
            Cell = Sheet.getRange(activeRow, tempCol)
            Cell.setBackground("#FFFFFF")
            Cell.setFontWeight("normal")


            if (nrOfIndSubComps != 1) {
                component = Category.components[k].labelShort
            }

            if (companyHasOpCom) {
                // setting up formula that compares values
                compCellName = defineNamedRange(indexPref, "DC", subStepID, Indicator.elements[elemNr].labelShort, component, Company.id, "opCom", stepCompID)

                formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
                Cell.setFormula(formula)

            } else {
                Cell.setValue("N/A").setHorizontalAlignment("center")
            }
            tempCol += 1
        }

        // for n Services + Indicator Subcomponents
        for (let s = 0; s < Company.services.length; s++) {

            for (let k = 0; k < nrOfIndSubComps; k++) {
                Cell = Sheet.getRange(activeRow, tempCol)

                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                // setting up formula that compares values
                compCellName = defineNamedRange(indexPref, "DC", subStepID, Indicator.elements[elemNr].labelShort, component, Company.id, Company.services[s].id, stepCompID)

                formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
                Cell.setFormula(formula)
                Cell.setBackground("#FFFFFF")
                Cell.setFontWeight("normal")

                tempCol += 1
            }
        }

        activeRow += 1
    }

    let Block = Sheet.getRange(firstRow, activeCol, activeRow - firstRow, tempCol - activeCol)

    Block
        .setBorder(null, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.DOTTED)
        .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)
        .setVerticalAlignment("top")

    return activeRow
}


// --- // Begin Sources // --- //
// eslint-disable-next-line no-unused-vars
function importElementRow(activeRow, activeCol, Sheet, StepComp, subStepID, Indicator, Company, companyHasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs, isPilotMode, indexPref) {

    let stepCompID = StepComp.id

    let currentSubStepID = subStepID
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
    let Cell = Sheet.getRange(activeRow, activeCol)
    let component = ""
    let compCellName, formula

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        let rowLabel = StepComp.rowLabel
        Cell.setValue(rowLabel)
        Cell.setWrap(true)
        tempCol += 1
    }

    // result cells
    // for Group + Indicator Subcomponents
    for (let k = 0; k < nrOfIndSubComps; k++) {
        Cell = Sheet.getRange(activeRow, tempCol)

        if (nrOfIndSubComps != 1) {
            component = Category.components[k].labelShort
        }

        // setting up formula that compares values
        compCellName = defineNamedRange(indexPref, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, "group", stepCompID)

        // adding formula
        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
        Cell.setFormula(formula)
        tempCol += 1
    }

    // for opCom + Indicator Subcomponents
    for (let k = 0; k < nrOfIndSubComps; k++) {
        Cell = Sheet.getRange(activeRow, tempCol)

        if (nrOfIndSubComps != 1) {
            component = Category.components[k].labelShort
        }

        if (companyHasOpCom) {
            // setting up formula that compares values
            compCellName = defineNamedRange(indexPref, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, "opCom", stepCompID)

            formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            Cell.setFormula(formula)

        } else {
            Cell.setValue("N/A").setHorizontalAlignment("center")
        }
        tempCol += 1
    }

    // for n Services + Indicator Subcomponents
    for (let g = 0; g < Company.services.length; g++) {

        for (let k = 0; k < nrOfIndSubComps; k++) {
            Cell = Sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = Category.components[k].labelShort
            }

            // setting up formula that compares values
            compCellName = defineNamedRange(indexPref, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, Company.services[g].id, stepCompID)

            formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            Cell.setFormula(formula)

            tempCol += 1
        }
    }

    activeRow += 1

    return activeRow
}

// --- // end Sources // --- //

// --- // Core function: SCORING // --- //

// eslint-disable-next-line no-unused-vars
function addElementScores(SS, sheetModeID, activeRow, activeCol, Sheet, subStepID, currentStepComponent, Indicator, Company, companyHasOpCom, nrOfIndSubComps, Category, blocks, hasFullScores, ScoreCells,yoy) {

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
    let rowLabel, Cell, cellName
    let range, elementScore

    let Element, elementLabel
    let scoringScaleReversed = false

    let scoringSuffix = "SE"
    let indexPref = ScoreCells.indexPref
    let compCellValue, rule

    let rules = Sheet.getConditionalFormatRules()

    // for each indicator.Element
    for (let elemNr = 0; elemNr < Indicator.elements.length; elemNr++) {

        Element = Indicator.elements[elemNr]
        elementLabel = Element.labelShort

        if (Element.scoringScaleReversed) {
            scoringScaleReversed = true
        }

        tempCol = activeCol
        Cell = Sheet.getRange(activeRow, tempCol)

        // row label / first Column
        // skip first Column for subsequent steps    
        if (blocks === 1) {
            rowLabel = "Points for " + Element.labelShort
            Cell.setValue(rowLabel.toString())
            Cell.setWrap(true)
            tempCol += 1
        }

        let up = Indicator.elements.length * verticalDim + verticalDim

        // for each Indicator Sub Component (G: FC, PC)
        for (let k = 0; k < nrOfIndSubComps; k++) {

            // add score
            Cell = Sheet.getRange(activeRow, tempCol)
            // Formula by calculating offset --> Refactor to generic method(Cell,)
            // console.log("let up: " + up)
            range = Sheet.getRange(activeRow - up, tempCol)
            // Cell.setValue(range.getA1Notation())


            if(yoy){
                cellName = defineNamedRange(Config.prevIndexPrefix, sheetModeID, "S07", elementLabel, component, Company.id, "group", scoringSuffix)
                compCellValue=SpreadsheetApp.openById(Company.urlCurrentCompanyScoringSheet).getRangeByName(cellName).getValue()

                if(indexPrefix!=Config.prevIndexPrefix&&compCellValue=="exclude (N/A)") {Cell.setValue("N/A")}
                
                else if (indexPrefix!=Config.prevIndexPrefix){
                    elementScore = elementScoreFormula(range, scoringScaleReversed)
                    Cell.setFormula(elementScore)

                }
                

            }


            Cell.setNumberFormat("0.##")
            


            // cell name formula; output defined in 44_rangeNamingHelper.js
            component = ""
            if (nrOfIndSubComps != 1) {
                component = Category.components[k].labelShort
            }
            cellName = defineNamedRange(indexPref, sheetModeID, subStepID, elementLabel, component, Company.id, "group", scoringSuffix)
            SS.setNamedRange(cellName, Cell)
            tempCol += 1
        }

        // atomic opCom scores
        for (let k = 0; k < nrOfIndSubComps; k++) {
            Cell = Sheet.getRange(activeRow, tempCol)

            if (companyHasOpCom) {

                // Formula by calculating offset --> Refactor

                range = Sheet.getRange(activeRow - up, tempCol)
                // Cell.setValue(range.getA1Notation())
                elementScore = elementScoreFormula(range, scoringScaleReversed)
                Cell.setFormula(elementScore)
                Cell.setNumberFormat("0.##")
                // cell name formula; output defined in 44_rangeNamingHelper.js
                component = ""
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                cellName = defineNamedRange("RDR19", sheetModeID, "S07", elementLabel, component, Company.id, "opCom", scoringSuffix)
                if(yoy&&subStepID!="S07"&&SpreadsheetApp.openById(Company.urlCurrentCompanyScoringSheet).getRangeByName(cellName).getValue()=="exclude (N/A)"){
                    Cell.setValue("N/A")
                }

                else{
                    elementScore = elementScoreFormula(range, scoringScaleReversed)
                    Cell.setFormula(elementScore)
                }

                Cell.setNumberFormat("0.##")

                cellName = defineNamedRange(indexPref, sheetModeID, subStepID, elementLabel, component, Company.id, "opCom", scoringSuffix)
                SS.setNamedRange(cellName, Cell)

            } else {

                Cell.setValue("N/A").setHorizontalAlignment("center")

            }

            tempCol += 1
        }

        // looping through the service scores

        for (let g = 0; g < Company.services.length; g++) {

            for (let k = 0; k < nrOfIndSubComps; k++) {
                Cell = Sheet.getRange(activeRow, tempCol)
                // Formula by calculating offset --> Refactor

                range = Sheet.getRange(activeRow - up, tempCol)
                // Cell.setValue(range.getA1Notation())
                // let elementScore = '=LEN(' + range.getA1Notation() + ')'
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                cellName = defineNamedRange("RDR19", sheetModeID, "S07", elementLabel, component, Company.id, Company.services[g].id, scoringSuffix)
                if(yoy&&subStepID!="S07"&&SpreadsheetApp.openById(Company.urlCurrentCompanyScoringSheet).getRangeByName(cellName).getValue()=="exclude (N/A)"){
                    Cell.setValue("N/A")
                }

                else{
                    elementScore = elementScoreFormula(range, scoringScaleReversed)
                    Cell.setFormula(elementScore)
                }

                Cell.setNumberFormat("0.##")
                // cell name formula; output defined in 44_rangeNamingHelper.js
                component = ""
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }
                cellName = defineNamedRange(indexPref, sheetModeID, subStepID, elementLabel, component, Company.id, Company.services[g].id, scoringSuffix)
                SS.setNamedRange(cellName, Cell)
                tempCol += 1
            }

        }

        activeRow += 1
    }

    //if(yoy){Sheet.setConditionalFormatRules(rules)}

    return activeRow + 1

}

// --- // Level Scoring // --- //

// eslint-disable-next-line no-unused-vars
function addLevelScores(SS, sheetModeID, activeRow, activeCol, Sheet, subStepID, Indicator, Company, companyHasOpCom, nrOfIndSubComps, Category, ScoreCells, blocks) {

    console.log(" - " + "in level scoring for " + " " + Indicator.labelShort)
    // --- adding the level averages --- //

    let scoringSuffix = "SL"
    let indexPref = ScoreCells.indexPref

    let Cell = Sheet.getRange(activeRow, activeCol)

    let tempCol = activeCol
    let component, cellName, levelFormula

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        Cell.setValue("Level Scores")
        Cell.setFontWeight("bold")
        tempCol += 1
    }

    let indyLabel = Indicator.labelShort
    let Elements = Indicator.elements
    let elementsLength = Elements.length
    let Element, elementLabel

    let Services = Company.services
    let servicesLength = Services.length
    let Service, serviceID

    let companyID = Company.id

    // --- Level Average Scores --- //

    // Company Components //

    // Group AVERAGE

    for (let k = 0; k < nrOfIndSubComps; k++) {

        Cell = Sheet.getRange(activeRow, tempCol)
        let serviceCells = []

        for (let elemNr = 0; elemNr < elementsLength; elemNr++) {

            Element = Elements[elemNr]
            elementLabel = Element.labelShort

            component = ""

            if (nrOfIndSubComps != 1) {
                component = Category.components[k].labelShort
            }

            cellName = defineNamedRange(indexPref, sheetModeID, subStepID, elementLabel, component, companyID, "group", "SE")

            serviceCells.push(cellName)
        }

        levelFormula = levelScoreFormula(serviceCells)
        Cell.setFormula(levelFormula)
        Cell.setNumberFormat("0.##")
        // naming the group level cell score
        component = ""
        if (nrOfIndSubComps != 1) {
            component = Category.components[k].labelShort
        }
        cellName = defineNamedRange(indexPref, sheetModeID, subStepID, indyLabel, component, companyID, "group", scoringSuffix)

        SS.setNamedRange(cellName, Cell)

        ScoreCells.companyScores.levelScoresGroup.cells.push(cellName) // adding name to the formula

        tempCol += 1
    }

    // OpCom AVERAGE

    for (let k = 0; k < nrOfIndSubComps; k++) {

        Cell = Sheet.getRange(activeRow, tempCol)

        if (companyHasOpCom) {
            let serviceCells = []

            for (let elemNr = 0; elemNr < elementsLength; elemNr++) {
                Element = Elements[elemNr]
                elementLabel = Element.labelShort

                // finding the cell names that are used in calculating a company specific average
                component = ""
                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }
                cellName = defineNamedRange(indexPref, sheetModeID, subStepID, elementLabel, component, companyID, "opCom", "SE")
                if (companyHasOpCom == true) {
                    serviceCells.push(cellName)
                }
            }

            levelFormula = levelScoreFormula(serviceCells)
            Cell.setFormula(levelFormula)
            Cell.setNumberFormat("0.##")
            // naming the opCom level cell score
            component = ""
            if (nrOfIndSubComps != 1) {
                component = Category.components[k].labelShort
            }

            cellName = defineNamedRange(indexPref, sheetModeID, subStepID, indyLabel, component, companyID, "opCom", scoringSuffix)
            SS.setNamedRange(cellName, Cell)
            ScoreCells.companyScores.levelScoresOpCom.cells.push(cellName)

        } else {

            Cell.setValue("N/A").setHorizontalAlignment("center")

        }
        tempCol += 1
    }

    // --- SERVICES --- //
    // iterate over services
    for (let s = 0; s < servicesLength; s++) {

        Service = Services[s]
        serviceID = Service.id

        for (let k = 0; k < nrOfIndSubComps; k++) {

            Cell = Sheet.getRange(activeRow, tempCol)

            let serviceCells = []

            for (let elemNr = 0; elemNr < elementsLength; elemNr++) {

                Element = Elements[elemNr]
                elementLabel = Element.labelShort

                component = ""

                if (nrOfIndSubComps != 1) {
                    component = Category.components[k].labelShort
                }

                cellName = defineNamedRange(indexPref, sheetModeID, subStepID, elementLabel, component, companyID, serviceID, "SE")

                serviceCells.push(cellName)
            }

            levelFormula = levelScoreFormula(serviceCells)
            Cell.setFormula(levelFormula)
            Cell.setNumberFormat("0.##")

            // naming the service level cell score
            component = ""
            if (nrOfIndSubComps != 1) {
                component = Category.components[k].labelShort
            }

            cellName = defineNamedRange(indexPref, sheetModeID, subStepID, indyLabel, component, companyID, serviceID, scoringSuffix)

            SS.setNamedRange(cellName, Cell)

            // TODO: if else push subtype
            if (Service.type === "mobile") {
                ScoreCells.serviceScores.levelScoresServices.sublevelScoresMobile.cells.push(cellName)
            } else {
                ScoreCells.serviceScores.levelScoresServices.cells.push(cellName)
            }

            tempCol += 1
        }
    }
    return activeRow + 1
}

// eslint-disable-next-line no-unused-vars
function addCompositeScores(SS, sheetModeID, activeRow, activeCol, Sheet, subStepID, Indicator, Company, nrOfIndSubComps, ScoreCells, blocks) {

    let indyLabel = Indicator.labelShort
    let hasOpCom = Company.hasOpCom

    console.log(`|---- ${indyLabel} - composite scores BEGIN`)

    let scoringSuffix = "SC"
    let indexPref = ScoreCells.indexPref
    let CompositeScoringEntity
    let compositeID

    activeRow += 1

    let Cell = Sheet.getRange(activeRow, activeCol)

    let tempCol = activeCol
    let cellName

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        Cell.setValue("Composite Scores")
        Cell.setFontWeight("bold")
        tempCol += 1
    }

    // --- Composite Company Entities--- //

    for (let s = 0; s < Object.keys(ScoreCells.companyScores).length; s++) {

        tempCol += s

        CompositeScoringEntity = Object.values(ScoreCells.companyScores)[s]
        compositeID = CompositeScoringEntity.id

        Cell = Sheet.getRange(activeRow, tempCol)

        if (compositeID === "O" && !hasOpCom) {
            Cell.setValue("N/A").setHorizontalAlignment("center")
        } else {
            Cell.setFormula(aggregateScoreFormula(CompositeScoringEntity))
        }

        cellName = defineNamedRange(indexPref, sheetModeID, subStepID, indyLabel, compositeID, Company.id, "", scoringSuffix)

        SS.setNamedRange(cellName, Cell)

        // apply scoring Logic
        Cell = applyCompositeScoringLogic(Indicator, compositeID, Cell, cellName, ScoreCells)

        console.log(`|---- ${indyLabel} - composite score ${s + 1} added`)

    }

    tempCol += 1

    // --- Composite Service Entities --- //

    // Problem: Pre/Postpaid Mobile Composite Logic //

    for (let s = 0; s < Object.keys(ScoreCells.serviceScores).length; s++) {

        CompositeScoringEntity = Object.values(ScoreCells.serviceScores)[s]

        compositeID = CompositeScoringEntity.id

        tempCol += s
        Cell = Sheet.getRange(activeRow, tempCol) // 2 := group + opCom cols

        Cell.setFormula(aggregateScoreFormula(CompositeScoringEntity))

        cellName = defineNamedRange(indexPref, sheetModeID, subStepID, indyLabel, compositeID, Company.id, "", scoringSuffix)

        SS.setNamedRange(cellName, Cell)

        // apply scoring Logic
        Cell = applyCompositeScoringLogic(Indicator, compositeID, Cell, cellName, ScoreCells)

        console.log(`|---- ${indyLabel} - composite score ${s + 1} added`)

    }

    console.log(`|---- DEBUG ${ScoreCells.CompositeScoreCells.cells}`)

    return activeRow + 1
}

// eslint-disable-next-line no-unused-vars
function addIndicatorScore(SS, sheetModeID, activeRow, activeCol, Sheet, subStepID, Indicator, Company, ScoreCells, blocks) {

    console.log(`|--- adding INDICATOR score for ${Indicator.labelShort}`)

    activeRow += 1

    let scoringSuffix = "SI"
    let indexPref = ScoreCells.indexPref

    let CompositeScoreCells = ScoreCells.CompositeScoreCells

    let cellName
    let Cell = Sheet.getRange(activeRow, activeCol)
    let tempCol = activeCol

    // row label / first Column
    // skip first Column for subsequent steps    
    if (blocks === 1) {
        Cell.setValue("Indicator Score")
        Cell.setFontWeight("bold")
        tempCol += 1
    }

    Cell = Sheet.getRange(activeRow, tempCol)

    console.log(`|--- Indicator CompositeScoreCells[]:\n${CompositeScoreCells.cells}`)


    Cell.setFormula(aggregateScoreFormula(CompositeScoreCells))

    Cell.setFontStyle("normal")
    Cell.setFontWeight("bold")
    Cell.setNumberFormat("0.##")

    let component = ""

    cellName = defineNamedRange(indexPref, sheetModeID, subStepID, Indicator.labelShort, component, Company.id, "", scoringSuffix)

    SS.setNamedRange(cellName, Cell)

    // --- INDICATOR END --- //

    return activeRow + 1
}

function addChangeComment(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, Indicator, Company, ScoreCells){

    Logger.log("Adding change row")

    let Cell
    activeRow=activeRow+2
    if(firstCol==1){
        Logger.log("in if statement")
        Cell = Sheet.getRange(activeRow, firstCol)
        Cell.setValue("Change")
        Cell.setFontStyle("normal")
        Cell.setFontWeight("bold")

    

        return activeRow+2
    
    }


    Cell = Sheet.getRange(activeRow, firstCol)

    Logger.log("Cell:"+activeRow+","+firstCol+"------------------------------")

    let formula="=IF(OR("
    let cellID=defineNamedRange(Config.indexPrefix, sheetModeID, subStepID, Indicator.labelShort, "", Company.id, "", "SI")
    formula=formula+cellID+'="N/A",'
    let cellID1=defineNamedRange(Config.prevIndexPrefix, sheetModeID, "S07", Indicator.labelShort, "", Company.id, "", "SI")
    formula=formula+cellID1+'="N/A"),"N/A",'+cellID+"-"+cellID1+")"

    Cell.setFormula(formula)
    Cell.setFontStyle("normal")
    Cell.setFontWeight("bold")

    Cell.setNumberFormat("0.##")

    

    activeRow=activeRow+2

    return activeRow

}
