// --- Spreadsheet Casting: Company Feedback Sheet --- //

/* global
    Config,
    IndicatorsObj,
    researchStepsVector,
    openSpreadsheetByID,
    appendFeedbackBlock,
    calculateCompanyWidthNet,
    importSourcesSheet
*/
function injectFeedbackForms(Company, makeDataOwner) {
    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    let companyShortName = cleanCompanyName(Company)

    let Indicators = IndicatorsObj
    let ResearchSteps = researchStepsVector

    let mainSheetMode = "Feedback"
    let spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    let masterFileId = Config.feedbackForms.masterTemplateUrl
    let outputFolderId = Config.feedbackForms.outputFolderId

    Logger.log("--- --- START: creating " + mainSheetMode + " Spreadsheet for " + Company.label.current)

    // define SS name
    // connect to Spreadsheet if it already exists (Danger!), otherwise make a COPY of Master Template, rename, and return new file

    let SS = Company.urlCurrentFeedbackSheet ? openSpreadsheetByID(Company.urlCurrentFeedbackSheet) : copyMasterSpreadsheet(masterFileId, outputFolderId, spreadsheetName, makeDataOwner)

    let fileID = SS.getId()

    Logger.log("SS ID: " + fileID)

    // --- // Feedback Parameters // --- //

    let outputParams = Config.feedbackForms
    let dataColWidth = outputParams.dataColWidth

    // minus for logical -> index

    let MainStep = ResearchSteps.researchSteps[outputParams.feedbackStep]

    // --- // MAIN: create Single Indicator Class Sheet // --- // 

    let sheetName = Config.sourcesTabName

    let doOverwrite = true

    sheetName = outputParams.sourcesSheetName
    let sourcesSheet = importFBSourcesSheet(SS, sheetName, Company, doOverwrite)

    // --- // creates helper sheet for YonY comments editing // --- //

    // let Sheet = insertSheetIfNotExist(SS, outputParams.yearOnYearHelperTabName, false)
    // if (Sheet !== null) {
    //     produceYonYCommentsSheet(Sheet, false)
    // }

    let Category, Indicator

    let sheetOverwrite = true

    let ankerSheetPos, sheetPos

    for (let c = 0; c < Indicators.indicatorCategories.length; c++) {

        Category = Indicators.indicatorCategories[c]

        ankerSheetPos = SS.getSheetByName(Category.labelLong).getIndex()
        // sheetPos = parseInt(ankerSheetPos)
        console.log("|--- intitial sheetPos: " + sheetPos)

        for (let i = 0; i < Category.indicators.length; i++) {



            Indicator = Category.indicators[i]
            sheetName = Indicator.labelShort
            console.log(`|---- START Processing ${sheetName}`)
            console.log("|------- sheetPos: " + (ankerSheetPos + i))
            Sheet = insertSheetIfNotExist(SS, sheetName, sheetOverwrite, (ankerSheetPos + i))

            prefillFeedbackPage(Sheet, Company, Indicator, MainStep, outputParams)
            console.log(`|---- END Processing ${sheetName}`)
        }
    }

    // add Tab Links to Table of Contents

    Sheet = SS.getSheetByName("Contents")
    appendTOC(SS, Sheet, Indicators)

    removeEmptySheet(SS)

    return fileID
}
