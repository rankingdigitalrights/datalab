/**
 * per single company
 * pulls out element level data from data input and puts data into
 * structured tables for further processing
 * shall become main endpoint for fetching input data
 */

/* global
        centralConfig,
        indicatorsVector,
        researchStepsVector,
        cleanCompanyName,
        spreadSheetFileName,
        connectToSpreadsheetByName,
        addDataStoreSingleCompany,
        removeEmptySheet,
        determineFirstStep,
        determineMaxStep,
*/

function createCompanyDataStore(useStepsSubset, useIndicatorSubset, thisCompany, filenamePrefix, filenameSuffix, mainSheetMode) {

    var Config = centralConfig
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var CompanyObj = thisCompany

    var companyFilename = cleanCompanyName(CompanyObj)

    Logger.log("begin main Data Layer Process for " + companyFilename)

    var hasOpCom = CompanyObj.hasOpCom

    // define SS name
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyFilename, filenameSuffix)

    // connect to SS or create a new one
    var SS = connectToSpreadsheetByName(spreadsheetName, true)
    var fileID = SS.getId()

    var outputParams = Config.dataStoreParams
    var integrateOutputs = outputParams.integrateOutputs
    var subStepNr = 0 // param for global control substep processing
    var dataColWidth = outputParams.dataColWidth

    var firstScoringStep = determineFirstStep(outputParams)
    var maxScoringStep = determineMaxStep(outputParams, ResearchStepsObj)

    addDataStoreSingleCompany(SS, IndicatorsObj, ResearchStepsObj, firstScoringStep, maxScoringStep, CompanyObj, hasOpCom, useIndicatorSubset, subStepNr, integrateOutputs, dataColWidth)

    // var subStepNr = 1 // param for global control substep processing
    // addDataStoreSingleCompany(SS, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, outputParams, subStepNr, integrateOutputs)

    // clean up // 

    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    return fileID
}