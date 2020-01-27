// ---------------------HELPER FUNCTIONS---------------------------------------------
// --- BEGIN setScoringCompanyHeader() --- //
function addDataStoreSheetHeaderWide(Sheet, Company, activeRow) {

    var columnLabel
    var columnLabels = ["Element", "Type"]

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

    Sheet.appendRow(columnLabels)
    return activeRow + 1
}

// Single Row import (for sources, header / researcher name)

function importDataStoreRowWide(activeRow, Sheet, StepComp, thisSubStepID, Indicator, Company, companyHasOpCom, integrateOutputs, urlDC) {

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
    var rowCells = []
    var component = ""
    var compCellName
    var formula
    var range

    // row label / first two Column
    rowLabel = Indicator.labelShort
    rowCells.push(rowLabel)

    rowLabel = StepComp.type
    rowCells.push(rowLabel)

    // result cells
    // for Group + Indicator Subcomponents


    // setting up formula that compares values
    compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, "group", stepCompID)

    // adding formula
    formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    rowCells.push(formula)


    // for opCom + Indicator Subcomponents
    if (companyHasOpCom) {
        // setting up formula that compares values
        compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, "opCom", stepCompID)

        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
    } else {
        formula = "NA"
    }
    rowCells.push(formula)

    // for n Services + Indicator Subcomponents
    for (var g = 0; g < Company.services.length; g++) {

        // setting up formula that compares values
        compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, Indicator.labelShort, component, Company.id, Company.services[g].id, stepCompID)

        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)

        rowCells.push(formula)
    }

    Logger.log("rowCells.length " + rowCells.length)
    Logger.log(rowCells)
    range = Sheet.getRange(activeRow, 1, 1, rowCells.length)
    range.setValues([rowCells])

    return activeRow + 1
}

// generic : imports both,element level evaluation results and comments
// proceeds row-wise per element
function importDataStoreElementsBlockWide(Sheet, activeRow, StepComp, thisSubStepID, Indicator, Company, companyHasOpCom, integrateOutputs, urlDC) {

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
        var rowCells = []
        // row labels / first two columns
        rowLabel = Indicator.elements[elemNr].labelShort
        rowCells.push(rowLabel)
        rowLabel = StepComp.type
        rowCells.push(rowLabel)

        // result cells
        // for Group + Indicator Subcomponents

        // setting up formula that compares values
        compCellName = defineNamedRangeStringImport(indexPrefix, "DC", thisSubStepID, Indicator.elements[elemNr].labelShort, component, Company.id, "group", stepCompID)

        // adding formula
        formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
        // currentCell.setFormula(formula)
        rowCells.push(formula)

        // OpCom
        if (companyHasOpCom) {
            // setting up formula that compares values
            compCellName = defineNamedRangeStringImport(indexPrefix, "DC", thisSubStepID, Indicator.elements[elemNr].labelShort, component, Company.id, "opCom", stepCompID)

            formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
        } else {
            formula = "NA"
        }
        rowCells.push(formula)

        // for n Services + Indicator Subcomponents
        for (var s = 0; s < Company.services.length; s++) {
            compCellName = defineNamedRangeStringImport(indexPrefix, "DC", thisSubStepID, Indicator.elements[elemNr].labelShort, component, Company.id, Company.services[s].id, stepCompID)

            formula = importRangeFormula(urlDC, compCellName, integrateOutputs)
            rowCells.push(formula)
        }
        // Sheet.appendRow(rowCells)

        blockCells.push(rowCells)

        currentRow += 1
    }

    blockRange = Sheet.getRange(activeRow, 1, blockCells.length, rowCells.length)
    blockRange.setValues(blockCells)

    return currentRow
}