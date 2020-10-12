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

        if (!doRepairsOnly) {
            Cell.merge()
                .setValue("Dummy Placeholder text to showcase / inspect readability and formatting")
        }

        Cell.setFontStyle("italic")
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

// special feedback evaluation helper
// checks if input was provided
function addFeedbackStepReview(SS, Sheet, Indicator, Company, isNewCompany, activeRow, mainStepNr, Substep, stepCNr, Category, companyNrOfServices) {

    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id
    let mode = Substep.mode

    // for first review, check if Substep should review the outcome from a different Index; if yes, change compared Index Prefix 

    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    let importStepID = StepComp.importStepID // "S07"
    let evaluationStep = StepComp.evaluationStep // the binary Review or Eval Substep which is evaluated
    let comparisonType = StepComp.comparisonType // "DC",

    let reviewCell, prevResultCell

    let yesAnswer = StepComp.mode === "YonY" ? "no change" : "not selected"

    let naText = "not selected"

    // for linking to Named Range of Substep 0
    // TODO: make a shared function() between importYonY & addResultsReview

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows
    let rangeCols
    let rule

    rule = SpreadsheetApp.newDataValidation().requireValueInList(StepComp.dropdown).build()

    let Cell, cellValue, Element, noteString, cellID, hasPredecessor, isRevised

    let activeCol

    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let ElementSpecs
    let companyType = Company.type

    let id = Company.id

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        Element = Elements[elemNr]
        ElementSpecs = checkElementSpecs(Element)

        hasPredecessor = Element.y2yResultRow ? true : false
        isRevised = Element.isRevised ? true : false

        // 1.) Row Labels

        activeCol = 1
        cellValue = StepComp.rowLabel + Element.labelShort

        noteString = Element.labelShort + ": " + Element.description

        cellValue += isRevised ? (" (rev.)") : !hasPredecessor ? (" (new)") : ""

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)
            .setFontWeight("bold")
            .setNote(noteString)

        activeCol += 1

        let serviceLabel, serviceType

        for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) {

            // TODO: Switch case

            if (serviceNr == 1) {
                serviceLabel = "group"
                serviceType = "group"
            } else if (serviceNr == 2) {
                serviceLabel = "opCom"
                serviceType = "opCom"
            } else {
                let s = serviceNr - 3
                serviceLabel = Company.services[s].id
                serviceType = Company.services[s].type
            }

            Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, serviceLabel, stepCompID)

            if (makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs)) {
                cellValue = "N/A"
            } else {

                if (serviceNr == 2 && Company.hasOpCom == false) {
                    cellValue = "N/A" // if no OpCom, pre-select N/A
                } else {

                    if (hasPredecessor || mainStepNr > 1) {

                        reviewCell = specialRangeName(id, Indicator.labelShort, "CoFBstatus")

                        cellValue = "=IF(" + reviewCell + "=\"no\"" + "," + "\"no\"" + "," + "\"not selected\"" + ")"

                    } else {
                        cellValue = naText
                    }

                    // creates dropdown list
                    Cell.setDataValidation(rule)
                }
            }

            if (!doRepairsOnly) {
                Cell.setValue(cellValue)
            }

            SS.setNamedRange(cellID, Cell) // names cells

            activeCol += 1

        } // Element END
    } // Elements Iteration END

    activeRow = activeRow + elementsNr

    rangeCols = activeCol
    rangeRows = elementsNr

    Sheet.getRange(rangeStartRow, rangeStartCol + 1, rangeRows, rangeCols)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")

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
