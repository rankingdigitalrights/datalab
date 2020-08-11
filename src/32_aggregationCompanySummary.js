// adds a single company level summary of indicator scores
// TODO: extend to allow element level scores + grouping

/* global 
    addSummaryCompanyHeader,
    addCompanyTotalsRow,
    addCompanyScores
*/

/* exported addSummarySingleCompany */ // TODO: test whether this works

// eslint-disable-next-line no-unused-vars
function addSummarySingleCompany(Sheet, thisSubStepID, Indicators, indicatorParams, row, col, Company, includeElements) {

    let additionalCol = 2

    let blockWidth = Company.services.length + additionalCol // for total + group elems

    let startRow = row
    let lastRow
    let blockRange

    // 2 rows; company + service labels
    row = addSummaryCompanyHeader(row, col, Sheet, Company)

    let totalsRowStart = row

    // --- // adding Total Scores // --- //

    /** as according to default Index layout this is happening in the wrong order twice (summary scores first, with overall totals before class totals, indicator results second) we need to anticipate the position and length of indicator class blocks. To do so, we sum up individual indicator class lengths only after passing totals and completing the first class. Other than that, this implementation can handle n classes with m indicators without additional modifications */

    // TODO: test insertRows(SummaryBlock)

    let catLength = 0
    let totalLength = 0
    let nrOfClasses = indicatorParams.length
    let classesLeft = 0


    // --- // adding Indicator level scores // --- //

    let resultCells = []

    row = row + nrOfClasses
    row = addCompanyScores(row, col, Sheet, Company, Indicators, thisSubStepID, blockWidth, includeElements, resultCells)

    lastRow = row

    // --- // adding Totals // --- //

    // TODO: implement includeElements with Array of Indicator Cells

    row = totalsRowStart

    for (let i = 0; i < nrOfClasses; i++) {
        catLength = parseInt(indicatorParams[i])
        // Logger.log("catLength: " + catLength)
        classesLeft = nrOfClasses - i

        row = addCompanyTotalsRow(row, col, Sheet, blockWidth, catLength, totalLength, classesLeft, resultCells)

        if (i > 0) {
            totalLength += catLength
            // Logger.log("totalLength: " + totalLength)
        }
    }

    blockRange = Sheet.getRange(startRow, col, lastRow - startRow, blockWidth)
    blockRange.setBorder(true, true, true, true, null, null, "black", null)


    return col + blockWidth
}
