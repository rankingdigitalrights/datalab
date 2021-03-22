// Imports previous year's outcome as Substep 0

/* global
    Config, indexPrefix, defineNamedRange, columnToLetterYonY, doRepairsOnly, checkIndicatorSpecs, checkElementSpecs, makeElementNA
*/

// eslint-disable-next-line no-unused-vars
function importYonYResults(
    SS,
    Sheet,
    Indicator,
    category,
    Company,
    isNewCompany,
    activeRow,
    Substep,
    stepCNr,
    companyNrOfServices,
    isComments
) {
    let prevIndexPrefix = Config.prevIndexPrefix

    let Elements = Indicator.elements
    let elementsNr = Elements.length
    let isElemNew

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id

    let importStepID = StepComp.importStepID // "S07"
    let comparisonType = StepComp.comparisonType // "DC",

    // for stepwise formatting
    // TODO
    let rangeStart

    rangeStart = activeRow
    let rangeStartCol = 1
    let rangeRows, rangeCols

    let Cell, cellID, Element, cellValue, targetColumn

    let prevOutcomeRow, isRevised

    let naText = 'New / Revised Element'

    // element-wise ~ row-wise

    let isIndicatorUnchanged = Indicator.isIndicatorUnchanged ? true : false
    let indicatorLength = isIndicatorUnchanged ? Indicator.elements.length : Indicator.prevIndLength
    let activeCol

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        // --- 1.) Row Labels --- //
        activeCol = 1

        Element = Elements[elemNr]
        // Fallback for another major Indicators revision
        // use Element.y2yResultRow when Element order / reference is non-linear
        // prevOutcomeRow = isComments ? Element.y2yResultRow + indicatorLength : Element.y2yResultRow
        // low-key solution for when Indicator Methodology is stable
        isElemNew = Element.isNew ? true : false
        prevOutcomeRow = isComments
            ? Indicator.prevOutcomeIndyStartRow + elemNr + indicatorLength
            : Indicator.prevOutcomeIndyStartRow + elemNr
        isRevised = Element.isRevised ? true : false

        if (prevOutcomeRow) {
            cellValue = `='${Config.prevYearOutcomeTab}'!$A$${prevOutcomeRow}`
        } else {
            cellValue = StepComp.rowLabel + Element.labelShort
            cellValue += isRevised ? ' (rev.)' : isElemNew ? ' (new)' : ''
        }

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setBackground(Substep.subStepColor)
            .setValue(cellValue)

        activeCol += 1

        // --- 2.) Cell Values --- //

        let serviceLabel
        let isNewService = false

        for (let serviceNr = 1; serviceNr < companyNrOfServices + 3; serviceNr++) {
            // address hard-coded offset 3 with company JSON

            // TODO: Switch case

            if (serviceNr == 1) {
                serviceLabel = 'group'
            } else if (serviceNr == 2) {
                serviceLabel = 'opCom'
            } else {
                let s = serviceNr - 3
                serviceLabel = Company.services[s].id
                if (Company.services[s].isNewService) {
                    isNewService = true
                }
            }

            Cell = Sheet.getRange(activeRow + elemNr, activeCol)

            cellID = defineNamedRange(
                prevIndexPrefix,
                comparisonType,
                importStepID,
                Elements[elemNr].labelShort,
                '',
                Company.id,
                serviceLabel,
                stepCompID
            )

            if (!doRepairsOnly) {
                if (!isNewCompany) {
                    if ((serviceNr == 2 && Company.hasOpCom == false) || isNewService) {
                        cellValue = 'N/A' // if no OpCom, pre-select N/A
                    } else {
                        if (prevOutcomeRow) {
                            // calculates which column
                            targetColumn = 2 + (serviceNr - 1)
                            let col = columnToLetterYonY(targetColumn, 0)
                            cellValue = `='${Config.prevYearOutcomeTab}'!$${col}$${prevOutcomeRow}`
                        } else {
                            cellValue = naText
                        }
                    }
                } else {
                    cellValue = isComments ? Config.newCompanyLabelComment : Config.newCompanyLabelResult
                }

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
        Sheet.getRange(rangeStart, rangeStartCol, rangeRows, 1).setFontWeight('bold')

        Sheet.getRange(rangeStart, rangeStartCol + 1, rangeRows, rangeCols)
            .setFontWeight('bold')
            .setHorizontalAlignment('center')
    } else {
        Sheet.getRange(rangeStart, rangeStartCol + 1, rangeRows, rangeCols)
            .setWrap(true)
            .setVerticalAlignment('top')
    }

    activeRow = activeRow + elementsNr

    return activeRow
}

// eslint-disable-next-line no-unused-vars
function importYonYSources(
    SS,
    Sheet,
    Indicator,
    category,
    Company,
    isNewCompany,
    activeRow,
    Substep,
    stepCNr,
    companyNrOfServices,
    isComments
) {
    let prevIndexPrefix = Config.prevIndexPrefix

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id

    // for stepwise formatting
    // TODO
    let Cell, cellID, cellValue, targetColumn

    let isIndicatorUnchanged = Indicator.isIndicatorUnchanged ? true : false
    let indicatorLength = isIndicatorUnchanged ? Indicator.elements.length : Indicator.prevIndLength

    let hasPredecessor = isIndicatorUnchanged ? true : false
    let prevOutcomeRow = isIndicatorUnchanged ? Indicator.prevOutcomeIndyStartRow + indicatorLength * 2 : null

    let naText = isComments ? Config.newElementLabelComment : Config.newElementLabelResult

    // for whole indicator

    let activeCol

    // --- 1.) Row Labels --- //

    activeCol = 1

    if (!doRepairsOnly) {
        Cell = Sheet.getRange(activeRow, activeCol).setBackground(Substep.subStepColor)
        Cell.setValue(StepComp.rowLabel)
    }

    activeCol += 1

    // --- 2.) Cell Values --- //
    /* element-wise procedure from labels column 1 over services (~columns) */

    let serviceLabel
    let isNewService = false

    for (let serviceNr = 1; serviceNr < companyNrOfServices + 3; serviceNr++) {
        // address hard-coded offset 3 with company JSON

        if (serviceNr == 1) {
            serviceLabel = 'group'
        } else if (serviceNr == 2) {
            serviceLabel = 'opCom'
        } else {
            let s = serviceNr - 3
            serviceLabel = Company.services[s].id
            if (Company.services[s].isNewService) {
                isNewService = true
            }
        }

        Cell = Sheet.getRange(activeRow, activeCol)

        cellID = defineNamedRange(
            prevIndexPrefix,
            'DC',
            'S07',
            Indicator.labelShort,
            '',
            Company.id,
            serviceLabel,
            stepCompID
        )

        if (!isNewCompany) {
            if ((hasPredecessor && !isNewService) || (serviceNr === 2 && Company.hasOpCom)) {
                // calculates which column
                targetColumn = 2 + (serviceNr - 1)
                let col = columnToLetterYonY(targetColumn, 0)
                cellValue = `='${Config.prevYearOutcomeTab}'!$${col}$${prevOutcomeRow}`
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

    Sheet.getRange(activeRow, 2, 1, activeCol).setHorizontalAlignment('center')

    activeRow += 1

    return activeRow
}

// eslint-disable-next-line no-unused-vars
function addYonYReview(SS, Sheet, Indicator, Company, isNewCompany, activeRow, Substep, stepCNr, companyNrOfServices) {
    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id

    let importPreviousResult = StepComp.importPreviousResult === true ? true : false

    let conditional = StepComp.reverseConditional ? 'no' : 'yes'

    // for first review, check if Substep should review the outcome from a different Index; if yes, change compared Index Prefix

    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    let importStepID = StepComp.importStepID // "S07"
    let evaluationStepID = StepComp.evaluationStepID // the binary Review or Eval Substep which is evaluated
    let comparisonType = StepComp.comparisonType // "DC",

    let reviewCell, prevResultCell

    let yesAnswer = StepComp.mode === 'YonY' ? 'no change' : 'not selected'

    let naText = Config.newElementLabelResult

    // for linking to Named Range of Substep 0
    // TODO: make a shared function() between importYonY & addResultsReview

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows
    let rangeCols

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(StepComp.dropdown).build()

    let Cell, cellValue, Element, noteString, cellID
    let isNewElement, isRevised

    let activeCol

    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let ElementSpecs
    let companyType = Company.type

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        Element = Elements[elemNr]
        ElementSpecs = checkElementSpecs(Element)

        isNewElement = Element.isNew ? true : false
        isRevised = Element.isRevised ? true : false

        // 1.) Row Labels

        activeCol = 1
        cellValue = StepComp.rowLabel + Element.labelShort

        noteString = Element.labelShort + ': ' + Element.description

        cellValue += isRevised ? ' (rev.)' : isNewElement ? ' (new)' : ''

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)
            .setFontWeight('bold')
            .setNote(noteString)

        activeCol += 1

        // 2.) Value Cells

        let serviceLabel, serviceType

        let isNewService = false // TODO: Confirm with RT and implement

        for (let serviceNr = 1; serviceNr < companyNrOfServices + 3; serviceNr++) {
            // TODO: Switch case

            if (serviceNr == 1) {
                serviceLabel = 'group'
                serviceType = 'group'
            } else if (serviceNr == 2) {
                serviceLabel = 'opCom'
                serviceType = 'opCom'
            } else {
                let s = serviceNr - 3
                serviceLabel = Company.services[s].id
                serviceType = Company.services[s].type
                if (Company.services[s].isNewService) {
                    isNewService = true
                }
            }

            Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            cellID = defineNamedRange(
                indexPrefix,
                'DC',
                subStepID,
                Element.labelShort,
                '',
                Company.id,
                serviceLabel,
                stepCompID
            )

            if (makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs)) {
                cellValue = 'N/A'
            } else {
                if (!isNewCompany) {
                    if ((serviceNr == 2 && Company.hasOpCom == false) || isNewService) {
                        cellValue = 'N/A' // if no OpCom, pre-select N/A
                    } else {
                        if (!isNewElement) {
                            reviewCell = defineNamedRange(
                                indexPrefix,
                                'DC',
                                evaluationStepID,
                                Element.labelShort,
                                '',
                                Company.id,
                                serviceLabel,
                                comparisonType
                            )

                            prevResultCell = defineNamedRange(
                                compIndexPrefix,
                                'DC',
                                importStepID,
                                Element.labelShort,
                                '',
                                Company.id,
                                serviceLabel,
                                stepCompID
                            )

                            if (importPreviousResult) {
                                cellValue = `=IF(${reviewCell}="${conditional}", ${prevResultCell}, "not selected")`
                            } else {
                                cellValue = `=IF(${reviewCell}="${conditional}","${yesAnswer}","not selected")`
                            }
                        } else {
                            cellValue = naText
                        }
                    }
                } else {
                    cellValue = Config.newCompanyLabelResult
                }
            }

            /** HOOK: if running mainRepairInputSheets:
           comment out`!doRepairsOnly` for manual CHIRURGICAL cell overwrite at subcomponent level. DON'T FORGET TO REMOVE AGAIN. */

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
        .setFontWeight('bold')
        .setHorizontalAlignment('center')
        .setDataValidation(rule)

    return activeRow
}
