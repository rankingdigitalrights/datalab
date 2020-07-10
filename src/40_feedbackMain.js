// --- Spreadsheet Casting: Company Feedback Sheet --- //

/* global
    Config,
    IndicatorsObj,
    researchStepsVector,
    openSpreadsheetByID,
    appendFeedbackBlock,
    calculateCompanyWidth,
    importSourcesSheet
*/
function injectFeedbackForms(Company) {
    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    let Indicators = IndicatorsObj
    let ResearchSteps = researchStepsVector

    let mainSheetMode = "Feedback"

    Logger.log("--- --- START: creating " + mainSheetMode + " Spreadsheet for " + Company.label.current)

    let hasOpCom = Company.hasOpCom
    //Company.width = calculateCompanyWidth(Company)

    // define SS name
    // connect to Spreadsheet if it already exists (Danger!), otherwise create and return new file

    let SS = openSpreadsheetByID(Company.urlCurrentFeedbackSheet)
    // --- // Feedback Parameters // --- //

    let integrateOutputs = false
    let isPilotMode = false
    let outputParams = Config.feedbackForms
    let subStepNr = outputParams.feedbackSubstep
    let dataColWidth = outputParams.dataColWidth

    // minus for logical -> index

    let MainStep = ResearchSteps.researchSteps[outputParams.feedbackStep]

    let SubStep = MainStep.substeps[subStepNr]
    let subStepID = SubStep.subStepID
    let subStepLabel = SubStep.labelShort

    // --- // MAIN: create Single Indicator Class Sheet // --- // 

    let sheetName = Config.sourcesTabName

    let doOverwrite = false

    sheetName = Config.sourcesTabName
    let sourcesSheet = importSourcesSheet(SS, sheetName, Company, true)

    let Category, Indicator
    let Sheet

    for (let c = 0; c < Indicators.indicatorCategories.length; c++) {

        Category = Indicators.indicatorCategories[c]

        for (let i = 0; i < Category.indicators.length; i++) {

            Indicator = Category.indicators[i]
            sheetName = Indicator.labelShort
            Sheet = SS.getSheetByName(sheetName)


            prefillFeedbackPage(Sheet, Company, Indicator, subStepID, outputParams)
        }

    }

}
