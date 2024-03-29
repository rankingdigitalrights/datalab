/**
 * Interface for creating a structured set of company element-level reults
 * NEW: Wide and Long (Tidy Format)
 */

/* global Config, insertSheetIfNotExist, dataStoreSingleStepResults, dataStoreSingleStepElementScoring, dataStoreSingleStepLevelScoring, dataStoreSingleStepCompositeScoring, dataStoreSingleStepIndicatorScoring, resizeSheet, elementsTotalLength, addTransposedSheet, cropEmptyColumns */

// eslint-disable-next-line no-unused-vars
function addDataStoreSingleCompany(
    SS,
    Indicators,
    ResearchSteps,
    firstScoringStep,
    maxScoringStep,
    Company,
    hasOpCom,
    DataMode
) {
    let urlDC = Company.urlCurrentInputSheet
    let urlSC = Company.urlCurrentOutputSheet

    let elementsTotalNr = elementsTotalLength(Indicators)

    // --- // MAIN Procedure // --- //
    // For each Main Research Step

    let indexPref

    let mainStepNr
    let MainStep
    let Substep

    let lastRowR, lastRowS, lastRowC, lastRowI, lastRowL

    let elementSheet, levelSS, compositeSS, indicatorSS

    // --- // Element Level Results // --- //

    if (DataMode === 'results' || DataMode === 'changes') {
        // keeping 2020 tab names
        tabName = DataMode === 'results' ? 'simple results' : 'reason for change'
        elementSheet = insertSheetIfNotExist(SS, tabName, true)
        if (elementSheet !== null) {
            elementSheet.clear()
            resizeSheet(elementSheet, 65000) // approaching upper limit of allowed cell limit of 500K
        }
    }

    // New: Transposing Results / Pivot

    if (DataMode === 'transpose') {
        let transposeSheet = insertSheetIfNotExist(SS, 'transposed', true)
        if (transposeSheet !== null) {
            // elementSheet.clear()
            let totalSteps = maxScoringStep + 1
            resizeSheet(transposeSheet, 10000) // approaching upper limit of allowed cell limit of 500K
            addTransposedSheet(transposeSheet, 'results', elementsTotalNr, totalSteps)
        }
    }

    // --- // Scores Sheets // --- //

    if (DataMode === 'scores') {
        elementSheet = insertSheetIfNotExist(SS, 'element scores', true)
        if (elementSheet !== null) {
            elementSheet.clear()
            resizeSheet(elementSheet, 65000) // approaching upper limit of allowed cell limit of 500K
        }

        levelSS = insertSheetIfNotExist(SS, 'level scores', true)
        if (levelSS !== null) {
            levelSS.clear()
        }

        compositeSS = insertSheetIfNotExist(SS, 'composite scores', true)
        if (compositeSS !== null) {
            compositeSS.clear()
        }

        indicatorSS = insertSheetIfNotExist(SS, 'indicator scores', true)
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

        if (mainStepNr === 5 && (DataMode === 'results' || DataMode === 'changes')) {
            continue
        }

        for (let subStepNr = 0; subStepNr < MainStep.substeps.length; subStepNr++) {
            Substep = MainStep.substeps[subStepNr]

            console.log('--- Main Step : ' + mainStepNr)
            // console.log("--- Main Step has " + MainStep.substeps.length + " Substeps")
            // console.log("substepNr====" + subStepNr + ", MainStep.scoring===" + MainStep.scoring)

            if ((DataMode === 'results' && subStepNr === scoringSubStepNr) || DataMode === 'changes') {
                console.log('MAIN - Beginning Results ' + mainStepNr)
                lastRowR = dataStoreSingleStepResults(
                    elementSheet,
                    Indicators,
                    Substep,
                    Company,
                    hasOpCom,
                    urlDC,
                    lastRowR,
                    indexPref,
                    DataMode
                )
                cropEmptyColumns(elementSheet)
                console.log('MAIN - Produced Results ' + mainStepNr)
            } else if (DataMode === 'scores' && subStepNr === scoringSubStepNr) {
                console.log('MAIN - Beginning Scoring ' + mainStepNr)

                console.log('|----- Element Scores')
                lastRowS = dataStoreSingleStepElementScoring(
                    elementSheet,
                    Indicators,
                    Substep,
                    Company,
                    hasOpCom,
                    urlSC,
                    lastRowS,
                    indexPref
                )
                cropEmptyColumns(elementSheet)
                console.log('|----- Element Scores OK')

                console.log('|----- Level Scores')
                lastRowL = dataStoreSingleStepLevelScoring(
                    levelSS,
                    Indicators,
                    Substep,
                    Company,
                    hasOpCom,
                    urlSC,
                    lastRowL,
                    indexPref
                )
                cropEmptyColumns(levelSS)
                console.log('|----- Level Scores OK')

                console.log('|----- Composite Scores')
                lastRowC = dataStoreSingleStepCompositeScoring(
                    compositeSS,
                    Indicators,
                    Substep,
                    Company,
                    hasOpCom,
                    urlSC,
                    lastRowC,
                    indexPref
                )
                cropEmptyColumns(compositeSS)
                console.log('|----- Composite Scores OK')

                console.log('|----- Indicator Scores')
                lastRowI = dataStoreSingleStepIndicatorScoring(
                    indicatorSS,
                    Indicators,
                    Substep,
                    Company,
                    hasOpCom,
                    urlSC,
                    lastRowI,
                    indexPref
                )
                cropEmptyColumns(indicatorSS)
                console.log('|----- Indicator Scores OK')

                console.log('MAIN - Ended Scoring ' + mainStepNr)
            }
        } // END SUBSTEP
    } // END MAIN STEP
}
