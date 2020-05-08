function insertFeedbackSheet(SS, sheetName, lastCol, isPilotMode, hasFullScores, thisIndClass, sheetModeID, thisMainStep, CompanyObj, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, useIndicatorSubset, includeSources, includeNames, includeResults, thisSubStep, thisSubStepID, thisSubStepLabel) {

    Logger.log("--- Begin Feedback for Single Indicator Class: " + sheetName)

    var companyShortName = CompanyObj.label.current

    Logger.log("Inserting Sheet " + sheetName)
    var sheet = insertSheetIfNotExist(SS, sheetName, true)
    if (sheet !== null) {
        sheet.clear()
    }

    var firstCol = lastCol
    var activeCol = firstCol
    var activeRow = 2
    var lastRow
    var offsetCol = firstCol + 2

    // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
    var nrOfIndSubComps = 1

    if (thisIndClass.hadSubComponents == true) {
        nrOfIndSubComps = thisIndClass.components.length
    }

    // set up header / TODO: remove from steps JSON. Not a component. This is Layout

    activeRow = setFeedbackSheetHeader(activeRow, offsetCol, sheet, numberOfColumns)

    activeRow = setFeedbackCompanyHeader(activeRow, offsetCol, sheet, CompanyObj, nrOfIndSubComps, thisIndClass, numberOfColumns)

    // TODO: Refactor to main caller

    var thisIndClassLength
    if (useIndicatorSubset) {
        thisIndClassLength = 2
    } else {
        thisIndClassLength = thisIndClass.indicators.length
    }

    // --- // For all Indicators of this Class // --- //

    var blockStartRow
    var blockEndRow
    var thisBlock
    var thisInd
    var StepComp
    var stepCompType

    for (var i = 0; i < thisIndClassLength; i++) {

        thisInd = thisIndClass.indicators[i]

        Logger.log("begin Indicator: " + thisInd.labelShort)

        activeRow = addIndicatorLabelRow(activeRow, firstCol, sheet, CompanyObj, nrOfIndSubComps, thisInd, numberOfColumns)

        blockStartRow = activeRow

        // --- // Main task // --- //

        // for all components of the current Research Step

        for (var stepCompNr = 0; stepCompNr < thisSubStep.components.length; stepCompNr++) {

            StepComp = thisSubStep.components[stepCompNr]
            stepCompType = StepComp.type
            Logger.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

            switch (stepCompType) {

                // import researcher name from x.0 step
                case "subStepHeader":
                    break

                case "evaluation":
                    // if (includeResults) {
                    //     activeRow = importElementBlock(activeRow, firstCol, sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndClass, blocks, integrateOutputs)
                    //     Logger.log(' - SC - ' + stepCompType + " added for: " + thisInd.labelShort)
                    // }
                    break

                case "comments":
                    activeRow = importFeedbackElementBlock(SS, activeRow, firstCol, offsetCol, numberOfColumns, sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndClass, blocks, integrateOutputs)
                    Logger.log(" - SC - " + stepCompType + " added for: " + thisInd.labelShort)
                    break

                case "sources":

                    activeRow = importFeedbackSourcesRow(activeRow, firstCol, offsetCol, sheet, StepComp, thisSubStepID, thisInd, CompanyObj, hasOpCom, nrOfIndSubComps, thisIndClass, blocks, integrateOutputs)
                    Logger.log(" - SC - " + "sources added for: " + thisInd.labelShort)

                    break
            }
        }

        blockEndRow = activeRow - 1 // mark end of block
        activeRow += 1

        lastCol = numberOfColumns * 2 + 2

        sheet.getRange(blockEndRow, firstCol, 1, lastCol)
            .setBorder(false, false, true, false, null, null, "black", SpreadsheetApp.BorderStyle.SOLID)

        thisBlock = sheet.getRange(blockStartRow, 1, blockEndRow - blockStartRow + 1, numberOfColumns)

        thisBlock.shiftRowGroupDepth(1)

    } // END INDICATOR

    // --- // Sheet-Level Formattings // --- //

    lastCol = numberOfColumns * 2 + 2

    Logger.log("Formatting Sheet")
    lastRow = activeRow - 2

    sheet.getRange(1, 1, lastRow, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
    // .setWrap(true)

    sheet.setColumnWidth(1, 40)
    sheet.setColumnWidth(2, 200)

    sheet.setColumnWidths(offsetCol, 2 * numberOfColumns, dataColWidth)

    // label columns
    sheet.getRange(1, 1, lastRow, 2)
        .setBorder(false, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    // results columns
    sheet.getRange(1, offsetCol, lastRow, numberOfColumns)
        .setBorder(false, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    // feedback columns
    sheet.getRange(1, offsetCol + numberOfColumns, lastRow, numberOfColumns)
        .setBorder(false, true, true, true, null, null, "black", SpreadsheetApp.BorderStyle.SOLID_MEDIUM)

    sheet.setFrozenRows(3)
    sheet.setFrozenColumns(2)


    return lastCol += 1
}

// END MAIN Step & function
