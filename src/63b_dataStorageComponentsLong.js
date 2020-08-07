/* global
        indexPref,
        defineNamedRange,
        importRangeFormula
        resizeSheet
*/

function addDataStoreSheetHeaderLong(Sheet, activeRow) {

    let columnLabels = ["Step", "Substep", "Category", "Indicator", "Element", "Datatype", "Class", "Service", "ID", "Value", ""]

    Sheet.appendRow(columnLabels)
    return activeRow + 1
}

function addDataStoreSheetHeaderLongScoring(Sheet, activeRow) {

    let columnLabels = ["Step", "Substep", "Category", "Indicator", "Element", "Datatype", "Class", "Service", "ID", "Scores", ""]

    Sheet.appendRow(columnLabels)
    return activeRow + 1
}

function importDataStoreRowLong(activeRow, Sheet, StepComp, stepCompID, subStepID, Indicator, indCatLabelShort, indLabelShort, elemLabelShort, elemNr, Company, hasOpCom, integrateOutputs, urlDC, urlSC, scoringSuffix, indexPref) {

    let importID = Indicator.labelShort
    console.log(" - " + "in " + StepComp.type + " " + importID)

    console.log(`DEBUG - ${indexPref}`)

    // PILOT: adjusting substep number for Researcher Name import
    if (StepComp.importNameFrom) {
        subStepID = StepComp.importNameFrom
    }

    let rowLabels = []
    let rowCells = []
    let blockCells = []
    let component = ""
    let compCellName
    let formula

    let c = elemLabelShort
    if (elemLabelShort != null) {
        console.log("here")
        c = elemLabelShort.substring(indLabelShort.length + 1, elemLabelShort.length + 1)
        console.log(c)
    }

    rowLabels.push(subStepID.substring(2, 3), subStepID.substring(3, 4), indCatLabelShort, indLabelShort, c, StepComp.variableName)

    rowCells = rowLabels.slice() //ES5 way to deep-copy; no Array.from()

    // --- // main data block // --- // 

    // 1. Group

    rowCells.push("Company", "Group")
    compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "group", stepCompID)

    formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    rowCells.push(compCellName, formula)
    //rowCells.push(compCellName, "")

    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "group", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    } else {
        formula = ""
    }

    //rowCells.push(formula)
    rowCells.push("")

    blockCells.push(rowCells)


    // 2. OpCom
    rowCells = rowLabels.slice()
    rowCells.push("Company", "OpCom")
    // for opCom + Indicator Subcomponents
    compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "opCom", stepCompID)
    formula = importRangeFormula(urlDC, compCellName, integrateOutputs)

    rowCells.push(compCellName, formula)

    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "opCom", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    } else {
        formula = "NA"
    }

    //rowCells.push(formula)
    rowCells.push("")

    blockCells.push(rowCells)

    // 3ff.: Service(s)
    // for n Services
    for (let s = 0; s < Company.services.length; s++) {

        rowCells = rowLabels.slice()

        rowCells.push(Company.services[s].type, Company.services[s].label.current)

        // setting up formula that compares values
        compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, Company.services[s].id, stepCompID)
        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
        rowCells.push(compCellName, formula)

        if (scoringSuffix) {
            compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, Company.services[s].id, scoringSuffix)
            formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
        } else {
            formula = ""
        }

        //rowCells.push(formula)
        rowCells.push("")

        blockCells.push(rowCells)
    }

    // --- write block --- //

    let nrOfRows = blockCells.length
    let nrOfCols = blockCells[0].length
    Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols)
        .setValues(blockCells)

    return activeRow + nrOfRows
}


