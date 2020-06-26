function mainProtectSingleCompany(company) {

    //let Company = companiesVector.companies.slice(0, 1)[0]
    let Company = company
    let companyID = Company.id
    Logger.log("CompanyObj :" + companyID)

    let Indicators = indicatorsVector

    // create an array with default as well as company-specific editors
    let Editors = centralConfig.defaultEditors
    Logger.log("Editors: "+Editors)

    let fileID = Company.urlCurrentDataCollectionSheet
    let SS = SpreadsheetApp.openById(fileID) //<---------------- undo when we want to edit actual sheets
    //let SS=SpreadsheetApp.openById("1u3F4xtzd89aVhO1UuWoNR_lPCFLsVXaom_xcDij5oKE")

    let currentPrefix = centralConfig.indexPrefix

    // removing all protections
    //removeAllProtections(SS)

    // close step
    protectSingleCompany(Indicators, Editors, SS, companyID, currentPrefix)

}

function mainUnProtectSingleCompany(company) {

    let Company = company

    let companyID = Company.id
    Logger.log("CompanyObj :" + companyID)

    let fileID = Company.urlCurrentDataCollectionSheet
    let SS = SpreadsheetApp.openById(fileID) //<---------------- undo when we want to edit actual sheets
    //let SS=SpreadsheetApp.openById("1u3F4xtzd89aVhO1UuWoNR_lPCFLsVXaom_xcDij5oKE")

    // close step
    removeAllProtections(SS)
}