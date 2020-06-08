/* global
    IndicatorsObj
*/

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
    let Indicators = filterSingleIndicator(indicatorsVector, "P11a")
    console.log(Indicators)
}


// filters the Indicator JSON by a single Indicator (by String: labelShort)
// and returns the subset JSON with intact Object structure

function filterSingleIndicator(Indicators, indLabel) {

    let category, indicator
    let resultVector = {}

    category = Indicators.indicatorCategories.filter(Category =>
        Category.indicators.some(indicator =>
            indicator.labelShort === indLabel)
    )

    indicator = category.map(Category =>
            Category.indicators.filter(indicator =>
                indicator.labelShort === indLabel)
        )
        .flat()

    category[0].indicators = indicator

    resultVector.indicatorCategories = category

    return resultVector

}

function isValueInColumn(SS, sheetName, colNr, value) {
    let Range, Sheet, lastRow
    let isInColumn = false
    Sheet = SS.getSheetByName(mode)
    lastRow = Sheet.getLastRow()
    Logger.log("lastRow: " + lastRow)
    if (lastRow >= 1) {
        Range = Sheet.getRange(1, colNr, lastRow)
        isInColumn = Range.getValues()
            .flat(2) // unnest 2D array to flat 1D array
            .includes(value)
    }
    return isInColumn
}

function createSubstepArray(stepLabel) {

    // TODO
    let substepArray = []
    let mainstepArray

    stepLabel.forEach(step => {

        let Steps = researchStepsVector.researchSteps // at some later point use researchSteps.filter(stepLabel)

        Steps.forEach(Step => {
            if (Step.stepID == step) {
                Step.substeps.forEach(Substep => {
                    substepArray.push(Substep.subStepID)
                })
            }
        })
        mainstepArray.push(substepArray)
    })

    return mainstepArray
}
