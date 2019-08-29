// find research Step by labelShort

function findResearchStep(ResearchStepsObj, stepsQuery) {

    var stepsSubset = []

    for (searchedStep in stepsQuery) {
		for (step in ResearchStepsObj.researchSteps) {
			// Logger.log("Starting search for steps")
			if (ResearchStepsObj.researchSteps[step].labelShort == stepsQuery[searchedStep]) {
				var foundStep = ResearchStepsObj.researchSteps[step].labelShort
				stepsSubset.push(foundStep)
				Logger.log("found " + foundStep)
			} else {
				Logger.log("Step for unprotection not found")
			}
		}
    }
    
    return stepsSubset
}
