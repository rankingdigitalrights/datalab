/* 
global
    Config,    
    defineNamedRange,
    indexPrefix,
    doRepairsOnly,
    checkElementSpecs,
    checkIndicatorSpecs,
    makeElementNA
*/

// New Substep 1; similar to Substep 1.5 but integrated into old Substep 1
// - has dropdown with evaluation options
// - compares result of step 0 review (yes/no/not selected)
// - and either pulls element results or picks "not selected"

// eslint-disable-next-line no-unused-vars
function addResultsReview(SS, Sheet, Indicator, Company, activeRow, mainStepNr, Substep, stepCNr, companyNrOfServices) {
    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id

    // for first review, check if Substep should review the outcome from a different Index; if yes, change compared Index Prefix

    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    // 2021 modification: if subcomponent is supposed to evaluate against indicator-level evaluation (i.e. binaryReview) set to true, else false
    let evalAtIndicatorLvl = StepComp.evalAtIndicatorLvl || false
    let evalLabelShort // ID of Element OR Indicator

    let importStepID = StepComp.importStepID // "S07"
    let evaluationStepID = StepComp.evaluationStepID // the binary Review or Eval Substep which is evaluated
    let comparisonType = StepComp.comparisonType // "DC",

    let reviewCell, prevResultCell

    let yesAnswer = StepComp.mode === 'YonY' ? 'no change' : 'not selected'

    let naText = 'not selected'

    // for linking to Named Range of Substep 0
    // TODO: make a shared function() between importYonY & addResultsReview

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows
    let rangeCols
    let rule

    rule = SpreadsheetApp.newDataValidation().requireValueInList(StepComp.dropdown).build()

    let Cell, cellValue, Element, noteString, cellID, isNewElement, isRevised

    let activeCol

    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let ElementSpecs
    let companyType = Company.type

    let showOnlyRelevant = StepComp.showOnlyRelevant ? true : false

    let conditional = StepComp.reverseConditional ? 'no' : 'yes'

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        Element = Elements[elemNr]
        ElementSpecs = checkElementSpecs(Element)
        evalLabelShort = evalAtIndicatorLvl ? Indicator.labelShort : Element.labelShort
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

        let serviceLabel, serviceType

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

            if (
                makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs) ||
                (serviceNr == 2 && Company.hasOpCom == false)
            ) {
                cellValue = 'N/A'
            } else {
                if (!isNewElement || mainStepNr > 1) {
                    reviewCell = defineNamedRange(
                        indexPrefix,
                        'DC',
                        evaluationStepID,
                        evalLabelShort,
                        '',
                        Company.id,
                        serviceLabel,
                        comparisonType
                    )

                    prevResultCell = showOnlyRelevant
                        ? ''
                        : defineNamedRange(
                              compIndexPrefix,
                              'DC',
                              importStepID,
                              Element.labelShort,
                              '',
                              Company.id,
                              serviceLabel,
                              stepCompID
                          )

                    cellValue = `=IF(${reviewCell}="${conditional}",${prevResultCell},"${yesAnswer}")`
                } else {
                    cellValue = naText
                }

                // creates dropdown list
                Cell.setDataValidation(rule)
            }

            /** HOOK: if running mainRepairInputSheets:
           comment out`!doRepairsOnly` for manual CHIRURGICAL cell overwrite at subcomponent level. DON'T FORGET TO REMOVE AGAIN. */
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
        .setFontWeight('bold')
        .setHorizontalAlignment('center')

    return activeRow
}

