/**
 * Interface for creating a structured set of company element-level reults
 * NEW: Wide and Long (Tidy Format)
 * TODO: consolidate all Steps into single Sheet
 */

/* global
       insertSheetIfNotExist,
       dataStoreSingleStepWide,
       dataStoreSingleStepLong
*/

function addDataStoreSingleCompany(SS, IndicatorsObj, ResearchStepsObj, firstScoringStep, maxScoringStep, Company, hasOpCom, useIndicatorSubset, subStepNr, integrateOutputs, dataColWidth, includeWide) {

    Logger.log("--- Begin addDataStoreSingleCompany --- subStep: " + subStepNr)

    var urlDC = Company.urlCurrentDataCollectionSheet

    var globalNrOfComponents = 1
    if (IndicatorsObj.indicatorClasses[0].components) {
        globalNrOfComponents = IndicatorsObj.indicatorClasses[0].components.length
    }

    var numberOfColumns = (Company.numberOfServices + 2) * globalNrOfComponents + 1

    // --- // MAIN Procedure // --- //
    // For each Main Research Step

    var mainStepNr
    var thisMainStep
    var thisSubStep

    var firstCol = 1
    var lastCol
    var lastRow
    var hookFirstDataCol

    // --- // long output // --- //

    var longSheet = insertSheetIfNotExist(SS, "long", true) // ToDo set as FALSE later

    longSheet.insertRows(1, 20000)

    if (longSheet !== null) {
        longSheet.clear()
    }

    lastRow = 1

    for (mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]

        for (subStepNr = 0; subStepNr < thisMainStep.substeps.length; subStepNr++) {

            thisSubStep = thisMainStep.substeps[subStepNr]
            Logger.log("--- Main Step : " + thisMainStep.step)
            Logger.log("--- Main Step has " + thisMainStep.substeps.length + " Substeps")

            lastRow = dataStoreSingleStepLong(longSheet, subStepNr, IndicatorsObj, thisSubStep, Company, hasOpCom, useIndicatorSubset, integrateOutputs, urlDC, lastRow)

        } // END SUBSTEP
    } // END MAIN STEP

    Logger.log("Formatting Sheet")
    lastCol = longSheet.getLastColumn()

    longSheet.getRange(1, 1, lastRow, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
        .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)
    // .setWrap(true)

    hookFirstDataCol = firstCol + 2
    longSheet.setColumnWidths(hookFirstDataCol, lastCol, dataColWidth)
    longSheet.setColumnWidth(lastCol + 1, 25)

    // --- // wide output // --- //

    if (includeWide) {
        var wideSheet = insertSheetIfNotExist(SS, "wide", true) // ToDo set as FALSE later

        if (wideSheet !== null) {
            wideSheet.clear()
            wideSheet.insertRows(1, 10000)
        }

        lastRow = 1

        for (mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

            thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]

            for (subStepNr = 0; subStepNr < thisMainStep.substeps.length; subStepNr++) {

                thisSubStep = thisMainStep.substeps[subStepNr]
                Logger.log("--- Main Step : " + thisMainStep.step)
                Logger.log("--- Main Step has " + thisMainStep.substeps.length + " Substeps")


                // setting up all the substeps for all the indicators
                // setting up all the substeps for all the indicators
                lastRow = dataStoreSingleStepWide(wideSheet, subStepNr, IndicatorsObj, thisSubStep, Company, hasOpCom, useIndicatorSubset, integrateOutputs, urlDC, lastRow)

            } // END SUBSTEP
        } // END MAIN STEP

        Logger.log("Formatting Sheet")
        lastCol = wideSheet.getLastColumn()

        wideSheet.getRange(1, 1, lastRow, lastCol)
            .setFontFamily("Roboto")
            .setVerticalAlignment("top")
            .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)
        // .setWrap(true)

        hookFirstDataCol = firstCol + 2
        wideSheet.setColumnWidths(hookFirstDataCol, lastCol, dataColWidth)
        wideSheet.setColumnWidth(lastCol + 1, 25)
    }
}