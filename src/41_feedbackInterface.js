/* 
  global
    Config,
    defineNamedRange,
    calculateCompanyWidthNet,
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

function prefillFeedbackPage(Sheet, Company, Indicator, MainStep, outputParams) {

    let companyWidth = calculateCompanyWidthNet(Company, Indicator, false)
    let layoutWidth = companyWidth < 3 ? 3 : companyWidth

    let localDataColWidth = companyWidth > 5 ? Math.floor(1680 / companyWidth) : Config.feedbackForms.dataColWidth
    Sheet.setColumnWidth(1, 28)
    // Sheet.setColumnWidth(9, 28)
    Sheet.setColumnWidth(2, 125)
    Sheet.setColumnWidths(3, layoutWidth, localDataColWidth)

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

    activeRow = appendFeedbackSection(Sheet, Company, Indicator, indyLabel, MainStep, layoutWidth, companyWidth, activeRow, offsetCol, outputParams)

    cropEmptyColumns(Sheet, 1)
    cropEmptyRows(Sheet, 1)

    let lastCol = Sheet.getLastColumn() + 1
    Sheet.setColumnWidth(lastCol, 28)
}
