// ## BEGIN High-level functions | main components ## //

// TODO: Explain in a few sentences what the whole function is doing
// List the parameters and where their values are coming from


function populateDCSheetByCategory(file, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, localColWidth, hasOpCom, doCollapseAll) {

    // for each indicator
    // - create a new Sheet
    // - name the Sheet
    // -
    var thisIndClassLength = currentClass.indicators.length

    // iterates over each indicator in the current type
    // for each indicator = distinct Sheet do

    var lastRow

    for (var i = 0; i < thisIndClassLength; i++) {

        var thisIndicator = currentClass.indicators[i]
        Logger.log('indicator :' + thisIndicator.labelShort)
        var thisIndScoringScope = thisIndicator.scoringScope
        Logger.log('Scoring Scope: ' + thisIndicator.labelShort + ' ' + thisIndScoringScope)

        var sheet = insertSheetIfNotExist(file, thisIndicator.labelShort, false)

        if (sheet === null) {
            continue // skips this i if sheet already exists
        }

        sheet.clear()

        // checks whether this indicator has components. If yes then it is set to that number, else it is defaulted to 1
        var nrOfIndSubComps = 1
        if (currentClass.hasSubComponents == true) {
            nrOfIndSubComps = currentClass.components.length
        }

        // checks how many company group/opcom columns to hide for this Indicator
        // (based on Scoring Scope)

        var bridgeCompColumnsNr = 2
        var bridgeOpCom

        if (thisIndicator.scoringScope == "full") {
            if (hasOpCom) {
                bridgeCompColumnsNr = 0
            } else {
                bridgeCompColumnsNr = 1
            }
        }

        // general formatting of sheet
        // TODO: think about where to refactor to
        sheet.setColumnWidth(1, localColWidth)

        var numberOfColumns = (companyNumberOfServices + 2) * nrOfIndSubComps + 1

        var localColWidth = localColWidth / nrOfIndSubComps
        sheet.setColumnWidths(2, numberOfColumns - 1, localColWidth)


        // start sheet in first top left cell
        var activeRow = 1
        var activeCol = 1

        // adds up indicator guidance
        activeRow = addIndicatorGuidance(sheet, currentClass, thisIndicator, activeRow, activeCol, nrOfIndSubComps, hasOpCom, numberOfColumns, bridgeCompColumnsNr)

        var dataStartRow = activeRow

        var mainStepsLength = ResearchStepsObj.researchSteps.length

        // --- // Begin Main Step-Wise Procedure // --- //

        // for each main step
        for (var mainStepNr = 0; mainStepNr < mainStepsLength; mainStepNr++) {

            var thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]
            var thisMainStepColor = thisMainStep.stepColor
            // setting up all the substeps for all the indicators

            Logger.log("main step : " + thisMainStep.step)
            var subStepsLength = thisMainStep.substeps.length


            activeRow = addMainStepHeader(sheet, currentClass, CompanyObj, activeRow, file, nrOfIndSubComps, companyNumberOfServices, thisMainStep.step, thisMainStepColor) // sets up header

            var beginStep = activeRow
            var endStep = activeRow

            // --- // Begin sub-Step-Wise Procedure // --- //

            // for each substep
            for (var subStepNr = 0; subStepNr < subStepsLength; subStepNr++) {

                var currentStep = thisMainStep.substeps[subStepNr]
                Logger.log("substep : " + currentStep.labelShort)

                var currentStepClength = currentStep.components.length

                // step-wise evaluate components of current research Step, execute the according building function and return the active row, which is then picked up by next building function

                // stores first row of a step to use later in naming a step
                var firstRow = activeRow + 1

                // Begin step component procedure
                for (var stepCNr = 0; stepCNr < currentStepClength; stepCNr++) {

                    var thisStepComponent = currentStep.components[stepCNr].type

                    Logger.log("step.component : " + currentStep.labelShort + " : " + thisStepComponent)

                    // create the type of substep component that is specified in the json
                    // TODO: refactor to switch()

                    switch (thisStepComponent) {

                        case "header":
                            activeRow = addSubStepHeader(sheet, thisIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices)
                            break

                        case "elementResults":
                            activeRow = addScoringOptions(sheet, thisIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices)
                            break

                        case "binaryReview":
                            activeRow = addBinaryEvaluation(sheet, thisIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices)
                            break

                        case "elementComments":
                            activeRow = addComments(sheet, thisIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices)
                            break

                        case "sources":
                            activeRow = addSources(sheet, thisIndicator, CompanyObj, activeRow, file, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices)
                            break

                        case "extraQuestion":
                            activeRow = addExtraInstruction(currentStep, stepCNr, activeRow, activeCol, sheet)
                            break

                        case "comparison":
                            activeRow = addComparisonYonY(sheet, thisIndicator, CompanyObj, activeRow, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices)
                            break

                        default:
                            sheet.appendRow(["!!!You missed a component!!!"])
                            break
                    }
                } // END substep component procedure

                // if there are no more substeps, we store the final row and name the step
                // if (stepCNr == currentStepClength - 1) {

                lastRow = activeRow

                var maxCol = 1 + (companyNumberOfServices + 2) * nrOfIndSubComps; // calculates the max column

                // we don't want the researchers' names as part of the range
                // so move firstRow by 1
                var range = sheet.getRange(firstRow + 1, 2, lastRow - firstRow - 1, maxCol - 1)

                // cell name formula; output defined in 44_rangeNamingHelper.js
                const component = ""
                var stepNamedRange = defineNamedRangeStringImport(indexPrefix, 'DC', currentStep.subStepID, currentClass.indicators[i].labelShort, component, CompanyObj.id, "", "Step")

                file.setNamedRange(stepNamedRange, range); // names an entire step

                // GROUPING for substep
                var substepRange = range.shiftRowGroupDepth(1)

                // COLLAPSE substep GROUP per researchSteps substep setting
                if (!doCollapseAll) {
                    if (currentStep.doCollapse) {
                        substepRange.collapseGroups()
                    }
                }
                endStep = activeRow
                // }

                endStep = activeRow
            } // --- // END Sub-Step-Wise Procedure // --- //

            activeRow += 1

            // group whole step and make main step header row the anchor
            var rangeStep = sheet.getRange(beginStep + 1, 1, endStep - beginStep - 1, numberOfColumns)
            Logger.log("grouping whole step for range :" + rangeStep.getA1Notation())
            rangeStep.shiftRowGroupDepth(1);

        } // --- // END Main-Step-Wise Procedure // --- //


        // set font for whole data range
        sheet.getRange(dataStartRow, 1, lastRow, numberOfColumns)
            .setFontFamily("Roboto")
            .setWrap(true)
            .setVerticalAlignment("top")

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
        sheet.setTabColor(currentClass.classColor)

    } // End of Indicator Sheet

} // End of populating process
