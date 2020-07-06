function mainProtectFileOpenStepSingleCompany(company,steps, editor) {
    // can easily call all the other permissions functions from this function

    // TODO: move Indicator Logic into Main Caller
    let Indicators = indicatorsVector
    // let Indicators = filterSingleIndicator(indicatorsVector, "P11a") // TODO: move subsetting logic into main Caller

    // TODO: adapt to stepIDs logic from mainCaller / substeps[] as parameter
    let stepIDs = steps

    // let Company = companiesVector.companies.slice(5, 6)[0]
    let Company = company

    // TODO: adapt to updated mainCaller logic / editors-as-parameters
    let assignedStepEditors = editor

    let companyID = Company.id
    Logger.log("CompanyObj :" + companyID)

    let Viewers = centralConfig.defaultViewers

    let defaultStepEditors = centralConfig.defaultEditors

    let StepEditors = defaultStepEditors.concat(assignedStepEditors)

    let SheetEditors = [] // TODO: remove

    let fileID = Company.urlCurrentDataCollectionSheet
    let SS = SpreadsheetApp.openById(fileID) //<---------------- undo when we want to edit actual sheets
    //let SS=SpreadsheetApp.openById("1u3F4xtzd89aVhO1UuWoNR_lPCFLsVXaom_xcDij5oKE")

    let currentPrefix = centralConfig.indexPrefix

    // overall open function
    let isSuccess = false

    isSuccess = initializationOpenStep(Indicators, stepIDs, companyID, StepEditors, SS, Company, "Names", Viewers, SheetEditors, fileID, currentPrefix)

    Logger.log("FLOW - Steps " + stepIDs + " for " + companyID + " opened? - " + isSuccess)

}