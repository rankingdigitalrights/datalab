// fill whole summary scores sheet

function fillSummaryScoresSheet(Sheet, sheetModeID, Config, IndicatorsObj, thisSubStepID, Companies, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode, indicatorParams) {

    var currentRow = 1
    var currentCol = 1
    var blockRange

    // left column: indicator labels
    currentCol = insertIndicatorColumn(Sheet, thisSubStepID, IndicatorsObj, currentRow, currentCol, indicatorParams)

    // now operating in currentCol + 1
    // Main part: horizontal company-wise results
    Companies.forEach(function (Company) {
        currentCol = addSingleCompanySummary(Sheet, thisSubStepID, IndicatorsObj, indicatorParams, currentRow, currentCol, Company)
    })
}

function addSingleCompanySummary(Sheet, thisSubStepID, IndicatorsObj, indicatorParams, currentRow, currentCol, Company) {

    var blockWidth = Company.services.length + 2 // for total + group elems

    var startRow = currentRow
    var lastRow
    var blockRange

    // 2 rows; company + service labels
    currentRow = addSummaryCompanyHeader(currentRow, currentCol, Sheet, Company)

    // --- // adding Total Scores // --- //

    /** as this is happening in the wrong order twice (summary scores frist, with overall totals before class totals,  indicator results second) we need to anticipate the position and length on indicator class blocks. To do so, we sum up individual indicator class lengths only after passing totals and completing the frist class. Other than that, this implementation can handle n classes with m indicators without additional modifications */

    var thisLength = 0
    var totalLength = 0
    var classesLength = indicatorParams.length
    var elemsLeft = 0

    for (var i = 0; i < classesLength; i++) {
        thisLength = indicatorParams[i]
        elemsLeft = classesLength - i

        currentRow = addSummaryScoresRow(currentRow, currentCol, Sheet, blockWidth, IndicatorsObj, indicatorParams, thisSubStepID, thisLength, totalLength, elemsLeft)

        if (i > 0) {totalLength += thisLength}
    }

    lastRow = currentRow

    blockRange = Sheet.getRange(startRow,currentCol,lastRow - startRow,blockWidth)
    blockRange.setBorder(true, true, true, true, null, null, "black", null)

    // --- // adding Indicator level scores // --- //
    currentRow = addCompanyIndicatorScores(currentRow, currentCol, Sheet, Company, IndicatorsObj, thisSubStepID, blockWidth)

    return currentCol + blockWidth
}

