// Generic Interface for creating a single set of imported
// input type data for an array of Steps[]
// CAUTION: is also used by 30_aggregationMain.js

/* global indexPrefix, determineFirstStep, determineMaxStep, insertSheetIfNotExist, scoringSingleStep, cropEmptyColumns, cropEmptyRows */

// eslint-disable-next-line no-unused-vars
function addSetOfScoringSteps(
    SS,
    sheetModeID,
    Indicators,
    ResearchSteps,
    Company,
    hasOpCom,
    outputParams,
    isYoyMode,
    yoyComp, // TODO: GW - rename / document / deprecate
    addNewStep,
    stepsToAdd
) {
    // stepsToAdd = stepsToAdd.map(stepNr => stepNr - 1)

    console.log('|--- Begin addSetOfScoringSteps')
    let sheetName = outputParams.sheetName
    console.log('|--- sheetName received: ' + sheetName)
    console.log('|--- File ID: ' + SS.getId())

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

    console.log('first step ' + firstScoringStep)
    console.log('last step ' + maxScoringStep)
    console.log('include Sources? ' + outputParams.includeSources)
    console.log('outputParams:' + outputParams)

    let lastCol = 1
    let blocks = 1

    if (addNewStep) {
        blocks = 2
    }

    // --- // MAIN Procedure // --- //
    // For each Main Research Step

    console.log('Inserting Sheet ' + sheetName)
    let Sheet = insertSheetIfNotExist(SS, sheetName, true)
    if (Sheet === null) {
        console.log('BREAK: Sheet for ' + sheetName + ' already exists. Skipping.')
        return lastCol
    } else {
        //Sheet.clear()
        // temporarily add more rows to improve Script performance
        if (!addNewStep) {
            Sheet.insertRowsAfter(Sheet.getMaxRows(), 2000)
        }
    }

    if (addNewStep) {
        lastCol = Sheet.getLastColumn() + 2
    }

    for (let mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {
        let MainStep = ResearchSteps.researchSteps[mainStepNr]

        // if current StepNr isn't in yony array / addNewStep Array / or is exclude in the research steps JSON --> skip Main Step

        if (
            (mainStepNr > 0 && isYoyMode && !yoyComp.includes(mainStepNr)) ||
            (addNewStep && !stepsToAdd.includes(mainStepNr)) ||
            MainStep.excludeFromOutputs
        ) {
            continue
        }

        // console.log(`DEBUG ${MainStep.altScoringSubstepNr}`)
        let subStepNr = MainStep.altScoringSubstepNr > -1 ? MainStep.altScoringSubstepNr : outputParams.subStepNr

        let indexPref = MainStep.altIndexID ? MainStep.altIndexID : indexPrefix

        console.log(`|--- Main Step : ${MainStep.step}`)
        console.log(`|---- Sub Step : ${subStepNr}`)

        // producing single Scoring Step for all indicators

        lastCol = scoringSingleStep(
            SS,
            Sheet,
            indexPref,
            subStepNr,
            lastCol,
            hasFullScores,
            Indicators,
            sheetModeID,
            MainStep,
            Company,
            numberOfColumns,
            hasOpCom,
            blocks,
            dataColWidth,
            includeSources,
            includeNames,
            includeResults,
            isYoyMode,
            addNewStep
        )

        blocks++
    } // END MAIN STEP

    // apply layouting

    let thisSheet = SS.getSheetByName(sheetName)
    thisSheet.setFrozenColumns(1)
    cropEmptyColumns(thisSheet, 1)
    cropEmptyRows(thisSheet, 1)
    thisSheet.protect().setDescription(sheetName + ' protected')
}
