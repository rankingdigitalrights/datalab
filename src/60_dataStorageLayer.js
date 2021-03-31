/**
 * per single company
 * pulls out element level data from data input and puts data into
 * structured long-form / tidy tables for further processing
 * ~~shall become~~ main endpoint for fetching input data
 */

/* global Config, IndicatorsObj, researchStepsVector, cleanCompanyName, spreadSheetFileName, createSpreadsheet, addDataStoreSingleCompany, removeEmptySheet */

// eslint-disable-next-line no-unused-vars
function createCompanyDataStore(Company, filenamePrefix, filenameSuffix, mainSheetMode, DataMode) {
    let Indicators = IndicatorsObj
    let ResearchSteps = researchStepsVector

    let companyFilename = cleanCompanyName(Company)

    console.log('START --- begin main Data Layer Process for ' + companyFilename + filenameSuffix)

    let hasOpCom = Company.hasOpCom

    // define SS name
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyFilename, filenameSuffix)

    // connect to SS or create a new one
    let SS = createSpreadsheet(spreadsheetName, true)
    let fileID = SS.getId()

    let outputParams = Config.dataStoreParams // obsolete

    let firstScoringStep = 0 // default: 0; include Step 0 or not? Step 7 = previous year's outcome

    // can control nr of Main Steps to be included but for production just produce all Steps at once
    let maxScoringStep = Config.subsetMaxStep
    // console.log("DEBUG - maxScoringStep " + maxScoringStep)

    /** for each DataMode of [results, changes, TODO: sources]
     * produce a tab with only this type of data
     * TODO: sources need to be re-added
     * consider adding as standalone tab vs including it into results
     * violates data principles (mixing Element vs Indicator-level data)
     * but would be much easier to collect with `datapipe`
     */

    DataMode.forEach((mode) =>
        addDataStoreSingleCompany(
            SS,
            Indicators,
            ResearchSteps,
            firstScoringStep,
            maxScoringStep,
            Company,
            hasOpCom,
            mode
        )
    )

    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    return fileID
}
