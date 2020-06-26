// --- // Top-Level Headings // --- //

/* 
global
    Styles,
    defineNamedRange,
    indexPrefix,
    specialRangeName,
    doRepairsOnly
*/

function addMainSheetHeader(SS, Sheet, Category, Indicator, Company, activeRow, activeCol, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNrOfServices, includeRGuidanceLink, collapseRGuidance) {

    let rangeStart, rangeEnd, Range, width, rangeName

    width = 1 + 2 + companyNrOfServices

    rangeStart = activeRow

    activeRow = addIndicatorGuidance(Sheet, Category, Indicator, activeRow, activeCol, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNrOfServices, includeRGuidanceLink, collapseRGuidance)

    activeRow = addMainCompanyHeader(Sheet, Category, Company, activeRow, companyNrOfServices)

    rangeEnd = activeRow

    rangeName = specialRangeName("Guide", "", Indicator.labelShort)
    Range = Sheet.getRange(rangeStart, 1, rangeEnd - rangeStart, width)
    SS.setNamedRange(rangeName, Range)

    Sheet.setFrozenRows(activeRow)

    return activeRow += 2
}

// Indicator Guidance for researchers

function addIndicatorGuidance(Sheet, Category, Indicator, activeRow, activeCol, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNrOfServices, includeRGuidanceLink, collapseRGuidance) {

    // TODO probably move all formatting params to JSON

    let row = activeRow
    let col = activeCol

    let maxColHeadings = (2 + bridgeCompColumnsNr) + 1
    if (companyNrOfServices == 1 && !hasOpCom) {
        maxColHeadings -= 1
    }

    let indTitle = "▶ " + Indicator.labelShort

    if (Indicator.description.length > 1) {
        indTitle = indTitle + ": " + Indicator.description
    }

    let indDescription = Indicator.labelLong

    // Indicator Heading
    Sheet.getRange(row, 1, 1, 2)
        .setValues([
            [indTitle, indDescription]
        ])
        .setFontSize(18)
        .setVerticalAlignment("middle")
        .setFontFamily("Oswald")

    Sheet.getRange(row, 1).setHorizontalAlignment("center")

    Sheet.setRowHeight(row, 30)
    Sheet.getRange(row, col, 1, numberOfColumns)
        .setBackground(Styles.colors.blue).setFontColor("white")

    // Sheet.setFrozenRows(1)

    row += 1

    let startRow

    if (includeRGuidanceLink) {
        // General Instruction
        Sheet.getRange(row, col)
            .setValue("Please read the indicator-specific guidance and discussions before starting the research!")
            .setFontWeight("bold")
            .setFontSize(9)
            .setHorizontalAlignment("left")
            .setVerticalAlignment("middle")
            .setFontFamily("Roboto Mono")
            .setFontColor("#ea4335")
        // .setFontColor("chocolate")

        Sheet.setRowHeight(row, 40)
        Sheet.getRange(row, col, 1, numberOfColumns)
            .setBackground("WhiteSmoke")

        row += 1
        startRow = row // for grouping
    } else {
        startRow = row // for grouping
        row += 1
    }

    let indStart = row
    let values = []
    let prefix, hasPredecessor, isRevised

    Indicator.elements.forEach((Element) => {
        hasPredecessor = Element.y2yResultRow ? true : false
        isRevised = Element.isRevised ? true : false
        prefix = isRevised ? (" (rev.)") : !hasPredecessor ? (" (new)") : ""

        values.push(
            [(prefix + " " + Element.labelShort + ":"), Element.description]
        )
        Sheet.getRange(row, 2, 1, maxColHeadings)
            .merge()
            .setWrap(true)
            .setVerticalAlignment("top")
        row += 1
    })

    let indEnd = row

    Sheet.getRange(indStart, col, values.length, 2)
        .setValues(values)
        .setFontSize(10)
        .setFontFamily("Roboto")
        .setHorizontalAlignment("left")

    Sheet.getRange(indStart, col, values.length, 1)
        .setHorizontalAlignment("right")
        .setFontWeight("bold")
        .setVerticalAlignment("top")
        .setFontFamily("Roboto Mono")

    let lastRow = row

    if (includeRGuidanceLink) {
        row += 1
        let indicatorLink = Indicator.researchGuidance

        // TODO: Parameterize

        Sheet.getRange(row, 1)
            .setValue("Research Guidance")
            .setFontWeight("bold")
            .setHorizontalAlignment("right")
            .setFontFamily("Roboto Mono")

        Sheet.getRange(row, 2, 1, maxColHeadings).merge().setWrap(true)
            .setValue(indicatorLink)

        row += 1
        lastRow = row // for grouping
    }

    let block = Sheet.getRange(2, 1, lastRow - 1, numberOfColumns)

    if (!doRepairsOnly) {
        block.shiftRowGroupDepth(1)
    }

    if (collapseRGuidance) {
        block.collapseGroups()
    }

    row += 1

    Sheet.getRange(startRow, 1, row - startRow, numberOfColumns).setBackground("WhiteSmoke")

    Sheet.getRange(row, activeCol, 1, numberOfColumns).setBorder(true, null, true, null, null, null, "black", null)

    // Sheet.setFrozenRows(lastRow)
    // row += 2

    activeRow = row
    return activeRow
}


