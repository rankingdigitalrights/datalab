// Interface to audit and fix named ranges in a company input spreadsheet
// Needs: Company, Company Spreadsheet, Indicators, List Sheet Broken, List Sheet Fixed, doRepair boolean

/* global
    getSheetByName,
    listBrokenRefsSingleSheet,
    fixBrokenRefsSingleSheet
*/

function processInputSheet(CompanySS, Indicators, Company, ResearchSteps, includeRGuidanceLink, ListSheetBroken, ListSheetFixed, doRepairs) {

    var hasOpCom = Company.hasOpCom
    // fetch number of Services once
    var companyNumberOfServices = Company.services.length

    var thisIndCat
    var thisIndCatLength
    var nrOfIndCatSubComps = 1
    var thisInd
    var thisIndLabel
    var thisIndScoringScope
    var Sheet


    for (var c = 0; c < Indicators.indicatorClasses.length; c++) {

        thisIndCat = Indicators.indicatorClasses[c]

        thisIndCatLength = thisIndCat.indicators.length


        if (thisIndCat.hasSubComponents === true) {
            nrOfIndCatSubComps = thisIndCat.components.length
        }

        // for each indicator / distinct Sheet do

        for (var i = 0; i < thisIndCatLength; i++) {

            thisInd = thisIndCat.indicators[i]
            thisIndLabel = thisInd.labelShort
            thisIndScoringScope = thisInd.scoringScope

            Sheet = getSheetByName(CompanySS, thisIndLabel)

            if (Sheet === null) {
                Logger.log("Skipping " + thisIndLabel)
                continue // skips this i if Sheet already exists
            }

            Logger.log(" --- inspecting " + thisIndLabel)

            listBrokenRefsSingleSheet(ListSheetBroken, Sheet, thisIndLabel)

            if (doRepairs) {
                Logger.log(" --- fixing " + thisIndLabel)
                fixBrokenRefsSingleSheet(CompanySS, ListSheetFixed, Sheet, ResearchSteps, thisInd, thisIndLabel, thisIndCat, nrOfIndCatSubComps, Company, hasOpCom, companyNumberOfServices, includeRGuidanceLink)
            }
        } // End of Indicator Sheet

    } // End of Indicator Category ("Class")

} // End of Company Repairs Process