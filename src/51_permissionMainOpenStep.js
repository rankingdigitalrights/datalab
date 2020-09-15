function mainProtectFileOpenStepSingleCompany(company, subStepIDs, editor, Indicators) {
    // can easily call all the other permissions functions from this function

    // let Indicators = filterSingleIndicator(indicatorsVector, "P11a") // TODO: move subsetting logic into main Caller

    // let Company = companiesVector.companies.slice(5, 6)[0]
    let Company = company

    // TODO: adapt to updated mainCaller logic / editors-as-parameters
    let assignedStepEditors = editor

    let companyID = Company.id
    Logger.log("CompanyObj :" + companyID)

    let Viewers = centralConfig.defaultViewers

    let defaultStepEditors = centralConfig.defaultEditors

    let StepEditors = defaultStepEditors.concat(assignedStepEditors)

    StepEditors = [...new Set(StepEditors)] // creates new Set with unique values

    let SheetEditors = [] // TODO: remove

    let fileID = Company.urlCurrentDataCollectionSheet
    let SS = SpreadsheetApp.openById(fileID)

    let currentPrefix = centralConfig.indexPrefix

    // overall open function
    let isSuccess = false

    isSuccess = initializationOpenStep(Indicators, subStepIDs, companyID, StepEditors, SS, Company, "Names", Viewers, SheetEditors, fileID, currentPrefix)

    Logger.log("FLOW - Steps " + subStepIDs + " for " + companyID + " opened? - " + isSuccess)

}
