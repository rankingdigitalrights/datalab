/** ATTEMPT at creating a universal Subcomponent Block import pattern
 * TODO: worth refactoring ALL block import / block production subscomponents
 * into something like this pattern
 * this would drastically simplify the maintenance and development experience
 */

/* global
    indexPrefix
    findSubStepComponent,
    checkIndicatorSpecs,
*/

function importContentBlock(
    Sheet,
    Company,
    Indicator,
    SubStep,
    mainStepNr,
    subStepNr,
    componentType,
    activeRow,
    offsetCol,
    omitOpCom,
    layoutWidth,
    companyWidth
) {
    let Cell, cellValue, label, type, blockHeight
    let serviceLabel, serviceType
    let Elements = Indicator.elements
    let ElementSpecs, hasPredecessor, isRevised
    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let scoringScope = Indicator.scoringScope
    let subStepID = SubStep.subStepID

    // let companyWidth = calculateCompanyWidth(Company, Indicator, omitOpCom)
    let companyURL = Company.urlCurrentInputSheet
    let companyType = Company.type

    let hasOpCom = Company.hasOpCom
    let companyCols = hasOpCom ? 2 : 1

    let StepComp = findSubStepComponent(mainStepNr, subStepNr, componentType)

    let stepCompID = StepComp.id

    let targetNamedRange

    let startRow = activeRow
    let activeCol = offsetCol

    // results / comments

    Elements.forEach((Element) => {
        // Element = Elements[elemNr]
        // ElementSpecs = checkElementSpecs(Element)

        // hasPredecessor = Element.y2yResultRow ? true : false
        // isRevised = Element.isRevised ? true : false

        // 1.) Row Labels

        activeCol = offsetCol

        cellValue = StepComp.rowLabel + Element.labelShort

        // noteString = Element.labelShort + ": " + Element.description

        // cellValue += !hasPredecessor ? (" (new)") : ""

        Cell = Sheet.getRange(activeRow, activeCol)
            .setValue(cellValue)
            // .setBackground(Substep.subStepColor)
            .setFontWeight('bold')
        // .setNote(noteString)

        for (let serviceNr = 0; serviceNr < companyWidth; serviceNr++) {
            // TODO: Switch case

            if (serviceNr === 0 && (scoringScope === 'full' || scoringScope === 'company')) {
                serviceLabel = 'group'
                serviceType = 'group'
            } else if (
                !omitOpCom &&
                serviceNr === 1 &&
                hasOpCom &&
                (scoringScope === 'full' || scoringScope === 'company')
            ) {
                serviceLabel = 'opCom'
                serviceType = 'opCom'
            } else {
                let s = scoringScope === 'services' ? serviceNr : serviceNr - companyCols
                serviceLabel = Company.services[s].id
                serviceType = Company.services[s].type
            }

            Cell = Sheet.getRange(activeRow, activeCol + serviceNr + 1)

            // if (makeElementNA(companyType, serviceType, IndicatorSpecs, ElementSpecs)) {
            //     cellValue = "N/A"
            // } else {

            //     if (!omitOpCom && serviceNr === 2 && Company.hasOpCom === false) {
            //         cellValue = "N/A" // if no OpCom, pre-select N/A
            //     } else {

            targetNamedRange = defineNamedRange(
                indexPrefix,
                'DC',
                subStepID,
                Element.labelShort,
                '',
                Company.id,
                serviceLabel,
                stepCompID
            )

            cellValue = `=IMPORTRANGE("${companyURL}", "${targetNamedRange}")`
            // }

            // }

            Cell.setValue(cellValue)
        } // Services End

        // let row = Sheet.getRange(activeRow + 1, offsetCol, 1, companyWidth + 1)

        // row.setBorder(true, false, true, false, false, true, "black", SpreadsheetApp.BorderStyle.DOTTED)

        activeRow += 1
    }) // Elements Row END

    let rowLength = Elements.length > 1 ? activeRow - startRow - 1 : 1

    let block = Sheet.getRange(startRow, offsetCol, rowLength, layoutWidth + 1)
        .setBorder(true, null, true, null, null, true, 'black', SpreadsheetApp.BorderStyle.DOTTED)
        .setBorder(true, null, null, null, null, null, 'black', SpreadsheetApp.BorderStyle.SOLID)

    if (componentType === 'reviewComments') {
        block.setWrap(true)
    }

    return activeRow
}

