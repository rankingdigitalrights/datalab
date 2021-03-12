/**
 * per single company
 * pulls out element level data from data input and puts data into
 * structured tables for further processing
 * shall become main endpoint for fetching input data
 */

/* global Config, IndicatorsObj, researchStepsVector, cleanCompanyName, spreadSheetFileName, createSpreadsheet, addDataStoreSingleCompany, removeEmptySheet, determineFirstStep, determineMaxStep */

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

    let outputParams = Config.dataStoreParams

    let firstScoringStep = 0
    let maxScoringStep = Config.subsetMaxStep
    // console.log("DEBUG - maxScoringStep " + maxScoringStep)

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
