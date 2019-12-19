/**
 * per single company
 * pulls out element level data from data input and puts data into structured * tables for further processing
 * shall become main endpoint for fetching input data
 */

function createCompanyDataLayer(useStepsSubset, useIndicatorSubset, thisCompany, filenamePrefix, filenameSuffix, mainSheetMode) {

    var Config = centralConfig
    var CompanyObj = thisCompany
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var sheetModeID = "DC"

    var companyFilename = cleanCompanyName(CompanyObj)

    Logger.log("begin main Data Layer Process for " + companyFilename)

    var hasOpCom = CompanyObj.hasOpCom

    // define SS name
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyFilename, filenameSuffix)

    // connect to SS or create a new one
    var SS = connectToSpreadsheetByName(spreadsheetName)
    var fileID = SS.getId()

    var outputParams = Config.dataLayerParams
    var integrateOutputs = outputParams.integrateOutputs
    var subStepNr = 0 // param for global control substep processing

    addDataLayerSingleCompany(SS, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, outputParams, subStepNr, integrateOutputs)

    // var subStepNr = 1 // param for global control substep processing
    // addDataLayerSingleCompany(SS, sheetModeID, Config, IndicatorsObj, ResearchStepsObj, CompanyObj, hasOpCom, useIndicatorSubset, outputParams, subStepNr, integrateOutputs)

    // clean up // 

    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    return fileID
}