// ## Main: populateDCSheetByCategory ## //

/* global
    Styles,
    insertSheetIfNotExist,
    addIndicatorGuidance,
    addMainStepHeader,
    addSubStepHeader,
    addScoringOptions,
    addBinaryEvaluation,
    addComments,
    addSources,
    addExtraInstruction,
    addComparisonYonY,
    defineNamedRangeStringImport
*/

function populateDCSheetByCategory(SS, IndyCat, Company, ResearchSteps, companyNrOfServices, hasOpCom, doCollapseAll, includeRGuidanceLink, collapseRGuidance, useIndicatorSubset, useStepsSubset) {

    // for each indicator
    // - create a new Sheet
    // - name the Sheet
    // - populate the Sheet Step-Wise

    let indyCatLength = useIndicatorSubset ? 2 : IndyCat.indicators.length

    let mainStepsLength = useStepsSubset ? 4 : ResearchSteps.researchSteps.length

    // iterates over each indicator in the current Category
    // for each indicator = distinct Sheet do

    var lastRow

    for (var i = 0; i < indyCatLength; i++) {

        var Indicator = IndyCat.indicators[i]
        Logger.log("Indicator: " + Indicator)
        Logger.log("Indicator toString(): " + Indicator.toString())
        Logger.log("indicator :" + Indicator.labelShort)
        var thisIndScoringScope = Indicator.scoringScope

        var sheet = insertSheetIfNotExist(SS, Indicator.labelShort, false)

        if (sheet === null) {
            continue
        } // skips this i if sheet already exists

        // checks whether this indicator has components. If yes then it is set to that number, else it is defaulted to 1
        var nrOfIndSubComps = (IndyCat.hasSubComponents == true) ? IndyCat.components.length : 1

        // checks how many company group/opcom columns to hide for this Indicator
        // (based on Scoring Scope)

        var bridgeCompColumnsNr = 2 // default:: no company columns

        if (Indicator.scoringScope == "full") {
            if (hasOpCom) {
                bridgeCompColumnsNr = 0
            } else {
                // if (companyNrOfServices > 1) {
                bridgeCompColumnsNr = 1
                // }
            }
        }

        // general formatting of sheet
        // TODO: think about where to refactor to
        sheet.setColumnWidth(1, Styles.dims.serviceColWidth)

        var numberOfColumns = (companyNrOfServices + 2) * nrOfIndSubComps + 1

        var thisColWidth = Styles.dims.serviceColWidth / nrOfIndSubComps

        // if (Company.services.length == 1) {
        //     thisColWidth = Styles.dims.serviceColWidth * 1.33
        // }

        sheet.setColumnWidths(2, numberOfColumns - 1, thisColWidth)


        // start sheet in first top left cell
        var activeRow = 1
        var activeCol = 1

        // adds up indicator guidance
        activeRow = addIndicatorGuidance(sheet, IndyCat, Indicator, activeRow, activeCol, nrOfIndSubComps, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNrOfServices, includeRGuidanceLink, collapseRGuidance)

        // --- // Begin Main Step-Wise Procedure // --- //

        var dataStartRow = activeRow

        // for each main step
        for (var mainStepNr = 0; mainStepNr < mainStepsLength; mainStepNr++) {

            var MainStep = ResearchSteps.researchSteps[mainStepNr]
            var mainStepColor = MainStep.stepColor
            // setting up all the substeps for all the indicators

            Logger.log("main step : " + MainStep.step)
            var subStepsLength = MainStep.substeps.length

            activeRow = addMainStepHeader(sheet, IndyCat, Company, activeRow, SS, nrOfIndSubComps, companyNrOfServices, MainStep.step, mainStepColor) // sets up header

            var beginStep = activeRow
            var endStep = activeRow

            // --- // Begin sub-Step-Wise Procedure // --- //

            // for each substep
            for (var subStepNr = 0; subStepNr < subStepsLength; subStepNr++) {

                var SubStep = MainStep.substeps[subStepNr]
                Logger.log("substep : " + SubStep.labelShort)

                var subStepLength = SubStep.components.length

                // step-wise evaluate components of current research Step, execute the according building function and return the active row, which is then picked up by next building function

                // stores first row of a step to use later in naming a step
                var firstRow = activeRow + 1

                // Begin step component procedure
                for (var stepCNr = 0; stepCNr < subStepLength; stepCNr++) {

                    var thisStepComponent = SubStep.components[stepCNr].type

                    Logger.log("step.component : " + SubStep.labelShort + " : " + thisStepComponent)

                    // create the type of substep component that is specified in the json

                    switch (thisStepComponent) {
                        case "importPrevious":
                            activeRow = importYonYResults(sheet, Indicator, Company, activeRow, SubStep, stepCNr, nrOfIndSubComps, IndyCat, companyNrOfServices)
                            break

                        case "header":
                            activeRow = addSubStepHeader(sheet, Indicator, Company, activeRow, SS, SubStep, stepCNr, nrOfIndSubComps, IndyCat, companyNrOfServices)
                            break

                        case "elementResults":
                            activeRow = addScoringOptions(sheet, Indicator, Company, activeRow, SS, SubStep, stepCNr, nrOfIndSubComps, IndyCat, companyNrOfServices)
                            break

                        case "binaryReview":
                            activeRow = addBinaryEvaluation(sheet, Indicator, Company, activeRow, SS, SubStep, stepCNr, nrOfIndSubComps, IndyCat, companyNrOfServices)
                            break

                        case "elementComments":
                            activeRow = addComments(sheet, Indicator, Company, activeRow, SS, SubStep, stepCNr, nrOfIndSubComps, IndyCat, companyNrOfServices)
                            break

                        case "sources":
                            activeRow = addSources(sheet, Indicator, Company, activeRow, SS, SubStep, stepCNr, nrOfIndSubComps, IndyCat, companyNrOfServices)
                            break

                        case "extraQuestion":
                            activeRow = addExtraInstruction(SubStep, stepCNr, activeRow, activeCol, sheet)
                            break

                        case "comparison":
                            activeRow = addComparisonYonY(sheet, Indicator, Company, activeRow, SubStep, stepCNr, nrOfIndSubComps, IndyCat, companyNrOfServices)
                            break

                        default:
                            sheet.appendRow(["!!!You missed a component!!!"])
                            break
                    }
                } // END substep component procedure

                // if there are no more substeps, we store the final row and name the step
                // if (stepCNr == subStepLength - 1) {

                lastRow = activeRow

                var maxCol = 1 + (companyNrOfServices + 2) * nrOfIndSubComps // calculates the max column

                // we don't want the researchers' names as part of the range
                // so move firstRow by 1
                var range = sheet.getRange(firstRow + 1, 2, lastRow - firstRow - 1, maxCol - 1)

                // cell name formula; output defined in 44_rangeNamingHelper.js
                const component = ""
                var stepNamedRange = defineNamedRangeStringImport(indexPrefix, "DC", SubStep.subStepID, IndyCat.indicators[i].labelShort, component, Company.id, "", "Step")

                SS.setNamedRange(stepNamedRange, range) // names an entire step

                // GROUPING for substep
                var substepRange = range.shiftRowGroupDepth(1)

                // COLLAPSE substep GROUP per researchSteps substep setting
                if (!doCollapseAll) {
                    if (SubStep.doCollapse) {
                        substepRange.collapseGroups()
                    }
                }
                endStep = activeRow
                // }

                endStep = activeRow
            } // --- // END Sub-Step-Wise Procedure // --- //

            if (mainStepNr < mainStepsLength - 1) {
                sheet.getRange(activeRow, activeCol, 1, numberOfColumns).setBorder(null, null, true, null, null, null, "black", null)
            }

            activeRow += 1

            // group whole step and make main step header row the anchor
            var rangeStep = sheet.getRange(beginStep + 1, 1, endStep - beginStep - 1, numberOfColumns)
            Logger.log("grouping whole step for range :" + rangeStep.getA1Notation())
            rangeStep.shiftRowGroupDepth(1)

        } // --- // END Main-Step-Wise Procedure // --- //


        // set font for whole data range
        var sheetRange = sheet.getRange(dataStartRow, 1, lastRow, numberOfColumns)
            .setFontFamily("Roboto")
            .setFontSize(10)
            .setWrap(true)
            .setVerticalAlignment("top")

        var condRuleNames = SpreadsheetApp.newConditionalFormatRule()
            .whenTextEqualTo("Your Name")
            .setFontColor("#ea4335")
            .setBold(true)
            .setRanges([sheetRange])
            .build()

        var condRuleValues = SpreadsheetApp.newConditionalFormatRule()
            .whenTextEqualTo("not selected")
            // .setFontColor('#ea4335')
            .setBackground("#f4cccc")
            .setRanges([sheetRange])
            .build()

        var rules = sheet.getConditionalFormatRules()
        rules.push(condRuleNames)
        rules.push(condRuleValues)
        sheet.setConditionalFormatRules(rules)


        // collapse all groups
        if (doCollapseAll) {
            sheet.collapseAllRowGroups()
        }

        // hides opCom column(s) if opCom == false
        // TODO: make dynamic

        if (thisIndScoringScope == "full") {
            if (!hasOpCom) {
                sheet.hideColumns(3)
            }
        } else {
            sheet.hideColumns(2, bridgeCompColumnsNr)
        }

        // color Indicator Sheet (Tab) in Class Color when done
        sheet.setTabColor(IndyCat.classColor)

    } // End of Indicator Sheet

} // End of populating process
