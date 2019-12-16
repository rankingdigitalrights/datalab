function countIndicatorLengths(IndicatorsObj) {

    var indicatorLengths = [0]

    var thisClassLength

    IndicatorsObj.indicatorClasses.forEach(function (IndClass) {
        // fetch this Class's indicators length
        thisClassLength = IndClass.indicators.length
        // add to total indicators length
        indicatorLengths[0] += thisClassLength
        // push to classes Array
        indicatorLengths.push(thisClassLength)
    })

    return indicatorLengths
}

function insertIndicatorColumn(Sheet, thisSubStepID, IndicatorsObj, currentRow, currentCol, indicatorParams) {

    var startRow = currentRow
    var lastRow
    var blockRange

    var indicatorCells = [
        ["Summary Scores"],
        ["Scope"],
        ["Total"],
        ["Governance"],
        ["Freedom of Expression"],
        ["Privacy"]
    ]
    var indicatorLabel

    lastRow = currentRow + indicatorCells.length
    blockRange = Sheet.getRange(startRow, currentCol, lastRow - startRow, 1)
    blockRange.setBorder(true, true, true, true, null, null, "black", null).setFontWeight("bold")

    IndicatorsObj.indicatorClasses.forEach(function (IndicatorClass) {

        startRow = currentRow

        IndicatorClass.indicators.forEach(function (Indicator) {
            indicatorLabel = Indicator.labelShort
            indicatorCells.push([indicatorLabel])
        })

        lastRow = currentRow + indicatorCells.length
        blockRange = Sheet.getRange(startRow, currentCol, lastRow - startRow, 1)
        blockRange.setBorder(true, true, true, true, null, null, "black", null).setFontWeight("bold")
    })

    var column = Sheet.getRange(currentRow, currentCol, indicatorCells.length, 1)
    column.setValues(indicatorCells)

    return currentCol + 1
}

function addSummaryCompanyHeader(currentRow, currentCol, Sheet, Company) {

    var topCell = Sheet.getRange(currentRow, currentCol)
    topCell.setValue(Company.label.current)
    topCell.setFontWeight("bold").setFontSize(12)

    currentRow += 1

    var rowElems = []
    var columnLabel

    columnLabel = "Total"
    rowElems.push(columnLabel)
    columnLabel = "Group"
    rowElems.push(columnLabel)

    // --- // --- Services --- // --- //
    for (var i = 0; i < Company.numberOfServices; i++) {
        columnLabel = Company.services[i].label.current
        rowElems.push(columnLabel)

    }

    var range = Sheet.getRange(currentRow, currentCol, 1, rowElems.length)
    range.setValues([rowElems]).setFontWeight("bold").setWrap(true)


    return currentRow + 1
}

function addSummaryScoresRow(currentRow, currentCol, Sheet, blockWidth, IndicatorsObj, indicatorParams, thisSubStepID, thisLength, totalLength, elemsLeft) {

    var tempCol = currentCol
    var rowFormulas = []
    var range
    var formula
    var formulaPrefix = "=IFERROR(AVERAGE("
    var formulaSuffix = "),\"incomplete\")"
    var startRow = currentRow + totalLength + elemsLeft

    for (var i = 0; i < blockWidth; i++) {
        range = Sheet.getRange(startRow, tempCol, thisLength, 1).getA1Notation()
        formula = formulaPrefix + range + formulaSuffix
        rowFormulas.push(formula)
        tempCol += 1
    }

    range = Sheet.getRange(currentRow, currentCol, 1, rowFormulas.length)
    range.setFormulas([rowFormulas])
        .setNumberFormat("0.##")
        .setFontWeight("bold")

    return currentRow + 1
}

function addCompanyIndicatorScores(currentRow, currentCol, Sheet, Company, IndicatorsObj, thisSubStepID, blockWidth) {

    var startRow
    var lastRow
    var blockRange

    IndicatorsObj.indicatorClasses.forEach(function (IndicatorClass) {

        startRow = currentRow

        IndicatorClass.indicators.forEach(function (Indicator) {
            currentRow = addIndicatorScoresRow(currentRow, currentCol, Sheet, Company, Indicator, thisSubStepID)
        })
        lastRow = currentRow

        blockRange = Sheet.getRange(startRow, currentCol, lastRow - startRow, blockWidth)
        blockRange.setBorder(true, true, true, true, null, null, "black", null)
    })


    return currentRow
}

function addIndicatorScoresRow(currentRow, currentCol, Sheet, Company, Indicator, thisSubStepID) {

    var scoringSuffixTotal = "SI"
    var scoringSuffixLvl = "SL"
    var component = ""
    var rowFormulas = []

    // var formulaPrefix = 'IFERROR('
    // var formulaSuffix = ',"pending")'
    var formulaPrefix = "=AVERAGE("
    var formulaSuffix = ")"
    var formula
    var cellID
    var range

    // Total
    cellID = defineNamedRangeStringImport(indexPrefix, "SC", thisSubStepID, Indicator.labelShort, component, Company.id, "", scoringSuffixTotal)
    formula = formulaPrefix + cellID + formulaSuffix
    rowFormulas.push(formula)

    // Group
    cellID = defineNamedRangeStringImport(indexPrefix, "SC", thisSubStepID, Indicator.labelShort, component, Company.id, "group", scoringSuffixLvl)
    formula = formulaPrefix + cellID + formulaSuffix
    rowFormulas.push(formula)

    // Services
    for (var i = 0; i < Company.numberOfServices; i++) {
        cellID = defineNamedRangeStringImport(indexPrefix, "SC", thisSubStepID, Indicator.labelShort, component, Company.id, Company.services[i].id, scoringSuffixLvl)
        formula = formulaPrefix + cellID + formulaSuffix
        rowFormulas.push(formula)
    }

    range = Sheet.getRange(currentRow, currentCol, 1, rowFormulas.length)
    range.setFormulas([rowFormulas])
    range.setNumberFormat("0.##")

    return currentRow + 1
}