// eslint-disable-next-line no-unused-vars
function addCommentsReview(
    SS,
    Sheet,
    Indicator,
    Company,
    activeRow,
    mainStepNr,
    Substep,
    stepCNr,
    Category,
    companyNrOfServices
) {
    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id

    // for first review, check if Substep should review the outcome from a different Index; if yes, change compared Index Prefix

    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    // 2021 modification: if subcomponent is supposed to evaluate against indicator-level evaluation (i.e. binaryReview) set to true, else false
    let evalAtIndicatorLvl = StepComp.evalAtIndicatorLvl || false
    let evalLabelShort // ID of Element OR Indicator

    let importStepID = StepComp.importStepID // ID of MainStep which evaluated
    let evaluationStepID = StepComp.evaluationStepID // ID of Substep which is evaluated
    let comparisonType = StepComp.comparisonType // "DC",

    let reviewCell, prevResultCell

    let yesAnswer = ''

    // for linking to Named Range of Substep 0
    // TODO: make a shared function() between importYonY & addResultsReview

    let Cell, cellValue, Element, cellID, isNewElement, isRevised

    let activeCol

    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let ElementSpecs
    let companyType = Company.type

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        Element = Elements[elemNr]
        ElementSpecs = checkElementSpecs(Element)
        evalLabelShort = evalAtIndicatorLvl ? Indicator.labelShort : Element.labelShort

        isNewElement = Element.isNew ? true : false
        isRevised = Element.isRevised ? true : false

        // 1.) Row Labels

        activeCol = 1
        cellValue = StepComp.rowLabel + Element.labelShort

        cellValue += isRevised ? ' (rev.)' : isNewElement ? ' (new)' : ''

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)

        activeCol += 1

        let serviceLabel, serviceType

        let conditional = StepComp.reverseConditional ? 'no' : 'yes'

        // 2.) Value Cells
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

            if (
                makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs) ||
                (serviceNr == 2 && Company.hasOpCom == false)
            ) {
                cellValue = 'N/A'
            } else {
                reviewCell = defineNamedRange(
                    indexPrefix,
                    'DC',
                    evaluationStepID,
                    evalLabelShort,
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

                cellValue = `=IF(${reviewCell}="${conditional}",${prevResultCell},"${yesAnswer}")`
            }

            /** HOOK: if running mainRepairInputSheets:
           comment out`!doRepairsOnly` for manual CHIRURGICAL cell overwrite at subcomponent level. DON'T FORGET TO REMOVE AGAIN. */
            if (!doRepairsOnly) {
                Cell.setValue(cellValue)
            }

            SS.setNamedRange(cellID, Cell) // names cells

            activeCol += 1
        } // Element END
    } // Elements Iteration END

    return activeRow + elementsNr
}

// eslint-disable-next-line no-unused-vars
function addSourcesReview(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, companyNrOfServices) {
    let subStepID = Substep.subStepID
    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id

    // for first review, check if Substep should review the outcome from a different Index; if yes, change compared Index Prefix

    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    let importStepID = StepComp.importStepID // "S07"
    let evaluationStepID = StepComp.evaluationStepID // the binary Review or Eval Substep which is evaluated
    let comparisonType = StepComp.comparisonType // "DC",

    let prevResultCell

    let yesAnswer = 'TODO'

    let Cell, cellValue, cellID

    let activeCol

    // 1.) Row Label

    activeCol = 1
    cellValue = StepComp.rowLabel

    Cell = Sheet.getRange(activeRow, activeCol).setBackground(Substep.subStepColor)

    /** HOOK: if running mainRepairInputSheets:
           comment out`!doRepairsOnly` for manual CHIRURGICAL cell overwrite at subcomponent level. DON'T FORGET TO REMOVE AGAIN. */
    if (!doRepairsOnly) {
        Cell.setValue(cellValue)
    }

    activeCol += 1

    let serviceLabel

    let conditional = StepComp.reverseConditional ? 'yes' : 'no'

    let Elements = Indicator.elements

    let namedRange

    for (let serviceNr = 1; serviceNr < companyNrOfServices + 3; serviceNr++) {
        // TODO: Switch case

        if (serviceNr == 1) {
            serviceLabel = 'group'
        } else if (serviceNr == 2) {
            serviceLabel = 'opCom'
        } else {
            let s = serviceNr - 3
            serviceLabel = Company.services[s].id
        }

        let reviewCells = []
        let reviewFormula

        Cell = Sheet.getRange(activeRow, activeCol)
        cellID = defineNamedRange(
            indexPrefix,
            'DC',
            subStepID,
            Indicator.labelShort,
            '',
            Company.id,
            serviceLabel,
            stepCompID
        )

        // 2021 Extension: if evaluation critera is on Indicator Level (i.e. binaryReview)
        // only add Indicator.labelShort
        // otherwise iterate over Elements

        if (StepComp.evalAtIndicatorLvl) {
            namedRange = defineNamedRange(
                indexPrefix,
                'DC',
                evaluationStepID,
                Indicator.labelShort,
                '',
                Company.id,
                serviceLabel,
                comparisonType
            )
            reviewCells.push(namedRange)
        } else {
            Elements.forEach((element) => {
                namedRange = defineNamedRange(
                    indexPrefix,
                    'DC',
                    evaluationStepID,
                    element.labelShort,
                    '',
                    Company.id,
                    serviceLabel,
                    comparisonType
                )
                reviewCells.push(namedRange)
            })
        }

        reviewFormula = reviewCells.map((cell) => `${cell}<>"${conditional}"`)

        prevResultCell = defineNamedRange(
            compIndexPrefix,
            'DC',
            importStepID,
            Indicator.labelShort,
            '',
            Company.id,
            serviceLabel,
            stepCompID
        )

        cellValue = `=IF(AND(${reviewFormula}),${prevResultCell},"${yesAnswer}")`

        /** HOOK: if running mainRepairInputSheets:
           comment out`!doRepairsOnly` for manual CHIRURGICAL cell overwrite at subcomponent level. DON'T FORGET TO REMOVE AGAIN. */
        if (!doRepairsOnly) {
            Cell.setValue(cellValue)
        }

        SS.setNamedRange(cellID, Cell) // names cells

        activeCol += 1
    }

    return activeRow + 1
}