function importDataStoreRowLongScoring(activeRow, Sheet, StepComp, stepCompID, subStepID, Indicator, indCatLabelShort, indLabelShort, elemLabelShort, elemNr, Company, hasOpCom, integrateOutputs, urlDC, urlSC, scoringSuffix, indexPref) {

    let importID = Indicator.labelShort
    console.log(" - " + "in " + StepComp.type + " " + importID)

    console.log(`DEBUG - ${indexPref}`)

    // PILOT: adjusting substep number for Researcher Name import
    if (StepComp.importNameFrom) {
        subStepID = StepComp.importNameFrom
    }

    let rowLabels = []
    let rowCells = []
    let blockCells = []
    let component = ""
    let compCellName
    let formula

    let c = elemLabelShort
    if (elemLabelShort != null) {
        console.log("here")
        c = elemLabelShort.substring(indLabelShort.length + 1, elemLabelShort.length + 1)
        console.log(c)
    }

    rowLabels.push(subStepID.substring(2, 3), subStepID.substring(3, 4), indCatLabelShort, indLabelShort, c, "score")

    rowCells = rowLabels.slice() //ES5 way to deep-copy; no Array.from()

    // --- // main data block // --- // 

    // 1. Group

    rowCells.push("Company", "Group")
    //compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "group", stepCompID)

    //formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "group", scoringSuffix)
    formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    rowCells.push(compCellName, formula)
    //rowCells.push(compCellName, "")

    /*
    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "group", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    } else {
        formula = ""
    }
    */

    //rowCells.push(formula)
    rowCells.push("")

    blockCells.push(rowCells)


    // 2. OpCom
    rowCells = rowLabels.slice()
    rowCells.push("Company", "OpCom")
    // for opCom + Indicator Subcomponents
    //compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "opCom", stepCompID)
    //formula = importRangeFormula(urlDC, compCellName, integrateOutputs)

    if(Company.hasOpCom){

        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "opCom", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    }

    else{formula="N/A"}

    rowCells.push(compCellName, formula)

    /*
    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "opCom", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    } else {
        formula = "NA"
    }
    */

    //rowCells.push(formula)
    rowCells.push("")

    blockCells.push(rowCells)

    // 3ff.: Service(s)
    // for n Services
    for (let s = 0; s < Company.services.length; s++) {

        rowCells = rowLabels.slice()

        rowCells.push(Company.services[s].type, Company.services[s].label.current)

        /*
        // setting up formula that compares values
        compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, Company.services[s].id, stepCompID)
        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
        */
       compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, Company.services[s].id, scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
        rowCells.push(compCellName, formula)

        /*
        if (scoringSuffix) {
            compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, Company.services[s].id, scoringSuffix)
            formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
        } else {
            formula = ""
        }
*/
        //rowCells.push(formula)
        rowCells.push("")

        blockCells.push(rowCells)
    }

    // --- write block --- //

    let nrOfRows = blockCells.length
    let nrOfCols = blockCells[0].length
    Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols)
        .setValues(blockCells)

    return activeRow + nrOfRows

}

// generic : imports both,element level evaluation results and comments
// proceeds row-wise per element

// eslint-disable-next-line no-unused-vars
function importDataStoreBlockLong(Sheet, activeRow, StepComp, stepCompID, subStepID, Indicator, indCatLabelShort, indLabelShort, Company, hasOpCom, integrateOutputs, urlDC, urlSC, indexPref) {

    let scoringSuffix = StepComp.scoringId || false

    console.log("- Element Data Type: " + stepCompID)

    let currentRow = activeRow

    console.log(" - " + "in " + StepComp.type + " " + indLabelShort)

    let indLength = Indicator.elements.length
    let elemLabelShort

    // for each element
    for (let elemNr = 0; elemNr < indLength; elemNr++) {
        elemLabelShort = Indicator.elements[elemNr].labelShort
        currentRow = importDataStoreRowLong(currentRow, Sheet, StepComp, stepCompID, subStepID, Indicator.elements[elemNr], indCatLabelShort, indLabelShort, elemLabelShort, elemNr, Company, hasOpCom, integrateOutputs, urlDC, urlSC, scoringSuffix, indexPref)
    }

    return currentRow
}

