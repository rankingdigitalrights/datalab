// ---------------------HELPER FUNCTIONS---------------------------------------------
// --- BEGIN setScoringCompanyHeader() --- //
function addDataStoreSheetHeader(Sheet, Company, activeRow) {

    var columnLabel
    var columnLabels = ["Element", "Type", "Scope", "Value"]

    /**
    // --- // Company Elements // --- //
    columnLabels.push("Group")

    // opcom

    columnLabel = "OpCom"

    if (Company.hasOpCom == true) {
        columnLabel = columnLabel + " - " + Company.opComLabel
    } else {
        columnLabel = columnLabel + " (NA)"
    }

    columnLabels.push(columnLabel)

    // --- // --- Services --- // --- //
    for (var s = 0; s < Company.numberOfServices; s++) {
        columnLabel = Company.services[s].label.current
        columnLabels.push(columnLabel)
    }

     */

    Sheet.appendRow(columnLabels)
    return activeRow + 1
}

// generic : imports both,element level evaluation results and comments
// proceeds row-wise per element
function importDataStoreElementBlock(Sheet, activeRow, StepComp, thisSubStepID, Indicator, Company, companyHasOpCom, integrateOutputs, urlDC) {

    var stepCompID
    if (stepCompID == "elementResults") {
        stepCompID = false
    } else {
        stepCompID = StepComp.id
    }
    Logger.log("- Element Data Type: " + stepCompID)

    var currentRow = activeRow

    Logger.log(" - " + "in " + StepComp.type + " " + Indicator.labelShort)

    var rowLabel
    var component = ""
    var blockCells = []
    var compCellName
    var formula
    var blockRange

    var indLength = Indicator.elements.length

    // for each element
    for (var elemNr = 0; elemNr < indLength; elemNr++) {
        currentRow = importDataStoreRow(currentRow, Sheet, StepComp, thisSubStepID, Indicator.elements[elemNr], Company, companyHasOpCom, integrateOutputs, urlDC)
    }

    return currentRow
}


// --- // Begin Sources // --- //

function importDataStoreRow(activeRow, Sheet, StepComp, thisSubStepID, Indicator, Company, companyHasOpCom, integrateOutputs, urlDC) {

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

    var rowLabel
    var rowLabels = []
    var rowCells = []
    var blockCells = []
    var component = ""
    var compCellName
    var formula
    var range

    // row label / first two Column
    rowLabel = Indicator.labelShort
    rowLabels.push(rowLabel)

    rowLabel = StepComp.type
    rowLabels.push(rowLabel)

    rowCells = rowLabels.slice()

    // --- // main data block // --- // 

    // 1. Group

    rowCells.push("Group")
    compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, "group", stepCompID)

    formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    rowCells.push(formula)
    blockCells.push(rowCells)


    // 2. OpCom
    rowCells = rowLabels.slice()
    rowCells.push("OpCom")
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
    for (var g = 0; g < Company.services.length; g++) {

        rowCells = rowLabels.slice()

        rowCells.push(Company.services[g].label.current)

        // setting up formula that compares values
        compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, Company.services[g].id, stepCompID)

        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)

        rowCells.push(formula)
        blockCells.push(rowCells)
    }

    // --- write block --- //

    var nrOfRows = blockCells.length
    var nrOfCols = blockCells[0].length
    Logger.log(" --- blockCells: " + blockCells)
    Logger.log(" --- nrOfRows: " + nrOfRows)
    Logger.log(" --- nrOfCols: " + nrOfCols)
    range = Sheet.getRange(activeRow, 1, nrOfRows, nrOfCols)
    Logger.log("range: " + range)
    range.setValues(blockCells)

    return activeRow + nrOfRows
}

// --- // end Sources // --- //