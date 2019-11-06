function insertIndicatorColumn(Sheet, thisSubStepID, IndicatorsObj, currentRow, currentCol) {

    var indicatorCells = [["Summary Scores"], ["Indicator"]]
    var indicatorLabel

    IndicatorsObj.indicatorClasses.forEach(function (IndicatorClass) {

        IndicatorClass.indicators.forEach(function (Indicator) {
            indicatorLabel = Indicator.labelShort
            Logger.log(indicatorLabel)
            indicatorCells.push([indicatorLabel])
        })
    })

    var arrayLength = indicatorCells.length
    var column = Sheet.getRange(currentRow, currentCol, indicatorCells.length, 1)
    column.setValues(indicatorCells)

    return currentCol + 1
}



function addSummaryCompHeader(currentRow, currentCol, Sheet, Company) {

    var topCell = Sheet.getRange(currentRow, currentCol)
    topCell.setValue(Company.label.current)

    currentRow += 1

    var rowElems = []
    var columnLabel

    columnLabel = "Group"

    rowElems.push(columnLabel)

    // --- // --- Services --- // --- //
    for (i = 0; i < Company.numberOfServices; i++) {
        columnLabel = Company.services[i].label.current
        rowElems.push(columnLabel)

    }

    var range = Sheet.getRange(currentRow, currentCol, 1, rowElems.length)
    range.setValues([rowElems])


    return currentRow + 1
}

function addCompanyIndicatorScores(currentRow, currentCol, Sheet, Company, IndicatorsObj, thisSubStepID) {

    IndicatorsObj.indicatorClasses.forEach(function (IndicatorClass) {

        Logger.log("Class")
        IndicatorClass.indicators.forEach(function (Indicator) {
            currentRow = addIndicatorScoresRow(currentRow, currentCol, Sheet, Company, Indicator, thisSubStepID)

        })
    })
    return currentRow
}

function addIndicatorScoresRow(currentRow, currentCol, Sheet, Company, Indicator, thisSubStepID) {

    var scoringSuffix = "SL"
    var component = ""


    var rowFormulas = []

    var formula = defineNamedRangeStringImport(indexPrefix, "SC", thisSubStepID, Indicator.labelShort, component, Company.id, "group", scoringSuffix)

    rowFormulas.push(formula)


    for (i = 0; i < Company.numberOfServices; i++) {
        formula = defineNamedRangeStringImport(indexPrefix, "SC", thisSubStepID, Indicator.labelShort, component, Company.id, Company.services[i].id, scoringSuffix)

        rowFormulas.push(formula)

    }


    var range = Sheet.getRange(currentRow, currentCol, 1, rowFormulas.length)
    range.setFormulas([rowFormulas]);
    range.setNumberFormat("0.##")

    return currentRow + 1
}
