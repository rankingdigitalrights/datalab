/* global
        Config, defineNamedRange, importRangeFormula,
*/

// eslint-disable-next-line no-unused-vars
function addDataStoreSheetHeaderResults(Sheet, activeRow) {
    let columnLabels = [
        'Step',
        'Substep',
        'Category',
        'Indicator',
        'Element',
        'Datatype',
        'Class',
        'Service',
        'ID',
        'Value',
        '',
    ]

    Sheet.appendRow(columnLabels)
    return activeRow + 1
}

// eslint-disable-next-line no-unused-vars
function addDataStoreSheetHeaderScoring(Sheet, activeRow) {
    let columnLabels = [
        'Step',
        'Substep',
        'Category',
        'Indicator',
        'Element',
        'Datatype',
        'Class',
        'Service',
        'ID',
        'Scores',
        '',
    ]

    Sheet.appendRow(columnLabels)
    return activeRow + 1
}

function importDataStoreRowResults(
    activeRow,
    Sheet,
    StepComp,
    stepCompID,
    subStepID,
    Indicator,
    indCatLabelShort,
    indLabelShort,
    elemLabelShort,
    elemNr,
    Company,
    hasOpCom,
    urlDC,
    scoringSuffix,
    indexPref
) {
    let importID = Indicator.labelShort
    // console.log(" - " + "in " + StepComp.type + " " + importID)

    // console.log(`DEBUG - ${indexPref}`)

    let rowLabels = []
    let rowCells = []
    let blockCells = []
    let component = ''
    let compCellName
    let formula

    let c = elemLabelShort
    if (elemLabelShort != null) {
        // console.log("here")
        c = elemLabelShort.substring(indLabelShort.length + 1, elemLabelShort.length + 1)
        // console.log(c)
    }

    let subStepLabel = subStepID.substring(3, 4)
    if (indexPref === Config.prevIndexPrefix) {
        subStepLabel = '0'
    }

    rowLabels.push(subStepID.substring(2, 3), subStepLabel, indCatLabelShort, indLabelShort, c, StepComp.variableName)

    rowCells = rowLabels.slice() //ES5 way to deep-copy; no Array.from()

    // --- // main data block // --- //

    // 1. Group

    rowCells.push('Company', 'Group')
    compCellName = defineNamedRange(indexPref, 'DC', subStepID, importID, component, Company.id, 'group', stepCompID)

    formula = importRangeFormula(urlDC, compCellName, false)
    rowCells.push(compCellName, formula)
    //rowCells.push(compCellName, "")

    blockCells.push(rowCells)

    // 2. OpCom
    rowCells = rowLabels.slice()
    rowCells.push('Company', 'OpCom')
    // for opCom + Indicator Subcomponents
    compCellName = defineNamedRange(indexPref, 'DC', subStepID, importID, component, Company.id, 'opCom', stepCompID)
    formula = importRangeFormula(urlDC, compCellName, false)

    rowCells.push(compCellName, formula)

    blockCells.push(rowCells)

    // 3ff.: Service(s)
    // for n Services
    for (let s = 0; s < Company.services.length; s++) {
        rowCells = rowLabels.slice()

        rowCells.push(Company.services[s].type, Company.services[s].label.current)

        // setting up formula that compares values
        compCellName = defineNamedRange(
            indexPref,
            'DC',
            subStepID,
            importID,
            component,
            Company.id,
            Company.services[s].id,
            stepCompID
        )
        formula = importRangeFormula(urlDC, compCellName, false)
        rowCells.push(compCellName, formula)

        blockCells.push(rowCells)
    }

    // --- write block --- //

    let nrOfRows = blockCells.length
    let nrOfCols = blockCells[0].length
    Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols).setValues(blockCells)

    return activeRow + nrOfRows
}

