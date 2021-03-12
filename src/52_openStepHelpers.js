/* global
    specialRangeName, defineNamedRange
*/

// eslint-disable-next-line no-unused-vars
function initializationOpenStep(
    Indicators,
    subStepIDs,
    companyID,
    StepEditors,
    SS,
    Company,
    SNames,
    Viewers,
    SheetEditors,
    fileID,
    currentPrefix,
    doUpdateEditors
) {
    let isSuccess = false

    DriveApp.getFileById(fileID).setShareableByEditors(false)

    // TODO: this should not be part of this function or be optional with a boolean

    // removeAllProtections(SS)
    // protectSheets(Indicators, SheetEditors, SS, companyID, currentPrefix)

    // assignFileViewers(SS, Viewers) // we don't assign specific file viewers currently as viewers are all added to the main index folder and are then inherited

    isSuccess = openResearchStep(
        Indicators,
        subStepIDs,
        companyID,
        StepEditors,
        SS,
        Company,
        SNames,
        currentPrefix,
        doUpdateEditors
    )

    return isSuccess
}

function openResearchStep(
    Indicators,
    subStepIDs,
    companyID,
    StepEditors,
    SS,
    Company,
    Label,
    currentPrefix,
    doUpdateEditors
) {
    // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
    console.log('FLOW - Open Steps')

    let Sheet, Category, Indicator
    let sheetProtection, range, unprotectedRanges
    // let editors;
    let rangeName, subLabel, rangeNotation

    // looping through the types of indicators (G,F,P)
    for (
        let indicatorCategory = 0;
        indicatorCategory < Indicators.indicatorCategories.length;
        indicatorCategory++
    ) {
        Category = Indicators.indicatorCategories[indicatorCategory]
        console.log('--- NEXT : Starting ' + Category.labelLong)

        // looping through indicators
        for (
            let indicator = 0;
            indicator < Category.indicators.length;
            indicator++
        ) {
            Indicator = Category.indicators[indicator]
            console.log('BEGIN indicator :' + Indicator.labelShort)
            // if the spread has a Sheet for this indicator
            if (SS.getSheetByName(Indicator.labelShort) != null) {
                Sheet = SS.getSheetByName(Indicator.labelShort)

                // looking for the protection of the entire Sheet with the indicator name
                // assumes there are no two Sheet protections with same name
                sheetProtection = Sheet.getProtections(
                    SpreadsheetApp.ProtectionType.SHEET
                )[0] // gets the Sheet protection assuming there's only 1

                unprotectedRanges = sheetProtection.getUnprotectedRanges()
                subStepIDs.forEach(function (substep) {
                    // add the name range here as well
                    console.log(`|--- STARTING ${substep}`)

                    /* this should be optional with a boolean */
                    /* or should evaluate MainStep.omitResearcher */

                    subLabel = substep[0].substring(0, 3)
                    rangeName = specialRangeName(
                        Label,
                        subLabel,
                        Indicator.labelShort
                    )
                    console.log(`|--- try: fetching ${rangeName}`)

                    try {
                        range = SS.getRange(rangeName)
                        rangeNotation = range.getA1Notation()
                        range = Sheet.getRange(rangeNotation) // getting the range associated with named range
                        unprotectedRanges.push(range)
                    } catch (error) {
                        console.log(`try-catch Error:\n${error}`)
                    }

                    /*       --------------------------      */

                    // looping through all the steps you want to open
                    for (
                        let substepNr = 0;
                        substepNr < substep.length;
                        substepNr++
                    ) {
                        console.log(`DEBUG - substepNr: ${substepNr}`)

                        // now need to build the namedRange you want, get A1 notation, then unprotect it
                        // need to make DC a variable
                        rangeName = defineNamedRange(
                            currentPrefix,
                            'DC',
                            substep[substepNr],
                            Indicator.labelShort,
                            '',
                            companyID,
                            '',
                            'Step'
                        )
                        range = SS.getRange(rangeName)
                        unprotectedRanges.push(range)
                    }
                    console.log(`|--- ADDED ${substep} to list of ranges`)
                })
                console.log(`|--- Applying unprotections for ${subStepIDs}`)

                sheetProtection.setUnprotectedRanges(unprotectedRanges) // now this substep is unprotected
            } // end if statement
        } // end individual indicator

        console.log('|---|--- Completed ' + Category.labelLong)
    } // end category

    // now need to update the editors for the entire sheet
    // need to first remove all old editors then add the ones we want

    // removes old editors and adds new editors
    // editors = SS.getEditors()
    // for (var editor = 0; editor < editors.length; editor++) {
    //     SS.removeEditor(editors[editor])
    //     SS.addViewer(editors[editor])
    // }
    // SS.addEditors(StepEditors)

    if (doUpdateEditors) {
        updateFileEditors(SS, StepEditors)
    }

    return true
} // end function

/*  assigns old editors as file viewers
    assigns new Editors as file editors */
function updateFileEditors(SS, newEditors) {
    let editors = SS.getEditors()
    for (let editor = 0; editor < editors.length; editor++) {
        SS.removeEditor(editors[editor])
        SS.addViewer(editors[editor])
    }

    SS.addEditors(newEditors)
}