// NEW: Binary evaluation of whole step per company column

// eslint-disable-next-line no-unused-vars
function addBinaryReview(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, companyNrOfServices) {
    activeRow += 1

    let subStepID = Substep.subStepID

    let StepComp = Substep.components[stepCNr]

    let stepCompID = Substep.components[stepCNr].id
    let dataType = StepComp.dataType // "YY"

    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let companyType = Company.type

    let rule = SpreadsheetApp.newDataValidation().requireValueInList(Substep.components[stepCNr].dropdown).build()
    let activeCol = 1

    let cellName, cellValue

    // sets up the labels
    cellValue = StepComp.rowLabel + ' ' + Indicator.labelShort
    let Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(cellValue)
        .setBackground(Substep.subStepColor)
        .setFontWeight('bold')
        .setHorizontalAlignment('center')
        .setFontSize(11)

    activeCol += 1

    for (let serviceNr = 1; serviceNr < companyNrOfServices + 3; serviceNr++) {
        // TODO: Switch case

        let serviceLabel, serviceType, s, cellValue

        switch (serviceNr) {
            case 1:
                serviceLabel = 'group'
                serviceType = 'group'
                break

            case 2:
                serviceLabel = 'opCom'
                serviceType = 'opCom'
                break

            default:
                s = serviceNr - 3
                serviceLabel = Company.services[s].id
                serviceType = Company.services[s].type
        }

        Cell = Sheet.getRange(activeRow, activeCol)

        cellName = defineNamedRange(
            indexPrefix,
            dataType,
            subStepID,
            Indicator.labelShort,
            '',
            Company.id,
            serviceLabel,
            stepCompID
        )

        SS.setNamedRange(cellName, Cell) // names cells
        Cell.setDataValidation(rule) // creates dropdown list
            .setFontWeight('bold') // bolds the answers

        cellValue = StepComp.preSelectValue ? StepComp.preSelectValue : 'not selected'

        if (makeElementNA(companyType, serviceType, IndicatorSpecs, null)) {
            cellValue = 'N/A'
        } else {
            if (serviceNr == 2 && Company.hasOpCom == false) {
                cellValue = 'N/A' // if no OpCom, pre-select N/A
            }
        }

        /** HOOK: if running mainRepairInputSheets:
           comment out`!doRepairsOnly` for manual CHIRURGICAL cell overwrite at subcomponent level. DON'T FORGET TO REMOVE AGAIN. */
        if (!doRepairsOnly) {
            Cell.setValue(cellValue) // sets default for drop down list
        }

        activeCol += 1
    }

    Sheet.getRange(activeRow, 1, 1, activeCol).setFontWeight('bold').setHorizontalAlignment('center')

    return activeRow + 1
}

