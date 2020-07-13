/* global
    Config,
    returnFBStyleParams,
    defineNamedRange
*/

function appendFeedbackSection(Sheet, Company, Indicator, indyLabel, subStepID, companyWidth, activeRow, offsetCol, outputParams) {
    // Results Section Header

    let StyleSpecs

    StyleSpecs = returnFBStyleParams("mainSection")
    activeRow = appendFBSectionHeader(Sheet, activeRow, offsetCol, companyWidth, StyleSpecs)

    // Company Column Labels Header
    activeRow = appendFBCompany(Sheet, activeRow, offsetCol, companyWidth, Company, indyLabel)

    // Results Block
    activeRow = appendFBRows(Sheet, Company, Indicator, subStepID, companyWidth, activeRow, offsetCol)

    // Year-on-Year Text Block
    StyleSpecs = returnFBStyleParams("yearOnYearSection")
    activeRow = appendFBSectionHeader(Sheet, activeRow, offsetCol, companyWidth, StyleSpecs)

    let extraLink = "=VLOOKUP(\"" + Indicator.labelShort + "\",'" + outputParams.yearOnYearHelperTabName + "'!A2:B,2,TRUE)"

    activeRow = addFreeTextBox(Sheet, Indicator, activeRow, offsetCol, companyWidth, StyleSpecs, extraLink)

    // Company Feedback Block
    StyleSpecs = returnFBStyleParams("feedbackBoxSection")
    activeRow = appendFBSectionHeader(Sheet, activeRow, offsetCol, companyWidth, StyleSpecs)

    activeRow = addFreeTextBox(Sheet, Indicator, activeRow, offsetCol, companyWidth, StyleSpecs, false)

    return activeRow + 2
}


function appendFBSectionHeader(Sheet, activeRow, offsetCol, companyWidth, StyleSpecs) {
    let Range = Sheet.getRange(activeRow, offsetCol, 1, companyWidth + 1)
    Range.setValue(StyleSpecs.label)
        .merge()
        .setHorizontalAlignment("center")
        .setBackground(StyleSpecs.backColor)
        .setFontColor(StyleSpecs.fontColor || "black")
        .setFontSize(14)
        .setFontWeight("bold")
        .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID_THICK)
    return activeRow + 2
}

