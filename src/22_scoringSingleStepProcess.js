/* global
    Config, setScoringSheetHeader, setScoringCompanyHeader, importElementRow, importElementBlock, addElementScores, addLevelScores, addCompositeScores, addIndicatorScore
*/

// eslint-disable-next-line no-unused-vars
function scoringSingleStep(SS, Sheet, indexPref, subStepNr, lastCol, isPilotMode, hasFullScores, Indicators, sheetModeID, MainStep, Company, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, includeSources, includeNames, includeResults,addNewStep) {

    console.log("--- Begin Scoring Single (Sub)Step: " + subStepNr)

    let companyShortName = Company.label.current
    let hasMobile = Company.services.some(service => service.type === "mobile")

    // let SubStep = filterSingleSubstep(MainStep, MainStep.scoringSubStep)
    let SubStep = MainStep.substeps[subStepNr]
    console.log(`DEBUG ${SubStep}`)

    let subStepID = SubStep.importStepID ? SubStep.importStepID : SubStep.subStepID
    let mainStepLabel = `Step ${MainStep.step}`

    let firstCol = lastCol
    let activeCol = firstCol
    let activeRow = 1
    let lastRow

    console.log("--- Beginning Substep " + subStepID)

    // set up header

    // TODO: remove from steps JSON. Not a component. This is Layout

        activeRow = setScoringSheetHeader(activeRow, activeCol, Sheet, Company, companyShortName, MainStep, mainStepLabel, subStepID, blocks)
        console.log("Adding Scoring Sheet Header")

    

    // For all Indicator Categories
    for (let c = 0; c < Indicators.indicatorCategories.length; c++) {

        let Category = Indicators.indicatorCategories[c]
        // Check whether Indicator Category has Sub-Components (i.e. G: FoE + P)
        console.log("begin Indicator Category: " + Category.labelLong)
        let nrOfIndSubComps = 1

        // TODO: Refactor to main caller

        let categoryLength = Category.indicators.length

        // For all Indicators
        for (let i = 0; i < categoryLength; i++) {

            let Indicator = Category.indicators[i]

            Indicator.description = elemsMetadata.indicators.find(Indy => Indy.indicator === Indicator.labelShort).description

            console.log("begin Indicator: " + Indicator.labelShort)

            // Object later used for indicator composites and indicator scores

            let ScoreCells = {
                indexPref: indexPref,
                companyScores: {
                    levelScoresGroup: {
                        id: "G",
                        cells: []
                    },
                    levelScoresOpCom: {
                        hasOpCom: hasOpCom,
                        id: "O",
                        cells: []
                    }
                },
                serviceScores: {
                    levelScoresServices: {
                        id: "S",
                        cells: [],
                        hasMobile: hasMobile,
                        sublevelScoresMobile: {
                            id: "M",
                            cells: []
                        },
                    }
                },
                CompositeScoreCells: {
                    cells: []
                }
            }

            
                activeRow = setScoringCompanyHeader(activeRow, firstCol, Sheet, Indicator, nrOfIndSubComps, Category, Company, blocks)
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

                            activeRow = importElementRow(activeRow, firstCol, Sheet, StepComp, subStepID, Indicator, Company, hasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs, isPilotMode, indexPref)
                            console.log(Indicator.labelShort + " - SC - " + stepCompType + " added")
                        }
                        break

                    case "reviewResults":
                    case "importPreviousResults":
                        if (includeResults) {
                            activeRow = importElementBlock(activeRow, firstCol, Sheet, StepComp, subStepID, Indicator, Company, hasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs, indexPref)
                            console.log(Indicator.labelShort + " - SC - " + stepCompType + " added")
                        }
                        break

                    case "reviewComments":
                    case "importPreviousComments":
                    case "comments":
                        activeRow = importElementBlock(activeRow, firstCol, Sheet, StepComp, subStepID, Indicator, Company, hasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs, indexPref)
                        console.log(Indicator.labelShort + " - SC - " + stepCompType + " added")
                        break

                    case "sources":
                    case "importPreviousSources":
                        if (includeSources) {
                            activeRow = importElementRow(activeRow, firstCol, Sheet, StepComp, subStepID, Indicator, Company, hasOpCom, nrOfIndSubComps, Category, blocks, integrateOutputs, false, indexPref)
                            console.log(Indicator.labelShort + " - SC - " + "sources added")
                        }

                        break
                }
            }

            activeRow +=2

            // ADD SCORING AFTER ALL OTHER COMPONENTS

            if (hasFullScores) {
                activeRow = addElementScores(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, stepCompNr, Indicator, Company, hasOpCom, nrOfIndSubComps, Category, blocks, hasFullScores, ScoreCells)
                console.log(Indicator.labelShort + " - " + "element scores added")

                activeRow = addLevelScores(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, Indicator, Company, hasOpCom, nrOfIndSubComps, Category, ScoreCells, blocks)
                console.log(Indicator.labelShort + " - " + "level scores added")

                activeRow = addCompositeScores(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, Indicator, Company, nrOfIndSubComps, ScoreCells, blocks)
                console.log(Indicator.labelShort + " - " + "composite scores added")

                // Indicator Score

                activeRow = addIndicatorScore(SS, sheetModeID, activeRow, firstCol, Sheet, subStepID, Indicator, Company, ScoreCells, blocks)

                console.log(`${Indicator.labelShort} INDICATOR score added`)

                if(addNewStep&&blocks==2){activeRow++}
            } // END SUBSTEP COMPONENTS
        } // END INDICATOR
    } // END INDICATOR CATEGORY

    lastCol = Sheet.getLastColumn()+1

    console.log("Formatting Sheet")
    lastRow = activeRow


    Sheet.getRange(1, 1, lastRow, lastCol)
        .setFontFamily("Roboto")
    // .setVerticalAlignment("top")
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

    let columns = Sheet.getRange(1, hookFirstDataCol + 1, 1, numberOfColumns - 2)
    let Group = columns.shiftColumnGroupDepth(1)

    if (MainStep.step === 0) {
        Group.collapseGroups()
    }

    if (!Config.scoringSteps.includes(MainStep.step)) {
        Sheet.hideColumns(hookFirstDataCol, numberOfColumns)
    }

    return lastCol += 1
}

// END MAIN Step & function
