function injectFeedbackBlock(Sheet, Company, Indicator, subStepID) {

    let activeRow = Sheet.getLastRow() + 2
    let offsetCol = 2

    let indyLabel = Indicator.labelShort

    let rangeWidth = Company.width

    activeRow = appendFBHeader(Sheet, activeRow, offsetCol, rangeWidth)

    activeRow = appendFBCompany(Sheet, activeRow, offsetCol, rangeWidth, Company, indyLabel)

    let isComments = false
    // TODO
    isComments = false
    activeRow = appendFBRows(isComments)

    // TODO
    isComments = true
    activeRow = appendFBRows(isComments)

    // TODO
    activeRow = appendFBSources(...)

}

function appendFBHeader(Sheet, activeRow, offsetCol, rangeWidth) {
    let Range = Sheet.getRange(activeRow, offsetCol, 1, rangeWidth + 1)
    Range.setValue("PRELIMINARY EVALUATION")
        .merge()
        .setHorizontalAlignment("center")
        .setBackground("#5ca5d9")
        .setFontColor("white")
        .setFontSize(14)
        .setFontWeight("bold")
        .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.SOLID_THICK)
    return activeRow + 2
}

function appendFBCompany(Sheet, activeRow, offsetCol, rangeWidth, Company, indyLabel) {

    let activeCol = offsetCol

    let Cell, cellValue

    // first cell: MainStep Label
    Sheet.getRange(activeRow, activeCol)
        .setValue(indyLabel)

    activeCol += 1

    // Company (group) column(s)
    Cell = Sheet.getRange(activeRow, activeCol)
        // .setValue("Group")
        .setValue(Company.groupLabel)
        .setBackground("#fff2cc")

    activeCol += 1

    // if no OpCom : skip

    if (Company.hasOpCom) {
        Cell = Sheet.getRange(activeRow, activeCol)
            .setBackground("#fff2cc")

        // Cell.setValue("Operating Company")
        Cell.setValue(Company.opComLabel)

        activeCol += 1
    }

    // for remaining columns (services)
    for (let i = 0; i < Company.services.length; i++) {
        Sheet.getRange(activeRow, activeCol)
            .setValue(Company.services[i].label.current)
            .setBackground("#b7e1cd")
        activeCol += 1
    }

    Sheet.getRange(activeRow, offsetCol, 1, rangeWidth + 1)
        .setFontWeight("bold")
        .setVerticalAlignment("middle")
        .setHorizontalAlignment("center")
        .setFontSize(12)

    Sheet.setRowHeight(activeRow, 30)

    // if (Config.freezeHead) {
    //     Sheet.setFrozenRows(activeRow) // freezes rows; define in config.json
    // }

    return activeRow + 2
}

// TODO: one generic function to rowwise import Element-level results or Element-level comments by named range from Input Sheet Step 3.2
function appendFBRows(isComments) {

    // use isComments to toggle between rowwise import of results vs comments
    console.log("--- Results")
}

// TODO:
function appendFBSources() {

    // use isComments to toggle between rowwise import of results vs comments
    console.log("--- Results")
}
