function addDataStoreSheetHeaderLong(Sheet, Company, activeRow) {

    var columnLabels = ["Step", "Element", "Data Type", "Class", "Service", "Value"]

    Sheet.appendRow(columnLabels)
    return activeRow + 1
}

function importDataStoreRowLong(activeRow, Sheet, StepComp, thisSubStepID, Indicator, Company, companyHasOpCom, integrateOutputs, urlDC) {

    var stepCompID

    if (stepCompID == "elementResults") {
        stepCompID = false
    } else {
        stepCompID = StepComp.id
    }

    Logger.log("- Element Data Type: " + stepCompID)
    Logger.log(" - " + "in " + StepComp.type + " " + Indicator.labelShort)

    var currentSubStepID = thisSubStepID
    // TODO - PILOT: adjusting substep number for Researcher Name import
    if (StepComp.importNameFrom) {
        currentSubStepID = StepComp.importNameFrom
    }

    Logger.log(" - " + "in " + stepCompID + " " + Indicator.labelShort)

    var rowLabels = []
    var rowCells = []
    var blockCells = []
    var component = ""
    var compCellName
    var formula
    var range

    // row label / first two Column

    rowLabels.push(currentSubStepID, Indicator.labelShort, StepComp.type)

    rowCells = rowLabels.slice() //ES5; no Array.from()

    // --- // main data block // --- // 

    // 1. Group

    rowCells.push("Company", "Group")
    compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, "group", stepCompID)

    formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    rowCells.push(formula)
    blockCells.push(rowCells)


    // 2. OpCom
    rowCells = rowLabels.slice()
    rowCells.push("Company", "OpCom")
    // for opCom + Indicator Subcomponents
    if (companyHasOpCom) {
        // setting up formula that compares values
        compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, "opCom", stepCompID)

        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    } else {
        formula = "NA"
    }
    rowCells.push(formula)
    blockCells.push(rowCells)

    // 3ff.: Service(s)
    // for n Services
    for (var s = 0; s < Company.services.length; s++) {

        rowCells = rowLabels.slice()

        rowCells.push(Company.services[s].type, Company.services[s].label.current)

        // setting up formula that compares values
        compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, Company.services[s].id, stepCompID)

        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)

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
function importDataStoreElementBlockLong(Sheet, activeRow, StepComp, thisSubStepID, Indicator, Company, companyHasOpCom, integrateOutputs, urlDC) {

    var stepCompID
    if (stepCompID == "elementResults") {
        stepCompID = false
    } else {
        stepCompID = StepComp.id
    }
    Logger.log("- Element Data Type: " + stepCompID)

    var currentRow = activeRow

    Logger.log(" - " + "in " + StepComp.type + " " + Indicator.labelShort)

    var indLength = Indicator.elements.length

    // for each element
    for (var elemNr = 0; elemNr < indLength; elemNr++) {
        currentRow = importDataStoreRowLong(currentRow, Sheet, StepComp, thisSubStepID, Indicator.elements[elemNr], Company, companyHasOpCom, integrateOutputs, urlDC)
    }

    return currentRow
}