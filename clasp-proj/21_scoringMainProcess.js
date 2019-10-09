function addSetOfScoringSteps(file, sheetMode, configObj, IndicatorsObj, ResearchStepsObj, CompanyObj, companyHasOpCom, isLocalImport) {
    // var to estimate max sheet width in terms of columns based on whether G has subcomponents. This is needed for formatting the whole sheet at end of script. More performant than using getLastCol() esp. when executed per Sheet (think 45 indicators)

    var pilotMode = configObj.pilotMode

    var firstScoringStep = configObj.firstScoringStep - 1
    var maxScoringStep
    if(configObj.maxScoringStep) {
        maxScoringStep = configObj.maxScoringStep + 1
    } else {
        maxScoringStep = ResearchStepsObj.researchSteps.length
    }

    var globalNrOfComponents = 1

    if (IndicatorsObj.indicatorClasses[0].components) {
        globalNrOfComponents = IndicatorsObj.indicatorClasses[0].components.length
    }

    var numberOfColumns = (CompanyObj.numberOfServices + 2) * globalNrOfComponents + 1

    // --- // MAIN Procedure // --- //
    // For all Research Steps
    // For each main step
    var sheetName
    var subStepNr

    // TODO: refactor to global helper function
    if (pilotMode) {
        subStepNr = 1
        sheetName = configObj.notesSheetname
    } else {
        subStepNr = 0
        if (configObj.includeScoring) {
            sheetName = configObj.scoringSheetname
        } else {
            firstScoringStep = configObj.feedbackStep - 1
            maxScoringStep = firstScoringStep + 1 
            sheetName = configObj.feedbackSheetname
        }
    }

    var lastCol = 1
    var blocks = 1

    for (var mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        var thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]
        Logger.log("--- Main Step : " + thisMainStep.step + " ---")
        // var subStepsLength = thisMainStep.substeps.length

        // setting up all the substeps for all the indicators
        
        lastCol = addSingleScoringStep(file, sheetName, subStepNr, lastCol, configObj, pilotMode, IndicatorsObj, sheetMode, thisMainStep, CompanyObj, numberOfColumns, companyHasOpCom, blocks, isLocalImport)
        blocks++

    } // END MAIN STEP
}