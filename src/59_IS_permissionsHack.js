/*
This file will have two functions that will open up and close research step(s) to
the designated email(s) respectively. A third function will close research step(s)
to all.

https://developers.google.com/apps-script/reference/spreadsheet/protection
*/

/* global
    companiesVector,
    centralConfig,
    indicatorsVector,
    filterSingleIndicator
*/

// idea for preventing the sharing of folder: https://developers.google.com/apps-script/reference/drive/folder#setShareableByEditors(Boolean)
// see setShareableByEditors
// file also has shareable

var editors = [
    "zhang@rankingdigitalrights.org",
    "lauraannreed@gmail.com",
    "luisgar12@gmail.com",
    "dumitrita.cji@gmail.com",
    "rogoff@rankingdigitalrights.org",
    "elonnaiz@gmail.com",
    "michael.kowen@gmail.com",
    "elonnaiz@gmail.com",
    "ahackl2130@gmail.com",
    "mariam@smex.org",
    "rydzak@rankingdigitalrights.org",
    "ahackl2130@gmail.com",
    "museofu@gmail.com",
    "itskermoshina@gmail.com",
    "opeakanbi@gmail.com",
    "alex.comninos@gmail.com",
    "moussa@smex.org",
    "abrougui@rankingdigitalrights.org",
    "8kkim8@gmail.com",
    "lucia@karisma.org.co ",
    "outi.puukko@gmail.com",
    "zsbchow@gmail.com",
    "wessenauer@rankingdigitalrights.org",
    "amy.mcewan.s@googlemail.com",
    "bojanperkov@sharedefense.org",
    "tatyana.lockot@gmail.com"
]

function updateAll() {
    for (let i = 0; i < companiesVector.companies.length; i++) {
        mainProtectFileOpenStepSingleCompany(i)
    }
}

function updateSingle() {
    mainProtectFileOpenStepSingleCompany(0)
}

function mainProtectFileOpenStepSingleCompany(i) {
    // can easily call all the other permissions functions from this function

    // let Indicators = indicatorsVector
    let Indicators = filterSingleIndicator(indicatorsVector, "P11a")

    // let stepIDs = ["S030", "S031", "S035"]
    // let stepIDs = ["S020", "S021", "S025"]
    let stepIDs = ["S010", "S011", "S015"]

    // let Company = companiesVector.companies.slice(5, 6)[0]
    let Company = companiesVector.companies[i]

    let assignedStepEditors = [editors[i]]

    let companyID = Company.id
    Logger.log("CompanyObj :" + companyID)

    let Viewers = centralConfig.defaultViewers

    let defaultStepEditors = centralConfig.defaultEditors

    let StepEditors = defaultStepEditors.concat(assignedStepEditors)

    let SheetEditors = [] // TODO: remove

    let fileID = Company.urlCurrentDataCollectionSheet
    let SS = SpreadsheetApp.openById(fileID)

    // overall open function
    let isSuccess = false

    isSuccess = initializationOpenStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, "SNames", Viewers, SheetEditors, fileID)

    Logger.log("FLOW - Steps " + stepIDs + " for " + companyID + " opened? - " + isSuccess)

}

function mainProtectSingleCompany() {

    let Company = companiesVector.companies.slice(0, 1)[0]
    let companyID = Company.id
    Logger.log("CompanyObj :" + companyID)

    let Indicators = indicatorsVector

    let Editors = centralConfig.defaultEditors

    let fileID = Company.urlCurrentDataCollectionSheet
    let SS = SpreadsheetApp.openById(fileID)

    // removing all protections
    removeAllProtections(SS)

    // close step
    protectSingleCompany(Indicators, Editors, SS)
}

function mainUnProtectSingleCompany() {

    let Company = companiesVector.companies.slice(0, 1)[0]

    let companyID = Company.id
    Logger.log("CompanyObj :" + companyID)

    let fileID = Company.urlCurrentDataCollectionSheet
    let SS = SpreadsheetApp.openById(fileID)

    // close step
    removeAllProtections(SS)
}


function initializationOpenStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, SNames, Viewers, SheetEditors, fileID) {

    let isSuccess = false

    DriveApp.getFileById(fileID).setShareableByEditors(false)

    protectSheets(Indicators, SheetEditors, SS, companyID)

    // assignFileViewers(SS, Viewers) // we don't assign specific file viewers currently as viewers are all added to the main index folder and are then inherited

    isSuccess = openResearchStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, SNames)

    return isSuccess

}

// protectSingleCompany simply removes all permissions and then adds only the Sheet permissions back
function protectSingleCompany(Indicators, SheetEditors, SS) {
    removeAllProtections(SS)
    protectSheets(Indicators, SheetEditors, SS)
}

function openResearchStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, Label) {
    // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
    Logger.log("FLOW - Open Steps")

    let Sheet, Category, Indicator
    let protections, protection, namedR, notation, range, unprotectedRanges
    let protectionStep
    let editors
    let rangeName
    let firstR, lastR

    // looping through the types of indicators (G,F,P)
    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {

        Category = Indicators.indicatorCategories[i]
        Logger.log("--- NEXT : Starting " + Category.labelLong)

        // looping through indicators
        for (let j = 0; j < Category.indicators.length; j++) {
            Indicator = Category.indicators[j]
            Logger.log("BEGIN indicator :" + Indicator.labelShort)
            // if the spread has a Sheet for this indicator
            if (SS.getSheetByName(Indicator.labelShort) != null) {

                Sheet = SS.getSheetByName(Indicator.labelShort)

                // getting the list of protections on this spread
                protections = Sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)

                // looking for the protection of the entire Sheet with the indicator name
                // assumes there are no two Sheet protections with same name
                protection = protections[0] // gets the Sheet protection assuming there's only 1
                Logger.log(protection.getDescription())

                unprotectedRanges = protection.getUnprotectedRanges()
                // add the name range here as well
                // TODO unhardcode this
                rangeName = specialRangeName("Names", "S01", Indicator.labelShort)
                notation = SS.getRangeByName(rangeName).getA1Notation()
                range = Sheet.getRange(notation) // getting the range associated with named range

                unprotectedRanges.push(range)

                // looping through all the steps you want to open
                for (let l = 0; l < stepIDs.length; l++) {

                    // now need to build the namedRange you want, get A1 notation, then unprotect it, then protect it and open it only to certain people
                    // need to make RDR20 and DC variables

                    let width = Company.services.length + 3

                    // Cell name formula; output defined in 44_rangeNamingHelper.js

                    namedR = defineNamedRange("RDR20", "DC", stepIDs[l], Indicator.labelShort, "", companyID, "", "Step")

                    firstR = SS.getRangeByName(namedR).getRow()
                    lastR = SS.getRangeByName(namedR).getLastRow()

                    range = Sheet.getRange(firstR + ":" + lastR); // getting the range associated with named range                  

                    unprotectedRanges.push(range)

                }
                protection.setUnprotectedRanges(unprotectedRanges) // now this step is unprotected

                Logger.log("--- Completed " + Category.labelLong)
            } // end if statement

        } // end individual indicator

    } // end category

    // now need to update the editors for the entire sheet
    // need to first remove all old editors then add the ones we want


    editors = SS.getEditors()
    for (var i = 0; i < editors.length; i++) {
        SS.removeEditor(editors[i])
    }

    SS.addEditors(StepEditors)

    return true
} // end function

function removeAllProtections(SS) {
    Logger.log("In removeAllProtections")
    let sheets = SS.getSheets()

    // looping through each Sheet and removing all protections on the Sheet
    for (let i = 0; i < sheets.length; i++) {
        let Sheet = SS.getSheets()[i]

        Logger.log("In " + Sheet)


        // getting all the protections on a Sheet and then removing them
        let protections = Sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
        let protect = Sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)

        // removing Sheet protections
        for (let j = 0; j < protections.length; j++) {
            protections[j].remove()
        }

        // removing range protections
        for (let j = 0; j < protect.length; j++) {
            protect[j].remove()
        }

    }
}

function protectSheets(Indicators, Editors, SS, companyID) {
    Logger.log("FLOW - Protecting Sheets")

    let protect, protection
    let rangeName, notation, range
    let unprotectedRanges
    let Sheet
    let firstR, lastR

    // protecting 2019 Outcome
    // protect = SS.getSheetByName(centralConfig.prevYearOutcomeTab).protect().setDescription(centralConfig.prevYearOutcomeTab)
    // protect.removeEditors(protect.getEditors());
    // protect.addEditors(Editors)
    // if (protect.canDomainEdit()) {
    //     protect.setDomainEdit(false);
    // }

    // // protecting 2019 Sources
    // protect = SS.getSheetByName(centralConfig.prevYearSourcesTab).protect().setDescription(centralConfig.prevYearSourcesTab)
    // protect.removeEditors(protect.getEditors());
    // protect.addEditors(Editors)
    // if (protect.canDomainEdit()) {
    //     protect.setDomainEdit(false);
    // }

    // looping through the types of indicators
    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {

        let Category = Indicators.indicatorCategories[i]

        Logger.log("--- Starting " + Category.labelLong)

        // looping through each indicator in the types and protecting individual sheets
        for (let j = 0; j < Category.indicators.length; j++) {
            Logger.log("--- --- " + Category.indicators[j].labelShort)

            let Indicator = Category.indicators[j] // specific indicator

            Sheet = SS.getSheetByName(Indicator.labelShort)

            // if the Sheet with this indicator name exists protect that Sheet
            if (Sheet != null) {

                // creating a protection for the Sheet, description must be name of Sheet for openStep to work

                protection = Sheet.protect().setDescription(Indicator.labelShort)

                // removing other editors and only adding array of Editors
                protection.removeEditors(protection.getEditors());
                protection.addEditors(Editors)
                if (protection.canDomainEdit()) {
                    protection.setDomainEdit(false);
                }

                unprotectedRanges = []

                rangeName = specialRangeName("Guide", "", Indicator.labelShort)

                firstR = SS.getRangeByName(rangeName).getRow()
                lastR = SS.getRangeByName(rangeName).getLastRow()

                range = Sheet.getRange(firstR + ":" + lastR); // getting the range associated with named range

                unprotectedRanges.push(range)

                rangeName = defineNamedRange("RDR20", "DC", "S00", Indicator.labelShort, "", companyID, "", "Step")

                firstR = SS.getRangeByName(rangeName).getRow()
                lastR = SS.getRangeByName(rangeName).getLastRow()

                range = Sheet.getRange(firstR + ":" + lastR); // getting the range associated with named range

                unprotectedRanges.push(range)

                Logger.log("unprotectedRanges " + unprotectedRanges.toString())

                protection.setUnprotectedRanges(unprotectedRanges)

                Logger.log("--- --- " + Indicator.labelShort + " done")
            }
        }

        Logger.log("--- Completed " + Category.labelLong)

    }
}