function importDataStoreBlockLongScoring(Sheet, activeRow, StepComp, stepCompID, subStepID, Indicator, indCatLabelShort, indLabelShort, Company, hasOpCom, integrateOutputs, urlDC, urlSC, indexPref){
    let scoringSuffix = StepComp.scoringId || false

    console.log("- Element Data Type: " + stepCompID)

    let currentRow = activeRow

    console.log(" - " + "in " + StepComp.type + " " + indLabelShort)

    let indLength = Indicator.elements.length
    let elemLabelShort

    // for each element
    for (let elemNr = 0; elemNr < indLength; elemNr++) {
        elemLabelShort = Indicator.elements[elemNr].labelShort
        currentRow = importDataStoreRowLongScoring(currentRow, Sheet, StepComp, stepCompID, subStepID, Indicator.elements[elemNr], indCatLabelShort, indLabelShort, elemLabelShort, elemNr, Company, hasOpCom, integrateOutputs, urlDC, urlSC, "SE", indexPref)
    }

    return currentRow
}

function importDataStoreScoringOverall(Sheet, activeRow, StepComp, stepCompID, subStepID, Indicator, catLabel, indLabelShort, Company, hasOpCom, integrateOutputs, urlDC, urlSC, indexPref, scoringSuffix) {

    let importID = Indicator.labelShort
    console.log(" - " + "in " + StepComp.type + " " + importID)

    console.log(`DEBUG - ${indexPref}`)

    // PILOT: adjusting substep number for Researcher Name import
    if (StepComp.importNameFrom) {
        subStepID = StepComp.importNameFrom
    }

    let rowLabels = []
    let rowCells = []
    let blockCells = []
    let component = ""
    let compCellName
    let formula

    let c = ""
    

    rowLabels.push(subStepID.substring(2, 3), subStepID.substring(3, 4), catLabel, indLabelShort, c, "score")

    rowCells = rowLabels.slice() //ES5 way to deep-copy; no Array.from()

    // --- // main data block // --- // 

    // 1. Group

    rowCells.push("Company", "Group")
    //compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "group", stepCompID)

    //formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "group", scoringSuffix)
    formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    rowCells.push(compCellName, formula)
    //rowCells.push(compCellName, "")

    /*
    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "group", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    } else {
        formula = ""
    }
    */

    //rowCells.push(formula)
    rowCells.push("")

    blockCells.push(rowCells)


    // 2. OpCom
    rowCells = rowLabels.slice()
    rowCells.push("Company", "OpCom")
    // for opCom + Indicator Subcomponents
    //compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, "opCom", stepCompID)
    //formula = importRangeFormula(urlDC, compCellName, integrateOutputs)

    if(Company.hasOpCom){

        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "opCom", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    }

    else{formula="N/A"}

    rowCells.push(compCellName, formula)

    /*
    if (scoringSuffix) {
        compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "opCom", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    } else {
        formula = "NA"
    }
    */

    //rowCells.push(formula)
    rowCells.push("")

    blockCells.push(rowCells)

    // 3ff.: Service(s)
    // for n Services
    for (let s = 0; s < Company.services.length; s++) {

        rowCells = rowLabels.slice()

        rowCells.push(Company.services[s].type, Company.services[s].label.current)

        /*
        // setting up formula that compares values
        compCellName = defineNamedRange(indexPref, "DC", subStepID, importID, component, Company.id, Company.services[s].id, stepCompID)
        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
        */
       compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, Company.services[s].id, scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
        rowCells.push(compCellName, formula)

        /*
        if (scoringSuffix) {
            compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, Company.services[s].id, scoringSuffix)
            formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
        } else {
            formula = ""
        }
*/
        //rowCells.push(formula)
        rowCells.push("")

        blockCells.push(rowCells)
    }

    rowCells = rowLabels.slice()
    rowCells.push("Company", "")
    compCellName = defineNamedRange(indexPref, "SC", subStepID, importID, component, Company.id, "", "SI")
    formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    rowCells.push(compCellName, formula)
    rowCells.push("")
    blockCells.push(rowCells)
    

    // --- write block --- //

    let nrOfRows = blockCells.length
    let nrOfCols = blockCells[0].length
    Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols)
        .setValues(blockCells)

    return activeRow + nrOfRows


}
