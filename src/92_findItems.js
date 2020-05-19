// find research Step by labelShort
// TODO adapt to updated Research Steps JSON structure

function findResearchStepShort(ResearchStepsObj, stepsQuery) {

    var useStepsSubset = []

    for (var searchedStep in stepsQuery) {
        for (var step in ResearchStepsObj.researchSteps) {
            // Logger.log("Starting search for steps")
            if (ResearchStepsObj.researchSteps[step].labelShort == stepsQuery[searchedStep]) {
                var foundStep = ResearchStepsObj.researchSteps[step].labelShort
                useStepsSubset.push(foundStep)
                Logger.log("found " + foundStep)
            } 
        }
    }

    if (useStepsSubset.length === 0) {
        Logger.log("No steps found. Check spelling or variable names.")
    }
    
    return useStepsSubset
}

// Testing subsetting of ResearchSteopObj
function mainSubsettingTesting() {
    var fileName = "researchSteps"
    var subset = true

    var firstScoringStep = 3
    
    var fullStepsObj = importLocalJSON(fileName, subset)
    
    var subsetLength = fullStepsObj.researchSteps.length - 1
    Logger.log("length: " + subsetLength)
    var fullStepsObjSubset = fullStepsObj.researchSteps.slice(firstScoringStep,subsetLength)
  
    Logger.log(fullStepsObjSubset)
}
