// addStepEvaluation creates a dropdown list in each column for each subindicator

/* global
    Config, indexPrefix, doRepairsOnly, defineNamedRange, checkIndicatorSpecs, checkElementSpecs, makeElementNA
*/

// eslint-disable-next-line no-unused-vars
function addStepEvaluation(
    SS,
    Sheet,
    Indicator,
    Company,
    isNewCompany,
    activeRow,
    mainStepNr,
    Substep,
    stepCNr,
    Category,
    companyNrOfServices
) {
    let rule = SpreadsheetApp.newDataValidation().requireValueInList(Substep.components[stepCNr].dropdown).build()

    let Elements = Indicator.elements
    let elementsNr = Elements.length

    let StepComp = Substep.components[stepCNr]
    let stepCompID = Substep.components[stepCNr].id

    let naText = Config.newElementLabelResult

    let rangeStartRow = activeRow
    let rangeStartCol = 1
    let rangeRows, rangeCols

    let Cell, cellID, Element, noteString, cellValue, isNewElement, isRevised

    let activeCol

    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let ElementSpecs
    let companyType = Company.type

    for (let elemNr = 0; elemNr < elementsNr; elemNr++) {
        Element = Elements[elemNr]
        ElementSpecs = checkElementSpecs(Element)

        isNewElement = Element.isNew ? true : false
        isRevised = Element.isRevised ? true : false

        // row labels

        activeCol = 1

        cellValue = StepComp.rowLabel + Element.labelShort
        noteString = Element.labelShort + ': ' + Element.description
        cellValue += isRevised ? ' (rev.)' : isNewElement ? ' (new)' : ''

        // setting up the labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(cellValue)
            .setBackground(Substep.subStepColor)
            .setFontWeight('bold')
            .setNote(noteString)

        activeCol += 1

        let serviceLabel
        let serviceType = ''

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
                Substep.subStepID,
                Element.labelShort,
                '',
                Company.id,
                serviceLabel,
                stepCompID
            )

            if (makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs)) {
                cellValue = 'N/A'
            } else {
                if (serviceNr == 2 && Company.hasOpCom == false) {
                    cellValue = 'N/A' // if no OpCom, pre-select N/A
                } else {
                    cellValue = 'not selected' // default for drop down list

                    if ((!isNewElement && !isNewCompany) || (mainStepNr > 1 && stepCompID != 'YY')) {
                        Cell.setDataValidation(rule)
                    } else {
                        cellValue = isNewCompany ? Config.newCompanyLabelResult : naText
                    }
                }
            }

            if (!doRepairsOnly) {
                Cell.setValue(cellValue)
            }

            SS.setNamedRange(cellID, Cell)

            activeCol += 1
        }
    }

    rangeCols = activeCol
    rangeRows = elementsNr
    Sheet.getRange(rangeStartRow, rangeStartCol + 1, rangeRows, rangeCols)
        .setFontWeight('bold')
        .setHorizontalAlignment('center')

    activeRow = activeRow + elementsNr
    return activeRow
}

// this function creates a cell for comments for each subindicator and names the ranges

// eslint-disable-next-line no-unused-vars
function addComments(SS, Sheet, Indicator, Company, activeRow, currentStep, stepCNr, Category, companyNrOfServices) {
    let StepComp = currentStep.components[stepCNr]
    let stepCompID = StepComp.id

    let indLength = Indicator.elements.length
    let rangeStartRow = activeRow
    let rangeStartCol = 2
    let rangeRows = indLength
    let rangeCols = 2 + companyNrOfServices

    // for (let i = 0; i < Indicator.elements.length; i++) {
    //     Sheet.setRowHeight(activeRow + i, 50)
    // } // increases height of row

    let Element, Cell, cellID

    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let ElementSpecs
    let companyType = Company.type

    // loops through subindicators
    for (let elemNr = 0; elemNr < indLength; elemNr++) {
        let activeCol = 1

        Element = Indicator.elements[elemNr]
        ElementSpecs = checkElementSpecs(Element)

        // adding the labels
        Cell = Sheet.getRange(activeRow + elemNr, activeCol)
        Cell.setValue(StepComp.rowLabel + Element.labelShort)
        Cell.setBackground(currentStep.subStepColor) // colors Cell

        activeCol += 1

        let serviceLabel, serviceType
        let cellValue

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
                currentStep.subStepID,
                Element.labelShort,
                '',
                Company.id,
                serviceLabel,
                stepCompID
            )

            if (makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs)) {
                cellValue = 'N/A'
                if (!doRepairsOnly) {
                    Cell.setValue(cellValue)
                }
            } else {
                if (serviceNr == 2 && !Company.hasOpCom) {
                    cellValue = 'N/A'
                    if (!doRepairsOnly) {
                        Cell.setValue(cellValue)
                    }
                }
            }

            SS.setNamedRange(cellID, Cell)
            activeCol += 1
        }
    }

    Sheet.getRange(rangeStartRow, rangeStartCol, rangeRows, rangeCols).setWrap(true).setVerticalAlignment('top')

    activeRow = activeRow + indLength
    return activeRow
}