function importDataStoreRowScoring(
    activeRow,
    Sheet,
    StepComp,
    stepCompID,
    subStepID,
    Indicator,
    indCatLabelShort,
    indLabelShort,
    elemLabelShort,
    elemNr,
    Company,
    hasOpCom,
    urlSC,
    scoringSuffix,
    indexPref
) {
    let importID = Indicator.labelShort
    // console.log(" - " + "in " + StepComp.type + " " + importID)

    // console.log(`DEBUG - ${indexPref}`)

    let rowLabels = []
    let rowCells = []
    let blockCells = []
    let component = ''
    let compCellName
    let formula

    let c = elemLabelShort
    if (elemLabelShort != null) {
        // console.log("here")
        c = elemLabelShort.substring(indLabelShort.length + 1, elemLabelShort.length + 1)
        // console.log(c)
    }

    let subStepLabel = subStepID.substring(3, 4)
    if (indexPref === Config.prevIndexPrefix) {
        subStepLabel = '0'
    }

    rowLabels.push(subStepID.substring(2, 3), subStepLabel, indCatLabelShort, indLabelShort, c, 'score')

    rowCells = rowLabels.slice() //ES5 way to deep-copy; no Array.from()

    // --- // main data block // --- //

    // 1. Group

    rowCells.push('Company', 'Group')
    //compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "group", stepCompID)

    //formula = importRangeFormula(urlDC, compCellName, false)
    compCellName = defineNamedRange(indexPref, 'SC', subStepID, importID, component, Company.id, 'group', scoringSuffix)
    formula = importRangeFormula(urlSC, compCellName, false)
    rowCells.push(compCellName, formula)
    //rowCells.push(compCellName, "")

    /*
    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "group", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, false)
    } else {
        formula = ""
    }
    */

    //rowCells.push(formula)
    rowCells.push('')

    blockCells.push(rowCells)

    // 2. OpCom
    rowCells = rowLabels.slice()
    rowCells.push('Company', 'OpCom')
    // for opCom + Indicator Subcomponents
    //compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "opCom", stepCompID)
    //formula = importRangeFormula(urlDC, compCellName, false)

    if (Company.hasOpCom) {
        compCellName = defineNamedRange(
            indexPref,
            'SC',
            subStepID,
            importID,
            component,
            Company.id,
            'opCom',
            scoringSuffix
        )
        formula = importRangeFormula(urlSC, compCellName, false)
    } else {
        formula = 'N/A'
    }

    rowCells.push(compCellName, formula)

    /*
    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "opCom", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, false)
    } else {
        formula = "NA"
    }
    */

    //rowCells.push(formula)
    rowCells.push('')

    blockCells.push(rowCells)

    // 3ff.: Service(s)
    // for n Services
    for (let s = 0; s < Company.services.length; s++) {
        rowCells = rowLabels.slice()

        rowCells.push(Company.services[s].type, Company.services[s].label.current)

        /*
        // setting up formula that compares values
        compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, Company.services[s].id, stepCompID)
        formula = importRangeFormula(urlDC, compCellName, false)
        */
        compCellName = defineNamedRange(
            indexPref,
            'SC',
            subStepID,
            importID,
            component,
            Company.id,
            Company.services[s].id,
            scoringSuffix
        )
        formula = importRangeFormula(urlSC, compCellName, false)
        rowCells.push(compCellName, formula)

        /*
        if (scoringSuffix) {
            compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, Company.services[s].id, scoringSuffix)
            formula = importRangeFormula(urlSC, compCellName, false)
        } else {
            formula = ""
        }
*/
        //rowCells.push(formula)
        rowCells.push('')

        blockCells.push(rowCells)
    }

    // --- write block --- //

    let nrOfRows = blockCells.length
    let nrOfCols = blockCells[0].length
    Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols).setValues(blockCells)

    return activeRow + nrOfRows
}

// generic : imports both,element level evaluation results and comments
// proceeds row-wise per element

// eslint-disable-next-line no-unused-vars
function importDataStoreBlockResults(
    Sheet,
    activeRow,
    StepComp,
    stepCompID,
    subStepID,
    Indicator,
    indCatLabelShort,
    indLabelShort,
    Company,
    hasOpCom,
    urlDC,
    indexPref
) {
    // TODO: get rid of cellID

    let scoringSuffix = StepComp.scoringId || false

    // console.log("- Element Data Type: " + stepCompID)

    let currentRow = activeRow

    // console.log(" - " + "in " + StepComp.type + " " + indLabelShort)

    let indLength = Indicator.elements.length
    let elemLabelShort

    // for each element
    for (let elemNr = 0; elemNr < indLength; elemNr++) {
        elemLabelShort = Indicator.elements[elemNr].labelShort
        currentRow = importDataStoreRowResults(
            currentRow,
            Sheet,
            StepComp,
            stepCompID,
            subStepID,
            Indicator.elements[elemNr],
            indCatLabelShort,
            indLabelShort,
            elemLabelShort,
            elemNr,
            Company,
            hasOpCom,
            urlDC,
            scoringSuffix,
            indexPref
        )
    }

    return currentRow
}

