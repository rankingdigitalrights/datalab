/* global
    Config,
    returnFBStyleParams,
    defineNamedRange
*/

function appendFeedbackSection(Sheet, Company, Indicator, indyLabel, MainStep, layoutWidth, companyWidth, activeRow, offsetCol, outputParams) {
    // Results Section Header

    let mainStepNr = MainStep.step

    let subStepNr = outputParams.feedbackSubstepResults // feedbackSubstepYonYComments
    let SubStep = MainStep.substeps[subStepNr]
    let subStepID = SubStep.subStepID

    let contentTypes = []
    let includeSourcesRow
    let StyleSpecs

    let omitOpCom = false

    StyleSpecs = returnFBStyleParams("mainSection")
    activeRow = appendFBSectionHeader(Sheet, activeRow, offsetCol, layoutWidth, StyleSpecs)

    // Company Column Labels Header
    activeRow = appendFBCompanyHeader(Sheet, Indicator, activeRow, offsetCol, layoutWidth, companyWidth, Company, indyLabel)

    // Results Block
    // activeRow = appendFBRowsOld(Sheet, Company, Indicator, SubStep, companyWidth, activeRow, offsetCol)
    contentTypes.push("reviewResults")
    contentTypes.push("reviewComments")
    includeSourcesRow = true


    activeRow = appendFBRows(Sheet, Company, Indicator, SubStep, mainStepNr, subStepNr, contentTypes, includeSourcesRow, layoutWidth, companyWidth, activeRow, offsetCol, omitOpCom)

    // Year-on-Year Text Block

    StyleSpecs = returnFBStyleParams("yearOnYearSection")
    activeRow = appendFBSectionHeader(Sheet, activeRow, offsetCol, layoutWidth, StyleSpecs)

    subStepNr = outputParams.feedbackSubstepYonYComments
    SubStep = MainStep.substeps[subStepNr]

    contentTypes = []
    contentTypes.push("comments")
    includeSourcesRow = false

    activeRow = appendFBRows(Sheet, Company, Indicator, SubStep, mainStepNr, subStepNr, contentTypes, includeSourcesRow, layoutWidth, companyWidth, activeRow, offsetCol, omitOpCom)

    // let extraLink = "=VLOOKUP(\"" + Indicator.labelShort + "\",'" + outputParams.yearOnYearHelperTabName + "'!A2:B,2,TRUE)"

    // activeRow = addFreeTextBox(Sheet, Indicator, activeRow, offsetCol, layoutWidth, StyleSpecs, extraLink)

    // Company Feedback Block
    StyleSpecs = returnFBStyleParams("feedbackBoxSection")
    activeRow = appendFBSectionHeader(Sheet, activeRow, offsetCol, layoutWidth, StyleSpecs)

    activeRow = addFBExtraInstruction(Sheet, Indicator, activeRow, offsetCol, layoutWidth, StyleSpecs)

    activeRow = addFreeTextBox(Sheet, Indicator, activeRow, offsetCol, layoutWidth, StyleSpecs, false)

    return activeRow + 2
}

function appendFBSectionHeader(Sheet, activeRow, offsetCol, layoutWidth, StyleSpecs) {

    let Range = Sheet.getRange(activeRow, offsetCol, 1, layoutWidth + 1)

    Range.setValue(StyleSpecs.label)
        .merge()
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setBackground(StyleSpecs.backColor)
        .setFontColor(StyleSpecs.fontColor || "black")
        .setFontSize(14)
        .setFontWeight("bold")
        .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.DOTTED)

    Sheet.setRowHeight(activeRow, 40)

    return activeRow + 2
}

