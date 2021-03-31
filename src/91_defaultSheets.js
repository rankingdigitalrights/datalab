// --- // Collection of Default frequently used Sheets // --- //

/* global
    Config, insertSheetIfNotExist, fillPointsSheet, fillCompanyFeedbackInputSheet, cropEmptyColumns, cropEmptyRows
*/

// --- // Sources Collection Table for Input Sheets // --- //

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

    // simple toggle to skip writing to the header row
    // i.e. !doFill will only apply formatting
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

// simplified way to add an array of IMPORTRANGE calls to a sheet

// eslint-disable-next-line no-unused-vars
function fillSheetWithImportRanges(Sheet, sheetname, formulas) {
    Sheet.setName(sheetname)
    let range = Sheet.getRange(1, 1, 1, formulas.length)
    range.setValues([formulas])
}

// inserts the Scoring Evaluation/Validation Sheet into
// Output sheets. The sheet is used for calculating Scores
// see 96_scoringFormulasHelper.js for the content
// eslint-disable-next-line no-unused-vars
function insertPointValidationSheet(SS, SheetName) {
    let pointsSheet = insertSheetIfNotExist(SS, SheetName, true)
    if (pointsSheet !== null) {
        pointsSheet.clear() // purge to maintain integrity
        fillPointsSheet(pointsSheet)
    }

    return pointsSheet
}

/** Core for the Company Feedback setup
 * adds a Company Feedback Tab to Input sheets, and
 * for each Indicator adds named ranges later used to Import Feedback
 * into Step 4/5 for each Indicator
 * default: will not overwrite existing sheet
 */

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

/** universal Spreadsheet connector Sheet for convinient
 * click-click-click connecting to any imported Company-level
 * spreadsheets from a single table
 * @param company.urlCurrentOutputSheet and
 * @param company.urlCurrentInputSheet
 * need to exist in @file json/JSON_Companies.js
 * */

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

/** For Company Feedback Forms
 * connects to existing Sources tab in Company Feedback form
 * and imports a subset of columns from a Input Sheet Sources tab
 * TODO: Maintain this in Sync with Input Sheet Sources module
 * TODO: make subset Columns a @param
 */

// eslint-disable-next-line no-unused-vars
function importSourcesSheet(SS, sheetName, Company, doOverwrite) {
    let sheet = insertSheetIfNotExist(SS, sheetName, doOverwrite)

    if (sheet !== null && doOverwrite) {
        // sheet.clear() // will delete the header rows, so don't do

        // row 4 since Header rows have already been added when producing
        // the Feedback form with produceSourceSheet(sheet)
        let targetCell = sheet.getRange(4, 2)

        // subsets particular columns from the Sources tab
        let formula = `QUERY(IMPORTRANGE("${Company.urlCurrentInputSheet}","${Config.sourcesTabName}!A1:C"), "select Col1, Col2, Col3", 1)`
        // let formula = "=IMPORTRANGE(\"" + Company.urlCurrentInputSheet + "\",\"" + Config.sourcesTabName + "!A1:G" + "\")" // import all columns
        targetCell.setFormula(formula)
    } else {
        console.log('WARNING: Sources Tab already exists. Skipping!')
    }
}

// same as above but simplified
// subset is hardcoded
// TODO: obsolete; deprecate

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
