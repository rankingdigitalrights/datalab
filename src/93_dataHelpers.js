/* global
    IndicatorsObj
*/

function determineFirstStep(outputParams) {
    var firstScoringStep

    if (outputParams.firstStepNr) {
        firstScoringStep = outputParams.firstStepNr
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

function filterIndicatorList(Indicators, indLabels) {

    let category, indicator, indCategory
    let resultVector = {}
    let categories=[]

    for(let cat=0; cat<Indicators.indicatorCategories;cat++){
        indCategory=Indicators.indicatorCategories[cat]
        indCategory.indicators=[]
        categories.push(indCategory)
    }
   
    for(let label=0; label<indLabels.length;label++){
        category = Indicators.indicatorCategories.filter(Category =>
            Category.indicators.some(indicator =>
                indicator.labelShort === indLabels[label])
        )
    
        indicator = category.map(Category =>
                Category.indicators.filter(indicator =>
                    indicator.labelShort === indLabels[label])
            )
            .flat()

            for(let cate=0; cate<Indicators.indicatorCategories;cate++){
                if(category.labelShort==categories[cate].labelShort){
                    categories[cate].indicators.push(Indicators.indicatorCategories[cate])
                }
                
            }

    }

    resultVector={"indicatorCategories": categories}

    return resultVector

}




function isValueInColumn(SS, sheetName, colNr, value) {
    let Range, Sheet, lastRow
    let isInColumn = false
    Sheet = SS.getSheetByName(sheetName)
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
