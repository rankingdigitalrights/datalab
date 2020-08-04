// Interface for creating a single set of scoring content
// Single set := either Outcome OR Comments OR Company Feedback

/* global
    determineFirstStep,
    determineMaxStep,
    insertSheetIfNotExist,
    scoringSingleStep,
    cropEmptyColumns,
    cropEmptyRows,
    singleSheetProtect,
    moveSheetifExists
*/

// eslint-disable-next-line no-unused-vars
function addSetOfScoringSteps(SS, sheetModeID, Config, Indicators, ResearchSteps, Company, hasOpCom, integrateOutputs, outputParams, isPilotMode) {

    Logger.log("--- Begin addSetOfScoringSteps")
    let sheetName = outputParams.sheetName
    Logger.log("sheetName received: " + sheetName)
    let subStepNr = outputParams.subStepNr
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
        let maxRows = Sheet.getMaxRows
        if (maxRows < 2000) Sheet.insertRowsAfter(maxRows, 1000)
    }

    for (let mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        let thisMainStep = ResearchSteps.researchSteps[mainStepNr]
        Logger.log("--- Main Step : " + thisMainStep.step + " ---")
        // let subStepsLength = thisMainStep.substeps.length

        // setting up all the substeps for all the indicators

        lastCol = scoringSingleStep(SS, Sheet, subStepNr, lastCol, Config, isPilotMode, hasFullScores, Indicators, sheetModeID, thisMainStep, Company, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, includeSources, includeNames, includeResults)

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
