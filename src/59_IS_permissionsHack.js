/*
This file will have two functions that will open up and close research step(s) to
the designated email(s) respectively. A third function will close research step(s)
to all.

https://developers.google.com/apps-script/reference/spreadsheet/protection

*/

// idea for preventing the sharing of folder: https://developers.google.com/apps-script/reference/drive/folder#setShareableByEditors(Boolean)
// see setShareableByEditors
// file also has shareable

function testSelectSingleIndicator() {
    let Indicators = selectSingleIndicator(indicatorsVector, "P", "P18")
}


function selectSingleIndicator(Indicators, catLabel, indLabel) {

    let CategorySubset = Indicators.indicatorCategories.filter(category => category.labelShort == catLabel)

    let Indicator = CategorySubset[0].indicators.filter(indicator => indicator.labelShort == indLabel)

    Indicator ? console.log("Indicator " + Indicator[0].labelShort + " found!") : console.log("Indicator " + indLabel + " NOT found!")

    return Indicator
}

function protectSingleCompany() {
    // can easily call all the other permissions functions from this function

    // variables that user determines
    // let Indicators = selectSingleIndicator(indicatorsVector, "P", "P18")
    let Indicators = indicatorsVector

    // let stepIDs = ["S030", "S031", "S035"]
    let stepIDs = ["S020", "S021", "S025"]
    // let stepIDs = ["S01"]
    //["S010","S011","S015","S020","S021","S025","S030","S031","S035"] // add all the (sub)steps to be opened


    // let Company = companiesVector.companies.slice(0, 1)[0]
    // let Company = companiesVector.companies.slice(3, 4)[0]
    let Company = companiesVector.companies.slice(19, 20)[0]
    let companyID = Company.id
    Logger.log("CompanyObj :")
    Logger.log(Company.id)

    //let Researchers = ["wessenauer@rankingdigitalrights.org", "rogoff@rankingdigitalrights.org", "zhang@rankingdigitalrights.org", "brouillette@rankingdigitalrights.org", "abrougui@rankingdigitalrights.org", "rydzak@rankingdigitalrights.org", "ilja.sperling@gmail.com"]
    //let Editors = ["walton@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"]
    //let allEmails = ["walton@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org", "wessenauer@rankingdigitalrights.org", "rogoff@rankingdigitalrights.org", "zhang@rankingdigitalrights.org", "brouillette@rankingdigitalrights.org", "abrougui@rankingdigitalrights.org", "rydzak@rankingdigitalrights.org", "ilja.sperling@gmail.com"]

    let Viewers =["wessenauer@rankingdigitalrights.org", "rogoff@rankingdigitalrights.org", "zhang@rankingdigitalrights.org", "brouillette@rankingdigitalrights.org", "abrougui@rankingdigitalrights.org", "rydzak@rankingdigitalrights.org", "ilja.sperling@gmail.com"]
    let StepEditors=["walton@rankingdigitalrights.org"]
    let SheetEditors=[]

    let SS = SpreadsheetApp.openById(Company.urlCurrentDataCollectionSheet)

    // adding viewers
    // assignFileViewers(SS, Viewers)

    // adding editors
    // assignFileEditors(SS, [])

    // assignFileOwner("1uetDs8PQfIiDRW572b_AP5i9bxC17DSVaqIXVnpe3fc", "sperling")


    // opening a step
    //openResearchNameStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, "RNames")
     openResearchStep(Indicators, stepIDs, companyID, Researchers, SS, Company, "SNames")


    // assignFileOwner("1uetDs8PQfIiDRW572b_AP5i9bxC17DSVaqIXVnpe3fc", "data")
    // protecting all sheets
    // protectSheets(Indicators, SheetEditors, SS)

    // removing all protections
    //removeAllProtections(SS)

    // close step
    // closeStep(Indicators,Editors,SS)

}

// closeStep simply removes all permissions and then adds only the Sheet permissions back
function closeStep(Indicators, SheetEditors, SS) {
    removeAllProtections(SS)
    protectSheets(Indicators, SheetEditors, SS)
}


function openResearchStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, Label) {
    // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
    Logger.log("protectSheets")

    let Sheet, Category, Indicator
    let protections, protection, namedR, notation, range, unprotectedRanges
    let protectionStep
    let editors

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
                protections = Sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);

                // looking for the protection of the entire Sheet with the indicator name
                // assumes there are no two Sheet protections with same name
                protection = protections[0] // gets the Sheet protection assuming there's only 1
                Logger.log(protection.getDescription())

                unprotectedRanges=protection.getUnprotectedRanges()
                // add the name range here as well


                // looping through all the steps you want to open
                for (let l = 0; l < stepIDs.length; l++) {

                // now need to build the namedRange you want, get A1 notation, then unprotect it, then protect it and open it only to certain people
                // need to make RDR20 and DC variables

                            let width = Company.services.length + 3

                            // Cell name formula; output defined in 44_rangeNamingHelper.js

                            namedR = defineNamedRange("RDR20", "DC", stepIDs[l], Indicator.labelShort, "", companyID, "", "Step")

                            notation = SS.getRangeByName(namedR).getA1Notation();
                            range = Sheet.getRange(notation); // getting the range associated with named range

                            unprotectedRanges.push(range)

                        }
                        protection.setUnprotectedRanges(unprotectedRanges) // now this step is unprotected





                Logger.log("--- Completed " + Category.labelLong)
            } // end if statement

        } // end individual indicator

    } // end category

    // now need to update the editors for the entire sheet
    editors=SS.getEditors()
    for(var i=0; i<editors.length;i++){
        if(!StepEditors.contains(editors[i])){
            SS.removeEditor(editors[i])
        }
    }

    SS.addEditors(StepEditors)



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



function protectSheets(Indicators, emails, SS) {
    Logger.log(" In protectSheets")

    let protect

    // protecting 2019 Outcome
    protect = SS.getSheetByName("2019 Outcome").protect().setDescription("2019 Outcome")
    protect.removeEditors(protect.getEditors());
    protect.addEditors(emails)
    if (protect.canDomainEdit()) {
        protect.setDomainEdit(false);
    }

    // protecting 2019 Sources
    protect = SS.getSheetByName("2019 Sources").protect().setDescription("2019 Sources")
    protect.removeEditors(protect.getEditors());
    protect.addEditors(emails)
    if (protect.canDomainEdit()) {
        protect.setDomainEdit(false);
    }



    // looping through the types of indicators
    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {

        let Category = Indicators.indicatorCategories[i]

        Logger.log("--- NEXT : Starting " + Category.labelLong)


        // looping through each indicator in the types and protecting individual sheets
        for (let j = 0; j < Category.indicators.length; j++) {
            Logger.log(Category.indicators[j].labelShort)

            let Indicator = Category.indicators[j] // specific indicator

            // if the Sheet with this indicator name exists protect that Sheet
            if (SS.getSheetByName(Indicator.labelShort) != null) {

                // creating a protection for the Sheet, description must be name of Sheet for openStep to work
                let protection = SS.getSheetByName(Indicator.labelShort).protect().setDescription(Indicator.labelShort)

                // removing other editors and only adding array of emails
                protection.removeEditors(protection.getEditors());
                protection.addEditors(emails)
                if (protection.canDomainEdit()) {
                    protection.setDomainEdit(false);
                }

                Logger.log("indicator :" + Indicator.labelShort)
            }
        }


        Logger.log("--- Completed " + Category.labelLong)


    }



}
