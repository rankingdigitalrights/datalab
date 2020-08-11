/* global
    Config,
    indexPrefix,
    defineNamedRange,
    columnToLetterYonY,
    doRepairsOnly
*/

// Imports previous year's outcome as Substep 0

function importYonYResults(SS, Sheet, Indicator, category, Company, isNewCompany, activeRow, Substep, stepCNr, nrOfSubIndicators, companyNrOfServices, isComments) {

    let comparisonIndexPrefix = Config.prevIndexPrefix

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id

    let importStepID = StepComp.importStepID // "S07"
    let comparisonType = StepComp.comparisonType // "DC",

    // for stepwise formatting
    // TODO
    let rangeStart, rangeEnd, Range, width, rangeName
    width = 1 + 2 + companyNrOfServices

    rangeStart = activeRow
    let rangeStartCol = 1
    let rangeRows, rangeCols, stepRange, dataRange

    let Cell, cellID, Element, subIndicator, cellValue, targetColumn

    let hasPredecessor, isRevised
    let subIndOffset = 0
    let subCatLabel = ""
    let hasSubindicator = (category == "G") ? true : false

    let naText = "New / Revised Element"

    // element-wise ~ row-wise

    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {

        // --- 1.) Row Labels --- //

        activeCol = 1

        Element = Elements[elemNr]
        hasPredecessor = isComments ? Element.y2yCommentRow : Element.y2yResultRow
        isRevised = Element.isRevised ? true : false

        if (hasSubindicator) {
            Element.prevSubInd ? subCatLabel = "\" (" + Element.prevSubInd + ")\"" : ""
            if (Element.prevSubInd == "P") {
                subIndOffset = 1
            } else {
                subIndOffset = 0
            }
        }

        if (hasPredecessor) {
            cellValue = "=CONCATENATE(" + "\"" + StepComp.rowLabel + "\"" + "," + "REGEXEXTRACT(" + "'" + Config.prevYearOutcomeTab + "'!$A$" + (hasPredecessor) + ", " + "\"[A-Z]\\d+\\.\\d+\"" + ")," +
                subCatLabel + ")"

        } else {
            cellValue = StepComp.rowLabel + Element.labelShort
            cellValue += isRevised ? (" (rev.)") : !hasPredecessor ? (" (new)") : ""
        }

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setBackground(Substep.subStepColor)
            .setValue(cellValue)

        if (!isComments) {
            Cell.setFontWeight("bold")
        }

        activeCol += 1

        // --- 2.) Cell Values --- // 

        let serviceLabel
        let serviceType = ""
        let isNewService = false

        for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) { // address hard-coded offset 3 with company JSON

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
                if (Company.services[s].isNewService) {
                    isNewService = true
                }
            }


            Cell = Sheet.getRange(activeRow + elemNr, activeCol)

            subIndicator = ""

            cellID = defineNamedRange(comparisonIndexPrefix, comparisonType, importStepID, Elements[elemNr].labelShort, subIndicator, Company.id, serviceLabel, stepCompID)

            if (!isNewCompany) {

                if ((serviceNr == 2 && Company.hasOpCom == false) || (isNewService)) {
                    cellValue = "N/A" // if no OpCom, pre-select N/A
                } else {
                    if (hasPredecessor) {
                        // calculates which column
                        targetColumn = Indicator.y2yCompColumn + ((serviceNr - 1) * nrOfSubIndicators)
                        let col = columnToLetterYonY(targetColumn, subIndOffset)
                        cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + hasPredecessor
                    } else {
                        cellValue = naText
                    }
                }
            } else {
                cellValue = (isComments) ? Config.newCompanyLabelComment : Config.newCompanyLabelResult
            }

            if (!doRepairsOnly) {
                Cell.setValue(cellValue)
            }

            SS.setNamedRange(cellID, Cell)

            activeCol += 1
        } // services END
    } // whole element-wise iteration END

    // adding the conditional formating so that the Cell turns red if the answer is no

    rangeCols = activeCol
    rangeRows = elementsNr

    //format Component block
    if (!isComments) {
        Sheet.getRange(rangeStart, rangeStartCol + 1, rangeRows, rangeCols)
            .setFontWeight("bold")
            .setHorizontalAlignment("center")
    } else {
        Sheet.getRange(rangeStart, rangeStartCol + 1, rangeRows, rangeCols)
            .setWrap(true)
            .setVerticalAlignment("top")
    }

    activeRow = activeRow + elementsNr

    rangeEnd = activeRow

    return activeRow
}