// eslint-disable-next-line no-unused-vars
function addTwoStepComparison(
    SS,
    Sheet,
    Indicator,
    Company,
    isNewCompany,
    mainStepNr,
    activeRow,
    Substep,
    stepCNr,
    companyNrOfServices
) {
    let subStepID = Substep.subStepID

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = StepComp.id

    let evaluationStepID = StepComp.evaluationStepID
    let importStepID = StepComp.importStepID

    let isInternalEval = StepComp.isInternalEval

    let comparisonType = StepComp.comparisonType
    let compIndexPrefix = StepComp.prevIndexPrefix ? StepComp.prevIndexPrefix : indexPrefix

    let naText = Config.newElementLabelResult

    let prevYearCell

    let Cell, cellValue, Element, subIndicator, noteString, cellID, prevResultCell
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

        noteString = Element.labelShort + ': ' + Element.description

        cellValue = StepComp.rowLabel + Element.labelShort

        cellValue += isRevised ? ' (rev.)' : isNewElement ? ' (new)' : ''

        // Row Labels

        activeCol = 1

        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)
            .setFontWeight('bold')
            .setNote(noteString)

        activeCol += 1

        // --- 2.) Cell Values --- //

        let serviceLabel, serviceType

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
            }

            // setting Cell
            Cell = Sheet.getRange(activeRow + elemNr, activeCol)

            // finding the name of Cell that it will be compared too

            subIndicator = ''

            cellID = defineNamedRange(
                indexPrefix,
                'DC',
                subStepID,
                Element.labelShort,
                subIndicator,
                Company.id,
                serviceLabel,
                stepCompID
            )

            if (makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs)) {
                cellValue = 'N/A'
            } else {
                if (serviceNr == 2 && Company.hasOpCom == false) {
                    cellValue = 'N/A'
                } else {
                    if (!isNewCompany || isInternalEval) {
                        if (!isNewElement || (mainStepNr > 1 && isInternalEval)) {
                            prevResultCell = defineNamedRange(
                                indexPrefix,
                                'DC',
                                importStepID,
                                Element.labelShort,
                                subIndicator,
                                Company.id,
                                serviceLabel,
                                comparisonType
                            )

                            prevYearCell = defineNamedRange(
                                compIndexPrefix,
                                'DC',
                                evaluationStepID,
                                Element.labelShort,
                                subIndicator,
                                Company.id,
                                serviceLabel,
                                comparisonType
                            )

                            // sets up cellValue that compares values
                            cellValue =
                                '=IF(' + prevResultCell + '=' + prevYearCell + ',' + '"Yes"' + ',' + '"No"' + ')'
                        } else {
                            cellValue = naText
                        }
                    } else {
                        cellValue = Config.newCompanyLabelResult
                    }
                }
            }

            /** HOOK: if running mainRepairInputSheets:
           comment out`!doRepairsOnly` for manual CHIRURGICAL cell overwrite at subcomponent level. DON'T FORGET TO REMOVE AGAIN. */
            if (!doRepairsOnly) {
                Cell.setValue(cellValue)
            }

            SS.setNamedRange(cellID, Cell) // names cells

            activeCol += 1
        }
    }

    // conditional formating so that the Cell turns red if the answer is no
    let Range = Sheet.getRange(activeRow, 2, elementsNr, 2 + (companyNrOfServices + 2))

    Range.setHorizontalAlignment('center')

    let Rule = SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo('No')
        .setBackground('#fa7661')
        .setRanges([Range])
        .build()
    let Rules = Sheet.getConditionalFormatRules()
    Rules.push(Rule)
    Sheet.setConditionalFormatRules(Rules)

    activeRow = activeRow + elementsNr
    return activeRow
}
