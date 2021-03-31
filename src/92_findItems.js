// OUTDATED / deprecated
// use 93_dataHelpers.js::subsetIndicatorsObject() which returns an intact ResearchObj
// find research Step by labelShort
// TODO adapt to updated Research Steps JSON structure

function specialRangeName(Prefix, Main, Suffix) {
    return Prefix + Main + Suffix
}

function findResearchStepShort(ResearchStepsObj, stepsQuery) {
    let useStepsSubset = []

    for (let searchedStep in stepsQuery) {
        for (let step in ResearchStepsObj.researchSteps) {
            // console.log("Starting search for steps")
            if (ResearchStepsObj.researchSteps[step].labelShort == stepsQuery[searchedStep]) {
                let foundStep = ResearchStepsObj.researchSteps[step].labelShort
                useStepsSubset.push(foundStep)
                console.log('found ' + foundStep)
            }
        }
    }

    if (useStepsSubset.length === 0) {
        console.log('No steps found. Check spelling or variable names.')
    }

    return useStepsSubset
}

// Testing subsetting of ResearchSteopObj
function mainSubsettingTesting() {
    let fileName = 'researchSteps'
    let subset = true

    let firstScoringStep = 3

    let fullStepsObj = importLocalJSON(fileName, subset)

    let subsetLength = fullStepsObj.researchSteps.length - 1
    console.log('length: ' + subsetLength)
    let fullStepsObjSubset = fullStepsObj.researchSteps.slice(firstScoringStep, subsetLength)

    console.log(fullStepsObjSubset)
}
