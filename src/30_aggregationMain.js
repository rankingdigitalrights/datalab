/** create Aggregation / Summary Scores Spreadsheet
 * produces for a particular Main Step
 * TODO: verify that removal of Substep 3.2 does not break Step 3 Scores
 * TBC: produces Year-on-Year Sheets as well?
 * TODO: YonY TBC by GW (and to be documented if yes)
 * needs @param scoringStepNr
 * has toggle @param includeElements to include Element level results
 */

/* global
Config, IndicatorsObj, researchStepsVector, spreadSheetFileName, createSpreadsheet, insertPointValidationSheet, countIndiClassLengths, cleanCompanyName, addSetOfScoringSteps, insertSheetIfNotExist, fillSummaryScoresSheet, moveSheetifExists, insertSheetConnector, moveHideSheetifExists, removeEmptySheet, filterSingleSubstep
*/

// eslint-disable-next-line no-unused-vars
function createAggregationOutput(
    Companies,
    filenamePrefix,
    filenameSuffix,
    mainSheetMode,
    scoringStepNr,
    includeCompanyOutcomeSheets,
    isYoyMode // TODO: GW
) {
    let sheetModeID = 'SC' // data type ID: Scoring Company

    let Indicators = IndicatorsObj
    let ResearchStepsObj = researchStepsVector
    let stepName = 'S' + scoringStepNr // just for filename
    let summarySheetName = Config.summaryParams.sheetNameSimple + ' ' + stepName // tab name; not filename

    // connect to existing spreadsheet or creat a blank spreadsheet
    let spreadsheetName = spreadSheetFileName(filenamePrefix, stepName, mainSheetMode, filenameSuffix)

    let SS = createSpreadsheet(spreadsheetName, true)

    let fileID = SS.getId()
    console.log('SS ID: ' + fileID)

    // Scoring Scheme / Validation
    // see 20_scoringMain.js
    let pointsSheet = insertPointValidationSheet(SS, 'Points')

    // helper var to estimate row lengths per category
    // needed for category wise averages
    let indicatorParams = countIndiClassLengths(Indicators)

    // --- // Main Procedure // --- //

    let outputParams = Config.scoringParams
    // legacy hack to hard-code producing only a single step
    // legacy from including Company Outcome tabs
    // TODO: deprecate
    outputParams.firstStepNr = scoringStepNr
    outputParams.lastStepNr = scoringStepNr

    // --- // Individual Company Outcome Sheets // --- //

    let companyFilename
    let hasOpCom

    // old mode to include individual company outcome sheets
    // utilizes 21_scoringInterface.js
    // discouraged for Spreadsheet performance reasons
    // if we have Outcome Sheets, the we import Summary Scores internally
    // TODO: reconsider / deprecate
    if (includeCompanyOutcomeSheets) {
        Companies.forEach(function (CompanyObj) {
            companyFilename = cleanCompanyName(CompanyObj)
            outputParams.sheetName = companyFilename
            console.log('--- --- START: creating ' + mainSheetMode + ' Sheet for ' + companyFilename)
            hasOpCom = CompanyObj.hasOpCom
            addSetOfScoringSteps(
                SS,
                sheetModeID,
                Indicators,
                ResearchStepsObj,
                CompanyObj,
                hasOpCom,
                outputParams,
                isYoyMode,
                scoringStepNr
            )
            console.log('--- --- END: created ' + mainSheetMode + ' Sheet for ' + companyFilename)
        })
    }

    // --- // Core: Summary Sheet // --- //
    /** currently, will produce a plain Summary Scores Sheet with only
     * Indicator-level data AND
     * an extended Summary Scores Sheet which also includes Element-level data
     */

    /** Subset the relevant Scoring Substep
     * has 2020 legacy mode - if a scoring substep is not x.1 then
     * alternative scoring substep needs to be defined in
     * @param ResearchStepObj (@param scoringStepNr */

    let thisSubStepID = filterSingleSubstep(
        // TODO: rename / refactor
        ResearchStepsObj.researchSteps[scoringStepNr],
        ResearchStepsObj.researchSteps[scoringStepNr].scoringSubStep
    )
    thisSubStepID = thisSubStepID.subStepID

    let summarySheet
    let includeElements

    // CORE 1. Plain Summary Scores Sheet

    includeElements = false // keep; HOOK: include Element-Level results

    // Caution: as default overwrites tab if it exist
    summarySheet = insertSheetIfNotExist(SS, summarySheetName, true)

    if (summarySheet === null) {
        console.log('BREAK: Sheet for ' + summarySheetName + ' already exists. Skipping.')
    } else {
        summarySheet.clear() // Purge existing Sheet

        summarySheet = fillSummaryScoresSheet(
            summarySheet,
            Indicators,
            thisSubStepID,
            Companies,
            indicatorParams,
            includeElements,
            isYoyMode
        )

        summarySheet.setFrozenColumns(1)
        if (!isYoyMode) {
            summarySheet.setFrozenRows(2)
        } else {
            summarySheet.setFrozenRows(3)
        }
        moveSheetifExists(SS, summarySheet, 2)
    }

    // 2. Prototype Summary Scores with Element Level //
    // TODO: add global boolean to exclude the Element Level Sheet
    includeElements = true // default; keep for this part

    summarySheetName = 'Summary w Elements '
    summarySheet = insertSheetIfNotExist(SS, summarySheetName + stepName, false)

    if (summarySheet === null) {
        console.log('BREAK: Sheet for ' + summarySheetName + ' already exists. Skipping.')
    } else {
        summarySheet.clear()

        summarySheet = fillSummaryScoresSheet(
            summarySheet,
            Indicators,
            thisSubStepID,
            Companies,
            indicatorParams,
            includeElements,
            isYoyMode
        )

        summarySheet.setFrozenColumns(1)
        if (!isYoyMode) {
            summarySheet.setFrozenRows(2)
        } else {
            summarySheet.setFrozenRows(3)
        }
        moveSheetifExists(SS, summarySheet, 3)
    }

    // --- // Final formatiing // --- //

    // Default Utility Sheet for easier connecting to imported Sheets
    let connectorSheet = insertSheetConnector(SS, Companies, 'Scores')

    moveHideSheetifExists(SS, connectorSheet, 1)
    moveHideSheetifExists(SS, pointsSheet, 1)

    // if empty Sheet exists, delete
    removeEmptySheet(SS)

    return fileID
}