function appendFBCompanyHeader(Sheet, Indicator, activeRow, offsetCol, layoutWidth, companyWidth, Company, indyLabel) {

    let activeCol = offsetCol

    let Cell

    // first cell: MainStep Label
    Sheet.getRange(activeRow, activeCol)
        .setValue(indyLabel)

    activeCol += 1

    if (Indicator.scoringScope === "full" || Indicator.scoringScope === "company") {
        // Company (group) column(s)
        Cell = Sheet.getRange(activeRow, activeCol)
            // .setValue("Group")
            .setValue(Company.groupLabel)

        activeCol += 1

        // if no OpCom : skip

        if (Company.hasOpCom) {
            Cell = Sheet.getRange(activeRow, activeCol)

            // Cell.setValue("Operating Company")
            Cell.setValue(Company.opComLabel)

            activeCol += 1
        }

    }

    if (Indicator.scoringScope === "full" || Indicator.scoringScope === "services") {

        // for remaining columns (services)
        for (let i = 0; i < Company.services.length; i++) {
            Sheet.getRange(activeRow, activeCol)
                .setValue(Company.services[i].label.current)
            activeCol += 1
        }

    }

    Sheet.setRowHeight(activeRow, 30)

    Sheet.getRange(activeRow, offsetCol, 1, layoutWidth + 1)
        .setFontWeight("bold")
        .setVerticalAlignment("middle")
        .setHorizontalAlignment("center")
        .setFontSize(12)
        .setWrap(true)
        .setBorder(false, false, true, false, false, true, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    Sheet.getRange(activeRow, offsetCol + 1, 1, layoutWidth)
        .setBackground("#fff2cc")

    // if (Config.freezeHead) {
    //     Sheet.setFrozenRows(activeRow) // freezes rows; define in config.json
    // }

    return activeRow + 1
}

// TODO: one generic function to rowwise import Element-level results or Element-level comments by named range from Input Sheet Step 3.2

function appendFBRows(Sheet, Company, Indicator, SubStep, mainStepNr, subStepNr, contentTypes, includeSourcesRow, layoutWidth, companyWidth, activeRow, offsetCol, omitOpCom) {

    let startRow, endRow, block

    startRow = activeRow

    console.log(`Array received: ${contentTypes}`)

    contentTypes.forEach(contentType =>
        activeRow = importContentBlock(Sheet, Company, Indicator, SubStep, mainStepNr, subStepNr, contentType, activeRow, offsetCol, omitOpCom, layoutWidth, companyWidth))

    if (includeSourcesRow) {
        activeRow = importContentRow(Sheet, Company, Indicator, SubStep, mainStepNr, subStepNr, "sources", activeRow, offsetCol, omitOpCom, layoutWidth, companyWidth)
    }

    endRow = activeRow

    block = Sheet.getRange(startRow, offsetCol, endRow - startRow, layoutWidth + 1)
        .setVerticalAlignment("top")
        .setBorder(true, null, true, null, null, null, "black", SpreadsheetApp.BorderStyle.SOLID)
        .setFontSize(12)

    block = Sheet.getRange(startRow, offsetCol + 1, endRow - startRow, layoutWidth)
        .setWrap(true)

    return activeRow + 1
}

function addFreeTextBox(Sheet, Indicator, activeRow, offsetCol, layoutWidth, StyleSpecs, extraLink) {

    let rowLabel = Indicator.labelShort + StyleSpecs.rowLabel

    let Cell
    let activeCol = offsetCol

    // Main Row Label
    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(rowLabel)
        .setBackground(StyleSpecs.backColor)
        .setFontWeight("bold")
        .setFontSize(13)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setWrap(true)

    Sheet.setRowHeight(activeRow, StyleSpecs.contentRowHeight)

    // Optional Row Label
    if (StyleSpecs.extraRow) {

        Sheet.getRange(activeRow + 1, activeCol)
            .setValue(StyleSpecs.extraRowLabel)
            .setBackground(StyleSpecs.backColor)
            .setFontWeight("bold")
            .setFontSize(12)
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle")
            .setWrap(true)
    }

    // Main Row Content
    activeCol += 1

    let cellValue = extraLink ? extraLink : "Dummy Placeholder text to showcase / inspect readability and formatting"
    Sheet.getRange(activeRow, activeCol, 1, layoutWidth).merge()
        .setValue(cellValue)
        .setFontSize(12)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("top")

    Sheet.getRange(activeRow, offsetCol, 1, layoutWidth + 1)
        .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.DOTTED)

    // Optional Row Content

    if (StyleSpecs.extraRow) {

        Sheet.getRange(activeRow + 1, activeCol, 1, layoutWidth).merge()
            .setFontSize(12)
            .setHorizontalAlignment("left")
            .setVerticalAlignment("top")

        Sheet.getRange(activeRow + 1, offsetCol, 1, layoutWidth + 1)
            .setBorder(true, true, true, true, false, false, "black", SpreadsheetApp.BorderStyle.DOTTED)

        activeRow += 1
    }

    return activeRow + 2
}

function addFBExtraInstruction(Sheet, Indicator, activeRow, offsetCol, layoutWidth, StyleSpecs) {

    Sheet.getRange(activeRow, offsetCol + 1, 1, 3)
        .merge()
        .setValue(StyleSpecs.extraInstructionFB)
        // .setBackground(StyleSpecs.backColor)
        .setFontStyle("italic")
        .setFontSize(13)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setWrap(true)

    return activeRow + 2
}

function columnToLetter(column) {
    let temp, letter = ""
    while (column > 0) {
        temp = (column - 1) % 26
        letter = String.fromCharCode(temp + 65) + letter
        column = (column - temp - 1) / 26
    }
    return letter
}