// this function adds an element drop down list to a single row

// eslint-disable-next-line no-unused-vars
function addBinaryEvaluation(
    SS,
    Sheet,
    currentIndicator,
    Company,
    activeRow,
    currentStep,
    stepCNr,
    Category,
    companyNrOfServices
) {
    let rule = SpreadsheetApp.newDataValidation().requireValueInList(currentStep.components[stepCNr].dropdown).build()
    let thisStepComponent = currentStep.components[stepCNr]
    let stepCompID = currentStep.components[stepCNr].id
    let activeCol = 1

    // sets up the labels
    let cell = Sheet.getRange(activeRow, activeCol)
        .setValue(thisStepComponent.rowLabel)
        .setBackground(currentStep.subStepColor)
    if (thisStepComponent.type === 'binaryEvaluation') {
        cell.setFontWeight('bold').setFontStyle('italic').setHorizontalAlignment('center').setFontSize(12)
    }
    activeCol += 1

    for (let serviceNr = 1; serviceNr < companyNrOfServices + 3; serviceNr++) {
        if (serviceNr == 1) {
            // company group
            let Cell = Sheet.getRange(activeRow, activeCol)

            let cellName = defineNamedRange(
                indexPrefix,
                'DC',
                currentStep.subStepID,
                currentIndicator.labelShort,
                '',
                Company.id,
                'group',
                stepCompID
            )

            SS.setNamedRange(cellName, Cell)
            Cell.setDataValidation(rule).setFontWeight('bold')

            if (!doRepairsOnly) {
                Cell.setValue('not selected')
            }

            activeCol += 1
        }

        // opCom column
        else if (serviceNr == 2) {
            let Cell = Sheet.getRange(activeRow, activeCol)

            let cellName = defineNamedRange(
                indexPrefix,
                'DC',
                currentStep.subStepID,
                currentIndicator.labelShort,
                '',
                Company.id,
                'opCom',
                stepCompID
            )

            SS.setNamedRange(cellName, Cell)
            Cell.setDataValidation(rule).setFontWeight('bold')

            if (!doRepairsOnly) {
                Cell.setValue('not selected')
            }

            activeCol += 1
        }

        // service columns
        else {
            let s = serviceNr - 3

            let Cell = Sheet.getRange(activeRow, activeCol)

            let cellName = defineNamedRange(
                indexPrefix,
                'DC',
                currentStep.subStepID,
                currentIndicator.labelShort,
                '',
                Company.id,
                Company.services[s].id,
                stepCompID
            )

            SS.setNamedRange(cellName, Cell)
            Cell.setDataValidation(rule).setFontWeight('bold')

            if (!doRepairsOnly) {
                Cell.setValue('not selected')
            }

            activeCol += 1
        }
    }

    Sheet.getRange(activeRow, 2, 1, activeCol).setFontWeight('bold').setHorizontalAlignment('center')

    return activeRow + 1
}

// ## TODO Component Level functions ## //

// the sources step adds a single row in which the sources of each column can be listed

// eslint-disable-next-line no-unused-vars
function addSources(SS, Sheet, Indicator, Company, activeRow, Substep, stepCNr, Category, companyNrOfServices) {
    let activeCol = 1

    let stepCompID = Substep.components[stepCNr].id

    let Cell, cellID

    // adding rowLabel
    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(Substep.components[stepCNr].rowLabel)
        .setBackground(Substep.subStepColor)
    Cell.setNote('Sources: reference, specific page, section, etc.')
    activeCol += 1

    for (let serviceNr = 1; serviceNr < companyNrOfServices + 3; serviceNr++) {
        // TODO: fix Cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            Cell = Sheet.getRange(activeRow, activeCol)

            cellID = defineNamedRange(
                indexPrefix,
                'DC',
                Substep.subStepID,
                Indicator.labelShort,
                '',
                Company.id,
                'group',
                stepCompID
            )

            SS.setNamedRange(cellID, Cell)

            activeCol += 1
        } else if (serviceNr == 2) {
            // opCom
            Cell = Sheet.getRange(activeRow, activeCol)

            cellID = defineNamedRange(
                indexPrefix,
                'DC',
                Substep.subStepID,
                Indicator.labelShort,
                '',
                Company.id,
                'opCom',
                stepCompID
            )

            SS.setNamedRange(cellID, Cell)

            if (!Company.hasOpCom) {
                Cell.setValue('N/A')
            }

            activeCol += 1
        } else {
            // services
            Cell = Sheet.getRange(activeRow, activeCol)

            let g = serviceNr - 3 // helper for Services

            cellID = defineNamedRange(
                indexPrefix,
                'DC',
                Substep.subStepID,
                Indicator.labelShort,
                '',
                Company.id,
                Company.services[g].id,
                stepCompID
            )

            SS.setNamedRange(cellID, Cell)

            activeCol += 1
        }
    }

    Sheet.getRange(activeRow, 2, 1, activeCol).setHorizontalAlignment('center')

    return activeRow + 1
}