function importContentRow(
    Sheet,
    Company,
    Indicator,
    SubStep,
    mainStepNr,
    subStepNr,
    componentType,
    activeRow,
    offsetCol,
    omitOpCom,
    layoutWidth,
    companyWidth
) {
    let Cell, cellValue
    let serviceLabel, serviceType

    let IndicatorSpecs = checkIndicatorSpecs(Indicator)
    let scoringScope = Indicator.scoringScope
    let subStepID = SubStep.subStepID

    // let companyWidth = calculateCompanyWidth(Company, Indicator, omitOpCom)
    let companyURL = Company.urlCurrentInputSheet
    let companyType = Company.type
    let hasOpCom = Company.hasOpCom
    let companyCols = hasOpCom ? 2 : 1

    let StepComp = findSubStepComponent(mainStepNr, subStepNr, componentType)

    let stepCompID = StepComp.id

    let targetNamedRange

    let startRow = activeRow
    let activeCol = offsetCol

    // results / comments

    activeCol = offsetCol

    cellValue = StepComp.rowLabel + ' ' + Indicator.labelShort

    // noteString = Element.labelShort + ": " + Element.description

    Cell = Sheet.getRange(activeRow, activeCol)
        .setValue(cellValue)
        // .setBackground(Substep.subStepColor)
        .setFontWeight('bold')
    // .setNote(noteString)

    for (let serviceNr = 0; serviceNr < companyWidth; serviceNr++) {
        // TODO: Switch case

        if (serviceNr === 0 && (scoringScope === 'full' || scoringScope === 'company')) {
            serviceLabel = 'group'
            serviceType = 'group'
        } else if (
            !omitOpCom &&
            serviceNr === 1 &&
            hasOpCom &&
            (scoringScope === 'full' || scoringScope === 'company')
        ) {
            serviceLabel = 'opCom'
            serviceType = 'opCom'
        } else {
            let s = scoringScope === 'services' ? serviceNr : serviceNr - companyCols
            serviceLabel = Company.services[s].id
            serviceType = Company.services[s].type
        }
        Cell = Sheet.getRange(activeRow, activeCol + serviceNr + 1)

        // if (makeElementNA(companyType, serviceType, IndicatorSpecs, null)) {
        //     cellValue = "N/A"
        // } else {

        //     if (!omitOpCom && serviceNr === 2 && Company.hasOpCom === false) {
        //         cellValue = "N/A" // if no OpCom, pre-select N/A
        //     } else {

        targetNamedRange = defineNamedRange(
            indexPrefix,
            'DC',
            subStepID,
            Indicator.labelShort,
            '',
            Company.id,
            serviceLabel,
            stepCompID
        )

        cellValue = `=IMPORTRANGE("${companyURL}", "${targetNamedRange}")`
        // }

        // }

        Cell.setValue(cellValue)
    } // Services End

    // let row = Sheet.getRange(activeRow + 1, offsetCol, 1, companyWidth + 1)

    // row.setBorder(true, false, true, false, false, true, "black", SpreadsheetApp.BorderStyle.DOTTED)

    let block = Sheet.getRange(startRow, offsetCol, 1, layoutWidth + 1)
        .setBorder(true, null, true, null, null, true, 'black', SpreadsheetApp.BorderStyle.DOTTED)
        .setBorder(true, null, null, null, null, null, 'black', SpreadsheetApp.BorderStyle.SOLID)

    return activeRow + 1
}
