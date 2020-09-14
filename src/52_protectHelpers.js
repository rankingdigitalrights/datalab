function protectSingleCompany(Indicators, SheetEditors, SS, companyID, currentPrefix) {
    removeAllProtections(SS)
    protectSheets(Indicators, SheetEditors, SS, companyID, currentPrefix)
}

function protectSheets(Indicators, Editors, SS, companyID, currentPrefix) {
    Logger.log("FLOW - Protecting Sheets")

    let sheetProtection, range, unprotectedRanges, Sheet, rangeName, rangeNotation

    // protecting 2019 Outcome
    protectSingleSheet(centralConfig.prevYearOutcomeTab, Editors, SS)

    // protecting 2019 Sources
    protectSingleSheet(centralConfig.prevYearSourcesTab, Editors, SS)


    // looping through the types of indicators
    for (let indicatorCategory = 0; indicatorCategory < Indicators.indicatorCategories.length; indicatorCategory++) {

        let Category = Indicators.indicatorCategories[indicatorCategory]

        Logger.log("--- Starting " + Category.labelLong)

        // looping through each indicator in the types and protecting individual sheets
        for (let indicator = 0; indicator < Category.indicators.length; indicator++) {
            Logger.log("--- --- " + Category.indicators[indicator].labelShort)

            let Indicator = Category.indicators[indicator] // specific indicator

            Sheet = SS.getSheetByName(Indicator.labelShort)

            // if the Sheet with this indicator name exists protect that Sheet
            if (Sheet != null) {

                // creating a protection for the Sheet, description must be name of Sheet for openStep to work
                sheetProtection = protectSingleSheet(Indicator.labelShort, Editors, SS)
                unprotectedRanges = []

                // unprotecting the guide
                rangeName = specialRangeName("Guide", "", Indicator.labelShort)
                rangeNotation = getNamedRangeRowNotation(rangeName, SS)
                range = Sheet.getRange(rangeNotation)
                unprotectedRanges.push(range)

                // unprotecting step 00
                rangeName = defineNamedRange(currentPrefix, "DC", "S00", Indicator.labelShort, "", companyID, "", "Step")
                rangeNotation = getNamedRangeRowNotation(rangeName, SS)
                range = Sheet.getRange(rangeNotation)
                unprotectedRanges.push(range)

                sheetProtection.setUnprotectedRanges(unprotectedRanges)

                Logger.log("--- --- " + Indicator.labelShort + " done")
            }
        }

        Logger.log("--- Completed " + Category.labelLong)

    }
}

function protectSingleSheet(sheetName, Editors, SS) {
    let sheetProtection

    // function protects a single sheet
    sheetProtection = SS.getSheetByName(sheetName).protect().setDescription(sheetName)
    sheetProtection.removeEditors(sheetProtection.getEditors());
    sheetProtection.addEditors(Editors)
    if (sheetProtection.canDomainEdit()) {
        sheetProtection.setDomainEdit(false);
    }

    return sheetProtection
}
