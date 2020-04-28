/* global
    fixIndicatorGuidance,
    skipMainStepHeader,
    fixSubStepHeader,
    fixScoringOptions,
    fixBinaryEvaluation,
    fixComments,
    fixSources,
    fixExtraInstruction,
    listBrokenRefsSingleSheet
*/

function fixBrokenRefsSingleSheet(CompanySS, ListSheetFixed, Sheet, ResearchSteps, thisInd, thisIndLabel, thisIndCat, nrOfIndSubComps, Company, hasOpCom, companyNrOfServices, includeRGuidanceLink) {
    // checks whether this indicator has components. If yes then it is set to that number, else it is defaulted to 1


    // checks how many company group/opcom columns to hide for this Indicator
    // (based on Scoring Scope)

    var bridgeCompColumnsNr = 2 // default:: no company columns
    var bridgeOpCom

    if (thisInd.scoringScope == "full") {
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

    var numberOfColumns = (companyNrOfServices + 2) * nrOfIndSubComps + 1

    // start Sheet in first top left cell
    var activeRow = 1
    var activeCol = 1

    // adds up indicator guidance
    activeRow = fixIndicatorGuidance(Sheet, thisInd, activeRow, activeCol, nrOfIndSubComps, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNrOfServices, includeRGuidanceLink)

    // --- // Begin Main Step-Wise Procedure // --- //

    var mainStepsLength = ResearchSteps.researchSteps.length

    // optional: update answer dropdown
    var updateAnswerOptions = false

    // for each main step
    for (var mainStepNr = 0; mainStepNr < mainStepsLength; mainStepNr++) {

        /* optional: update answer dropdown */
        /* only update dropdown for Step 4 (array[3]) and following
        
        if (mainStepNr > 2) { 
            updateAnswerOptions = true
        }
        */

        var thisMainStep = ResearchSteps.researchSteps[mainStepNr]
        // setting up all the substeps for all the indicators

        Logger.log(thisIndLabel + " main step : " + thisMainStep.step)
        var subStepsLength = thisMainStep.substeps.length


        activeRow = skipMainStepHeader(thisIndCat, activeRow) // sets up header

        // --- // Begin sub-Step-Wise Procedure // --- //

        // for each substep
        for (var subStepNr = 0; subStepNr < subStepsLength; subStepNr++) {

            var currentStep = thisMainStep.substeps[subStepNr]
            Logger.log(thisIndLabel + " substep : " + currentStep.labelShort)

            var currentStepClength = currentStep.components.length

            // step-wise evaluate components of current research Step, execute the according building function and return the active row, which is then picked up by next building function

            // stores first row of a step to use later in naming a step

            // Begin step component procedure
            for (var stepCNr = 0; stepCNr < currentStepClength; stepCNr++) {

                var thisStepComponent = currentStep.components[stepCNr].type

                Logger.log("step.component : " + currentStep.labelShort + " : " + thisStepComponent)

                // create the type of substep component that is specified in the json

                switch (thisStepComponent) {

                    case "header":
                        activeRow = fixSubStepHeader(Sheet, thisInd, Company, activeRow, CompanySS, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNrOfServices)
                        break

                    case "evaluation":
                        activeRow = fixScoringOptions(Sheet, thisInd, Company, activeRow, CompanySS, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNrOfServices, updateAnswerOptions)
                        break

                    case "binaryEvaluation":
                        activeRow = fixBinaryEvaluation(Sheet, thisInd, Company, activeRow, CompanySS, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNrOfServices)
                        break

                    case "comments":
                        activeRow = fixComments(Sheet, thisInd, Company, activeRow, CompanySS, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNrOfServices)
                        break

                    case "sources":
                        activeRow = fixSources(Sheet, thisInd, Company, activeRow, CompanySS, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNrOfServices)
                        break

                    case "extraQuestion":
                        activeRow = fixExtraInstruction(currentStep, stepCNr, activeRow, activeCol, Sheet)
                        break

                }
            } // END substep component procedure

            // if there are no more substeps, we store the final row and name the step
            // if (stepCNr == currentStepClength - 1) {


            // CompanySS.setNamedRange(stepNamedRange, range)

            // names an entire step

            // GROUPING for substep

            // }

        } // --- // END Sub-Step-Wise Procedure // --- //

        // if (mainStepNr < mainStepsLength - 1) {
        //     Sheet.getRange(activeRow, activeCol, 1, numberOfColumns).setBorder(null, null, true, null, null, null, "black", null)
        // }

        activeRow += 1


    } // --- // END Main-Step-Wise Procedure // --- //

    // restore Formatting

    // // set font for whole data range
    // var sheetRange = Sheet.getRange(dataStartRow, 1, lastRow, numberOfColumns)
    //     .setFontFamily("Roboto")
    //     .setFontSize(10)
    //     .setWrap(true)
    //     .setVerticalAlignment("top")

    // var condRuleNames = SpreadsheetApp.newConditionalFormatRule()
    //     .whenTextEqualTo('Your Name')
    //     .setFontColor('#ea4335')
    //     .setBold(true)
    //     .setRanges([sheetRange])
    //     .build()

    // var condRuleValues = SpreadsheetApp.newConditionalFormatRule()
    //     .whenTextEqualTo('not selected')
    //     // .setFontColor('#ea4335')
    //     .setBackground('#f4cccc')
    //     .setRanges([sheetRange])
    //     .build()

    // var condRuleNewElem = SpreadsheetApp.newConditionalFormatRule()
    //     .whenTextEqualTo(Config.newElementLabelResult)
    //     .setBackground("#f4cccc")
    //     .setRanges([sheetRange])
    //     .build()

    // var rules = Sheet.getConditionalFormatRules()        
    // rules.push(condRuleNames)
    // rules.push(condRuleValues)
    // rules.push(condRuleNewElem)
    // Sheet.setConditionalFormatRules(rules)

    listBrokenRefsSingleSheet(ListSheetFixed, Sheet, thisIndLabel)
}
