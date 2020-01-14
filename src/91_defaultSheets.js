// --- // creates sources page // --- //

function fillSourceSheet(thisSheet) {

    var webArchiveLink = "=HYPERLINK(\"https://archive.org/web/\", \"Internet Archive\")"
    thisSheet.appendRow(["Source\nreference\nnumber", "Document title", "URL", "Date of document\n(if applicable)\nYYYY-MM-DD", "Date accessed\nYYYY-MM-DD", "Saved source link", webArchiveLink, "Has this policy changed from the previous year's Index?"])

    var lastCol = thisSheet.getLastColumn()

    thisSheet.getRange(1, 1, 1, lastCol)
        .setFontFamily("Roboto")
        .setFontWeight("bold")
        .setVerticalAlignment("top")
        .setHorizontalAlignment("center")
        .setWrap(true)
        .setFontSize(11)

    thisSheet.getRange(2, 1, 99, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
        .setWrap(true)
        .setFontSize(10)

    thisSheet.setColumnWidths(1, 1, 100)
    thisSheet.setColumnWidths(2, lastCol, 200)
    thisSheet.setFrozenRows(1)
}

function fillPrevOutcomeSheet(thisSheet, importedOutcomeTabName, externalFormula) {
    thisSheet.setName(importedOutcomeTabName)
    var cell = thisSheet.getActiveCell()
    cell.setValue(externalFormula.toString())
}

function insertPointValidationSheet(SS, SheetName) {
    var pointsSheet = insertSheetIfNotExist(SS, SheetName, false)
    if (pointsSheet !== null) {
        fillPointsSheet(pointsSheet)
    }

    return pointsSheet
}

function fillPointsSheet(pointsSheet) {
    pointsSheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A", "not piloted"])
    pointsSheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude", "exclude"])
    pointsSheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude", "exclude"])
}

function insertSheetConnector(SS, Companies) {

    var Sheet = insertSheetIfNotExist(SS, "Connector", true)

    var companyCells = []
    var companyName
    var companyUrl
    var formula
    var formulaPrefix = "=IMPORTRANGE(\""
    var formulaSuffix = "\", \"G1!B5\")"

    Companies.forEach(function (company) {
        companyName = company.label.current
        companyUrl = company.urlCurrentDataCollectionSheet
        formula = formulaPrefix + companyUrl + formulaSuffix
        companyCells.push([companyName, formula])
    })

    var arrayLength = companyCells.length
    if (arrayLength > 0) {
        var column = Sheet.getRange(1, 1, arrayLength, 2)
        column.setValues(companyCells)
    }

    return Sheet
}