// Company + Services Header

function addMainCompanyHeader(Sheet, Category, Company, activeRow, companyNrOfServices) {

    let activeCol = 1

    let rowRange = (activeRow + ":" + activeRow).toString()
    Sheet.getRange(rowRange).setHorizontalAlignment("center") // aligns header row

    let Cell

    let cellValue = Company.label.current

    if (!Company.isPrevScored) {
        cellValue += " (New)"
    }

    // first cell: MainStep Label
    Sheet.getRange(activeRow, activeCol)
        .setValue(cellValue)
        .setWrap(true)

    activeCol += 1

    // Company (group) column(s)
    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue("Group") // .setValue(Company.groupLabel)
        .setBackground("#fff2cc")

    activeCol += 1

    // setting up OpCom regardless of whether it has one
    // hide the column if it doesn't exist

    Cell = Sheet.getRange(activeRow, activeCol)
        .setBackground("#fff2cc")

    Company.hasOpCom == false ? Cell.setValue("Operating Company (N/A)") : Cell.setValue("Operating Company") // Cell.setValue(Company.opComLabel)

    activeCol += 1

    // for remaining columns (services)
    for (let i = 0; i < companyNrOfServices; i++) {
        Sheet.getRange(activeRow, activeCol)
            .setValue(Company.services[i].label.current)
            .setBackground("#b7e1cd")
        activeCol += 1
    }

    let horizontalDim = 1 + 2 + companyNrOfServices
    Sheet.getRange(activeRow, 1, 1, horizontalDim)
        .setFontWeight("bold")
        .setVerticalAlignment("middle")
        .setFontSize(12)

    Sheet.setRowHeight(activeRow, 30)

    // if (Config.freezeHead) {
    //     Sheet.setFrozenRows(activeRow) // freezes rows; define in config.json
    // }

    return activeRow

}

