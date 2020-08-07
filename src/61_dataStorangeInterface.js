/**
 * Interface for creating a structured set of company element-level reults
 * NEW: Wide and Long (Tidy Format)
 */

/* global Config, insertSheetIfNotExist,dataStoreSingleStepWide,dataStoreSingleStepLong,resizeSheet */

// eslint-disable-next-line no-unused-vars
function addDataStoreSingleCompany(SS, Indicators, ResearchSteps, firstScoringStep, maxScoringStep, Company, hasOpCom, integrateOutputs, dataColWidth, includeWide, DataMode) {

    let urlDC = Company.urlCurrentDataCollectionSheet
    let urlSC = Company.urlCurrentCompanyScoringSheet

    // --- // MAIN Procedure // --- //
    // For each Main Research Step

    let indexPref

    let mainStepNr
    let MainStep
    let Substep

    let firstCol = 1
    let lastCol
    let lastRow
    let hookFirstDataCol

    // --- // long output // --- //

    let longSheet = insertSheetIfNotExist(SS, DataMode, true) // ToDo set as FALSE later

    if (longSheet !== null) {
        longSheet.clear()
        resizeSheet(longSheet, 65000) // approaching upper limit of allowed cell limit of 500K
    }

    lastRow = 1

    for (mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        MainStep = ResearchSteps.researchSteps[mainStepNr]

        indexPref = MainStep.altIndexID ? Config.prevIndexPrefix : Config.indexPrefix

        if (MainStep.excludeFromOutputs) {
            break // i.e. ignore Step 4 Feedback Debate
        }

        for (let subStepNr = 0; subStepNr < MainStep.substeps.length; subStepNr++) {

            Substep = MainStep.substeps[subStepNr]

            console.log("--- Main Step : " + MainStep.step)
            console.log("--- Main Step has " + MainStep.substeps.length + " Substeps")
            Logger.log("substepNr===="+subStepNr+", MainStep.scoring==="+MainStep.scoring)

            if(DataMode=="results"){
                lastRow = dataStoreSingleStepLong(longSheet, subStepNr, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlDC, urlSC, lastRow, indexPref)
            }

            else if(DataMode=="scores"&&Substep.subStepID==MainStep.scoringSubStep) {
                
                lastRow = dataStoreSingleStepLongScoring(longSheet, subStepNr, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlDC, urlSC, lastRow, indexPref)
            }
            

        } // END SUBSTEP
    } // END MAIN STEP

    console.log("Formatting Sheet")
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

    // if (includeWide) {
    //     let wideSheet = insertSheetIfNotExist(SS, "wide", true) // ToDo set as FALSE later

    //     if (wideSheet !== null) {
    //         wideSheet.clear()
    //         wideSheet.insertRows(1, 10000)
    //     }

    //     lastRow = 1

    //     for (mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

    //         MainStep = ResearchSteps.researchSteps[mainStepNr]

    //         for (let subStepNr = 0; subStepNr < MainStep.substeps.length; subStepNr++) {

    //             Substep = MainStep.substeps[subStepNr]
    //             console.log("--- Main Step : " + MainStep.step)
    //             console.log("--- Main Step has " + MainStep.substeps.length + " Substeps")


    //             // setting up all the substeps for all the indicators
    //             // setting up all the substeps for all the indicators
    //             lastRow = dataStoreSingleStepWide(wideSheet, subStepNr, Indicators, Substep, Company, hasOpCom, useIndicatorSubset, integrateOutputs, urlDC, lastRow)

    //         } // END SUBSTEP
    //     } // END MAIN STEP

    //     console.log("Formatting Sheet")
    //     lastCol = wideSheet.getLastColumn()

    //     wideSheet.getRange(1, 1, lastRow, lastCol)
    //         .setFontFamily("Roboto")
    //         .setVerticalAlignment("top")
    //         .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)
    //     // .setWrap(true)

    //     hookFirstDataCol = firstCol + 2
    //     wideSheet.setColumnWidths(hookFirstDataCol, lastCol, dataColWidth)
    //     wideSheet.setColumnWidth(lastCol + 1, 25)
    // }

}


function addDataStoreScoringSingleCompay(SS, Indicators, ResearchSteps, firstScoringStep, maxScoringStep, Company, hasOpCom, integrateOutputs, dataColWidth, DataMode) {





}
