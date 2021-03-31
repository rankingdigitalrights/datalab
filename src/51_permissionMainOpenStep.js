/** for all things Permissions see
 * https://www.notion.so/Permissions-Protections-Management-ee5d9b1306974a099b82568565ff559c
 * https://github.com/rankingdigitalrights/datalab/wiki/50-Permissions
 */

function mainProtectFileOpenStepSingleCompany(company, subStepIDs, editor, Indicators, doUpdateEditors) {
    // can easily call all the other permissions functions from this function

    // let Indicators = filterSingleIndicator(indicatorsVector, "P11a") // TODO: move subsetting logic into main Caller

    // let Company = companiesVector.companies.slice(5, 6)[0]
    let Company = company

    // TODO: adapt to updated mainCaller logic / editors-as-parameters
    let assignedStepEditors = editor

    let companyID = Company.id
    console.log('CompanyObj :' + companyID)

    let Viewers = centralConfig.defaultViewers

    let defaultStepEditors = centralConfig.defaultEditors

    let StepEditors = defaultStepEditors.concat(assignedStepEditors)

    StepEditors = [...new Set(StepEditors)] // creates new Set with unique values

    let SheetEditors = [] // TODO: remove

    let fileID = Company.urlCurrentInputSheet
    let SS = SpreadsheetApp.openById(fileID)

    let currentPrefix = centralConfig.indexPrefix

    // overall open function
    let isSuccess = false

    isSuccess = initializationOpenStep(
        Indicators,
        subStepIDs,
        companyID,
        StepEditors,
        SS,
        Company,
        'Names',
        Viewers,
        SheetEditors,
        fileID,
        currentPrefix,
        doUpdateEditors
    )

    console.log('FLOW - Steps ' + subStepIDs + ' for ' + companyID + ' opened? - ' + isSuccess)
}
