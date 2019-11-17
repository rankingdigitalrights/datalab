// ## BEGIN High-level functions | main components ## //

// TODO: Explain in a few sentences what the whole function is doing
// List the parameters and where their values are coming from


function repairDCSheetByCategory(Spreadsheet, thisIndCat, CompanyObj, ResearchStepsObj, companyNumberOfServices, hasOpCom, includeRGuidanceLink, useIndicatorSubset, ListSheet) {

    // for each indicator
    // - create a new Sheet
    // - name the Sheet
    // -
    var thisIndCatLength
    
    if (useIndicatorSubset) {
        thisIndCatLength = 2
    } else {
        thisIndCatLength = thisIndCat.indicators.length
    }

    // iterates over each indicator in the current type
    // for each indicator = distinct Sheet do

    for (var i = 0; i < thisIndCatLength; i++) {

        var thisInd = thisIndCat.indicators[i]
        var thisIndLabel = thisInd.labelShort
        Logger.log('indicator :' + thisIndLabel)
        var thisIndScoringScope = thisInd.scoringScope
        Logger.log('Scoring Scope: ' + thisIndLabel + ' ' + thisIndScoringScope)

        var sheet = getSheetByName(Spreadsheet, thisIndLabel)

        if (sheet === null) {
            Logger.log("Skip " + thisIndLabel)
            continue // skips this i if sheet already exists
        }

        // checks whether this indicator has components. If yes then it is set to that number, else it is defaulted to 1
        var nrOfIndSubComps = 1
        if (thisIndCat.hasSubComponents == true) {
            nrOfIndSubComps = thisIndCat.components.length
        }

        // checks how many company group/opcom columns to hide for this Indicator
        // (based on Scoring Scope)

        var bridgeCompColumnsNr = 2 // default:: no company columns
        var bridgeOpCom

        if (thisInd.scoringScope == "full") {
            if (hasOpCom) {
                bridgeCompColumnsNr = 0
            } else {
                // if (companyNumberOfServices > 1) {
                bridgeCompColumnsNr = 1
                // }
            }
        }

        // general formatting of sheet
        // TODO: think about where to refactor to
        
        var numberOfColumns = (companyNumberOfServices + 2) * nrOfIndSubComps + 1

        // start sheet in first top left cell
        var activeRow = 1
        var activeCol = 1

        // adds up indicator guidance
        activeRow = skipIndicatorGuidance(thisInd, activeRow, includeRGuidanceLink)

        // --- // Begin Main Step-Wise Procedure // --- //

        var mainStepsLength = ResearchStepsObj.researchSteps.length

        // for each main step
        for (var mainStepNr = 0; mainStepNr < mainStepsLength; mainStepNr++) {

            var thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]
            var thisMainStepColor = thisMainStep.stepColor
            // setting up all the substeps for all the indicators

            Logger.log("main step : " + thisMainStep.step)
            var subStepsLength = thisMainStep.substeps.length


            activeRow = skipMainStepHeader(thisIndCat, activeRow) // sets up header

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
                            activeRow = fixSubStepHeader(sheet, thisInd, CompanyObj, activeRow, Spreadsheet, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNumberOfServices)
                            break

                        case "elementResults":
                            activeRow = fixScoringOptions(sheet, thisInd, CompanyObj, activeRow, Spreadsheet, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNumberOfServices)
                            break

                        case "binaryReview":
                            activeRow = fixBinaryEvaluation(sheet, thisInd, CompanyObj, activeRow, Spreadsheet, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNumberOfServices)
                            break

                        case "elementComments":
                            activeRow = fixComments(sheet, thisInd, CompanyObj, activeRow, Spreadsheet, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNumberOfServices)
                            break

                        case "sources":
                            activeRow = fixSources(sheet, thisInd, CompanyObj, activeRow, Spreadsheet, currentStep, stepCNr, nrOfIndSubComps, thisIndCat, companyNumberOfServices)
                            break

                        case "extraQuestion":
                            activeRow = fixExtraInstruction(currentStep, stepCNr, activeRow, activeCol, sheet)
                            break

                    }
                } // END substep component procedure

                // if there are no more substeps, we store the final row and name the step
                // if (stepCNr == currentStepClength - 1) {


                // Spreadsheet.setNamedRange(stepNamedRange, range)
                
                // names an entire step

                // GROUPING for substep

                // }

            } // --- // END Sub-Step-Wise Procedure // --- //

            // if (mainStepNr < mainStepsLength - 1) {
            //     sheet.getRange(activeRow, activeCol, 1, numberOfColumns).setBorder(null, null, true, null, null, null, "black", null)
            // }

            activeRow += 1


        } // --- // END Main-Step-Wise Procedure // --- //


        // // set font for whole data range
        // var sheetRange = sheet.getRange(dataStartRow, 1, lastRow, numberOfColumns)
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
        
        // var rules = sheet.getConditionalFormatRules()        
        // rules.push(condRuleNames)
        // rules.push(condRuleValues)
        // sheet.setConditionalFormatRules(rules)
        
        listBrokenRefs(ListSheet, sheet, thisIndLabel)
    } // End of Indicator Sheet

} // End of populating process