function importYonYSources(SS, Sheet, Indicator, category, Company, isNewCompany, activeRow, Substep, stepCNr, companyNrOfServices, isComments) {

    let comparisonIndexPrefix = Config.prevIndexPrefix

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id

    // for stepwise formatting
    // TODO
    let Cell, cellID, cellValue, targetColumn

    let hasPredecessor = Indicator.prevIndicator ? true : false
    let targetRow = hasPredecessor ? (Indicator.y2yCompRow + (Indicator.prevIndLength * 2)) : null

    let subIndOffset = 0
    let subCatLabel = ""
    let hasSubindicator = (category == "G") ? true : false // TODO: Category.hadSubComponents

    let naText = isComments ? Config.newElementLabelComment : Config.newElementLabelResult

    // for whole indicator

    let activeCol

    // --- 1.) Row Labels --- //

    activeCol = 1

    if (!hasSubindicator) {
        cellValue = StepComp.rowLabel
    } else {
        cellValue = StepComp.rowLabel + " (F | P)"
    }

    Cell = Sheet.getRange(activeRow, activeCol)
        .setBackground(Substep.subStepColor)

    if (!doRepairsOnly) {
        Cell.setValue(cellValue)
    }

    activeCol += 1

    // --- 2.) Cell Values --- // 
    /* element-wise procedure from labels column 1 over services (~columns) */

    let serviceLabel
    let isNewService = false

    for (let serviceNr = 1; serviceNr < (companyNrOfServices + 3); serviceNr++) { // address hard-coded offset 3 with company JSON

        if (serviceNr == 1) {
            serviceLabel = "group"
        } else if (serviceNr == 2) {
            serviceLabel = "opCom"
        } else {
            let s = serviceNr - 3
            serviceLabel = Company.services[s].id
            if (Company.services[s].isNewService) {
                isNewService = true
            }
        }

        Cell = Sheet.getRange(activeRow, activeCol)

        cellID = defineNamedRange(comparisonIndexPrefix, "DC", "S07", Indicator.labelShort, "", Company.id, serviceLabel, stepCompID)

        if (!isNewCompany) {

            if (hasPredecessor && !isNewService) {
                // calculates which column
                targetColumn = Indicator.y2yCompColumn + (serviceNr - 1)
                let col = columnToLetterYonY(targetColumn, 0)

                if (!hasSubindicator) {

                    cellValue = "=" + "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + targetRow
                } else {

                    let col2 = columnToLetterYonY(targetColumn, 1)

                    let cellA = "'" + Config.prevYearOutcomeTab + "'" + "!$" + col + "$" + targetRow
                    let cellB = "'" + Config.prevYearOutcomeTab + "'" + "!$" + col2 + "$" + targetRow

                    cellValue = "=CONCATENATE(" + cellA + ",\" | \"," + cellB + ")"

                }

            } else {
                cellValue = naText
            }
        } else {
            cellValue = Config.newCompanyLabelComment
        }

        Cell.setValue(cellValue.toString())

        SS.setNamedRange(cellID, Cell)

        activeCol += 1

    } // single row END

    Sheet.getRange(activeRow, 2, 1, activeCol).setHorizontalAlignment("center")

    activeRow += 1

    return activeRow
}

function addYonYReview(SS, Sheet, Indicator, Company, isNewCompany, activeRow, Substep, stepCNr, companyNrOfServices) {

    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id

    // for first review, check if Substep should review the outcome from a different Index; if yes, change compared Index Prefix 

    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    let importStepID = StepComp.importStepID // "S07"
    let evaluationStep = StepComp.evaluationStep // the binary Review or Eval Substep which is evaluated
    let comparisonType = StepComp.comparisonType // "DC",

    let reviewCell, prevResultCell

    let yesAnswer = StepComp.mode === "YonY" ? "no change" : "not selected"

    let naText = Config.newElementLabelResult

    // for linking to Named Range of Substep 0
    // TODO: make a shared function() between importYonY & addStepReview

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows
    let rangeCols

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(StepComp.dropdown).build()

    let Cell, cellValue, Element, noteString, cellID
    let hasPredecessor, isRevised

    let activeCol

    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let ElementSpecs
    let companyType = Company.type

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

        // 2.) Value Cells

        let serviceLabel, serviceType

        let isNewService = false // TODO: Confirm with RT and implement

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
            cellID = defineNamedRange(indexPrefix, "DC", subStepID, Element.labelShort, "", Company.id, "opCom", stepCompID)

            if (makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs)) {
                cellValue = "N/A"
            } else {

                if (!isNewCompany) {

                    if (serviceNr == 2 && Company.hasOpCom == false) {
                        cellValue = "N/A" // if no OpCom, pre-select N/A
                    } else {

                        if (hasPredecessor) {

                            reviewCell = defineNamedRange(indexPrefix, "DC", evaluationStep, Element.labelShort, "", Company.id, serviceLabel, comparisonType)

                            prevResultCell = defineNamedRange(compIndexPrefix, "DC", importStepID, Element.labelShort, "", Company.id, serviceLabel, stepCompID)

                            // sets up cellValue that compares values
                            cellValue = "=IF(" + reviewCell + "=\"yes\"" + "," + "\"" + yesAnswer + "\"" + "," + "\"not selected\"" + ")"
                            Cell.setDataValidation(rule)
                        } else {
                            cellValue = naText
                        }
                    }
                } else {
                    cellValue = Config.newCompanyLabelResult
                }
            }

            Cell.setFontWeight("bold")

            if (!doRepairsOnly) {
                Cell.setValue(cellValue)
            }

            SS.setNamedRange(cellID, Cell) // names cells

            activeCol += 1


        } // single Element END
    } // whole Elements Iteration END

    activeRow = activeRow + elementsNr

    rangeCols = activeCol
    rangeRows = elementsNr

    Sheet.getRange(rangeStartRow, rangeStartCol + 1, rangeRows, rangeCols)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")

    return activeRow
}
