// adds a single company level summary of indicator scores
// TODO: extend to allow element level scores + grouping

/* global 
    addSummaryCompanyHeader,
    addSummaryScoresRow,
    addCompanyScores
*/

/* exported addSummarySingleCompany */ // TODO: test whether this works

/**
 * @param {string} thisSubStepID
 * @param {any} IndicatorsObj
 * @param {number} currentRow
 * @param {number} currentCol
 * @param {{ services: string | any[]; }} Company
 * @param {boolean} includeElements
 */

function addSummarySingleCompany(Sheet, thisSubStepID, IndicatorsObj, indicatorParams, currentRow, currentCol, Company, includeElements) {

    var blockWidth = Company.services.length + 2 // for total + group elems

    var startRow = currentRow
    var lastRow
    var blockRange

    // 2 rows; company + service labels
    currentRow = addSummaryCompanyHeader(currentRow, currentCol, Sheet, Company)

    // --- // adding Total Scores // --- //

    /** as according to default Index layout this is happening in the wrong order twice (summary scores first, with overall totals before class totals, indicator results second) we need to anticipate the position and length of indicator class blocks. To do so, we sum up individual indicator class lengths only after passing totals and completing the first class. Other than that, this implementation can handle n classes with m indicators without additional modifications */

    var thisLength = 0
    var totalLength = 0
    var nrOfClasses = indicatorParams.length
    var classesLeft = 0

    // TODO: implement includeElements with Array of Indicator Cells

    for (var i = 0; i < nrOfClasses; i++) {
        thisLength = parseInt(indicatorParams[i])
        // Logger.log("thisLength: " + thisLength)
        classesLeft = nrOfClasses - i

        currentRow = addSummaryScoresRow(currentRow, currentCol, Sheet, blockWidth, thisLength, totalLength, classesLeft)

        if (i > 0) {
            totalLength += thisLength
            // Logger.log("totalLength: " + totalLength)
        }
    }

    lastRow = currentRow

    blockRange = Sheet.getRange(startRow, currentCol, lastRow - startRow, blockWidth)
    blockRange.setBorder(true, true, true, true, null, null, "black", null)

    // --- // adding Indicator level scores // --- //

    currentRow = addCompanyScores(currentRow, currentCol, Sheet, Company, IndicatorsObj, thisSubStepID, blockWidth, includeElements)

    return currentCol + blockWidth
}