/**
 * Interface for creating a structured set of company element-level reults
 * 
 */

/* global
       insertSheetIfNotExist,
       dataStoreSingleStep
*/

function addDataStoreSingleCompany(SS, IndicatorsObj, ResearchStepsObj, firstScoringStep, maxScoringStep, Company, hasOpCom, useIndicatorSubset, subStepNr, integrateOutputs, dataColWidth) {

    Logger.log("--- Begin addDataStoreSingleCompany --- subStep: " + subStepNr)

    var urlDC = Company.urlCurrentDataCollectionSheet

    // var to estimate max sheet width in terms of columns based on whether G has subcomponents. This is needed for formatting the whole sheet at end of script. More performant than using getLastCol() esp. when executed per Sheet (think 45 indicators)
    var globalNrOfComponents = 1
    if (IndicatorsObj.indicatorClasses[0].components) {
        globalNrOfComponents = IndicatorsObj.indicatorClasses[0].components.length
    }

    var numberOfColumns = (Company.numberOfServices + 2) * globalNrOfComponents + 1

    // --- // MAIN Procedure // --- //
    // For each Main Research Step

    var mainStepNr
    var thisMainStep
    var thisSubStep
    var sheetLabel

    for (mainStepNr = firstScoringStep; mainStepNr < maxScoringStep; mainStepNr++) {

        thisMainStep = ResearchStepsObj.researchSteps[mainStepNr]

        for (subStepNr = 0; subStepNr < thisMainStep.substeps.length; subStepNr++) {

            thisSubStep = thisMainStep.substeps[subStepNr]
            sheetLabel = thisSubStep.subStepID
            Logger.log("--- Main Step : " + thisMainStep.step)
            Logger.log("--- Main Step has " + thisMainStep.substeps.length + " Substeps")

            var Sheet = insertSheetIfNotExist(SS, sheetLabel, true) // ToDo set as FALSE later

            if (Sheet !== null) {
                Sheet.clear()
            } else {
                continue
            }

            // setting up all the substeps for all the indicators

            dataStoreSingleStep(Sheet, subStepNr, IndicatorsObj, thisSubStep, Company, numberOfColumns, hasOpCom, dataColWidth, useIndicatorSubset, integrateOutputs, urlDC)

        } // END SUBSTEP
    } // END MAIN STEP

}