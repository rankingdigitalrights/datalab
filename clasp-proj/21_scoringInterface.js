function addSetOfScoringSteps(file, sheetMode, configObj, IndicatorsObj, ResearchStepsObj, CompanyObj, companyHasOpCom, isLocalImport) {
    // var to estimate max sheet width in terms of columns based on whether G has subcomponents. This is needed for formatting the whole sheet at end of script. More performant than using getLastCol() esp. when executed per Sheet (think 45 indicators)

    var pilotMode = configObj.pilotMode
    var fullScoring = configObj.isFullScoring

    var firstScoringStep = configObj.firstScoringStep - 1
    var scoringSteps = configObj.scoringSteps
    var maxScoringStep
    
    if(configObj.maxScoringStep) {
        maxScoringStep = configObj.maxScoringStep - 1
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
    
    var sheetName
    var subStepNr = 0
    var dataColWidth = configObj.defaultDataColWidth.toString()

    // TODO: refactor to global helper function
    if (pilotMode) {
        subStepNr = 1
        firstScoringStep = 0
        sheetName = configObj.notesSheetname
        dataColWidth = 200
    } else {
        if (configObj.includeScoring) {
            sheetName = configObj.scoringSheetname
        } else {
            // otherwise feedback
            fullScoring = true
            firstScoringStep = configObj.feedbackStep - 1
            maxScoringStep = firstScoringStep + 1 
            sheetName = configObj.feedbackSheetname
        }
    }

    var lastCol = 1
    var blocks = 1

    // For each Main Research Step
    
    for (var mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        var thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]
        Logger.log("--- Main Step : " + thisMainStep.step + " ---")
        // var subStepsLength = thisMainStep.substeps.length

        // setting up all the substeps for all the indicators
        
        lastCol = scoringSingleStep(file, sheetName, subStepNr, lastCol, configObj, pilotMode, fullScoring, IndicatorsObj, sheetMode, thisMainStep, CompanyObj, numberOfColumns, companyHasOpCom, blocks, isLocalImport, dataColWidth)

        blocks++

    } // END MAIN STEP

    var thisSheet = file.getSheetByName(sheetName)
    thisSheet.setFrozenColumns(1)
    singleSheetProtect(thisSheet, sheetName)

}