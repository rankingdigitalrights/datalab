function importSourcesSheet(File, sheetName, CompanyObj, doOverwrite) {
    var sheet = insertSheetIfNotExist(File, sheetName, doOverwrite)
    if (sheet !== null) { sheet.clear() }
    fillSourceSheet(sheet)
    var targetCell = sheet.getRange(2,1)
    var formula = '=IMPORTRANGE("' + CompanyObj.urlCurrentDataCollectionSheet + '","' + 'Sources' + '!' + 'A2:Z' + '")'
    targetCell.setFormula(formula)
}

function setFeedbackSheetHeader(activeRow, offsetCol, sheet, numberOfColumns) {

    sheet.getRange(activeRow, offsetCol, 1, numberOfColumns)
        .merge()
        .setValue("RDR PRELIMINARY FINDINGS")
        .setFontWeight("bold")
        .setBackground("#fff2cc")
        .setFontSize(12)
        .setHorizontalAlignment("center")
        .setBorder(true, false, true, false, null, null, "black", null)

    offsetCol = offsetCol + numberOfColumns

    sheet.getRange(activeRow, offsetCol, 1, numberOfColumns)
        .merge()
        .setValue("COMPANY RESPONSE/FEEDBACK")
        .setFontWeight("bold")
        .setBackground("#46bdc6")
        .setFontSize(12)
        .setHorizontalAlignment("center")
        .setBorder(true, false, true, false, null, null, "black", null)

    return activeRow + 1
}

function setFeedbackCompanyHeader(activeRow, offsetCol, sheet, companyObj, nrOfIndSubComps, thisIndClass, numberOfColumns) {

    var firstCol = offsetCol
    var currentCell = sheet.getRange(activeRow, offsetCol)
    var columnLabel

    var g

    // --- // Company Elements // --- //

    // group 
    var thisColor = "#f3f3f3" // grey TODO: outsource to Config

    for (g = 0; g < nrOfIndSubComps; g++) {
        currentCell = sheet.getRange(activeRow, offsetCol)
        columnLabel = companyObj.label.current + ' (group)'

        if (nrOfIndSubComps > 1) {
            columnLabel = columnLabel + '\n' + thisIndClass.components[g].labelLong
        }
        currentCell.setValue(columnLabel)
        // currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

        offsetCol += 1
    }

    // opcom
    if (companyObj.hasOpCom === true) {
        for (g = 0; g < nrOfIndSubComps; g++) {
            currentCell = sheet.getRange(activeRow, offsetCol)
            columnLabel = 'OperatingCo\n'

            columnLabel = columnLabel + companyObj.opComLabel


            if (nrOfIndSubComps > 1) {
                columnLabel = columnLabel + '\n' + thisIndClass.components[g].labelLong
            }
            currentCell.setValue(columnLabel)
            // currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

            offsetCol += 1
        }
    }

    // --- // --- Services --- // --- //
    for (var k = 0; k < companyObj.numberOfServices; k++) {
        for (g = 0; g < nrOfIndSubComps; g++) {
            currentCell = sheet.getRange(activeRow, offsetCol)
            columnLabel = companyObj.services[k].label.current

            if (nrOfIndSubComps > 1) {
                columnLabel = columnLabel + '\n' + thisIndClass.components[g].labelLong
            }

            currentCell.setValue(columnLabel)
            // currentCell = styleScoringIndicatorHeader(currentCell, columnLabel, thisColor)

            offsetCol += 1
        }
    }

    sheet.getRange(activeRow, firstCol, 1, 2 * numberOfColumns)
        .setFontWeight("bold")
        .setFontSize(12)
        .setBackground(thisColor)
        .setHorizontalAlignment("center")

    return activeRow + 1
}

