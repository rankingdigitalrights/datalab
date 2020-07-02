/* global
    indicatorsVector
*/

// filters IndicatorsObj by a regex String "G1|F9c|P11a"
// returns intact IndicatorsObj
// Important: If String is ambiguous (i.e. P1 vs P11)
// use startsWith (^) / EndsWith ($) Regex, i.e. "^P1$"

function subsetIndicatorsObject(IndicatorsObj, regexString) {

    // filter out categories in question
    let results = indicatorsVector.indicatorCategories.filter(category => {
        return category.indicators.some(indicator => indicator.labelShort.match(regexString))
    })


    // make deep nested copy of greedy results Object
    // crazy: https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
    let newCopy = JSON.parse(JSON.stringify(results))

    let findings = {
        "indicatorCategories": []
    }

    // prepare final results Object with empty indicators[]
    results.map((category, index) => {
        newCopy[index].indicators = Array.from([])
        findings.indicatorCategories.push(newCopy[index])
    })

    // category-wise, push only target indicators
    results.map((category, index) => {
        let catIndex = index
        let found = category.indicators.filter(indicator => {
            return indicator.labelShort.match(regexString)
        })
        // found.forEach(indicator => findings[catIndex].indicators.push(indicator))
        // more elegant:
        findings.indicatorCategories[catIndex].indicators = found

    })

    // verbose feedback
    console.log(" ------ FILTER SUCCESS ------")
    console.log(" ------ Returned Indicators Subset:")
    console.log(findings)

    // findings.indicatorCategories.forEach(category => {
    //     console.log(" ------ RESULTS: ------ ")
    //     console.log("Category: " + category.labelLong)
    //     console.log("Found Indicators: ")
    //     console.log(category.indicators)
    // })

    return findings
}

function testSubsetOfIndicators() {
    let targets = "^G1$|P11a"

    let findings = subsetIndicatorsObject(indicatorsVector, targets)
    console.log(findings)
}

// returns first Scoring Step based on Config

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

function filterSingleSubstep(Step, substepLabel) {
    for (var i = 0; c < Step.substeps.length; i++) {
        if (Step.substeps[i].subStepID==substepLabel) {
            return Step.substeps[i]
        }

    }

    return null
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
