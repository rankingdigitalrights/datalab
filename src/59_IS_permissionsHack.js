/*
This file will have two functions that will open up and close research step(s) to
the designated email(s) respectively. A third function will close research step(s)
to all.

https://developers.google.com/apps-script/reference/spreadsheet/protection

*/

// both main Functions can server as main callers in 00_mainControler

function mainUnprotectSingleCompany() {

    // let Company = companiesVector.companies.slice(0, 1)[0]
    // let Company = companiesVector.companies.slice(3, 4)[0]
    // let Company = companiesVector.companies.slice(19, 20)[0]
    let Company = companiesVector.companies.slice(6, 7)[0] // Baidu

    let Researchers = ["ilja.sperling@gmail.com", "ilja_s@pm.me", "ggw12@georgetown.edu"]

    let Editors = ["walton@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"]

    // let Researchers = ["wessenauer@rankingdigitalrights.org", "rogoff@rankingdigitalrights.org", "zhang@rankingdigitalrights.org", "brouillette@rankingdigitalrights.org", "abrougui@rankingdigitalrights.org", "rydzak@rankingdigitalrights.org", "ilja.sperling@gmail.com"]
    // let Editors = ["walton@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"]

    unProtectSingleCompany(Company, Researchers, Editors)
}

function mainProtectSingleCompany() {
    // let Company = companiesVector.companies.slice(0, 1)[0]
    // let Company = companiesVector.companies.slice(3, 4)[0]
    // let Company = companiesVector.companies.slice(19, 20)[0]
    let Company = companiesVector.companies.slice(6, 7)[0] // Baidu

    let useIndSubset = true

    // variables that user determines
    // let Indicators = selectSingleIndicator(indicatorsVector, "P", "P18")
    let Indicators = indicatorsVector

    // let stepIDs = ["S030", "S031", "S035"]
    // let stepIDs = ["S020", "S021", "S025"]
    let stepIDs = ["S010", "S011", "S015"]
    let mainStepID = "S01"
    // let stepIDs = ["S01"] // for researcher names

    let Researchers = ["ilja.sperling@gmail.com", "ilja_s@pm.me", "ggw12@georgetown.edu"]
    let Editors = ["walton@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"]

    // let Researchers = ["wessenauer@rankingdigitalrights.org", "rogoff@rankingdigitalrights.org", "zhang@rankingdigitalrights.org", "brouillette@rankingdigitalrights.org", "abrougui@rankingdigitalrights.org", "rydzak@rankingdigitalrights.org", "ilja.sperling@gmail.com"]
    // let Editors = ["walton@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"]

    protectSingleCompany(Company, Researchers, Editors, Indicators, useIndSubset, stepIDs, mainStepID)
}

// idea for preventing the sharing of folder: https://developers.google.com/apps-script/reference/drive/folder#setShareableByEditors(Boolean)
// see setShareableByEditors
// file also has shareable

function unProtectSingleCompany(Company, Researchers, Editors) {
    // can easily call all the other permissions functions from this function

    // variables that user determines
    // let Indicators = selectSingleIndicator(indicatorsVector, "P", "P18")
    // let Indicators = indicatorsVector

    let companyID = Company.id
    Logger.log("CompanyObj :" + companyID)

    let SS = SpreadsheetApp.openById(Company.urlCurrentDataCollectionSheet)

    // let allEmails = Researchers.concat(Editors)
    // 
    // adding viewers
    // assignFileViewers(SS, allEmails)

    // adding editors
    // assignFileEditors(SS, Editors)

    // removing all protections
    removeAllProtections(SS)

}

function protectSingleCompany(Company, Researchers, Editors, Indicators, useIndSubset, stepIDs, mainStepID) {
    // can easily call all the other permissions functions from this function

    let companyID = Company.id
    Logger.log("CompanyObj: " + Company.id)

    let SS = SpreadsheetApp.openById(Company.urlCurrentDataCollectionSheet)

    // protecting all sheets
    // TODO: we can also (should)
    // a) make this a distinct main-controller level functions
    // b) run for all compnies (maybe in parallel) it after we produce the input sheets
    // currently takes around 4minutes to run

    protectSheets(Indicators, Editors, SS)
    // adding viewers

    let allEmails = Researchers.concat(Editors)
    assignFileViewers(SS, allEmails)

    // adding editors
    assignFileEditors(SS, Researchers)

    // opening a step
    // openResearcherNameStep(Indicators, stepIDs, companyID, Researchers, SS, Company, "Names")
    openResearchSteps(Indicators, useIndSubset, mainStepID, stepIDs, companyID, Researchers, SS, Company, "Step")

    // close step
    // closeStep(Indicators,Editors,SS)

}

