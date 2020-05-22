/*
This file will have two functions that will open up and close research step(s) to
the designated email(s) respectively. A third function will close research step(s)
to all.

https://developers.google.com/apps-script/reference/spreadsheet/protection
*/

/* global
    companiesVector,
    centralConfig,
    indicatorsVector
*/

// idea for preventing the sharing of folder: https://developers.google.com/apps-script/reference/drive/folder#setShareableByEditors(Boolean)

/*
    Can only open one step at a time using openStep BUT can run same function multiple times with different steps!!!!
*/

function mainProtectFileOpenStepSingleCompany() {
    // can easily call all the other permissions functions from this function

    let Indicators = indicatorsVector

    // let stepIDs = ["S030", "S031", "S035"]
    // let stepIDs = ["S020", "S021", "S025"]
    let stepIDs = ["S010", "S011", "S015"]

    // let Company = companiesVector.companies.slice(5, 6)[0]
    let Company = companiesVector.companies[25]

    let assignedStepEditors = ["tatyana.lockot@gmail.com"]

    let companyID = Company.id
    Logger.log("CompanyObj :" + companyID)

    let Viewers = centralConfig.defaultViewers

    let defaultStepEditors = centralConfig.defaultEditors

    let StepEditors = defaultStepEditors.concat(assignedStepEditors)

    let SheetEditors = [] // TODO: remove

    let fileID = Company.urlCurrentDataCollectionSheet
    let SS = SpreadsheetApp.openById(fileID)

    let currentPrefix=centralConfig.indexPrefix

    // overall open function
    let isSuccess = false

    isSuccess = initializationOpenStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, "SNames", Viewers, SheetEditors, fileID,currentPrefix)

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

    let currentPrefix=centralConfig.indexPrefix

    // removing all protections
    removeAllProtections(SS)

    // close step
    protectSingleCompany(Indicators, Editors, SS,currentPrefix)
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


function initializationOpenStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, SNames, Viewers, SheetEditors, fileID,currentPrefix) {

    let isSuccess = false

    DriveApp.getFileById(fileID).setShareableByEditors(false)

    protectSheets(Indicators, SheetEditors, SS, companyID,currentPrefix)

    // assignFileViewers(SS, Viewers) // we don't assign specific file viewers currently as viewers are all added to the main index folder and are then inherited

    isSuccess = openResearchStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, SNames,currentPrefix)

    return isSuccess

}

// protectSingleCompany simply removes all permissions and then adds only the Sheet permissions back
function protectSingleCompany(Indicators, SheetEditors, SS,currentPrefix) {
    removeAllProtections(SS)
    protectSheets(Indicators, SheetEditors, SS,currentPrefix)
}



function openResearchStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, Label, currentPrefix) {
    // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
    Logger.log("FLOW - Open Steps")

    let Sheet, Category, Indicator
    let sheetProtection, notation, range, unprotectedRanges
    let editors
    let rangeName

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
                Logger.log(sheetProtection.getDescription())

                unprotectedRanges = sheetProtection.getUnprotectedRanges()

                // add the name range here as well
                rangeName = specialRangeName(Label, stepIDs[0].substring(0,3), Indicator.labelShort)

                if(Sheet.getRangeByName(rangeName)!=null){
                notation = SS.getRangeByName(rangeName).getA1Notation()
                range = Sheet.getRange(notation) // getting the range associated with named range
                }

                unprotectedRanges.push(range)

                // looping through all the steps you want to open
                for (let stepID = 0; stepID < stepIDs.length; stepID++) {

                    // now need to build the namedRange you want, get A1 notation, then unprotect it
                    // need to make RDR20 and DC variables
                    range=getNamedRangeRowNotation(defineNamedRange(currentPrefix, "DC", stepIDs[stepID], Indicator.labelShort, "", companyID, "", "Step"), SS)
                    unprotectedRanges.push(range)

                }
                sheetProtection.setUnprotectedRanges(unprotectedRanges) // now this step is unprotected

                Logger.log("--- Completed " + Category.labelLong)
            } // end if statement

        } // end individual indicator

    } // end category

    // now need to update the editors for the entire sheet
    // need to first remove all old editors then add the ones we want


    // removes old editors and adds new editors
    editors = SS.getEditors()
    for (var editor = 0; editor < editors.length; editor++) {SS.removeEditor(editors[editor])}
    SS.addEditors(StepEditors)

    return true
} // end function

function removeAllProtections(SS) {
    Logger.log("In removeAllProtections")

    let sheets = SS.getSheets()
    let sheetProtections, rangeProtections

    // looping through each Sheet and removing all protections on the Sheet
    for (let sheet = 0; sheet < sheets.length; sheet++) {
        let Sheet = SS.getSheets()[sheet]

        Logger.log("In " + Sheet)


        // getting all the protections on a Sheet and then removing them
        sheetProtections = Sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
        rangeProtections = Sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)

        // removing Sheet protections
        for (let j = 0; j < sheetProtections.length; j++) {sheetProtections[j].remove()}

        // removing range protections
        for (let j = 0; j < rangeProtections.length; j++) { rangeProtections[j].remove()}

    }
}

function protectSingleSheet(sheetName,Editors,SS){
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

function protectSheets(Indicators, Editors, SS, companyID,currentPrefix) {
    Logger.log("FLOW - Protecting Sheets")

    let sheetProtection, range, unprotectedRanges, Sheet

    // protecting 2019 Outcome
    protectSingleSheet(centralConfig.prevYearOutcomeTab,Editors,SS)

    // protecting 2019 Sources
    protectSingleSheet(centralConfig.prevYearSourcesTab,Editors,SS)


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
                sheetProtection=protectSingleSheet(Indicator.labelShort.prevYearSourcesTab,Editors,SS)
                unprotectedRanges = []

                // unprotecting the guide
                range=getNamedRangeRowNotation(specialRangeName("Guide", "", Indicator.labelShort), SS)
                unprotectedRanges.push(range)

                // unprotecting step 00
                range=getNamedRangeRowNotation(defineNamedRange(currentPrefix, "DC", "S00", Indicator.labelShort, "", companyID, "", "Step"),SS)
                unprotectedRanges.push(range)

                sheetProtection.setUnprotectedRanges(unprotectedRanges)

                Logger.log("--- --- " + Indicator.labelShort + " done")
            }
        }

        Logger.log("--- Completed " + Category.labelLong)

    }
}

function getNamedRangeRowNotation(namedRange, SS) {
    let firstR, lastR

    firstR = SS.getRangeByName(namedRange).getRow()
    lastR = SS.getRangeByName(namedRange).getLastRow()

    return firstR + ":" + lastR

}
