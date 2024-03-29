// data object helpers for //
// - Subsetting the research Object
// - estimating row / column lengths of Indicator objects
// - returning  array of Indicator lables
// - checking if a Value exists in a spreasdsheet column

/* global
    indicatorsVector
*/

// filters IndicatorsObj by a regex String "G1|F9c|P11a"
// returns intact IndicatorsObj
// Important: If String is ambiguous (i.e. P1 vs P11)
// use startsWith (^) / EndsWith ($) Regex, i.e. "^P1$"

function subsetIndicatorsObject(IndicatorsObj, labelsArray) {
    // filter out categories in question
    let results = indicatorsVector.indicatorCategories.filter((category) => {
        return category.indicators.some((indicator) => labelsArray.includes(indicator.labelShort))
    })

    // make deep nested copy of greedy results Object
    // crazy: https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
    let newCopy = JSON.parse(JSON.stringify(results))

    let findings = {
        indicatorCategories: [],
    }

    // prepare final results Object with empty indicators[]
    results.map((category, index) => {
        newCopy[index].indicators = Array.from([])
        findings.indicatorCategories.push(newCopy[index])
    })

    // category-wise, push only target indicators
    results.map((category, index) => {
        let catIndex = index
        let found = category.indicators.filter((indicator) => {
            return labelsArray.includes(indicator.labelShort)
        })
        // found.forEach(indicator => findings[catIndex].indicators.push(indicator))
        // more elegant:
        findings.indicatorCategories[catIndex].indicators = found
    })

    // verbose feedback
    // console.log(" ------ FILTER SUCCESS ------")
    // console.log(" ------ Returned Indicators Subset:")
    // console.log(findings)

    // findings.indicatorCategories.forEach(category => {
    //     console.log(" ------ RESULTS: ------ ")
    //     console.log("Category: " + category.labelLong)
    //     console.log("Found Indicators: ")
    //     console.log(category.indicators)
    // })

    return findings
}

function testSubsetOfIndicators() {
    let targets = '^G1$|P11a'

    let findings = subsetIndicatorsObject(indicatorsVector, targets)
    console.log(findings)
}

// returns first Scoring Step based on Config

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
    var maxScoringStep = outputParams.lastStepNr ? outputParams.lastStepNr + 1 : ResearchStepsObj.researchSteps.length

    return maxScoringStep
}

function testSelectSingleIndicator() {
    let Indicators = filterSingleIndicator(indicatorsVector, 'P11a')
    console.log(Indicators)
}

// filters the Indicator JSON by a single Indicator (by String: labelShort)
// and returns the subset JSON with intact Object structure

function filterSingleIndicator(Indicators, indLabel) {
    let category, indicator
    let resultVector = {}

    category = Indicators.indicatorCategories.filter((Category) =>
        Category.indicators.some((indicator) => indicator.labelShort === indLabel)
    )

    indicator = category
        .map((Category) => Category.indicators.filter((indicator) => indicator.labelShort === indLabel))
        .flat()

    category[0].indicators = indicator

    resultVector.indicatorCategories = category

    return resultVector
}

function filterSingleSubstep(Step, substepLabel) {
    for (var i = 0; i < Step.substeps.length; i++) {
        if (Step.substeps[i].subStepID == substepLabel) {
            return Step.substeps[i]
        }
    }

    return null
}

// super helpul for i.e. not adding duplicate entries to a spreadsheet column
// used for adding fileIds to the dev dashboard Spreadsheet

function isValueInColumn(SS, sheetName, colNr, value) {
    let Range, Sheet, lastRow
    let isInColumn = false
    Sheet = SS.getSheetByName(sheetName)
    lastRow = Sheet.getLastRow()
    console.log('lastRow: ' + lastRow)
    if (lastRow >= 1) {
        Range = Sheet.getRange(1, colNr, lastRow)
        isInColumn = Range.getValues()
            .flat(2) // unnest 2D array to flat 1D array
            .includes(value)
    }
    return isInColumn
}

// PROTOTYPE: Research Step Progress Percentage Tracker
// never used but might be woth exploring
// Idea is to count the number of cells with "not selected" divided
// by number of cells to be edited.

