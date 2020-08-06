// --- // creates sources page // --- //

function produceSourceSheet(Sheet, doFill) {

    let webArchiveLink = "=HYPERLINK(\"https://archive.org/web/\", \"Internet Archive\")"

    let columns = ["Source\nreference\nnumber", "Document title", "URL", "Date of document\n(if applicable)\nYYYY-MM-DD", "Date accessed\n\nYYYY-MM-DD", "Saved source link", "Has this policy changed from the previous year's Index?"]

    if (doFill) {
        Sheet.appendRow(columns)
    }

    let lastCol = columns.length

    Logger.log("lastCol: " + lastCol)

    Sheet.getRange(1, 1, 99, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
        .setWrap(true)
        .setFontSize(10)

    Sheet.getRange(1, 1, 1, lastCol)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")
        .setFontSize(11)

    Sheet.setColumnWidths(1, 1, 100)
    Sheet.setColumnWidths(2, lastCol, 200)
    Sheet.setColumnWidths(4, 2, 140)
    Sheet.setFrozenRows(1)
}

function fillPrevOutcomeSheet(Sheet, importedOutcomeTabName, externalFormula) {
    Sheet.setName(importedOutcomeTabName)
    let cell = Sheet.getActiveCell()
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

function insertCompanyFeedbackSheet(SS, SheetName, Company, Indicators, updateSheet) {
    let Sheet = insertSheetIfNotExist(SS, SheetName, updateSheet)
    if (Sheet !== null && updateSheet) {
        Sheet.clear()
        fillCompanyFeedbackInputSheet(SS, Sheet, Company, Indicators)
    }

    return Sheet
}

function insertSheetConnector(SS, Companies, Mode) {

    let Sheet = insertSheetIfNotExist(SS, "Connector", true)

    let companyCells = []
    let companyName
    let companyUrl
    let formula
    let formulaPrefix = "=IMPORTRANGE(\""
    let formulaSuffix = "\", \"G1!A9\")"

    Companies.forEach(function (company) {
        companyName = company.label.current

        switch (Mode) {
            case "Scores":
                companyUrl = company.urlCurrentCompanyScoringSheet
                break
            case "Input":
                companyUrl = company.urlCurrentDataCollectionSheet
                break
            default:
                companyUrl = company.urlCurrentCompanyScoringSheet
                break
        }

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

// function produceCompanyFeedbackSheet(Sheet, Company, Indicators) {

//     let header = ["Indicator", "Feedback returned?", "Feedback Text"]
//     Sheet.appendRow([header])

//     let StatusCell, ValueCell, namedRange


//     Indicators.forEach(Indicator, index =>

//     )


// }

// TODO: Fix this in Aligment with Input Sheet process

function importSourcesSheet(SS, sheetName, Company, doOverwrite) {

    let sheet = insertSheetIfNotExist(SS, sheetName, doOverwrite)

    if (sheet !== null && doOverwrite) {
        // sheet.clear()
        // produceSourceSheet(sheet)
        let targetCell = sheet.getRange(4, 2)
        let formula = `QUERY(IMPORTRANGE("${Company.urlCurrentDataCollectionSheet}","${Config.sourcesTabName} !A1:C"), "select Col1, Col2, Col3", 1)`
        // let formula = "=IMPORTRANGE(\"" + Company.urlCurrentDataCollectionSheet + "\",\"" + Config.sourcesTabName + "!A1:G" + "\")"
        targetCell.setFormula(formula)
    } else {
        console.log("WARNING: Sources Tab already exists. Skipping!")
    }
}

// simplified Sources Table Import for Company Feedback Forms

function importFBSourcesSheet(SS, sheetName, Company, doOverwrite) {

    let Sheet = insertSheetIfNotExist(SS, sheetName, doOverwrite)

    if (Sheet !== null && doOverwrite) {
        // Sheet.clear()
        // produceSourceSheet(Sheet)
        let targetCell = Sheet.getRange(4, 2)
        // let formula = `QUERY(IMPORTRANGE("${Company.urlCurrentDataCollectionSheet}","${Config.sourcesTabName}!A1:C"), "select Col1, Col2, Col3", 1)`
        let formula = `IMPORTRANGE("${Company.urlCurrentDataCollectionSheet}","${Config.sourcesTabName}!A1:C")`
        targetCell.setFormula(formula)
        // cropEmptyRows(Sheet, 2)
    } else {
        console.log("WARNING: Sources Tab already exists. Skipping!")
    }
}
