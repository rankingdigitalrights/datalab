/**
 * Interface for creating a structured set of company element-level reults
 * NEW: Wide and Long (Tidy Format)
 */

/* global Config, insertSheetIfNotExist,dataStoreSingleStepWide,dataStoreSingleStepLong,resizeSheet */

// eslint-disable-next-line no-unused-vars
function addDataStoreSingleCompany(SS, Indicators, ResearchSteps, firstScoringStep, maxScoringStep, Company, hasOpCom, integrateOutputs, dataColWidth, DataMode) {

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
    let lastRowR, lastRowS, lastRowC, lastRowI, lastRowL
    let hookFirstDataCol

    let elementSheet, levelSS, compositeSS, indicatorSS

    // --- // long output // --- //

    elementSheet = DataMode === "scores" ? insertSheetIfNotExist(SS, "element scores", true) : insertSheetIfNotExist(SS, "results", true)

    if (elementSheet !== null) {
        elementSheet.clear()
        resizeSheet(elementSheet, 65000) // approaching upper limit of allowed cell limit of 500K
    }

    if (DataMode === "scores") {

        levelSS = insertSheetIfNotExist(SS, "level scores", true)
        if (levelSS !== null) {
            levelSS.clear()
        }

        compositeSS = insertSheetIfNotExist(SS, "composite scores", true)
        if (compositeSS !== null) {
            compositeSS.clear()
        }

        indicatorSS = insertSheetIfNotExist(SS, "indicator scores", true)
        if (indicatorSS !== null) {
            indicatorSS.clear()
        }

    }

    lastRowR = lastRowS = lastRowL = lastRowC = lastRowI = 1

    for (mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        console.log("DEBUG - " + mainStepNr)
        MainStep = ResearchSteps.researchSteps[mainStepNr]

        indexPref = MainStep.altIndexID ? Config.prevIndexPrefix : Config.indexPrefix

        let scoringSubStepNr = MainStep.altScoringSubstepNr ? MainStep.altScoringSubstepNr : 1

        if (MainStep.excludeFromOutputs) {
            continue // i.e. ignore Step 4 Feedback Debate
        }

        for (let subStepNr = 0; subStepNr < MainStep.substeps.length; subStepNr++) {

            Substep = MainStep.substeps[subStepNr]

            console.log("--- Main Step : " + MainStep.step)
            console.log("--- Main Step has " + MainStep.substeps.length + " Substeps")
            // Logger.log("substepNr====" + subStepNr + ", MainStep.scoring===" + MainStep.scoring)

            if (DataMode === "results") {

                console.log("MAIN - Beginning Results")
                lastRowR = dataStoreSingleStepLong(elementSheet, subStepNr, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlDC, urlSC, lastRowR, indexPref)
                console.log("MAIN - Produced Results")

            } else if (DataMode === "scores" && subStepNr === scoringSubStepNr) {

                console.log("MAIN - Beginning Scoring")
                lastRowS = dataStoreSingleStepLongScoring(elementSheet, subStepNr, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlDC, urlSC, lastRowS, indexPref)

                lastRowL = dataStoreSingleStepLongLevelScoring(levelSS, subStepNr, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlDC, urlSC, lastRowL, indexPref)

                lastRowC = dataStoreSingleStepLongCompositeScoring(compositeSS, subStepNr, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlDC, urlSC, lastRowC, indexPref)

                lastRowI = dataStoreSingleStepLongIndicatorScoring(indicatorSS, subStepNr, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlDC, urlSC, lastRowI, indexPref)

                console.log("MAIN - Ended Scoring")
            }


        } // END SUBSTEP
    } // END MAIN STEP

    console.log("Formatting Sheet")
    lastCol = elementSheet.getLastColumn()

    elementSheet.getRange(1, 1, lastRowR, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
        .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP)
    // .setWrap(true)

    hookFirstDataCol = firstCol + 2
    elementSheet.setColumnWidths(hookFirstDataCol, lastCol, dataColWidth)
    elementSheet.setColumnWidth(lastCol + 1, 25)

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