function createFormula() {
    //let Company=companiesVector.companies.slice(0,1)[0]
    let stepLabel = 'S020'

    let formula = ''
    let SS = SpreadsheetApp.openByUrl(
        'https://docs.google.com/spreadsheets/d/1Etb_IxD2Xl_bITrbAw7mWepZjQu3N8KSuuyAGEG_MTM/edit#gid=0'
    )
    let Sheet = SS.getActiveSheet()
    let row = 1

    let Companies = companiesVector.companies
    // .slice(0, 0) // on purpose to prevent script from running.
    // .slice(0, 1) //   0 "Alibaba",
    // .slice(1, 2) //   1 "Amazon",
    // .slice(2, 3) //   2 "América Móvil",
    // .slice(3, 4) //   3 "Apple",
    // .slice(4, 5) //   4 "AT&T",
    // .slice(5, 6) //   5 "Axiata",
    // .slice(6, 7) //   6 "Baidu",
    // .slice(7, 8) //   7 "Bharti Airtel",
    // .slice(8, 9) //   8 "Deutsche Telekom",
    // .slice(9, 10) //   9 "Etisalat",
    //.slice(10, 11) //   10 "Facebook",
    // .slice(11, 12) //   11 "Google",
    // .slice(12, 13) //   12 "Kakao",
    // .slice(13, 14) //   13 "Mail.Ru",
    // .slice(14, 15) //   14 "Microsoft",
    // .slice(15, 16) //   15 "MTN",
    // .slice(16, 17) //   16 "Ooredoo",
    // .slice(17, 18) //   17 "Orange",
    // .slice(18, 19) //   18 "Samsung",
    // .slice(19, 20) //   19 "Telefónica",
    // .slice(20, 21) //   20 "Telenor",
    // .slice(21, 22) //   21 "Tencent",
    // .slice(22, 23) //   22 "Twitter",
    // .slice(23, 24) //   23 "Verizon Media",
    // .slice(24, 25) //   24 "Vodafone",
    // .slice(25, 26) //   25 "Yandex"

    Companies.forEach(function (Company) {
        formula = createPercentageDone(Company, stepLabel)
        range = 'A' + String(row)
        Sheet.getRange(range).setFormula(formula)
        row = row + 1
    })
}

function createPercentageDone(Company, stepLabel) {
    let rangeName, Indicator

    let finalFormula = ''
    let formulaNotSelected = '=1-('
    let formulaAllCells = '/('
    //let Indicators = subsetIndicatorsObject(indicatorsVector, "G1|G2")
    let Indicators = indicatorsVector
    let currentPrefix = centralConfig.indexPrefix

    console.log('indicator:' + Indicators)

    // looping through the types of indicators
    for (let indicatorCategory = 0; indicatorCategory < Indicators.indicatorCategories.length; indicatorCategory++) {
        let Category = Indicators.indicatorCategories[indicatorCategory]

        console.log('--- Starting ' + Category.labelLong)

        // looping through each indicator
        for (let indicator = 0; indicator < Category.indicators.length; indicator++) {
            Indicator = Category.indicators[indicator]
            rangeName = defineNamedRange(
                currentPrefix,
                'DC',
                stepLabel,
                Indicator.labelShort,
                '',
                Company.id,
                '',
                'Step'
            )
            formulaNotSelected =
                formulaNotSelected +
                'COUNTIF(IMPORTRANGE("' +
                Company.urlCurrentInputSheet +
                '","' +
                rangeName +
                '"),"*not selected")+'
            formulaAllCells =
                formulaAllCells +
                'COUNTIF(IMPORTRANGE("' +
                Company.urlCurrentInputSheet +
                '","' +
                rangeName +
                '"),"<>N/A")+'
        }
    }

    formulaNotSelected = formulaNotSelected + '0)'
    formulaAllCells = formulaAllCells + '0)'

    console.log('unselected:' + formulaNotSelected)
    console.log('all:' + formulaAllCells)

    //return formulaAllCells
    return formulaNotSelected + formulaAllCells
}

// no idea; used in Company Feedback
function metaIndyFilter(MetaObj, label) {
    return MetaObj.indicators.find((indicator) => indicator.indicator === label)
}

// used in 97_*::importContentBlock()

function findSubStepComponent(stepNr, subStepNr, componentType) {
    return researchStepsVector.researchSteps[stepNr].substeps[subStepNr].components.find(
        (component) => component.type === componentType
    )
}

// used for Company Feedback Tab
// returns a 1D array with all Indicator Labels
function getIndicatorLabelsList(Indicators, flatten) {
    let indicatorLabels = Indicators.indicatorCategories.map((category) =>
        category.indicators.map((indicator) => indicator.labelShort)
    )

    if (flatten) {
        indicatorLabels = indicatorLabels.flat()
    }

    return indicatorLabels
}

// used for Summary Scores to create range blocks for
// calculating Category-level totals

function getColumnFromArray(array, col) {
    var column = []
    for (var i = 0; i < array.length; i++) {
        column.push(array[i][col])
    }
    return column
}

// critical for SUmmary Scores with Element-level data
// calculates total number of elements

function elementsTotalLength(Indicators) {
    return Indicators.indicatorCategories
        .map((category) => category.indicators.map((indicator) => indicator.elements.length))
        .flat()
        .reduce((a, b) => a + b)
}

// eslint-disable-next-line no-unused-vars
function getISOtimeAsString() {
    return new Date().toISOString().substr(0, 16).split('T').join(': ')
}
