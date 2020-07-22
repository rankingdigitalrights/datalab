/* global
    filterSingleSubstep,
    setScoringSheetHeader,
    setScoringCompanyHeader,
    importElementRow,
    importElementBlock,
    addElementScores,
    addLevelScores,
    addCompositeScores,
    addIndicatorScore
*/

function scoringSingleStep(SS, Sheet, subStepNr, lastCol, Config, isPilotMode, hasFullScores, Indicators, sheetModeID, MainStep, CompanyObj, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, useIndicatorSubset, includeSources, includeNames, includeResults) {

    console.log("--- Begin Scoring Single (Sub)Step: " + subStepNr)

    let companyShortName = CompanyObj.label.current

    let SubStep = filterSingleSubstep(MainStep, MainStep.scoringSubStep)
    let subStepID = SubStep.subStepID
    let subStepLabel = SubStep.labelShort

    let firstCol = lastCol
    let activeCol = firstCol
    let activeRow = 1
    let lastRow

    console.log("--- Beginning Substep " + subStepID)

    // set up header

    // TODO: remove from steps JSON. Not a component. This is Layout

    activeRow = setScoringSheetHeader(activeRow, activeCol, Sheet, companyShortName, subStepLabel, blocks)

    // For all Indicator Categories
    for (let c = 0; c < Indicators.indicatorCategories.length; c++) {

        let Category = Indicators.indicatorCategories[c]
        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
        console.log("begin Indicator Category: " + Category.labelLong)
        let nrOfIndSubComps = 1

        // TODO: Refactor to main caller

        let categoryLength
        if (useIndicatorSubset) {
            categoryLength = 2
        } else {
            categoryLength = Category.indicators.length
        }

        // For all Indicators
        for (let i = 0; i < categoryLength; i++) {

            let Indicator = Category.indicators[i]

            console.log("begin Indicator: " + Indicator.labelShort)

            // variable used for indicator average later

            let levelScoresCompany = []
            let levelScoresServices = []
            let levelScoresMobile = []
            let CompositeScoreCells = []

            activeRow = setScoringCompanyHeader(activeRow, firstCol, Sheet, Indicator, nrOfIndSubComps, Category, CompanyObj, blocks)
            console.log(" - company header added for " + Indicator.labelShort)

            // --- // Main task // --- //

            let StepComp
            let stepCompType
            let stepCompNr

            // for all components of the current Research Step
            for (stepCompNr = 0; stepCompNr < SubStep.components.length; stepCompNr++) {

                StepComp = SubStep.components[stepCompNr]
                stepCompType = StepComp.type
                console.log(" - begin stepCompNr: " + stepCompNr + " - " + stepCompType)

                switch (stepCompType) {

                    // import researcher name from x.0 step
                    case "subStepHeader":
                        if (includeNames) {

                            activeRow = importElementRow(activeRow, firstCol, Sheet, StepComp, subStepID, Indicator, CompanyObj, hasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs, isPilotMode)
                            console.log(" - SC - " + stepCompType + " added for: " + Indicator.labelShort)
                        }
                        break

                    case "reviewResults":
                        if (includeResults) {
                            activeRow = importElementBlock(activeRow, firstCol, Sheet, StepComp, subStepID, Indicator, CompanyObj, hasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs)
                            console.log(" - SC - " + stepCompType + " added for: " + Indicator.labelShort)
                        }
                        break

                    case "reviewComments":
                    case "comments":
                        activeRow = importElementBlock(activeRow, firstCol, Sheet, StepComp, subStepID, Indicator, CompanyObj, hasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs)
                        console.log(" - SC - " + stepCompType + " added for: " + Indicator.labelShort)
                        break

                    case "sources":
                        if (includeSources) {
                            activeRow = importElementRow(activeRow, firstCol, Sheet, StepComp, subStepID, Indicator, CompanyObj, hasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs)
                            console.log(" - SC - " + "sources added for: " + Indicator.labelShort)
                        }

                        break
                }
            }

            activeRow += 1

            // ADD SCORING AFTER ALL OTHER COMPONENTS

            if (hasFullScores) {
                activeRow = addElementScores(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, stepCompNr, Indicator, CompanyObj, hasOpCom, nrOfIndSubComps, Category, blocks, hasFullScores)
                console.log(" - " + "element scores added for " + Indicator.labelShort)

                activeRow = addLevelScores(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, stepCompNr, Indicator, CompanyObj, hasOpCom, nrOfIndSubComps, Category, levelScoresCompany, levelScoresServices, levelScoresMobile, blocks)
                console.log(" - " + "level scores added for " + Indicator.labelShort)

                activeRow = addCompositeScores(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, Indicator, CompanyObj, nrOfIndSubComps, levelScoresCompany, levelScoresServices, levelScoresMobile, CompositeScoreCells, blocks)
                console.log(" - " + "composite scores added for " + Indicator.labelShort)

                if (CompositeScoreCells.length === 0) {
                    activeRow = addIndicatorScore(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, Indicator, CompanyObj, CompositeScoreCells, blocks)
                } else if (CompanyObj.type === "internet" || CompanyObj.id === "tAT1" || Indicator.labelShort.substring(0, 1) !== "G") {
                    activeRow = addIndicatorScore(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, Indicator, CompanyObj, CompositeScoreCells, blocks)
                } else {

                    activeRow = addIndicatorScore(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, Indicator, CompanyObj, CompositeScoreCells, blocks)
                }
                console.log(" - " + "indicator score added for " + Indicator.labelShort)

                activeRow = activeRow + 1
            } // END SUBSTEP COMPONENTS
        } // END INDICATOR
    } // END INDICATOR CATEGORY

    lastCol = numberOfColumns * blocks + 1

    console.log("Formatting Sheet")
    lastRow = activeRow

    Sheet.getRange(1, 1, lastRow, lastCol)
        .setFontFamily("Roboto")
        .setVerticalAlignment("top")
    // .setWrap(true)

    let hookFirstDataCol = firstCol
    if (blocks === 1) {
        hookFirstDataCol = firstCol + 1
    }
    Sheet.setColumnWidths(hookFirstDataCol, numberOfColumns, dataColWidth)
    Sheet.setColumnWidth(lastCol, 25)

    if (!hasOpCom) {
        let opComCol = hookFirstDataCol + 1
        Sheet.hideColumns(opComCol)
    }

    return lastCol += 1
}

// END MAIN Step & function
