// process to fill whole summary scores sheet

/* global
    insertLabelColumn,
    addSummarySingleCompany
*/

function fillSummaryScoresSheet(Sheet, IndicatorsObj, thisSubStepID, Companies, indicatorParams, includeElements) {

    var currentRow = 1
    var currentCol = 1

    // left column: indicator labels

    currentCol = insertLabelColumn(Sheet, thisSubStepID, IndicatorsObj, currentRow, currentCol, includeElements)

    // now operating in currentCol + 1
    // Main part: horizontal company-wise results

    Companies.forEach(function (Company) {
        currentCol = addSummarySingleCompany(Sheet, thisSubStepID, IndicatorsObj, indicatorParams, currentRow, currentCol, Company, includeElements)
    })

    if (includeElements) {
        Sheet.collapseAllRowGroups()
    }

    var lastRow = Sheet.getLastRow();
    var lastColumn = Sheet.getLastColumn();

    Sheet.getRange(1, 1, lastRow, lastColumn)
        .setFontFamily("Roboto")
        .setFontSize(10)
        .setVerticalAlignment("top")

    return Sheet
}