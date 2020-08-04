// Interface for creating a single set of scoring content
// Single set := either Outcome OR Comments OR Company Feedback

/* global indexPrefix, determineFirstStep, determineMaxStep, insertSheetIfNotExist, scoringSingleStep, cropEmptyColumns, cropEmptyRows, singleSheetProtect, moveSheetifExists */

// eslint-disable-next-line no-unused-vars
function addSetOfScoringSteps(SS, sheetModeID, Indicators, ResearchSteps, Company, hasOpCom, integrateOutputs, outputParams, isPilotMode) {

    Logger.log("|--- Begin addSetOfScoringSteps")
    let sheetName = outputParams.sheetName
    Logger.log("|--- sheetName received: " + sheetName)
    Logger.log("|--- File ID: " + SS.getId())

    // let subStepNr = outputParams.subStepNr

    let hasFullScores = outputParams.hasFullScores
    let includeSources = outputParams.includeSources
    let includeNames = outputParams.includeNames
    let includeResults = outputParams.includeResults

    let dataColWidth = outputParams.dataColWidth

    // var to estimate max sheet width in terms of columns based on whether G has subcomponents. This is needed for formatting the whole sheet at end of script. More performant than using getLastCol() esp. when executed per Sheet (think 45 indicators)
    let numberOfColumns = Company.services.length + 3

    let firstScoringStep = determineFirstStep(outputParams)
    let maxScoringStep = determineMaxStep(outputParams, ResearchSteps)

    Logger.log("first step " + firstScoringStep)
    Logger.log("last step " + maxScoringStep)
    Logger.log("include Sources? " + outputParams.includeSources)
    Logger.log("outputParams:" + outputParams)


    let lastCol = 1
    let blocks = 1

    // --- // MAIN Procedure // --- //
    // For each Main Research Step

    Logger.log("Inserting Sheet " + sheetName)
    let Sheet = insertSheetIfNotExist(SS, sheetName, true)
    if (Sheet === null) {
        Logger.log("BREAK: Sheet for " + sheetName + " already exists. Skipping.")
        return lastCol
    } else {
        Sheet.clear()
        // temporarily add more rows to improve Script performance
        Sheet.insertRowsAfter(Sheet.getMaxRows(), 2000)
    }

    for (let mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        let MainStep = ResearchSteps.researchSteps[mainStepNr]

        if (MainStep.excludeFromOutputs) {
            break // i.e. ignore Step 4 Feedback Debate
        }

        console.log(`DEBUG ${MainStep.altScoringSubstepNr}`)
        let subStepNr = MainStep.altScoringSubstepNr > -1 ? MainStep.altScoringSubstepNr : outputParams.subStepNr

        let indexPref = MainStep.altIndexID ? MainStep.altIndexID : indexPrefix

        Logger.log(`|--- Main Step : ${MainStep.step}`)
        Logger.log(`|---- Sub Step : ${subStepNr}`)


        // producing single Scoring Step for all indicators

        lastCol = scoringSingleStep(SS, Sheet, indexPref, subStepNr, lastCol, isPilotMode, hasFullScores, Indicators, sheetModeID, MainStep, Company, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, includeSources, includeNames, includeResults)

        blocks++

    } // END MAIN STEP

    // apply layouting

    let thisSheet = SS.getSheetByName(sheetName)
    thisSheet.setFrozenColumns(1)
    cropEmptyColumns(thisSheet, 1)
    cropEmptyRows(thisSheet, 1)
    singleSheetProtect(thisSheet, sheetName)

    if (integrateOutputs) moveSheetifExists(SS, thisSheet, 1)
}
