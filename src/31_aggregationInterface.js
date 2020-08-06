// process to fill whole summary scores sheet

/* global
    insertLabelColumn,
    addSummarySingleCompany
*/


// eslint-disable-next-line no-unused-vars
function fillSummaryScoresSheet(Sheet, Indicators, thisSubStepID, Companies, indicatorParams, includeElements) {

    let currentRow = 1
    let currentCol = 1

    // left column: indicator labels

    currentCol = insertLabelColumn(Sheet, thisSubStepID, Indicators, currentRow, currentCol, includeElements)

    // now operating in currentCol + 1
    // Main part: horizontal company-wise results

    Companies.forEach(function (Company) {
        currentCol = addSummarySingleCompany(Sheet, thisSubStepID, Indicators, indicatorParams, currentRow, currentCol, Company, includeElements)
    })

    if (includeElements) {
        Sheet.collapseAllRowGroups()
    }

    let lastRow = Sheet.getLastRow()
    let lastColumn = Sheet.getLastColumn()

    Sheet.getRange(1, 1, lastRow, lastColumn)
        .setFontFamily("Roboto")
        .setFontSize(10)
        .setVerticalAlignment("top")

    return Sheet
}
