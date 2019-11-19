function determineFirstStep(ConfigObj, outputParams) {
    var firstScoringStep

    if (outputParams.firstStepNr) {
        firstScoringStep = outputParams.firstStepNr - 1
    } else {
        if (ConfigObj.firstScoringStep) {
            firstScoringStep = ConfigObj.firstScoringStep - 1
        } else {
            firstScoringStep = 0
        }
    }

    return firstScoringStep
}

function determineMaxStep(ConfigObj, outputParams, ResearchStepsObj) {
    var maxScoringStep

    if (outputParams.lastStepNr) {
        maxScoringStep = outputParams.lastStepNr + 1 // for at least 1 iteration
    } else {
        if (ConfigObj.maxScoringStep) {
            maxScoringStep = ConfigObj.maxScoringStep + 1 // for at least 1 iteration
        } else {
            maxScoringStep = ResearchStepsObj.researchSteps.length
        }
    }

    return maxScoringStep
}