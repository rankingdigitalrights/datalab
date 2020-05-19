// ## Main: populateDCSheetByCategory ## //

/* global
    Config,
    Styles,
    indexPrefix,
    insertSheetIfNotExist,
    addMainSheetHeader
    addMainStepHeader,
    addStepResearcherRow,
    addSubStepHeader,
    addStepEvaluation,
    addYonYReview,
    addBinaryEvaluation,
    addStepReview,
    addBinaryReview,
    addComments,
    addSources,
    addExtraInstruction,
    addTwoStepComparison,
    importYonYResults,
    importYonYSources,
    defineNamedRange,
    cropEmptyColumns
*/

function populateDCSheetByCategory(SS, Category, Company, ResearchSteps, companyNrOfServices, hasOpCom, isNewCompany, doCollapseAll, includeRGuidanceLink, collapseRGuidance, useIndicatorSubset, useStepsSubset) {

    // for each indicator
    // - create a new Sheet
    // - name the Sheet
    // - populate the Sheet Step-Wise

    // fallback for subset runs when indicator category only has 1 item

    let minIndicators = Category.indicators.length > 1 ? 3 : 1

    let category = Category.labelShort

    let indyCatLength = useIndicatorSubset ? minIndicators : Category.indicators.length
    let mainStepsLength = useStepsSubset ? 4 : ResearchSteps.researchSteps.length

    // iterates over each indicator in the current Category
    // for each indicator = distinct Sheet do

    let lastRow

    for (let i = 0; i < indyCatLength; i++) {

        let Indicator = Category.indicators[i]
        Logger.log("--- Starting Indicator :" + Indicator.labelShort)
        let thisIndScoringScope = Indicator.scoringScope

        let Sheet = insertSheetIfNotExist(SS, Indicator.labelShort, false)

        if (Sheet === null) {
            continue
        } // skips this i if Sheet already exists

        // checks whether this indicator has components. If yes then it is set to that number, else it is defaulted to 1
        let nrOfIndSubComps = (Category.hadSubComponents == true) ? Category.components.length : 1

        // checks how many company group/opcom columns to hide for this Indicator
        // (based on Scoring Scope)

        let bridgeCompColumnsNr = 2 // default:: no company columns

        if (Indicator.scoringScope == "full") {
            if (hasOpCom) {
                bridgeCompColumnsNr = 0
            } else {
                // if (companyNrOfServices > 1) {
                bridgeCompColumnsNr = 1
                // }
            }
        }

        // general formatting of Sheet
        // TODO: think about where to refactor to
        Sheet.setColumnWidth(1, 140)

        let numberOfColumns = (companyNrOfServices + 2) + 1

        let thisColWidth = Styles.dims.serviceColWidth

        // if (Company.services.length == 1) {
        //     thisColWidth = Styles.dims.serviceColWidth * 1.33
        // }

        Sheet.setColumnWidths(2, numberOfColumns - 1, thisColWidth)


        // start Sheet in first top left cell
        let activeRow = 1
        let activeCol = 1

        // adds up indicator guidance
        activeRow = addMainSheetHeader(Sheet, Category, Indicator, Company, activeRow, activeCol, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNrOfServices, includeRGuidanceLink, collapseRGuidance)

        // --- // Begin Main Step-Wise Procedure // --- //

        let contentStartRow = activeRow
        let dataStartRow = 0

        // for each main step
        for (let mainStepNr = 0; mainStepNr < mainStepsLength; mainStepNr++) {

            var MainStep = ResearchSteps.researchSteps[mainStepNr]
            var mainStepColor = MainStep.stepColor
            // setting up all the substeps for all the indicators

            Logger.log("FLOW - main step : " + MainStep.step)
            let subStepsLength = MainStep.substeps.length

            activeRow = addMainStepHeader(Sheet, Category, Company, activeRow, companyNrOfServices, MainStep, mainStepColor) // sets up header

            let beginStep = activeRow

            if (mainStepNr > 0) {
                activeRow = addStepResearcherRow(SS, Sheet, Indicator, Company, activeRow, MainStep, companyNrOfServices)
            }

            let endStep = activeRow

            // --- // Begin sub-Step-Wise Procedure // --- //

            // for each substep
            for (let subStepNr = 0; subStepNr < subStepsLength; subStepNr++) {

                let SubStep = MainStep.substeps[subStepNr]
                Logger.log("FLOW - substep : " + SubStep.labelShort)

                let subStepLength = SubStep.components.length

                // step-wise evaluate components of current research Step, execute the according building function and return the active row, which is then picked up by next building function

                // stores first row of a step to use later in naming a step
                let firstRow = mainStepNr == 0 ? activeRow : activeRow + 1

                // Begin step component procedure
                for (let stepCNr = 0; stepCNr < subStepLength; stepCNr++) {

                    let thisStepComponent = SubStep.components[stepCNr].type

                    Logger.log("----- component : " + SubStep.labelShort + " : " + thisStepComponent)

                    // create the type of substep component that is specified in the json

                    switch (thisStepComponent) {

                        case "stepResearcherRow":
                            //TODO: remove from JSON
                            break

                        case "subStepHeader":

                            // HOOK for data range and conditional formatting
                            if (dataStartRow === 0 && mainStepNr > 0) dataStartRow = activeRow

                            activeRow = addSubStepHeader(SS, Sheet, Indicator, Company, activeRow, SubStep, stepCNr, companyNrOfServices)
                            break

                        case "importPreviousResults":
                            activeRow = importYonYResults(SS, Sheet, Indicator, category, Company, isNewCompany, activeRow, SubStep, stepCNr, nrOfIndSubComps, companyNrOfServices, false)
                            break

                        case "importPreviousComments":
                            activeRow = importYonYResults(SS, Sheet, Indicator, category, Company, isNewCompany, activeRow, SubStep, stepCNr, nrOfIndSubComps, companyNrOfServices, true)
                            break

                        case "importPreviousSources":
                            activeRow = importYonYSources(SS, Sheet, Indicator, category, Company, isNewCompany, activeRow, SubStep, stepCNr, companyNrOfServices, null)
                            break

                        case "compareTwoSteps":
                            activeRow = addTwoStepComparison(SS, Sheet, Indicator, Company, isNewCompany, mainStepNr, activeRow, SubStep, stepCNr, companyNrOfServices)
                            break

                        case "YonYreview":
                            activeRow = addYonYReview(SS, Sheet, Indicator, Company, isNewCompany, activeRow, SubStep, stepCNr, companyNrOfServices)
                            break

                        case "reviewResults":
                            activeRow = addStepReview(SS, Sheet, Indicator, Company, isNewCompany, activeRow, mainStepNr, SubStep, stepCNr, Category, companyNrOfServices)
                            break

                        case "reviewComments":
                            activeRow = addCommentsReview(SS, Sheet, Indicator, Company, activeRow, mainStepNr, SubStep, stepCNr, Category, companyNrOfServices)
                            break

                        case "evaluation":
                            activeRow = addStepEvaluation(SS, Sheet, Indicator, Company, isNewCompany, activeRow, mainStepNr, SubStep, stepCNr, Category, companyNrOfServices)
                            break

                        case "binaryReview":

                            activeRow = addBinaryReview(SS, Sheet, Indicator, Company, activeRow, SubStep, stepCNr, Category, companyNrOfServices)
                            break

                        case "binaryEvaluation":

                            activeRow = addBinaryEvaluation(SS, Sheet, Indicator, Company, activeRow, SubStep, stepCNr, Category, companyNrOfServices)
                            break

                        case "comments":
                            activeRow = addComments(SS, Sheet, Indicator, Company, activeRow, SubStep, stepCNr, Category, companyNrOfServices)
                            break

                        case "sources":
                            activeRow = addSources(SS, Sheet, Indicator, Company, activeRow, SubStep, stepCNr, Category, companyNrOfServices)
                            break

                        case "extraQuestion":
                            activeRow = addExtraInstruction(SubStep, stepCNr, activeRow, activeCol, Sheet, Company, companyNrOfServices)
                            break

                        default:
                            Sheet.appendRow(["!!!Error: Missed a component!!!"])
                            break
                    }
                } // END substep component procedure

                // if there are no more substeps, store the final row and name the step
                // if (stepCNr == subStepLength - 1) {

                lastRow = activeRow

                let maxCol = 1 + (companyNrOfServices + 2) // calculates the max column

                // exclude researchers' names from step named range
                // so move firstRow by 1
                let range = Sheet.getRange(firstRow, 2, lastRow - firstRow, maxCol - 1)

                // cell name formula; output defined in 44_rangeNamingHelper.js
                const component = ""
                let stepNamedRange = defineNamedRange(indexPrefix, "DC", SubStep.subStepID, Category.indicators[i].labelShort, component, Company.id, "", "Step")

                SS.setNamedRange(stepNamedRange, range) // names an entire step

                // GROUPING for substep
                if (subStepsLength > 1) {

                    range = Sheet.getRange(firstRow, 2, lastRow - firstRow, maxCol - 1)
                    let substepRange = range.shiftRowGroupDepth(1)

                    // COLLAPSE substep GROUP per researchSteps substep setting
                    if (!doCollapseAll) {
                        if (SubStep.doCollapse) {
                            substepRange.collapseGroups()
                        }
                    }
                }

                endStep = activeRow
                activeRow += 1
            } // --- // END Sub-Step-Wise Procedure // --- //

            // activeRow += 1

            // group whole step and make main step header row the anchor
            let rangeStep = Sheet.getRange(beginStep, 1, endStep - beginStep, numberOfColumns)
            Logger.log("grouping whole step for range :" + rangeStep.getA1Notation())
            rangeStep.shiftRowGroupDepth(1)

        } // --- // END Main-Step-Wise Procedure // --- //

        let sheetRange = Sheet.getRange(contentStartRow, 1, lastRow, numberOfColumns)
            .setFontFamily("Roboto")
            // .setFontSize(10)
            .setVerticalAlignment("top")

        // set font for whole data range
        sheetRange = Sheet.getRange(dataStartRow, 1, lastRow, numberOfColumns)
            .setWrap(true)

        let condRuleNames = SpreadsheetApp.newConditionalFormatRule()
            .whenTextEqualTo("Your Name")
            .setFontColor("#ea4335")
            .setBold(true)
            .setRanges([sheetRange])
            .build()

        let condRuleValues = SpreadsheetApp.newConditionalFormatRule()
            .whenTextEqualTo("not selected")
            .setFontColor("#ea4335")
            .setBold(true)
            .setRanges([sheetRange])
            .build()

        // let condRuleNewElem = SpreadsheetApp.newConditionalFormatRule()
        //     .whenTextEqualTo(Config.newElementLabelResult)
        //     .setFontColor("#ea4335")
        //     .setBold(true)
        //     .setRanges([sheetRange])
        //     .build()

        let rules = Sheet.getConditionalFormatRules()
        rules.push(condRuleNames)
        rules.push(condRuleValues)
        // rules.push(condRuleNewElem)
        Sheet.setConditionalFormatRules(rules)


        // collapse all groups
        if (doCollapseAll) {
            Sheet.collapseAllRowGroups()
        }

        // hides opCom column(s) if opCom == false
        // TODO: make dynamic

        if (thisIndScoringScope == "full") {
            if (!hasOpCom) {
                Sheet.hideColumns(3)
            }
        } else {
            Sheet.hideColumns(2, bridgeCompColumnsNr)
        }

        cropEmptyColumns(Sheet)

        // color Indicator Sheet (Tab) in Class Color when done
        Sheet.setTabColor(Category.classColor)

    } // End of Indicator Sheet

} // End of populating process
