function determineFirstStep(outputParams) {
    var firstScoringStep

    if (outputParams.firstStepNr) {
        firstScoringStep = outputParams.firstStepNr - 1
    } else {
        firstScoringStep = 0
    }

    return firstScoringStep
}

function determineMaxStep(outputParams, ResearchStepsObj) {

    var maxScoringStep = outputParams.lastStepNr ? outputParams.lastStepNr : ResearchStepsObj.researchSteps.length

    return maxScoringStep
}

function testSelectSingleIndicator() {
    let Indicators = selectSingleIndicator(indicatorsVector, "P", "P18")
}


function selectSingleIndicator(Indicators, catLabel, indLabel) {

    let CategorySubset = Indicators.indicatorCategories.filter(category => category.labelShort == catLabel)

    let Indicator = CategorySubset[0].indicators.filter(indicator => indicator.labelShort == indLabel)

    Indicator ? console.log("Indicator " + Indicator[0].labelShort + " found!") : console.log("Indicator " + indLabel + " NOT found!")

    return Indicator
}
