/* 
  global
    Config,
    defineNamedRange,
    calculateCompanyWidth,
    returnFBStyleParams,
    addFBFrontMatter,
    appendFeedbackSection,
    elemsMetadata,
    metaIndyFilter,
    cropEmptyColumns,
    cropEmptyRows,
    produceSourceSheet,
    insertSheetIfNotExist
*/

function prefillFeedbackPage(Sheet, Company, Indicator, SubStep, outputParams) {

    let companyWidth = calculateCompanyWidth(Company, true)

    Sheet.setColumnWidth(1, 28)
    // Sheet.setColumnWidth(9, 28)
    Sheet.setColumnWidth(2, 125)
    Sheet.setColumnWidths(3, companyWidth, Config.feedbackForms.dataColWidth)

    Sheet.setHiddenGridlines(true)

    let activeRow = 1

    let offsetCol = 2

    let indyLabel = Indicator.labelShort



    let MetaData = metaIndyFilter(elemsMetadata, Indicator.labelShort)

    // let StyleSpecs

    // Front Matter

    // TODO: maybe implement Company/Service Specifics (N/A et al.)
    activeRow = addFBFrontMatter(Sheet, Indicator, MetaData, activeRow, offsetCol)

    // Content Section

    activeRow = appendFeedbackSection(Sheet, Company, Indicator, indyLabel, SubStep, companyWidth, activeRow, offsetCol, outputParams)

    cropEmptyColumns(Sheet, 1)
    cropEmptyRows(Sheet, 1)

    let lastCol = Sheet.getLastColumn() + 1
    Sheet.setColumnWidth(lastCol, 28)
}