// closeStep simply removes all permissions and then adds only the Sheet permissions back
function closeStep(Indicators, Emails, SS) {
    removeAllProtections(SS)
    protectSheets(Indicators, Emails, SS)
}


function openResearchSteps(Indicators, useIndSubset, mainStepID, stepIDs, companyID, Researchers, SS, Company, Label) {
    // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
    Logger.log("MODE: open researcher names")

    let Sheet, Category, Indicator
    let sheetProtections, sheetProtection, namedR, notation, range, unprotectedRanges
    let protectionStep

    let maxIndLength

    // looping through the types of indicators (G,F,P)
    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {

        Category = Indicators.indicatorCategories[i]
        Logger.log("NEXT : Starting " + Category.labelLong)

        maxIndLength = useIndSubset ? 3 : Category.indicators.length

        // looping through indicators
        for (let j = 0; j < maxIndLength; j++) {

            Indicator = Category.indicators[j]
            Logger.log("--- BEGIN indicator :" + Indicator.labelShort)
            // if the spread has a Sheet for this indicator

            Sheet = SS.getSheetByName(Indicator.labelShort)

            if (Sheet != null) {

                Logger.log("--- Sheet found :" + Indicator.labelShort)

                // getting the list of sheetProtections on this spread
                sheetProtections = Sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)

                // looking for the protection of the entire Sheet with the indicator name
                // assumes there are no two Sheet sheetProtections with same name
                for (let k = 0; k < sheetProtections.length; k++) {

                    // TODO: not sure why we need this
                    // thats O=n in the worst case
                    // use Array.includes()

                    if (sheetProtections[k].getDescription() == Indicator.labelShort) {

                        sheetProtection = sheetProtections[k] // gets the Sheet sheetProtection once found
                        Logger.log("--- existing sheetProtection found: " + sheetProtection.getDescription())

                        let unprotectedRanges = sheetProtection.getUnprotectedRanges()
                        let rangeProtection

                        // looping through all the steps you want to open
                        for (let l = 0; l < stepIDs.length; l++) {

                            // now need to build the namedRange you want, get A1 notation, then unprotect it, then protect it and open it only to certain people
                            // need to make RDR20 and DC variables

                            // Cell name formula; output defined in 44_rangeNamingHelper.js

                            namedR = defineNamedRange("RDR20", "DC", stepIDs[l], Indicator.labelShort, "", companyID, "", Label)

                            notation = SS.getRangeByName(namedR).getA1Notation()
                            range = Sheet.getRange(notation) // getting the range associated with named range

                            // TODO: update existing range protections instead of adding new redundant ones.

                            // create a new protection that will only be open to certain people of that step
                            rangeProtection = range.protect()

                            rangeProtection.removeEditors(rangeProtection.getEditors())
                            if (rangeProtection.canDomainEdit()) {
                                rangeProtection.setDomainEdit(false)
                            } // disabeling domain edit

                            rangeProtection.addEditors(Researchers) // add emails to the step rangeProtection
                            //SS.addEditors(emails) // maybe this step isn't needed

                            // let description = Indicator.labelShort + "StepProtection" + mainStepID + Label

                            // if (rangeProtection.getDescription() != description) {
                            //     rangeProtection.setDescription(description)
                            // }

                            unprotectedRanges.push(range)

                        }

                        sheetProtection.setUnprotectedRanges(unprotectedRanges) // now this step is unprotected



                    } // close if       
                }


                Logger.log("--- Completed " + Category.labelLong)
            } // end if statement

        } // end individual indicator

    } // end category


} // end function


// TODO: Deprecate if possible and assign named Range in Input Sheets module

