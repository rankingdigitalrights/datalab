function initializationOpenStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, SNames, Viewers, SheetEditors, fileID, currentPrefix) {

    let isSuccess = false

    DriveApp.getFileById(fileID).setShareableByEditors(false)

    // TODO: this should not be part of this function or be optional with a boolean

    // removeAllProtections(SS)
    // protectSheets(Indicators, SheetEditors, SS, companyID, currentPrefix)

    // assignFileViewers(SS, Viewers) // we don't assign specific file viewers currently as viewers are all added to the main index folder and are then inherited

    isSuccess = openResearchStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, SNames, currentPrefix)

    return isSuccess

}


function openResearchStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, Label, currentPrefix) {
    // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
    Logger.log("FLOW - Open Steps")

    let Sheet, Category, Indicator
    let sheetProtection, notation, range, unprotectedRanges
    let editors
    let rangeName, subLabel, rangeNotation

    // looping through the types of indicators (G,F,P)
    for (let indicatorCategory = 0; indicatorCategory < Indicators.indicatorCategories.length; indicatorCategory++) {

        Category = Indicators.indicatorCategories[indicatorCategory]
        Logger.log("--- NEXT : Starting " + Category.labelLong)

        // looping through indicators
        for (let indicator = 0; indicator < Category.indicators.length; indicator++) {
            Indicator = Category.indicators[indicator]
            Logger.log("BEGIN indicator :" + Indicator.labelShort)
            // if the spread has a Sheet for this indicator
            if (SS.getSheetByName(Indicator.labelShort) != null) {

                Sheet = SS.getSheetByName(Indicator.labelShort)

                // looking for the protection of the entire Sheet with the indicator name
                // assumes there are no two Sheet protections with same name
                sheetProtection = Sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)[0] // gets the Sheet protection assuming there's only 1

                unprotectedRanges = sheetProtection.getUnprotectedRanges()
                stepIDs.forEach(function (step) {
                    // add the name range here as well
                    console.log(`|--- STARTING ${step}`)

                    /* this should be optional with a boolean 
                    subLabel = step[0].substring(0, 3)
                    // rangeName = specialRangeName(Label, subLabel, Indicator.labelShort)
                    // console.log(`|--- fetching ${rangeName}`)

                    // range = SS.getRange(rangeName)
                    // rangeNotation = range.getA1Notation()
                    // range = Sheet.getRange(rangeNotation) // getting the range associated with named range
                    // unprotectedRanges.push(range)

                    */

                    // looping through all the steps you want to open
                    for (let substep = 0; substep < step.length; substep++) {

                        // now need to build the namedRange you want, get A1 notation, then unprotect it
                        // need to make RDR20 and DC variables
                        rangeName = defineNamedRange(currentPrefix, "DC", step[substep], Indicator.labelShort, "", companyID, "", "Step")
                        range = SS.getRange(rangeName)
                        unprotectedRanges.push(range)

                    }
                    console.log(`|--- ADDED ${step} to list of ranges`)
                })
                console.log(`|--- Applying unprotections for ${stepIDs}`)

                sheetProtection.setUnprotectedRanges(unprotectedRanges) // now this step is unprotected

            } // end if statement

        } // end individual indicator

        Logger.log("|---|--- Completed " + Category.labelLong)
    } // end category

    // now need to update the editors for the entire sheet
    // need to first remove all old editors then add the ones we want


    // removes old editors and adds new editors
    editors = SS.getEditors()
    for (var editor = 0; editor < editors.length; editor++) {
        SS.removeEditor(editors[editor])
        SS.addViewer(editors[editor])
    }
    SS.addEditors(StepEditors)

    return true
} // end function
