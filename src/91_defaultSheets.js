// --- // creates sources page // --- //

function produceSourceSheet(thisSheet, doFill) {

    let webArchiveLink = "=HYPERLINK(\"https://archive.org/web/\", \"Internet Archive\")"

    let columns = ["Source\nreference\nnumber", "Document title", "URL", "Date of document\n(if applicable)\nYYYY-MM-DD", "Date accessed\n\nYYYY-MM-DD", "Saved source link", "Has this policy changed from the previous year's Index?"]

    if (doFill) {
        thisSheet.appendRow(columns)
    }

    let lastCol = columns.length

    Logger.log("lastCol: " + lastCol)

    thisSheet.getRange(1, 1, 99, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
        .setWrap(true)
        .setFontSize(10)

    thisSheet.getRange(1, 1, 1, lastCol)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")
        .setFontSize(11)

    thisSheet.setColumnWidths(1, 1, 100)
    thisSheet.setColumnWidths(2, lastCol, 200)
    thisSheet.setColumnWidths(4, 2, 140)
    thisSheet.setFrozenRows(1)
}

function fillPrevOutcomeSheet(thisSheet, importedOutcomeTabName, externalFormula) {
    thisSheet.setName(importedOutcomeTabName)
    let cell = thisSheet.getActiveCell()
    cell.setValue(externalFormula.toString())
}

function insertPointValidationSheet(SS, SheetName) {
    let pointsSheet = insertSheetIfNotExist(SS, SheetName, true)
    if (pointsSheet !== null) {
        pointsSheet.clear()
        fillPointsSheet(pointsSheet)
    }

    return pointsSheet
}

function insertSheetConnector(SS, Companies) {

    let Sheet = insertSheetIfNotExist(SS, "Connector", true)

    let companyCells = []
    let companyName
    let companyUrl
    let formula
    let formulaPrefix = "=IMPORTRANGE(\""
    let formulaSuffix = "\", \"G1!B5\")"

    Companies.forEach(function (company) {
        companyName = company.label.current
        companyUrl = company.urlCurrentDataCollectionSheet
        formula = formulaPrefix + companyUrl + formulaSuffix
        companyCells.push([companyName, formula])
    })

    let arrayLength = companyCells.length
    if (arrayLength > 0) {
        let column = Sheet.getRange(1, 1, arrayLength, 2)
        column.setValues(companyCells)
    }

    return Sheet
}