function openResearcherNameStep(Indicators, stepIDs, companyID, Researchers, SS, Company, Label) {
    // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
    Logger.log("protectSheets")

    let Sheet, Category, Indicator
    let protections, protection, namedR, notation, range, unprotectedRanges
    let protectionStep

    // looping through the types of indicators (G,F,P)
    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {

        Category = Indicators.indicatorCategories[i]
        Logger.log("--- NEXT : Starting " + Category.labelLong)

        // looping through indicators
        for (let j = 0; j < 2; j++) {
            Indicator = Category.indicators[j]

            // if the spread has a Sheet for this indicator
            if (SS.getSheetByName(Indicator.labelShort) != null) {

                Sheet = SS.getSheetByName(Indicator.labelShort)

                // getting the list of protections on this spread
                protections = Sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)

                // looking for the protection of the entire Sheet with the indicator name
                // assumes there are no two Sheet protections with same name
                for (let k = 0; k < protections.length; k++) {
                    if (protections[k].getDescription() == Indicator.labelShort) {
                        protection = protections[k] // gets the Sheet protection once found
                        Logger.log(protection.getDescription())


                        // looping through all the steps you want to open
                        for (let l = 0; l < stepIDs.length; l++) {

                            // now need to build the namedRange you want, get A1 notation, then unprotect it, then protect it and open it only to certain people
                            // need to make RDR20 and DC variables

                            let width = Company.services.length + 3

                            // Cell name formula; output defined in 44_rangeNamingHelper.js

                            namedR = defineNamedRange("RDR20", "DC", "S01", Indicator.labelShort, "", companyID, "group", "N")

                            let namedRObj = SS.getRangeByName(namedR)

                            notation = namedRObj.getA1Notation()
                            range = Sheet.getRange(notation) // getting the range associated with named range

                            let rfr = range.getRow()
                            let rfc = range.getColumn()

                            let newRange = Sheet.getRange(rfr, rfc, 1, width)

                            // namedRObj.setRange(newRange)
                            SS.setNamedRange(namedR, newRange)

                            range = SS.getRangeByName(namedR).getA1Notation()
                            range = Sheet.getRange(range)

                            unprotectedRanges = protection.getUnprotectedRanges()
                            unprotectedRanges.push(range)

                            protection.setUnprotectedRanges(unprotectedRanges) // now this step is unprotected

                            // create a new protection that will only be open to certain people of that step
                            protectionStep = range.protect().setDescription(Indicator.labelShort + "StepProtection" + stepIDs[l] + Label)

                            protectionStep.removeEditors(protectionStep.getEditors())
                            if (protectionStep.canDomainEdit()) {
                                protectionStep.setDomainEdit(false)
                            } // disabeling domain edit

                            protectionStep.addEditors(Researchers) // add emails to the step protection
                            //SS.addEditors(emails) // maybe this step isn't needed
                        }

                    } // close if       
                    Logger.log("indicator :" + Indicator.labelShort)
                }
                Logger.log("--- Completed " + Category.labelLong)
            } // end if statement

        } // end individual indicator

    } // end category


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



function protectSheets(Indicators, Editors, SS) {
    Logger.log(" In protectSheets")

    let protect

    // protecting 2019 Outcome
    protect = SS.getSheetByName("2019 Outcome").protect().setDescription("2019 Outcome")
    protect.removeEditors(protect.getEditors())
    protect.addEditors(Editors)
    if (protect.canDomainEdit()) {
        protect.setDomainEdit(false)
    }

    // protecting 2019 Sources
    protect = SS.getSheetByName("2019 Sources").protect().setDescription("2019 Sources")
    protect.removeEditors(protect.getEditors())
    protect.addEditors(Editors)
    if (protect.canDomainEdit()) {
        protect.setDomainEdit(false)
    }


    let Category, Indicator
    let Protection

    // looping through the types of indicators
    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {

        Category = Indicators.indicatorCategories[i]

        Logger.log("--- NEXT : Starting " + Category.labelLong)

        // looping through each indicator in the types and protecting individual sheets
        for (let j = 0; j < Category.indicators.length; j++) {
            Logger.log(Category.indicators[j].labelShort)

            Indicator = Category.indicators[j] // specific indicator

            // if the Sheet with this indicator name exists protect that Sheet
            if (SS.getSheetByName(Indicator.labelShort) != null) {

                // creating a protection for the Sheet, description must be name of Sheet for openStep to work
                Protection = SS.getSheetByName(Indicator.labelShort).protect().setDescription(Indicator.labelShort)

                // removing other editors and only adding array of Editors
                Protection.removeEditors(Protection.getEditors())
                Protection.addEditors(Editors)
                if (Protection.canDomainEdit()) {
                    Protection.setDomainEdit(false)
                }

                Logger.log("indicator :" + Indicator.labelShort)
            }
        }

        Logger.log("--- Completed " + Category.labelLong)

    }

}
