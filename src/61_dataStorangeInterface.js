/**
 * Interface for creating a structured set of company element-level reults
 * NEW: Wide and Long (Tidy Format)
 */

/* global Config, insertSheetIfNotExist, dataStoreSingleStepResults, dataStoreSingleStepElementScoring, dataStoreSingleStepLevelScoring, dataStoreSingleStepCompositeScoring, dataStoreSingleStepIndicatorScoring, resizeSheet */

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

    // --- // Element Level Results // --- //

    if (DataMode === "results") {
        elementSheet = insertSheetIfNotExist(SS, "results", true)
        if (elementSheet !== null) {
            elementSheet.clear()
            resizeSheet(elementSheet, 65000) // approaching upper limit of allowed cell limit of 500K
        }
    }

    // --- // Scores Sheets // --- //

    if (DataMode === "scores") {

        elementSheet = insertSheetIfNotExist(SS, "element scores", true)
        if (elementSheet !== null) {
            elementSheet.clear()
            resizeSheet(elementSheet, 65000) // approaching upper limit of allowed cell limit of 500K
        }

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

    for (mainStepNr = firstScoringStep; mainStepNr <= maxScoringStep; mainStepNr++) {

        // console.log("DEBUG - " + mainStepNr)
        MainStep = ResearchSteps.researchSteps[mainStepNr]

        indexPref = MainStep.altIndexID ? Config.prevIndexPrefix : Config.indexPrefix

        let scoringSubStepNr = MainStep.altScoringSubstepNr ? MainStep.altScoringSubstepNr : 1
        if (mainStepNr == 0) {
            scoringSubStepNr = 0
        }


        if (MainStep.excludeFromOutputs) {
            continue // i.e. ignore Step 4 Feedback Debate
        }

        for (let subStepNr = 0; subStepNr < MainStep.substeps.length; subStepNr++) {

            Substep = MainStep.substeps[subStepNr]

            // console.log("--- Main Step : " + mainStepNr)
            // console.log("--- Main Step has " + MainStep.substeps.length + " Substeps")
            // Logger.log("substepNr====" + subStepNr + ", MainStep.scoring===" + MainStep.scoring)

            if (DataMode === "results") {
                console.log("MAIN - Beginning Results " + mainStepNr)
                lastRowR = dataStoreSingleStepResults(elementSheet, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlDC, lastRowR, indexPref)
                console.log("MAIN - Produced Results " + mainStepNr)

            } else if (DataMode === "scores" && subStepNr === scoringSubStepNr) {

                console.log("MAIN - Beginning Scoring " + mainStepNr)

                console.log("|----- Element Scores")
                lastRowS = dataStoreSingleStepElementScoring(elementSheet, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlSC, lastRowS, indexPref)
                console.log("|----- Element Scores OK")

                console.log("|----- Level Scores")
                lastRowL = dataStoreSingleStepLevelScoring(levelSS, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlSC, lastRowL, indexPref)
                console.log("|----- Level Scores OK")


                console.log("|----- Composite Scores")
                lastRowC = dataStoreSingleStepCompositeScoring(compositeSS, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlSC, lastRowC, indexPref)
                console.log("|----- Composite Scores OK")


                console.log("|----- Indicator Scores")
                lastRowI = dataStoreSingleStepIndicatorScoring(indicatorSS, Indicators, Substep, Company, hasOpCom, integrateOutputs, urlSC, lastRowI, indexPref)
                console.log("|----- Indicator Scores OK")

                console.log("MAIN - Ended Scoring " + mainStepNr)
            }


        } // END SUBSTEP
    } // END MAIN STEP
}