function addMainStepHeader(Sheet, Category, Company, activeRow, companyNrOfServices, MainStep, mainStepColor) {

    let horizontalDim = 1 + 2 + companyNrOfServices

    let titleWidth = companyNrOfServices == 1 || Company.hasOpCom ? 3 : 4

    Sheet.getRange(activeRow, 1, 1, horizontalDim)
        .setBackground(mainStepColor)
        .setBorder(true, false, true, false, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    Sheet.getRange(activeRow, 2, 1, titleWidth)
        .merge()
        .setValue("Step " + MainStep.step + " - " + MainStep.rowLabel)
        .setFontSize(14)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")

    Sheet.setRowHeight(activeRow, 30)

    // return MainStep.omitResearcher ? activeRow + 2 : activeRow + 1
    return activeRow + 1

}

function addSubStepHeader(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, companyNrOfServices) {

    let horizontalDim = 1 + 2 + companyNrOfServices

    let titleWidth = companyNrOfServices == 1 || Company.hasOpCom ? 3 : 4

    let Cell = Sheet.getRange(activeRow, 1)
    Cell.setValue(Substep.labelShort)
        .setBackground(Substep.subStepColor)

    Cell = Sheet.getRange(activeRow, 2, 1, titleWidth)
        .merge()
        .setValue(Substep.components[stepCNr].rowLabel)
        .setFontStyle("italic")

    Cell = Sheet.getRange(activeRow, 1, 1, horizontalDim)
        .setFontWeight("bold")
        .setFontSize(12)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setBorder(true, true, true, true, null, null, Substep.subStepColor, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    Sheet.setRowHeight(activeRow, 30)

    return activeRow + 1

}

function addExtraInstruction(Substep, stepCNr, activeRow, activeCol, Sheet, Company, companyNrOfServices) {

    let horizontalDim = 1 + 2 + companyNrOfServices

    let titleWidth = companyNrOfServices == 1 || Company.hasOpCom ? 3 : 4

    Sheet.getRange(activeRow, 1, 2, 1)
        .setBackground(Substep.subStepColor)

    activeRow += 1

    Sheet.getRange(activeRow, 2, 1, titleWidth)
        .merge()
        .setValue(Substep.components[stepCNr].rowLabel)
        .setFontStyle("italic")
        .setFontWeight("bold")
        .setFontSize(12)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")

    Sheet.getRange(activeRow, 1, 1, horizontalDim)
        .setBorder(true, true, true, true, null, null, Substep.subStepColor, SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    Sheet.setRowHeight(activeRow, 30)

    return activeRow + 1
}

function addStepResearcherRow(SS, Sheet, Indicator, Company, activeRow, MainStep, companyNrOfServices) {

    activeRow += 1

    let rangeStart, rangeEnd, Range, width, rangeName

    width = 1 + 2 + companyNrOfServices

    rangeStart = activeRow

    // sets up labels in the first column
    let Cell = Sheet.getRange(activeRow, 1)

    Cell.setValue("Researcher")
        .setBackground(MainStep.stepColor)
        .setFontStyle("italic")
        .setFontWeight("bold")
        .setFontSize(11)
        .setHorizontalAlignment("center") // Cell = textUnderline(Cell)

    // TODO
    // activeRow = addMainStepHeader(Sheet, Category, Company, activeRow, SS, nrOfIndSubComps, companyNrOfServices) // sets up header

    let thisFiller = "Your Name"
    let thisFirstCol = 2
    let thisLastCol = ((companyNrOfServices + 2))
    // for remaining company, opCom, and services columns it adds the placeholderText
    Cell = Sheet.getRange(activeRow, thisFirstCol, 1, thisLastCol)
        .setFontStyle("italic")
        .setHorizontalAlignment("center")

    if (!doRepairsOnly) {
        Cell.setValue(thisFiller)
    }

    let cellName
    let component = ""

    let activeCol = thisFirstCol

    let stepCompID = "N"

    for (let col = 1; col < (companyNrOfServices + 3); col++) {

        // TODO: fix Cell reference for OpCom

        if (col == 1) {
            // main company
            Cell = Sheet.getRange(activeRow, 1 + col)

            // Cell name formula; output defined in 44_rangeNamingHelper.js

            cellName = defineNamedRange(indexPrefix, "DC", MainStep.stepID, Indicator.labelShort, component, Company.id, "group", stepCompID)

            SS.setNamedRange(cellName, Cell)
            activeCol += 1

        } else if (col == 2) {
            // opCom
            Cell = Sheet.getRange(activeRow, 1 + col)

            // Cell name formula; output defined in 44_rangeNamingHelper.js

            cellName = defineNamedRange(indexPrefix, "DC", MainStep.stepID, Indicator.labelShort, component, Company.id, "opCom", stepCompID)

            SS.setNamedRange(cellName, Cell)
            activeCol += 1
        } else {
            // services
            Cell = Sheet.getRange(activeRow, activeCol)

            // Cell name formula; output defined in 44_rangeNamingHelper.js

            let g = col - 3 // helper for Services

            cellName = defineNamedRange(indexPrefix, "DC", MainStep.stepID, Indicator.labelShort, component, Company.id, Company.services[g].id, stepCompID)

            SS.setNamedRange(cellName, Cell)
            activeCol += 1
        }

    }

    rangeEnd = activeRow

    rangeName = specialRangeName("Names", MainStep.stepID, Indicator.labelShort)
    Range = Sheet.getRange(rangeStart, 2, 1, width - 1)
    SS.setNamedRange(rangeName, Range)

    return activeRow + 2

}