function addIndicatorLabelRow(activeRow, firstCol, sheet, CompanyObj, nrOfIndSubComps, thisInd, numberOfColumns) {

    var thisCell
    thisCell = sheet.getRange(activeRow, firstCol)
    thisCell.setValue(thisInd.labelShort)

    thisCell = sheet.getRange(activeRow, firstCol + 1)
    thisCell.setValue(thisInd.labelLong).setWrap(true)

    var rowDim = (numberOfColumns * 2) + 2
    sheet.getRange(activeRow, firstCol, 1, rowDim)
        .setFontWeight("bold")
        .setBackground("#fce5cd")
        .setFontSize(10)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("top")
        .setBorder(true, false, true, false, null, null, "black", null)

    return activeRow + 1
}

function importFeedbackElementBlock(File, activeRow, activeCol, offsetCol, numberOfColumns, sheet, StepComp, thisSubStepID, Indicator, CompanyObj, companyHasOpCom, nrOfIndSubComps, indicatorCat, blocks, integrateOutputs) {

    var scoringSuffix = "CF" // CF := Company Feedback
    var stepCompID = StepComp.id

    var firstRow = activeRow
    var firstCol = activeCol
    var currentCell
    var rowLabel
    var compCellName
    var formula
    var component = ""
    var tempCol
    var elemLogical
    var feedbackBlock

    var urlDC = CompanyObj.urlCurrentDataCollectionSheet

    // for each element
    for (var e = 0; e < Indicator.elements.length; e++) {

        // --- // row label / first two colums

        tempCol = activeCol

        elemLogical = e + 1
        currentCell = sheet.getRange(activeRow, tempCol)
        rowLabel = 'E' + elemLogical
        currentCell.setValue(rowLabel)
            .setWrap(true)
            .setHorizontalAlignment("right")
        tempCol += 1

        currentCell = sheet.getRange(activeRow, tempCol)
        rowLabel = Indicator.elements[e].description
        currentCell.setValue(rowLabel)
            .setWrap(true)
            .setHorizontalAlignment("left")
        tempCol += 1


        // --- // result cells // --- //

        // for Group + Indicator Subcomponents
        for (var k = 0; k < nrOfIndSubComps; k++) {

            currentCell = sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = indicatorCat.components[k].labelShort
            }

            // setting up formula that compares values
            compCellName = defineNamedRangeStringImport(indexPrefix, "DC", thisSubStepID, Indicator.elements[e].labelShort, component, CompanyObj.id, 'group', stepCompID)

            // adding formula
            formula = importRange(urlDC, compCellName, integrateOutputs)
            currentCell.setFormula(formula)
            tempCol += 1
        }

        // for opCom + Indicator Subcomponents
        if (companyHasOpCom) {
            for (var k = 0; k < nrOfIndSubComps; k++) {
                currentCell = sheet.getRange(activeRow, tempCol)

                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }

                // setting up formula that compares values
                compCellName = defineNamedRangeStringImport(indexPrefix, "DC", thisSubStepID, Indicator.elements[e].labelShort, component, CompanyObj.id, 'opCom', stepCompID)

                formula = importRange(urlDC, compCellName, integrateOutputs)
                currentCell.setFormula(formula)

                tempCol += 1
            }
        }

        // for n Services + Indicator Subcomponents
        for (var g = 0; g < CompanyObj.services.length; g++) {

            for (k = 0; k < nrOfIndSubComps; k++) {
                currentCell = sheet.getRange(activeRow, tempCol)

                if (nrOfIndSubComps != 1) {
                    component = indicatorCat.components[k].labelShort
                }

                // setting up formula that compares values
                compCellName = defineNamedRangeStringImport(indexPrefix, "DC", thisSubStepID, Indicator.elements[e].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompID)

                formula = importRange(urlDC, compCellName, integrateOutputs)
                currentCell.setFormula(formula)

                tempCol += 1
            }
        }

        activeRow += 1
    }

    // format labels
    sheet.getRange(firstRow, firstCol, activeRow - firstRow, tempCol - firstCol)
        .setWrap(true)
        .setFontSize(10)
        // .setBackground("red") // for debugging
        .setVerticalAlignment("top")

    // format results
    sheet.getRange(firstRow, offsetCol, activeRow - firstRow, tempCol - offsetCol)
        .setBackground("#fff2cc")

    // format feedback block
    var feedbackStartCol = offsetCol + numberOfColumns
    var feedbackEndCol = feedbackStartCol + numberOfColumns

    feedbackBlock = sheet.getRange(firstRow, feedbackStartCol, activeRow - firstRow, feedbackEndCol - feedbackStartCol)
        .setBackground("#f3f3f3")
        .merge()
        .setWrap(true)
        .setVerticalAlignment("top")
        .setHorizontalAlignment("left")
    
    // assign ID to Feedback block

    var cellName = defineNamedRangeStringImport(indexPrefix, "DC", thisSubStepID, Indicator.labelShort, component, CompanyObj.id, "", scoringSuffix)
    Logger.log(cellName)

    // File.setNamedRange(cellName, feedbackBlock)

    sheet.getRange(activeRow, feedbackStartCol, 1, feedbackEndCol - feedbackStartCol)
        .setBackground("#f3f3f3")
        .setWrap(true)
        .setVerticalAlignment("top")
        .setHorizontalAlignment("left")

    return activeRow
}