// eslint-disable-next-line no-unused-vars
function importDataStoreBlockScoring(
    Sheet,
    activeRow,
    StepComp,
    stepCompID,
    subStepID,
    Indicator,
    indCatLabelShort,
    indLabelShort,
    Company,
    hasOpCom,
    urlSC,
    indexPref
) {
    // let scoringSuffix = StepComp.scoringId || false

    // console.log("- Element Data Type: " + stepCompID)

    let currentRow = activeRow

    // console.log(" - " + "in " + StepComp.type + " " + indLabelShort)

    let indLength = Indicator.elements.length
    let elemLabelShort

    // for each element
    for (let elemNr = 0; elemNr < indLength; elemNr++) {
        elemLabelShort = Indicator.elements[elemNr].labelShort
        currentRow = importDataStoreRowScoring(
            currentRow,
            Sheet,
            StepComp,
            stepCompID,
            subStepID,
            Indicator.elements[elemNr],
            indCatLabelShort,
            indLabelShort,
            elemLabelShort,
            elemNr,
            Company,
            hasOpCom,
            urlSC,
            'SE',
            indexPref
        )
    }

    return currentRow
}

// eslint-disable-next-line no-unused-vars
function importDataStoreScoringLevelScores(
    Sheet,
    activeRow,
    StepComp,
    stepCompID,
    subStepID,
    Indicator,
    catLabel,
    indLabelShort,
    Company,
    hasOpCom,
    urlSC,
    indexPref,
    scoringSuffix
) {
    let importID = Indicator.labelShort
    // console.log(" - " + "in " + StepComp.type + " " + importID)

    // console.log(`DEBUG - ${indexPref}`)

    let rowLabels = []
    let rowCells = []
    let blockCells = []
    let component = ''
    let compCellName
    let formula, subStepLabel

    let c = ''
    subStepLabel = subStepID.substring(3, 4)
    if (indexPref === Config.prevIndexPrefix) {
        subStepLabel = '0'
    }

    rowLabels.push(subStepID.substring(2, 3), subStepLabel, catLabel, indLabelShort, c, 'score')

    rowCells = rowLabels.slice() // ES5 way to deep-copy Array; no Array.from()

    // --- // main data block // --- //

    // 1. Group

    rowCells.push('Company', 'Group')
    //compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "group", stepCompID)

    //formula = importRangeFormula(urlDC, compCellName, false)
    compCellName = defineNamedRange(indexPref, 'SC', subStepID, importID, component, Company.id, 'group', scoringSuffix)
    formula = importRangeFormula(urlSC, compCellName, false)
    rowCells.push(compCellName, formula)
    //rowCells.push(compCellName, "")

    /*
    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "group", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, false)
    } else {
        formula = ""
    }
    */
    blockCells.push(rowCells)

    // 2. OpCom
    rowCells = rowLabels.slice()
    rowCells.push('Company', 'OpCom')
    // for opCom + Indicator Subcomponents
    //compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "opCom", stepCompID)
    //formula = importRangeFormula(urlDC, compCellName, false)

    if (Company.hasOpCom) {
        compCellName = defineNamedRange(
            indexPref,
            'SC',
            subStepID,
            importID,
            component,
            Company.id,
            'opCom',
            scoringSuffix
        )
        formula = importRangeFormula(urlSC, compCellName, false)
    } else {
        formula = 'N/A'
    }

    rowCells.push(compCellName, formula)

    /*
    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "opCom", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, false)
    } else {
        formula = "NA"
    }
    */
    blockCells.push(rowCells)

    // 3ff.: Service(s)
    // for n Services

    for (let s = 0; s < Company.services.length; s++) {
        rowCells = rowLabels.slice()

        rowCells.push(Company.services[s].type, Company.services[s].label.current)

        compCellName = defineNamedRange(
            indexPref,
            'SC',
            subStepID,
            importID,
            component,
            Company.id,
            Company.services[s].id,
            scoringSuffix
        )
        formula = importRangeFormula(urlSC, compCellName, false)
        rowCells.push(compCellName, formula)

        blockCells.push(rowCells)
    }

    // --- write block --- //

    let nrOfRows = blockCells.length
    let nrOfCols = blockCells[0].length
    Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols).setValues(blockCells)

    return activeRow + nrOfRows
}

// eslint-disable-next-line no-unused-vars
function addTransposedSheet(Sheet, sourceTab, rowLength, maxSteps) {
    let catCellLabel = Sheet.getRange(1, 1)
    catCellLabel.setValue('CatOrder')

    let elementsTotalNr = rowLength * 2 * maxSteps
    let pivotAnchorCell = Sheet.getRange(1, 2)

    let formula = `=QUERY(${sourceTab}!A1:J,"Select B,C,D,A,G,max(J) Where G='prev_result' OR G='result' OR G='prev_comment' OR G='comment' Group by B,C,D,A,F,G Pivot I",1)`
    pivotAnchorCell.setFormula(formula)

    let catFormula = `=SWITCH(INDIRECT(ADDRESS(ROW(),COLUMN()+3)),"G",1,"F",2,"P",3)`
    let catCells = Sheet.getRange(2, 1, 1 + elementsTotalNr)
    catCells.setFormula(catFormula)
}
