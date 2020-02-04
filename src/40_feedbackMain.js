// --- Spreadsheet Casting: Company Scoring Sheet --- //
// Works only for a single ATOMIC step right now //

// --------------- This is the Main Scoring Process Caller ---------------- //

function createFeedbackForms(useIndicatorSubset, thisCompany, filenamePrefix, filenameSuffix, mainSheetMode) {
    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var Config = centralConfig
    var CompanyObj = thisCompany
    var IndicatorsObj = indicatorsVector
    var ResearchStepsObj = researchStepsVector

    var sheetModeID = "FB"

    var companyFilename = cleanCompanyName(CompanyObj)

    Logger.log("--- --- START: creating " + mainSheetMode + " Spreadsheet for " + companyFilename)

    var hasOpCom = CompanyObj.hasOpCom

    // define SS name
    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyFilename, filenameSuffix)

    // connect to Spreadsheet if it already exists (Danger!), otherwise create and return new file
    var SS = connectToSpreadsheetByName(spreadsheetName, true)
    var fileID = SS.getId()

    // --- // Feedback Parameters // --- //

    var integrateOutputs = false
    var isPilotMode = false
    var outputParams = Config.feedbackParams
    var subStepNr = outputParams.subStepNr
    var hasFullScores = outputParams.hasFullScores
    var includeSources = outputParams.includeSources
    var includeNames = outputParams.includeNames
    var includeResults = outputParams.includeResults
    var dataColWidth = outputParams.dataColWidth

    // var to estimate max sheet width in terms of columns based on whether G has subcomponents. This is needed for formatting the whole sheet at end of script. More performant than using getLastCol() esp. when executed per Sheet (think 45 indicators)
    var globalNrOfComponents = 1
    if (IndicatorsObj.indicatorClasses[0].components) {
        globalNrOfComponents = IndicatorsObj.indicatorClasses[0].components.length
    }

    var companyCols = 1
    if (hasOpCom) {
        companyCols = 2
    }
    var numberOfColumns = (CompanyObj.numberOfServices + companyCols) * globalNrOfComponents

    // minus for logical -> index
    var firstScoringStep = outputParams.firstStepNr - 1
    var thisMainStep = ResearchStepsObj.researchSteps[firstScoringStep]

    var thisSubStep = thisMainStep.substeps[subStepNr]
    var thisSubStepID = thisSubStep.subStepID
    var thisSubStepLabel = thisSubStep.labelShort

    // --- // MAIN: create Single Indicator Class Sheet // --- // 

    var thisIndClass
    var sheetName
    var lastCol
    var blocks = 1

    var doOverwrite = true
    sheetName = outputParams.sourcesSheetname

    var sourcesSheet = importSourcesSheet(SS, sheetName, CompanyObj, doOverwrite)

    for (var c = 0; c < IndicatorsObj.indicatorClasses.length; c++) {

        lastCol = 1

        thisIndClass = IndicatorsObj.indicatorClasses[c]

        sheetName = thisIndClass.labelLong

        lastCol = insertFeedbackSheet(SS, sheetName, lastCol, isPilotMode, hasFullScores, thisIndClass, sheetModeID, thisMainStep, CompanyObj, numberOfColumns, hasOpCom, blocks, dataColWidth, integrateOutputs, useIndicatorSubset, includeSources, includeNames, includeResults, thisSubStep, thisSubStepID, thisSubStepLabel)
    }

    // clean up // 
    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    return fileID
}