// --- // creates sources page // --- //

/* global
    Config, insertSheetIfNotExist, fillPointsSheet, fillCompanyFeedbackInputSheet, cropEmptyColumns, cropEmptyRows
*/
// eslint-disable-next-line no-unused-vars
function produceSourceSheet(Sheet, doFill) {
    // let webArchiveLink = '=HYPERLINK("https://archive.org/web/", "Internet Archive")'

    let columns = [
        'Source\nreference\nnumber',
        'Document title',
        'URL',
        'Date of document\n(if applicable)\nYYYY-MM-DD',
        'Date accessed\n\nYYYY-MM-DD',
        'Saved source link',
        'Has this policy changed from the previous year’s Index?',
    ]

    if (doFill) {
        Sheet.appendRow(columns)
    }

    let lastCol = columns.length

    console.log('lastCol: ' + lastCol)

    Sheet.getRange(1, 1, 99, lastCol).setFontFamily('Roboto').setVerticalAlignment('top').setWrap(true).setFontSize(10)

    Sheet.getRange(1, 1, 1, lastCol).setFontWeight('bold').setHorizontalAlignment('center').setFontSize(11)

    Sheet.setColumnWidths(1, 1, 100)
    Sheet.setColumnWidths(2, lastCol, 200)
    Sheet.setColumnWidths(4, 2, 140)
    Sheet.setFrozenRows(1)
}

// eslint-disable-next-line no-unused-vars
function fillSheetWithImportRanges(Sheet, sheetname, formulas) {
    Sheet.setName(sheetname)
    let range = Sheet.getRange(1, 1, 1, formulas.length)
    range.setValues([formulas])
}

// eslint-disable-next-line no-unused-vars
function insertPointValidationSheet(SS, SheetName) {
    let pointsSheet = insertSheetIfNotExist(SS, SheetName, true)
    if (pointsSheet !== null) {
        pointsSheet.clear()
        fillPointsSheet(pointsSheet)
    }

    return pointsSheet
}

// eslint-disable-next-line no-unused-vars
function insertCompanyFeedbackSheet(SS, SheetName, Company, Indicators, updateSheet = false) {
    let Sheet = insertSheetIfNotExist(SS, SheetName, updateSheet)
    if (Sheet !== null) {
        console.log('--- writing Feedback tab')
        Sheet.clear()
        fillCompanyFeedbackInputSheet(SS, Sheet, Company, Indicators)
        cropEmptyColumns(Sheet, 1)
        cropEmptyRows(Sheet, 1)
        console.log('Feedback Tab produced / updated')
    } else {
        console.log('ignoring Feedback tab')
    }
    return Sheet
}

// eslint-disable-next-line no-unused-vars
function insertSheetConnector(SS, Companies, Mode) {
    let Sheet = insertSheetIfNotExist(SS, 'Connector', true)

    let companyCells = []
    let companyName
    let companyUrl
    let formula
    let formulaPrefix = '=IMPORTRANGE("'
    let formulaSuffix = '", "G1!A9")'

    Companies.forEach(function (company) {
        companyName = company.label.current

        switch (Mode) {
            case 'Scores':
                companyUrl = company.urlCurrentOutputSheet
                break
            case 'Input':
                companyUrl = company.urlCurrentInputSheet
                break
            default:
                companyUrl = company.urlCurrentOutputSheet
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

// eslint-disable-next-line no-unused-vars
function importSourcesSheet(SS, sheetName, Company, doOverwrite) {
    let sheet = insertSheetIfNotExist(SS, sheetName, doOverwrite)

    if (sheet !== null && doOverwrite) {
        // sheet.clear()
        // produceSourceSheet(sheet)
        let targetCell = sheet.getRange(4, 2)
        let formula = `QUERY(IMPORTRANGE("${Company.urlCurrentInputSheet}","${Config.sourcesTabName} !A1:C"), "select Col1, Col2, Col3", 1)`
        // let formula = "=IMPORTRANGE(\"" + Company.urlCurrentInputSheet + "\",\"" + Config.sourcesTabName + "!A1:G" + "\")"
        targetCell.setFormula(formula)
    } else {
        console.log('WARNING: Sources Tab already exists. Skipping!')
    }
}

// simplified Sources Table Import for Company Feedback Forms

// eslint-disable-next-line no-unused-vars
function importFBSourcesSheet(SS, sheetName, Company, doOverwrite) {
    let Sheet = insertSheetIfNotExist(SS, sheetName, doOverwrite)

    if (Sheet !== null && doOverwrite) {
        // Sheet.clear()
        // produceSourceSheet(Sheet)
        let targetCell = Sheet.getRange(4, 2)
        // let formula = `QUERY(IMPORTRANGE("${Company.urlCurrentInputSheet}","${Config.sourcesTabName}!A1:C"), "select Col1, Col2, Col3", 1)`
        let formula = `IMPORTRANGE("${Company.urlCurrentInputSheet}","${Config.sourcesTabName}!A1:C")`
        targetCell.setFormula(formula)
        // cropEmptyRows(Sheet, 2)
    } else {
        console.log('WARNING: Sources Tab already exists. Skipping!')
    }
}