function importFeedbackSourcesRow(activeRow, firstCol, offsetCol, sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndClass, blocks, integrateOutputs) {

    var stepCompID = StepComp.id
    var currentSubStepID = thisSubStepID
    var urlDC = CompanyObj.urlCurrentDataCollectionSheet
    var tempCol = firstCol + 1
    var currentCell = sheet.getRange(activeRow, tempCol)

    // row label / first Column
    currentCell.setValue("Sources")
        .setFontWeight("bold")

    tempCol += 1

    var component = ""
    var compCellName
    var formula
    var k

    // result cells
    // for Group + Indicator Subcomponents
    for (k = 0; k < nrOfIndSubComps; k++) {
        currentCell = sheet.getRange(activeRow, tempCol)

        if (nrOfIndSubComps != 1) {
            component = thisIndClass.components[k].labelShort
        }

        // setting up formula that compares values
        compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, thisInd.labelShort, component, CompanyObj.id, 'group', stepCompID)

        // adding formula
        formula = importRange(urlDC, compCellName, integrateOutputs)
        currentCell.setFormula(formula)
        tempCol += 1
    }

    // for opCom + Indicator Subcomponents
    if (hasOpCom) {
        for (k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = thisIndClass.components[k].labelShort
            }

            // setting up formula that compares values
            compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, thisInd.labelShort, component, CompanyObj.id, 'opCom', stepCompID)

            formula = importRange(urlDC, compCellName, integrateOutputs)
            currentCell.setFormula(formula)

            tempCol += 1
        }
    }

    // for n Services + Indicator Subcomponents
    for (var s = 0; s < CompanyObj.services.length; s++) {

        for (k = 0; k < nrOfIndSubComps; k++) {
            currentCell = sheet.getRange(activeRow, tempCol)

            if (nrOfIndSubComps != 1) {
                component = thisIndClass.components[k].labelShort
            }

            // setting up formula that compares values
            compCellName = defineNamedRangeStringImport(indexPrefix, "DC", currentSubStepID, thisInd.labelShort, component, CompanyObj.id, CompanyObj.services[s].id, stepCompID)

            formula = importRange(urlDC, compCellName, integrateOutputs)
            currentCell.setFormula(formula)

            tempCol += 1
        }
    }
    var lastCol = tempCol

    var thisRange = sheet.getRange(activeRow,offsetCol,1,lastCol - offsetCol)
    thisRange.setBackground("#fff2cc")
        .setNumberFormat("@")
        .setHorizontalAlignment("right")

    activeRow += 1

    return activeRow
}