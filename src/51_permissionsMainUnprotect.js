function mainUnProtectSingleCompany(company) {
    let Company = company

    let companyID = Company.id
    console.log('CompanyObj :' + companyID)

    let fileID = Company.urlCurrentInputSheet
    let SS = SpreadsheetApp.openById(fileID) //<---------------- undo when we want to edit actual sheets
    //let SS=SpreadsheetApp.openById("1u3F4xtzd89aVhO1UuWoNR_lPCFLsVXaom_xcDij5oKE")

    // close step
    removeAllProtections(SS)
}