function appendFBCompany(Sheet, activeRow, offsetCol, companyWidth, Company, indyLabel) {

    let activeCol = offsetCol

    let Cell

    // first cell: MainStep Label
    Sheet.getRange(activeRow, activeCol)
        .setValue(indyLabel)

    activeCol += 1

    // Company (group) column(s)
    Cell = Sheet.getRange(activeRow, activeCol)
        // .setValue("Group")
        .setValue(Company.groupLabel)
        .setBackground("#fff2cc")

    activeCol += 1

    // if no OpCom : skip

    if (Company.hasOpCom) {
        Cell = Sheet.getRange(activeRow, activeCol)
            .setBackground("#fff2cc")

        // Cell.setValue("Operating Company")
        Cell.setValue(Company.opComLabel)

        activeCol += 1
    }

    // for remaining columns (services)
    for (let i = 0; i < Company.services.length; i++) {
        Sheet.getRange(activeRow, activeCol)
            .setValue(Company.services[i].label.current)
            .setBackground("#b7e1cd")
        activeCol += 1
    }

    Sheet.setRowHeight(activeRow, 30)

    Sheet.getRange(activeRow, offsetCol, 1, companyWidth + 1)
        .setFontWeight("bold")
        .setVerticalAlignment("middle")
        .setHorizontalAlignment("center")
        .setFontSize(12)
        .setWrap(true)
        .setBorder(false, false, true, false, false, false, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    // if (Config.freezeHead) {
    //     Sheet.setFrozenRows(activeRow) // freezes rows; define in config.json
    // }

    return activeRow + 1
}

// TODO: one generic function to rowwise import Element-level results or Element-level comments by named range from Input Sheet Step 3.2
function appendFBRows(Sheet, Company, Indicator, subStepID, companyWidth, activeRow, offsetCol) {

    // row-labels

    let label, type, blockHeight
    let startRow = activeRow
    let activeCol = offsetCol
    let column = []

    for (let i = 0; i < 2; i++) {
        type = i === 0 ? "Result " : "Comment "

        Indicator.elements.forEach(Element => {
            label = type + Element.labelShort
            column.push([label])
        })

    }

    column.push(["Sources"])

    blockHeight = column.length

    Sheet.getRange(activeRow, activeCol, blockHeight, 1)
        .setValues(column)
        .setFontWeight("bold")

    // results / comments

    activeCol += 1

    let namedStepRange = defineNamedRange(Config.indexPrefix, "DC", subStepID, Indicator.labelShort, "", Company.id, "", "Step")

    let DCurl = Company.urlCurrentDataCollectionSheet
    let CompanySS = SpreadsheetApp.openById(DCurl)

    // let r1 = Sheet.getRange(activeRow - 1, 1, 2)
    // r1.setBackground("white")
    // r1.setFontColor("black")

    Logger.log("namedRange:" + namedStepRange)

    let range = CompanySS.getRange(namedStepRange)
    let rangeNotation, formula

    if (!Company.hasOpCom) {
        Logger.log("hasOpCom")
        rangeNotation = '"' + Indicator.labelShort + '!B' + range.getRow() + ":B" + range.getLastRow() + '"'
        Logger.log("range:" + rangeNotation)
        formula = '=IMPORTRANGE("' + DCurl + '",' + rangeNotation + ')'
        Logger.log("formula:" + formula)
        Sheet.getRange(activeRow, activeCol).setFormula(formula)

        rangeNotation = '"' + Indicator.labelShort + '!D' + range.getRow() + ":" + columnToLetter(range.getLastColumn()) + range.getLastRow() + '"'
        formula = '=IMPORTRANGE("' + DCurl + '",' + rangeNotation + ')'

        Logger.log("formula:" + formula)

        Sheet.getRange(activeRow, 4).setFormula(formula)

    } else {

        range = CompanySS.getRange(namedStepRange)
        rangeNotation = '"' + Indicator.labelShort + '!B' + range.getRow() + ":" + columnToLetter(range.getLastColumn()) + range.getLastRow() + '"'

        Logger.log("range:" + rangeNotation)
        Logger.log("activeRow:" + activeRow)

        formula = '=IMPORTRANGE("' + DCurl + '",' + rangeNotation + ')'

        Logger.log("formula:" + formula)

        Sheet.getRange(activeRow, activeCol).setFormula(formula)

    }

    // formatting of results block

    let partBlockLength

    Sheet.getRange(activeRow, offsetCol, blockHeight, companyWidth + 1)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("top")
        .setWrap(true)

    partBlockLength = (blockHeight / 2 - 1)
    Sheet.getRange(activeRow + partBlockLength, offsetCol, 1, companyWidth + 1)
        .setBorder(false, false, true, false, false, false, "black", SpreadsheetApp.BorderStyle.DOTTED)

    partBlockLength = (blockHeight - 2)
    Sheet.getRange(activeRow + partBlockLength, offsetCol, 1, companyWidth + 1)
        .setBorder(false, false, true, false, false, false, "black", SpreadsheetApp.BorderStyle.DOTTED)

    // Sheet.getRange(startRow, offsetCol, blockHeight, companyWidth + 1)
    //     .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.DOTTED)

    return activeRow + blockHeight + 1
}

function addFreeTextBox(Sheet, Indicator, activeRow, offsetCol, companyWidth, StyleSpecs, extraLink) {

    let rowLabel = Indicator.labelShort + StyleSpecs.rowLabel

    let Cell
    let activeCol = offsetCol

    // Main Row Label
    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(rowLabel)
        .setBackground(StyleSpecs.backColor)
        .setFontWeight("bold")
        .setFontSize(13)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setWrap(true)

    Sheet.setRowHeight(activeRow, StyleSpecs.contentRowHeight)

    // Optional Row Label
    if (StyleSpecs.extraRow) {

        Sheet.getRange(activeRow + 1, activeCol)
            .setValue(StyleSpecs.extraRowLabel)
            .setBackground(StyleSpecs.backColor)
            .setFontWeight("bold")
            .setFontSize(12)
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle")
            .setWrap(true)
    }

    // Main Row Content
    activeCol += 1

    let cellValue = extraLink ? extraLink : "Dummy Placeholder text to showcase / inspect readability and formatting"
    Sheet.getRange(activeRow, activeCol, 1, companyWidth).merge()
        .setValue(cellValue)
        .setFontSize(12)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("top")

    Sheet.getRange(activeRow, offsetCol, 1, companyWidth + 1)
        .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.DOTTED)

    // Optional Row Content

    if (StyleSpecs.extraRow) {

        Sheet.getRange(activeRow + 1, activeCol, 1, companyWidth).merge()
            .setFontSize(12)
            .setHorizontalAlignment("left")
            .setVerticalAlignment("top")

        Sheet.getRange(activeRow + 1, offsetCol, 1, companyWidth + 1)
            .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.DOTTED)

        activeRow += 1
    }

    return activeRow + 2
}

// TODO:
function appendFBSources() {

    // use isComments to toggle between rowwise import of results vs comments
    console.log("--- Results")
}

function columnToLetter(column) {
    var temp, letter = ""
    while (column > 0) {
        temp = (column - 1) % 26
        letter = String.fromCharCode(temp + 65) + letter
        column = (column - temp - 1) / 26
    }
    return letter
}
