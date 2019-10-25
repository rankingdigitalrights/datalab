// Interface for creating a single set of scoring content
// Single set := either Outcome OR Comments OR Company Feedback

function addSetOfScoringSteps(File, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, integrateOutputs, outputParams, isPilotMode) {



    var sheetName = outputParams.sheetName
    var subStepNr = outputParams.subStepNr
    var hasFullScoring = outputParams.hasFullScoring

    // var to estimate max sheet width in terms of columns based on whether G has subcomponents. This is needed for formatting the whole sheet at end of script. More performant than using getLastCol() esp. when executed per Sheet (think 45 indicators)
    var globalNrOfComponents = 1
    if (IndicatorsObj.indicatorClasses[0].components) {
        globalNrOfComponents = IndicatorsObj.indicatorClasses[0].components.length
    }

    var numberOfColumns = (CompanyObj.numberOfServices + 2) * globalNrOfComponents + 1

    // minus for logical -> index
    var firstScoringStep = outputParams.firstStepNr - 1
    // var scoringSteps = Config.scoringSteps --> Array for iteration over particular steps
    var maxScoringStep

    if (outputParams.lastStepNr) {
        maxScoringStep = outputParams.lastStepNr // for at least 1 iteration
    } else {
        if (Config.maxScoringStep) {
            maxScoringStep = Config.maxScoringStep // for at least 1 iteration
        } else {
            maxScoringStep = ResearchStepsObj.researchSteps.length
        }
    }

    var dataColWidth = outputParams.dataColWidth

    var lastCol = 1
    var blocks = 1

    // --- // MAIN Procedure // --- //
    // For each Main Research Step

    for (var mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        var thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]
        Logger.log("--- Main Step : " + thisMainStep.step + " ---")
        // var subStepsLength = thisMainStep.substeps.length

        // setting up all the substeps for all the indicators

        lastCol = scoringSingleStep(File, sheetName, subStepNr, lastCol, Config, isPilotMode, hasFullScoring, IndicatorsObj, sheetModeID, thisMainStep, CompanyObj, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, useIndicatorSubset)

        blocks++

    } // END MAIN STEP

    // apply layouting

    var thisSheet = File.getSheetByName(sheetName)
    thisSheet.setFrozenColumns(1)
    singleSheetProtect(thisSheet, sheetName)

    if (integrateOutputs) {
        moveSheetToPos(File, thisSheet, 1)
    }

}