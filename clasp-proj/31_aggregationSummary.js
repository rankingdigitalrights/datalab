function fillSummaryScoresSheet(Sheet, sheetModeID, Config, IndicatorsObj, thisSubStepID, Companies, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode) {

    var currentRow = 1
    var currentCol = 1

    currentCol = insertIndicatorColumn(Sheet, thisSubStepID, IndicatorsObj, currentRow, currentCol)

    // for company in companies
    // Company = Companies[0]

    Companies.forEach(function(Company) {
        currentCol = addCompanySummary(Sheet, thisSubStepID, IndicatorsObj, currentRow, currentCol, Company)
    })

}

function addCompanySummary(Sheet, thisSubStepID, IndicatorsObj, currentRow, currentCol, Company) {
    
    var blockLength = Company.services.length + 1 // 1 for group elem

    currentRow = addSummaryCompHeader(currentRow, currentCol, Sheet, Company)

    currentRow = addCompanyIndicatorScores(currentRow, currentCol, Sheet, Company, IndicatorsObj, thisSubStepID)
    
    return currentCol + blockLength
}

