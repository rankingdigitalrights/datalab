// process to fill whole summary scores sheet

function fillSummaryScoresSheet(Sheet, IndicatorsObj, thisSubStepID, Companies, indicatorParams, includeElements) {

    var currentRow = 1
    var currentCol = 1

    // left column: indicator labels
    currentCol = insertIndicatorColumn(Sheet, thisSubStepID, IndicatorsObj, currentRow, currentCol, includeElements)

    // now operating in currentCol + 1
    // Main part: horizontal company-wise results
    Companies.forEach(function (Company) {
        currentCol = addSingleCompanySummary(Sheet, thisSubStepID, IndicatorsObj, indicatorParams, currentRow, currentCol, Company, includeElements)
    })

    return Sheet
}

// adds a single company level summary of indicator scores
// TODO: extend to allow element level scores + grouping

function addSingleCompanySummary(Sheet, thisSubStepID, IndicatorsObj, indicatorParams, currentRow, currentCol, Company, includeElements) {

    var blockWidth = Company.services.length + 2 // for total + group elems

    var startRow = currentRow
    var lastRow
    var blockRange

    // 2 rows; company + service labels
    currentRow = addSummaryCompanyHeader(currentRow, currentCol, Sheet, Company)

    // --- // adding Total Scores // --- //

    /** as this is happening in the wrong order twice (summary scores frist, with overall totals before class totals,  indicator results second) we need to anticipate the position and length on indicator class blocks. To do so, we sum up individual indicator class lengths only after passing totals and completing the first class. Other than that, this implementation can handle n classes with m indicators without additional modifications */

    var thisLength = 0
    var totalLength = 0
    var classesLength = indicatorParams.length
    var elemsLeft = 0

    for (var i = 0; i < classesLength; i++) {
        thisLength = indicatorParams[i]
        elemsLeft = classesLength - i

        currentRow = addSummaryScoresRow(currentRow, currentCol, Sheet, blockWidth, IndicatorsObj, indicatorParams, thisSubStepID, thisLength, totalLength, elemsLeft)

        if (i > 0) {
            totalLength += thisLength
        }
    }

    lastRow = currentRow

    blockRange = Sheet.getRange(startRow, currentCol, lastRow - startRow, blockWidth)
    blockRange.setBorder(true, true, true, true, null, null, "black", null)

    // --- // adding Indicator level scores // --- //
    currentRow = addCompanyIndicatorScores(currentRow, currentCol, Sheet, Company, IndicatorsObj, thisSubStepID, blockWidth)

    return currentCol + blockWidth
}