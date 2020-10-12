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

function insertLabelColumn(Sheet, thisSubStepID, Indicators, row, col, includeElements,yoy) {

    let startRow = row
    let classStartRow
    let lastRow
    let blockRange

    let indStartRow, indEndRow, indBlock

    let indicatorNotes = []
    let indicatorCells=[]

    if(!yoy){ 
        indicatorCells = [
            [thisSubStepID],
            ["Scope"],
            ["Total"],
            ["Governance"],
            ["Freedom of Expression"],
            ["Privacy"]
    ]}

    else{
        indicatorCells = [
            [thisSubStepID],
            ["Year"],
            ["Scope"],
            ["Total"],
            ["Governance"],
            ["Freedom of Expression"],
            ["Privacy"]
        ]}
   

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

function addSummaryCompanyHeaderYoy(row, col, Sheet, Company) {

    let additionalCol = 2
    let totalCols=3*(additionalCol + Company.services.length)

    let rowElems = Sheet.getRange(row, col, 1, totalCols)
        .setValue(Company.label.current)
        .setFontWeight("bold")
        .setFontSize(12)

    row += 1

    rowElems = []

    let columnLabel
    let currentYearlLabel="20"+Config.indexPrefix.substring(3,5)+" Adjusted Scores"
    let prevYearlLabel="20"+Config.prevIndexPrefix.substring(3,5)+" Scores"


    for(let i=0; i<totalCols/3;i++){
        rowElems.push(currentYearlLabel)
        rowElems.push(prevYearlLabel)
        rowElems.push("Change")
    }

    Sheet.getRange(row, col, 1, rowElems.length)
        .setValues([rowElems])
        .setFontWeight("bold")
        .setWrap(true)

    row += 1

    rowElems = []

    rowElems.push("Total")
    rowElems.push("Total")
    rowElems.push("")
    rowElems.push("Group")
    rowElems.push("Group")
    rowElems.push("")

    // --- // --- Services --- // --- //
    for (let i = 0; i < Company.services.length; i++) {
        columnLabel = Company.services[i].label.current
        rowElems.push(columnLabel)
        rowElems.push(columnLabel)
        rowElems.push("")
    }

    Sheet.getRange(row, col, 1, rowElems.length)
        .setValues([rowElems])
        .setFontWeight("bold")
        .setWrap(true)

    return row + 1
}


/* adds service class totals per company per row */

function addCompanyTotalsRow(row, col, Sheet, blockWidth, catLength, totalLength, classesLeft, resultCells) {

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


function addCompanyScores(row, col, Sheet, Company, Indicators, thisSubStepID, blockWidth, includeElements, resultCells,yoy) {

    let classStartRow, classEndRow, classBlock
    let isElement = false

    Indicators.indicatorCategories.forEach(IndicatorClass => {

        classStartRow = row

        IndicatorClass.indicators.forEach(Indicator => {
            if(!yoy){row = addCompanyScoresRow(row, col, Sheet, Company, Indicator, thisSubStepID, isElement, resultCells)}
            else{row = addCompanyScoresRowYoy(row, col, Sheet, Company, Indicator, thisSubStepID, isElement, resultCells)}

            if (includeElements) {
                isElement = true
                Indicator.elements.forEach(Element => {
                    if(yoy){row = addCompanyScoresRow(row, col, Sheet, Company, Element, thisSubStepID, isElement, resultCells)}
                    else{row = addCompanyScoresRowYoy(row, col, Sheet, Company, Element, thisSubStepID, isElement, resultCells)}
                    
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

            formula = `=IF(AND(REGEXMATCH(${cellA},"N/A"),REGEXMATCH(${cellB},"N/A")),"N/A",AVERAGEIF(${cellA}:${cellB},"N/A"))`

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

    // console.log("DEBUG")
    // console.log(resultCells)

    return row + 1
}

function addCompanyScoresRowYoy(row, col, Sheet, Company, ScoringObj, thisSubStepID, isElement, resultCells) {

    let scoringSuffixTotal
    let scoringSuffixLvl

    if (!isElement) {
        scoringSuffixTotal = "SI"
        scoringSuffixLvl = "SL"
    } else {
        scoringSuffixLvl = "SE"
    }

    let sheetUrl = Company.urlCurrentYoyScoringSheet

    let component = ""
    let rowFormulas = []
    let rowResultRanges = []

    // let formulaPrefix = 'IFERROR('
    // let formulaSuffix = ',"pending")'
    // let formulaPrefix = "=AVERAGE("
    // let formulaSuffix = ")"
    let formula = '=IMPORTRANGE("' + sheetUrl + '","'
    let formula1=formula
    let cellID

    let helperRow, helperCol, helperCell, helperCell1

    let changeFormula

    helperRow = row
    helperCol = col

    // Total
    if (!isElement) {
        cellID = defineNamedRange(indexPrefix, "SC", thisSubStepID, ScoringObj.labelShort, component, Company.id, "", scoringSuffixTotal)
        // formula = formulaPrefix + cellID + formulaSuffix
        formula = formula + cellID + '")'

        helperCell = columnToLetter(col) + row
        rowResultRanges.push(helperCell)
        changeFormula="="+helperCell

        cellID = defineNamedRange(Config.prevIndexPrefix, "SC", "S07", ScoringObj.labelShort, component, Company.id, "", scoringSuffixTotal)
        // formula = formulaPrefix + cellID + formulaSuffix
        formula1 = formula1 + cellID + '")'

        helperCell1 = columnToLetter(col+1) + row
        rowResultRanges.push(helperCell1)
        changeFormula=changeFormula+"-"+helperCell1

    } else {
        formula = "=\"---\""
        formula1=formula
        changeFormula=""
    }
    rowFormulas.push(formula)
    rowFormulas.push(formula1)
    rowFormulas.push(changeFormula)

    
    col=col+3
    

    // Group
    formula = '=IMPORTRANGE("' + sheetUrl + '","'
    cellID = defineNamedRange(indexPrefix, "SC", thisSubStepID, ScoringObj.labelShort, component, Company.id, "group", scoringSuffixLvl)
    formula = formula + cellID + '")'
    helperCell = columnToLetter(col) + row
    rowResultRanges.push(helperCell)
    changeFormula="="+helperCell

    formula1 = '=IMPORTRANGE("' + sheetUrl + '","'
    cellID = defineNamedRange(Config.prevIndexPrefix, "SC", "S07", ScoringObj.labelShort, component, Company.id, "group", scoringSuffixLvl)
    formula1 = formula1 + cellID + '")'
    
    helperCell1 = columnToLetter(col+1) + row
    rowResultRanges.push(helperCell1)
    changeFormula=changeFormula+"-"+helperCell1

    if (!isElement) {
        helperCell = columnToLetter(col) + row
        helperCell1 = columnToLetter(col+1) + row
        rowResultRanges.push(helperCell)
        rowResultRanges.push(helperCell1)
    }

    rowFormulas.push(formula)
    rowFormulas.push(formula1)
    rowFormulas.push(changeFormula)

    col=col+3

    // Services

    let servicesLength = Company.services.length

    for (let i = 0; i < servicesLength; i++) {

        if (Company.services[i].subtype === "mobileTotal") {

            let cellA, cellB

            // next two cells to the right := prepaid, postpaid
            cellA = `${columnToLetter(col +3*(i+3))}${row}`
            cellB = `${columnToLetter(col + 3*(i+2))}${row}`

            formula = `=IF(AND(${cellA}="N/A",${cellB}="N/A"),"N/A",AVERAGEIF(${cellA}:${cellB},"<>N/A"))`

        } else {

            cellID = defineNamedRange(indexPrefix, "SC", thisSubStepID, ScoringObj.labelShort, component, Company.id, Company.services[i].id, scoringSuffixLvl)
            formula = `=IMPORTRANGE("${sheetUrl}","${cellID}")`

            cellID = defineNamedRange(Config.prevIndexPrefix, "SC", "S07", ScoringObj.labelShort, component, Company.id, Company.services[i].id, scoringSuffixLvl)
            formula1 = `=IMPORTRANGE("${sheetUrl}","${cellID}")`

            changeFormula="" // <------------------------ fix

        }

        //TODO ---------------------------------------------------------
        if (!isElement) {
            helperCell = columnToLetter(col + 2 + i) + row
            rowResultRanges.push(helperCell)
        }

        rowFormulas.push(formula)
        rowFormulas.push(formula1)
        rowFormulas.push(changeFormula)
    }

    Sheet.getRange(row, col, 1, rowFormulas.length)
        .setFormulas([rowFormulas])
        .setNumberFormat("0.##")

    if (!isElement) {
        resultCells.push(rowResultRanges)
    }

    // console.log("DEBUG")
    // console.log(resultCells)

    return row + 1
}
