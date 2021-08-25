function mainProtectSingleCompany(company) {
    //let Company = companiesVector.companies.slice(0, 1)[0]
    let Company = company
    let companyID = Company.id
    console.log('CompanyObj :' + companyID)

    let Indicators = indicatorsVector

    // create an array with default as well as company-specific editors
    let Editors = centralConfig.devs
    console.log('Editors: ' + Editors)

    let fileID = Company.urlCurrentInputSheet
    let SS = SpreadsheetApp.openById(fileID) //<---------------- undo when we want to edit actual sheets
    //let SS=SpreadsheetApp.openById("1u3F4xtzd89aVhO1UuWoNR_lPCFLsVXaom_xcDij5oKE")

    console.log('Protecting spreadsheet: ' + fileID)

    let currentPrefix = centralConfig.indexPrefix

    // removing all protections
    //removeAllProtections(SS)

    // close step
    protectSingleCompany(Indicators, Editors, SS, companyID, currentPrefix)
}
