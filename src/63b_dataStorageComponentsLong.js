/* global
        indexPrefix,
        defineNamedRangeStringImport,
        importRangeFormula
        resizeSheet
*/

function addDataStoreSheetHeaderLong(Sheet, activeRow) {

    var columnLabels = ["Step", "Category", "Indicator", "Element", "Data Type", "Class", "Service", "Value", "Score"]

    Sheet.appendRow(columnLabels)
    return activeRow + 1
}

function importDataStoreRowLong(activeRow, Sheet, StepComp, stepCompID, thisSubStepID, Indicator, indCatLabelShort, indLabelShort, elemLabelShort, elemNr, Company, companyHasOpCom, integrateOutputs, urlDC, urlSC, scoringSuffix) {


    var importID = Indicator.labelShort
    Logger.log("- ROW - Element Data Type: " + stepCompID)
    Logger.log(" - " + "in " + StepComp.type + " " + importID)

    var currentSubStepID = thisSubStepID
    // TODO - PILOT: adjusting substep number for Researcher Name import
    if (StepComp.importNameFrom) {
        currentSubStepID = StepComp.importNameFrom
    }

    Logger.log(" - ROW - " + "in " + stepCompID + " " + importID)

    var rowLabels = []
    var rowCells = []
    var blockCells = []
    var component = ""
    var compCellName
    var formula

    // row label / first two Column

    rowLabels.push(currentSubStepID, indCatLabelShort, indLabelShort, elemLabelShort, StepComp.valueLabel)

    rowCells = rowLabels.slice() //ES5; no Array.from()

    // --- // main data block // --- // 

    // 1. Group

    rowCells.push("Company", "Group")
    compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, importID, component, Company.id, "group", stepCompID)

    formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    rowCells.push(formula)

    if (scoringSuffix) {
        compCellName = defineNamedRangeStringImport(indexPrefix, "SC", currentSubStepID, importID, component, Company.id, "group", scoringSuffix)
        formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
    } else {
        formula = ""
    }

    rowCells.push(formula)

    blockCells.push(rowCells)


    // 2. OpCom
    rowCells = rowLabels.slice()
    rowCells.push("Company", "OpCom")
    // for opCom + Indicator Subcomponents
    if (companyHasOpCom) {
        compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, importID, component, Company.id, "opCom", stepCompID)

        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    } else {
        formula = "NA"
    }

    rowCells.push(formula)

    if (scoringSuffix) {
        if (companyHasOpCom) {
            compCellName = defineNamedRangeStringImport(indexPrefix, "SC", currentSubStepID, importID, component, Company.id, "opCom", scoringSuffix)
            formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
        } else {
            formula = "NA"
        }
    } else {
        formula = ""
    }

    rowCells.push(formula)

    blockCells.push(rowCells)

    // 3ff.: Service(s)
    // for n Services
    for (var s = 0; s < Company.services.length; s++) {

        rowCells = rowLabels.slice()

        rowCells.push(Company.services[s].type, Company.services[s].label.current)

        // setting up formula that compares values
        compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, importID, component, Company.id, Company.services[s].id, stepCompID)
        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
        rowCells.push(formula)

        if (scoringSuffix) {
            compCellName = defineNamedRangeStringImport(indexPrefix, "SC", currentSubStepID, importID, component, Company.id, Company.services[s].id, scoringSuffix)
            formula = importRangeFormula(urlSC, compCellName, integrateOutputs)
        } else {
            formula = ""
        }

        rowCells.push(formula)

        blockCells.push(rowCells)
    }

    // --- write block --- //

    var nrOfRows = blockCells.length
    var nrOfCols = blockCells[0].length
    Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols)
        .setValues(blockCells)

    return activeRow + nrOfRows
}

// generic : imports both,element level evaluation results and comments
// proceeds row-wise per element
function importDataStoreBlockLong(Sheet, activeRow, StepComp, stepCompID, thisSubStepID, Indicator, indCatLabelShort, indLabelShort, Company, companyHasOpCom, integrateOutputs, urlDC, urlSC) {

    var scoringSuffix = StepComp.scoringId

    Logger.log("- Element Data Type: " + stepCompID)

    var currentRow = activeRow

    Logger.log(" - " + "in " + StepComp.type + " " + indLabelShort)

    var indLength = Indicator.elements.length
    var elemLabelShort

    // for each element
    for (var elemNr = 0; elemNr < indLength; elemNr++) {
        elemLabelShort = Indicator.elements[elemNr].labelShort
        currentRow = importDataStoreRowLong(currentRow, Sheet, StepComp, stepCompID, thisSubStepID, Indicator.elements[elemNr], indCatLabelShort, indLabelShort, elemLabelShort, elemNr, Company, companyHasOpCom, integrateOutputs, urlDC, urlSC, scoringSuffix)
    }

    return currentRow
}