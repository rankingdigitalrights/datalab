// Interface for creating a single set of scoring content
// Single set := either Outcome OR Comments OR Company Feedback

function addSetOfScoringSteps(SS, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode) {

    Logger.log("--- Begin addSetOfScoringSteps")
    var sheetName = outputParams.sheetName
    Logger.log("sheetName received: " + sheetName)
    var subStepNr = outputParams.subStepNr
    var hasFullScores = outputParams.hasFullScores
    var includeSources = outputParams.includeSources
    var includeNames = outputParams.includeNames
    var includeResults = outputParams.includeResults

    var dataColWidth = outputParams.dataColWidth

    // var to estimate max sheet width in terms of columns based on whether G has subcomponents. This is needed for formatting the whole sheet at end of script. More performant than using getLastCol() esp. when executed per Sheet (think 45 indicators)
    var globalNrOfComponents = 1
    if (IndicatorsObj.indicatorClasses[0].components) {
        globalNrOfComponents = IndicatorsObj.indicatorClasses[0].components.length
    }

    var numberOfColumns = (CompanyObj.numberOfServices + 2) * globalNrOfComponents + 1

    var firstScoringStep = determineFirstStep(outputParams)
    var maxScoringStep = determineMaxStep(outputParams, ResearchStepsObj)

    Logger.log("include Sources? " + outputParams.includeSources)


    var lastCol = 1
    var blocks = 1

    // --- // MAIN Procedure // --- //
    // For each Main Research Step

    Logger.log("Inserting Sheet " + sheetName)
    var Sheet = insertSheetIfNotExist(SS, sheetName, true)
    if (Sheet === null) {
        Logger.log("BREAK: Sheet for " + sheetName + " already exists. Skipping.")
        return lastCol
    }

    for (var mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        var thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]
        Logger.log("--- Main Step : " + thisMainStep.step + " ---")
        // var subStepsLength = thisMainStep.substeps.length

        // setting up all the substeps for all the indicators

        lastCol = scoringSingleStep(SS, Sheet, subStepNr, lastCol, Config, isPilotMode, hasFullScores, IndicatorsObj, sheetModeID, thisMainStep, CompanyObj, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, useIndicatorSubset, includeSources, includeNames, includeResults)

        blocks++

    } // END MAIN STEP

    // apply layouting

    var thisSheet = SS.getSheetByName(sheetName)
    thisSheet.setFrozenColumns(1)
    singleSheetProtect(thisSheet, sheetName)

    if (integrateOutputs) moveSheetifExists(SS, thisSheet, 1)
}