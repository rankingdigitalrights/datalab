// --- MAIN Interface Casting: Company Scoring Sheet --- //
/** produces a single Company Output spreadsheet  with
 * Results and Scores for a set of ResearchSteps[]
 * 21_scoringInterface.js is also used by other modules
 * (i.e. Aggregation Scores)
 */

/* global Config, IndicatorsObj, researchStepsVector, cleanCompanyName, spreadSheetFileName, createSpreadsheet, insertPointValidationSheet, addSetOfScoringSteps, moveHideSheetifExists, removeEmptySheet */

function createSpreadsheetOutput(Company, filenamePrefix, filenameSuffix, isYoyMode, yoyComp, addNewStep, stepsToAdd) {
    let Indicators = IndicatorsObj
    let ResearchSteps = researchStepsVector

    let sheetModeID = 'SC' // SC = Scoring Company

    let companyFilename = cleanCompanyName(Company)

    console.log('--- --- START: main Scoring for ' + companyFilename)
    console.log('--- --- START: creating Output Spreadsheet for ' + companyFilename)

    let hasOpCom = Company.hasOpCom

    // define SS name
    let spreadsheetName = spreadSheetFileName(filenamePrefix, 'Output', companyFilename, filenameSuffix)

    // connect to Spreadsheet if it already exists (Danger!), otherwise create and return new file
    // TODO: Check if has urlID & updateProduction --> grab by ID
    let SS = createSpreadsheet(spreadsheetName, true)
    let fileID = SS.getId()

    // creates Outcome  page

    // Inserts Scoring Scheme which is HLOOKUP'ed to calculate Scores
    // has reversed Scoring Logic as well
    let pointsSheet = insertPointValidationSheet(SS, 'Points')

    // --- // Main Procedure // --- //

    let outputParams = Config.scoringParams

    addSetOfScoringSteps(
        SS,
        sheetModeID,
        Indicators,
        ResearchSteps,
        Company,
        hasOpCom,
        outputParams,
        isYoyMode, // TODO: GW - document
        yoyComp, // TODO: GW - document
        addNewStep, // TODO: GW - document
        stepsToAdd // TODO: GW - document
    )

    // move the Points validation Sheet to the front and hide
    moveHideSheetifExists(SS, pointsSheet, 1)

    // clean up: if empty Sheet exists, delete
    removeEmptySheet(SS)

    console.log('--- --- END: main Scoring for ' + companyFilename)

    return fileID
}
