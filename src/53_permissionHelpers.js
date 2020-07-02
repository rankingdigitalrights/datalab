function getNamedRangeRowNotation(namedRange, SS) {
    let firstR, lastR

    firstR = SS.getRangeByName(namedRange).getRow()
    lastR = SS.getRangeByName(namedRange).getLastRow()

    return firstR + ":" + lastR

}

function createSubstepArray(stepLabel) {

    let stepArray=[]
    let Steps=researchStepsVector.researchSteps

    Steps.forEach(function (Step) {
        if(stepLabel.includes(Step.stepID)) {
            let substepArray=[]
            Step.substeps.forEach(function (Substep) {
                substepArray.push(Substep.subStepID)   
            })
            stepArray.push(substepArray)
        }
    })

    return stepArray
}