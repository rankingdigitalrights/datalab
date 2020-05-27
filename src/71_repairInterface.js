// Interface to audit and fix named ranges in a company input spreadsheet
// Needs: Company, Company Spreadsheet, Indicators, List Sheet Broken, List Sheet Fixed, doRepair boolean

/* global
    getSheetByName,
    listBrokenRefsSingleSheet,
    fixBrokenRefsSingleSheet
*/


function inspectInputSheet(SS, Indicators, Company, ListSheetBroken) {

    let hasOpCom = Company.hasOpCom
    // fetch number of Services once
    let companyNumberOfServices = Company.services.length

    let Category
    let CategoryLength
    let nrOfIndCatSubComps = 1
    let Indicator
    let IndicatorLabel
    let Sheet

    for (let c = 0; c < Indicators.indicatorCategories.length; c++) {

        Category = Indicators.indicatorCategories[c]

        CategoryLength = Category.indicators.length

        // for each indicator / distinct Sheet do

        for (let i = 0; i < CategoryLength; i++) {

            Indicator = Category.indicators[i]
            IndicatorLabel = Indicator.labelShort

            Sheet = getSheetByName(SS, IndicatorLabel)

            if (Sheet === null) {
                Logger.log("ERROR - Not found: " + IndicatorLabel)
                continue // skips this i if Sheet already exists
            }

            Logger.log("|--- inspecting " + IndicatorLabel)

            listBrokenRefsSingleSheet(SS, ListSheetBroken, Sheet, IndicatorLabel)

        } // End of Indicator Sheet

    } // End of Indicator Category ("Class")

} // End of Company Repairs Process



function processInputSheet(SS, Indicators, Company, ResearchSteps, includeRGuidanceLink, ListSheetBroken, ListSheetFixed, doRepairs) {

    let hasOpCom = Company.hasOpCom
    // fetch number of Services once
    let companyNumberOfServices = Company.services.length

    let Category
    let CategoryLength
    let nrOfIndCatSubComps = 1
    let Indicator
    let IndicatorLabel
    let Sheet


    for (let c = 0; c < Indicators.indicatorCategories.length; c++) {

        Category = Indicators.indicatorCategories[c]

        CategoryLength = Category.indicators.length


        if (Category.hadSubComponents === true) {
            nrOfIndCatSubComps = Category.components.length
        }

        // for each indicator / distinct Sheet do

        for (let i = 0; i < CategoryLength; i++) {

            Indicator = Category.indicators[i]
            IndicatorLabel = Indicator.labelShort

            Sheet = getSheetByName(SS, IndicatorLabel)

            if (Sheet === null) {
                Logger.log("ERROR - Not found: " + IndicatorLabel)
                continue // skips this i if Sheet already exists
            }

            Logger.log("|--- inspecting " + IndicatorLabel)

            listBrokenRefsSingleSheet(ListSheetBroken, Sheet, IndicatorLabel)

            if (doRepairs) {
                Logger.log("|--- fixing " + IndicatorLabel)
                fixBrokenRefsSingleSheet(SS, ListSheetFixed, Sheet, ResearchSteps, Indicator, IndicatorLabel, Category, nrOfIndCatSubComps, Company, hasOpCom, companyNumberOfServices, includeRGuidanceLink)
            }
        } // End of Indicator Sheet

    } // End of Indicator Category ("Class")

} // End of Company Repairs Process
