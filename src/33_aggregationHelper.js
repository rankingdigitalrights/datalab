/* global defineNamedRange, indexPrefix, columnToLetter, 
 */

function countIndiClassLengths(Indicators) {

    // structure [[total], [class], [class], [class]]
    // TODO 
    let indicatorLengths = [0]

    let thisClass
    let thisClassLengthInd
    let thisIndLength

    let i, e

    for (i = 0; i < Indicators.indicatorCategories.length; i++) {
        thisClass = Indicators.indicatorCategories[i]
        thisClassLengthInd = thisClass.indicators.length
        Logger.log("--- Length: " + thisClassLengthInd)
        indicatorLengths[0] += thisClassLengthInd
        indicatorLengths.push([thisClassLengthInd])
    }

    /**
    Indicators.indicatorCategories.forEach(function (Class) {
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

    // Logger.log("! --- ! indicatorLengths: " + indicatorLengths)
    return indicatorLengths
}

// creates 1st column with labels for totals and indicators / elements
// element := if(includeElements)

function insertLabelColumn(Sheet, thisSubStepID, Indicators, row, col, includeElements) {

    let startRow = row
    let classStartRow
    let lastRow
    let blockRange

    let indStartRow, indEndRow, indBlock

    let indicatorNotes = []
    let indicatorCells = [
        [thisSubStepID],
        ["Scope"],
        ["Total"],
        ["Governance"],
        ["Freedom of Expression"],
        ["Privacy"]
    ]

    indicatorNotes = indicatorCells.slice()

    let elementCells = []

    // Totals block

    lastRow = startRow + indicatorCells.length

    Sheet
        .getRange(startRow, col, lastRow - startRow, 1)
        .setBorder(true, true, true, true, null, null, "black", null)
        .setFontWeight("bold")
        .setBackground("Lavender")

    // Individual Indicators / Elements
    row = lastRow++

    Indicators.indicatorCategories.forEach(function (IndicatorClass) {

        classStartRow = row

        IndicatorClass.indicators.forEach(function (Indicator) {

            indStartRow = row
            indicatorCells.push([Indicator.labelShort])
            indicatorNotes.push([Indicator.labelLong])
            row++
            // Elements

            if (includeElements) {

                Indicator.elements.forEach(function (Element) {
                    indicatorCells.push([Element.labelShort])
                    indicatorNotes.push([Element.description])
                    row++
                })

            }

            indEndRow = row

            if (includeElements) {
                Sheet
                    .getRange(indStartRow + 1, col, indEndRow - indStartRow - 1, 1)
                    .shiftRowGroupDepth(1)
            }
        })

        lastRow = indEndRow

        Sheet.getRange(classStartRow, col, lastRow - classStartRow, 1)
            .setBorder(true, true, true, true, null, null, "black", null)
            .setFontWeight("bold")
            .setBackground(IndicatorClass.classColor)
    })

    let column = Sheet.getRange(startRow, col, indicatorCells.length, 1)

    column.setValues(indicatorCells)
    column.setNotes(indicatorNotes)

    return col + 1
}

function addSummaryCompanyHeader(row, col, Sheet, Company) {

    let additionalCol = 2
    if (Company.type == "telecom") {
        additionalCol = 3
    }

    let rowElems = Sheet.getRange(row, col, 1, additionalCol + Company.services.length)
    rowElems.setValue(Company.label.current)
    rowElems.setFontWeight("bold").setFontSize(12)

    row += 1

    rowElems = []

    let columnLabel

    rowElems.push("Total")
    rowElems.push("Group")

    // --- // --- Services --- // --- //
    for (let i = 0; i < Company.services.length; i++) {
        columnLabel = Company.services[i].label.current
        rowElems.push(columnLabel)
    }

    Sheet.getRange(row, col, 1, rowElems.length)
        .setValues([rowElems])
        .setFontWeight("bold")
        .setWrap(true)

    return row + 1
}

/* adds service class totals per company per row */

function addSummaryScoresRow(row, col, Sheet, blockWidth, catLength, totalLength, classesLeft, resultCells) {

    let rowFormulas = []
    let range
    let formula
    let formulaPrefix = "=IFERROR(AVERAGE("
    let formulaSuffix = "),\"incomplete\")"

    let startRow = row + totalLength + classesLeft // TODO: pass Array of SI / SL cells

    // for each company service
    for (let i = 0; i < blockWidth; i++) {
        // TODO: work with array of cells
        // range = Sheet.getRange(startRow, tempCol, catLength, 1).getA1Notation()
        range = getColumnFromArray(resultCells, i).slice(totalLength, totalLength + catLength)

        formula = formulaPrefix + range + formulaSuffix
        rowFormulas.push(formula)
    }

    range = Sheet.getRange(row, col, 1, rowFormulas.length)
    range.setFormulas([rowFormulas])
        .setNumberFormat("0.##")
        .setFontWeight("bold")

    return row + 1
}

function addCompanyScores(row, col, Sheet, Company, Indicators, thisSubStepID, blockWidth, includeElements, resultCells) {

    let classStartRow, classEndRow, classBlock
    let isElement = false

    Indicators.indicatorCategories.forEach(IndicatorClass => {

        classStartRow = row

        IndicatorClass.indicators.forEach(Indicator => {
            row = addCompanyScoresRow(row, col, Sheet, Company, Indicator, thisSubStepID, isElement, resultCells)

            if (includeElements) {
                isElement = true
                Indicator.elements.forEach(Element => {
                    row = addCompanyScoresRow(row, col, Sheet, Company, Element, thisSubStepID, isElement, resultCells)
                })
            }

            isElement = false
        })
        classEndRow = row

        classBlock = Sheet.getRange(classStartRow, col, classEndRow - classStartRow, blockWidth)
        classBlock.setBorder(true, true, true, true, null, null, "black", null)
    })


    return row
}

function addCompanyScoresRow(row, col, Sheet, Company, ScoringObj, thisSubStepID, isElement, resultCells) {

    let scoringSuffixTotal
    let scoringSuffixLvl

    if (!isElement) {
        scoringSuffixTotal = "SI"
        scoringSuffixLvl = "SL"
    } else {
        scoringSuffixLvl = "SE"
    }

    let sheetUrl = Company.urlCurrentCompanyScoringSheet

    let component = ""
    let rowFormulas = []
    let rowResultRanges = []

    // let formulaPrefix = 'IFERROR('
    // let formulaSuffix = ',"pending")'
    // let formulaPrefix = "=AVERAGE("
    // let formulaSuffix = ")"
    let formula = '=IMPORTRANGE("' + sheetUrl + '","'
    let cellID
    let range

    let helperRow, helperCol, helperCell

    helperRow = row
    helperCol = col

    // Total
    if (!isElement) {
        cellID = defineNamedRange(indexPrefix, "SC", thisSubStepID, ScoringObj.labelShort, component, Company.id, "", scoringSuffixTotal)
        // formula = formulaPrefix + cellID + formulaSuffix
        formula = formula + cellID + '")'

        helperCell = columnToLetter(col) + row
        rowResultRanges.push(helperCell)

    } else {
        formula = "=\"---\""
    }
    rowFormulas.push(formula)

    // Group
    formula = '=IMPORTRANGE("' + sheetUrl + '","'
    cellID = defineNamedRange(indexPrefix, "SC", thisSubStepID, ScoringObj.labelShort, component, Company.id, "group", scoringSuffixLvl)
    formula = formula + cellID + '")'

    if (!isElement) {
        helperCell = columnToLetter(col + 1) + row
        rowResultRanges.push(helperCell)
    }

    rowFormulas.push(formula)

    // Services

    let servicesLength = Company.services.length

    for (let i = 0; i < servicesLength; i++) {

        if (Company.services[i].subtype === "mobileTotal") {

            let cellA, cellB

            // next two cells to the right := prepaid, postpaid
            cellA = `${columnToLetter(col + 2 + i + 1)}${row}`
            cellB = `${columnToLetter(col + 2 + i + 2)}${row}`

            formula = `=IF(AND(${cellA}="N/A",${cellB}="N/A"),"N/A",AVERAGEIF(${cellA}:${cellB},"<>N/A"))`

        } else {

            cellID = defineNamedRange(indexPrefix, "SC", thisSubStepID, ScoringObj.labelShort, component, Company.id, Company.services[i].id, scoringSuffixLvl)
            formula = `=IMPORTRANGE("${sheetUrl}","${cellID}")`

        }
        if (!isElement) {
            helperCell = columnToLetter(col + 2 + i) + row
            rowResultRanges.push(helperCell)
        }

        rowFormulas.push(formula)
    }

    Sheet.getRange(row, col, 1, rowFormulas.length)
        .setFormulas([rowFormulas])
        .setNumberFormat("0.##")

    if (!isElement) {
        resultCells.push(rowResultRanges)
    }

    console.log("DEBUG")
    console.log(resultCells)

    return row + 1
}
