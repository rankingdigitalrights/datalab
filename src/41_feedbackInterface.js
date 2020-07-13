/* 
  global
    Config,
    defineNamedRange,
    calculateCompanyWidth,
    returnFBStyleParams,
    addFBFrontMatter,
    appendFeedbackSection,
    elemsMetadata,
    metaIndyFilter

*/

function prefillFeedbackPage(Sheet, Company, Indicator, subStepID, outputParams) {

    Sheet.setColumnWidth(1, 28)
    Sheet.setColumnWidth(9, 28)
    Sheet.setColumnWidth(2, 125)
    Sheet.setColumnWidths(3, 6, Config.feedbackForms.dataColWidth)

    Sheet.setHiddenGridlines(true)

    let activeRow = 1

    let offsetCol = 2

    let indyLabel = Indicator.labelShort

    let companyWidth = calculateCompanyWidth(Company)

    let MetaData = metaIndyFilter(elemsMetadata, Indicator.labelShort)

    // let StyleSpecs

    // Front Matter

    // TODO: maybe implement Company/Service Specifics (N/A et al.)
    activeRow = addFBFrontMatter(Sheet, Indicator, MetaData, activeRow, offsetCol)

    // Content Section

    activeRow = appendFeedbackSection(Sheet, Company, Indicator, indyLabel, subStepID, companyWidth, activeRow, offsetCol, outputParams)

    cropEmptyColumns(Sheet, 1)
    cropEmptyRows(Sheet, 1)

}



function importSourcesSheet(SS, sheetName, CompanyObj, doOverwrite) {
    let sheet = insertSheetIfNotExist(SS, sheetName, doOverwrite)
    if (sheet !== null && doOverwrite) {
        sheet.clear()
    }
    produceSourceSheet(sheet)
    let targetCell = sheet.getRange(1, 1)
    let formula = "=IMPORTRANGE(\"" + CompanyObj.urlCurrentDataCollectionSheet + "\",\"" + Config.sourcesTabName + "!A1:G" + "\")"
    targetCell.setFormula(formula)
}
