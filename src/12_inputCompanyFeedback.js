// subcomponent moduloe to import company feedback from internal Company Feedback Sheet

/* global
    Config,

*/

function addBinaryFBCheck(SS, Sheet, Indicator, Company, activeRow, MainStep, rowLabel, companyNrOfServices) {

    let id = Company.id
    let horizontalDim = 1 + 2 + companyNrOfServices
    let titleWidth = companyNrOfServices == 1 || Company.hasOpCom ? 3 : 4
    let indicatorLabel = Indicator.labelShort

    let fbStatusRange = specialRangeName(id, Indicator.labelShort, "CoFBstatus")
    let fbStatusText = specialRangeName(id, Indicator.labelShort, "CoFBtext")

    let fbStatusFormula = checkFeedbackFormula(fbStatusRange)

    let Cell = Sheet.getRange(activeRow, 1)

    Cell.setValue(rowLabel + " " + indicatorLabel)
        .setBackground(MainStep.stepColor)
        .setFontWeight("bold")
        .setFontSize(11)
        .setHorizontalAlignment("center")

    Cell = Sheet.getRange(activeRow, 2, 1, titleWidth)
    Cell.merge()
        .setFormula(fbStatusFormula)
        .setFontStyle("italic")
        .setFontWeight("bold")
        .setFontSize(14)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")

    let rules = Sheet.getConditionalFormatRules()

    let yesRule = SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("yes")
        .setFontColor("#ff0000")
        .setRanges([Cell])
        .build()

    let noRule = SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("no")
        .setBackground("#b7e1cd")
        .setRanges([Cell])
        .build()

    rules.push(yesRule)
    rules.push(noRule)

    // rules.push(condRuleNewElem)
    Sheet.setConditionalFormatRules(rules)

    return activeRow + 1
}

function addImportFBText(SS, Sheet, Indicator, Company, activeRow, MainStep, rowLabel, companyNrOfServices) {

    let id = Company.id
    let horizontalDim = 1 + 2 + companyNrOfServices
    let titleWidth = companyNrOfServices == 1 || Company.hasOpCom ? 3 : 4
    let indicatorLabel = Indicator.labelShort

    let fbStatusRange = specialRangeName(id, Indicator.labelShort, "CoFBstatus")
    let fbStatusText = specialRangeName(id, Indicator.labelShort, "CoFBtext")

    let fbImportFormula = importFeedbackFormula(fbStatusRange, fbStatusText)

    let Cell = Sheet.getRange(activeRow, 1)

    Cell.setValue(rowLabel + " " + indicatorLabel)
        .setBackground(MainStep.stepColor)
        .setFontWeight("bold")
        .setFontSize(11)
        .setHorizontalAlignment("center")

    Cell = Sheet.getRange(activeRow, 2, 1, titleWidth)
    Cell.merge()
        .setFormula(fbImportFormula)
        .setFontStyle("italic")
        .setFontSize(10)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("top")

    Sheet.setRowHeight(activeRow, 100)

    return activeRow + 1
}

function addResearcherFBNotes(SS, Sheet, Indicator, Company, activeRow, MainStep, rowLabel, subCompId, companyNrOfServices) {
    let id = Company.id
    let horizontalDim = 1 + 2 + companyNrOfServices
    let titleWidth = companyNrOfServices == 1 || Company.hasOpCom ? 3 : 4
    let indicatorLabel = Indicator.labelShort

    let Cell, rangeName

    for (let i = 0; i < 2; i++) {
        Cell = Sheet.getRange(activeRow, 1)

        Cell.setValue("\nResearcher " + String.fromCharCode(65 + i) + "\n\n" + rowLabel + " " + Indicator.labelShort)
            .setBackground(MainStep.stepColor)
            .setFontWeight("bold")
            .setFontSize(11)
            .setHorizontalAlignment("center")
            .setVerticalAlignment("middle")

        Cell = Sheet.getRange(activeRow, 2, 1, titleWidth)

        Cell.merge()
            .setValue("Dummy Placeholder text to showcase / inspect readability and formatting")
            .setFontStyle("italic")
            .setFontSize(10)
            .setHorizontalAlignment("left")
            .setVerticalAlignment("top")

        let suffix = subCompId + (i + 1)
        rangeName = specialRangeName(id, Indicator.labelShort, suffix)

        SS.setNamedRange(rangeName, Cell)
        Sheet.setRowHeight(activeRow, 100)

        activeRow += 1
    }

    return activeRow
}


function checkFeedbackFormula(fbStatusRange) {
    let formula = '=SWITCH(' + fbStatusRange + ',"yes","yes","no","no","...pending...")'
    return formula
}


function importFeedbackFormula(fbStatusRange, fbStatusText) {
    let formula = '=SWITCH(' + fbStatusRange + ',"yes",' + fbStatusText + ', "no", "No Feedback provided", "...pending...")'
    return formula
}


// Backend Logic would be like this:

/*
function companyHasFeedBack(SS, indLabel) {
    let sheetName = Config.compFeedbackSheetName
    let indExists = isValueInColumn(SS, sheetName, 1, indLabel)
    let indFeedbackExists = indHasFeedback()
    let indFeedback = indReadFeedback()
    // TODO: Logic
}
*/
