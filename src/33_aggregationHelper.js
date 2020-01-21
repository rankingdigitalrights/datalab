/* global
    defineNamedRangeStringImport,
    indexPrefix
 */

function countIndiClassLengths(IndicatorsObj) {

    // structure [[total], [class], [class], [class]]
    // TODO 
    var indicatorLengths = [0]

    var thisClass
    var thisClassLengthInd
    var thisIndLength

    var i, e

    for (i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {
        thisClass = IndicatorsObj.indicatorClasses[i]
        thisClassLengthInd = thisClass.indicators.length
        Logger.log("--- Length: " + thisClassLengthInd)
        indicatorLengths[0] += thisClassLengthInd
        indicatorLengths.push([thisClassLengthInd])
    }

    /**
    IndicatorsObj.indicatorClasses.forEach(function (Class) {
        // fetch this Class's indicators length
        thisClassLength = Class.indicators.length
        // add to total indicators length
        indicatorLengths[0] += thisClassLength

        // TODO: fix / finish
        // sum up element lengths
        Class.indicators.forEach(function (Indicator) {
            thisIndLength = Indicator.length
            indicatorLengths[0][1] += thisIndLength
        })

        // push to classes Array
        indicatorLengths.push([thisClassLength])
    })

     */

    Logger.log("! --- ! indicatorLengths: " + indicatorLengths)
    return indicatorLengths
}

// creates 1st column with labels for totals and indicators / elements
// element := if(includeElements)

function insertLabelColumn(Sheet, thisSubStepID, IndicatorsObj, currentRow, currentCol, includeElements) {

    var startRow = currentRow
    var classStartRow
    var lastRow
    var blockRange

    var indStartRow, indEndRow, indBlock

    var indicatorNotes = []
    var indicatorCells = [
        [thisSubStepID],
        ["Scope"],
        ["Total"],
        ["Governance"],
        ["Freedom of Expression"],
        ["Privacy"]
    ]

    indicatorNotes = indicatorCells.slice()

    var elementCells = []

    // Totals block

    lastRow = startRow + indicatorCells.length

    Sheet
        .getRange(startRow, currentCol, lastRow - startRow, 1)
        .setBorder(true, true, true, true, null, null, "black", null)
        .setFontWeight("bold")
        .setBackground("Lavender")

    // Individual Indicators / Elements
    currentRow = lastRow++

    IndicatorsObj.indicatorClasses.forEach(function (IndicatorClass) {

        classStartRow = currentRow

        IndicatorClass.indicators.forEach(function (Indicator) {

            indStartRow = currentRow
            indicatorCells.push([Indicator.labelShort])
            indicatorNotes.push([Indicator.labelLong])
            currentRow++
            // Elements

            if (includeElements) {

                Indicator.elements.forEach(function (Element) {
                    indicatorCells.push([Element.labelShort])
                    indicatorNotes.push([Element.description])
                    currentRow++
                })

            }

            indEndRow = currentRow

            if (includeElements) {
                Sheet
                    .getRange(indStartRow + 1, currentCol, indEndRow - indStartRow - 1, 1)
                    .shiftRowGroupDepth(1)
            }
        })

        lastRow = indEndRow

        Sheet.getRange(classStartRow, currentCol, lastRow - classStartRow, 1)
            .setBorder(true, true, true, true, null, null, "black", null)
            .setFontWeight("bold")
            .setBackground(IndicatorClass.classColor)
    })

    var column = Sheet.getRange(startRow, currentCol, indicatorCells.length, 1)

    column.setValues(indicatorCells)
    column.setNotes(indicatorNotes)

    return currentCol + 1
}

function addSummaryCompanyHeader(currentRow, currentCol, Sheet, Company) {

    var rowElems = Sheet.getRange(currentRow, currentCol, 1, 2 + Company.numberOfServices)
    rowElems.setValue(Company.label.current)
    rowElems.setFontWeight("bold").setFontSize(12)

    currentRow += 1

    rowElems = []

    var columnLabel

    rowElems.push("Total")
    rowElems.push("Group")

    // --- // --- Services --- // --- //
    for (var i = 0; i < Company.numberOfServices; i++) {
        columnLabel = Company.services[i].label.current
        rowElems.push(columnLabel)
    }

    var range = Sheet.getRange(currentRow, currentCol, 1, rowElems.length)
    range.setValues([rowElems]).setFontWeight("bold").setWrap(true)

    return currentRow + 1
}

/* adds service class totals per company per row */

function addSummaryScoresRow(currentRow, currentCol, Sheet, blockWidth, thisLength, totalLength, classesLeft) {

    var tempCol = currentCol
    var rowFormulas = []
    var range
    var formula
    var formulaPrefix = "=IFERROR(AVERAGE("
    var formulaSuffix = "),\"incomplete\")"

    var startRow = currentRow + totalLength + classesLeft // TODO: pass Array of SI / SL cells

    // for each company service
    for (var i = 0; i < blockWidth; i++) {
        // TODO: work with array of cells
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

function addCompanyScores(currentRow, currentCol, Sheet, Company, IndicatorsObj, thisSubStepID, blockWidth, includeElements) {

    var classStartRow, classEndRow, classBlock
    var isElement = false

    IndicatorsObj.indicatorClasses.forEach(function (IndicatorClass) {

        classStartRow = currentRow

        IndicatorClass.indicators.forEach(function (Indicator) {
            currentRow = addCompanyScoresRow(currentRow, currentCol, Sheet, Company, Indicator, thisSubStepID, isElement)
            if (includeElements) {
                isElement = true
                Indicator.elements.forEach(function (Element) {
                    currentRow = addCompanyScoresRow(currentRow, currentCol, Sheet, Company, Element, thisSubStepID, isElement)
                })
            }
            isElement = false
        })
        classEndRow = currentRow

        classBlock = Sheet.getRange(classStartRow, currentCol, classEndRow - classStartRow, blockWidth)
        classBlock.setBorder(true, true, true, true, null, null, "black", null)
    })


    return currentRow
}

function addCompanyScoresRow(currentRow, currentCol, Sheet, Company, ScoringObj, thisSubStepID, isElement) {

    var scoringSuffixTotal
    var scoringSuffixLvl

    if (!isElement) {
        scoringSuffixTotal = "SI"
        scoringSuffixLvl = "SL"
    } else {
        scoringSuffixLvl = "SE"
    }

    var component = ""
    var rowFormulas = []

    // var formulaPrefix = 'IFERROR('
    // var formulaSuffix = ',"pending")'
    // var formulaPrefix = "=AVERAGE("
    // var formulaSuffix = ")"
    var formula
    var cellID
    var range

    // Total
    if (!isElement) {
        cellID = defineNamedRangeStringImport(indexPrefix, "SC", thisSubStepID, ScoringObj.labelShort, component, Company.id, "", scoringSuffixTotal)
        // formula = formulaPrefix + cellID + formulaSuffix
        formula = cellID
    } else {
        formula = "=\"---\""
    }
    rowFormulas.push(formula)

    // Group
    cellID = defineNamedRangeStringImport(indexPrefix, "SC", thisSubStepID, ScoringObj.labelShort, component, Company.id, "group", scoringSuffixLvl)
    formula = cellID
    rowFormulas.push(formula)

    // Services
    for (var i = 0; i < Company.numberOfServices; i++) {
        cellID = defineNamedRangeStringImport(indexPrefix, "SC", thisSubStepID, ScoringObj.labelShort, component, Company.id, Company.services[i].id, scoringSuffixLvl)
        formula = cellID
        rowFormulas.push(formula)
    }

    range = Sheet.getRange(currentRow, currentCol, 1, rowFormulas.length)
    range.setFormulas([rowFormulas])
    range.setNumberFormat("0.##")

    return currentRow + 1
}