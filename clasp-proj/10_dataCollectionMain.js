// --- Spreadsheet Casting: Company Data Collection Sheet --- //

// --- CONFIG --- //

var importedOutcomeTabName = "2018 Outcome"

// --- //  This is the main caller // --- //

/**
 * 
 * @param {boolean} stepsSubset Parameter: subset reserachSteps.json?
 * @param {boolean} indicatorSubset Parameter: subset indicators.json?
 * @param {string} companyShortName small caps short company name for <company>.json
 * @param {string} filenameSuffix arbitary String for versioning ("v8") or declaring ("test")
 */

function createSpreadsheetDC(stepsSubset, indicatorSubset, companyObj, filenameSuffix) {
    Logger.log('begin main data collection')

    var sheetMode = "DC" // TODO
    var colWidth = 280 //TODO: Move to central  style config

    var companyShortName = companyObj.label.current

    Logger.log("creating " + sheetMode + ' Spreadsheet for ' + companyShortName)

    // importing the JSON objects which contain the parameters
    // Refactored to fetching from Google Drive

    var configObj = importLocalJSON("config")
    // var CompanyObj = importLocalJSON(companyShortName)
    var CompanyObj = companyObj // TODO this a JSON Obj now; adapt in scope
    var IndicatorsObj = importLocalJSON("indicators", indicatorSubset)
    var ResearchStepsObj = importLocalJSON("researchSteps", stepsSubset)

    // creating a blank spreadsheet
    var spreadsheetName = spreadSheetFileName(companyShortName, sheetMode, filenameSuffix)
    //   var file = SpreadsheetApp.create(spreadsheetName)
    var file = connectToSpreadsheetByName(spreadsheetName)

    var fileID = file.getId()
    Logger.log("File ID: " + fileID)
    // --- // add previous year's outcome sheet // --- //

    // Formula for importing previous year's outcome
    var externalFormula = '=IMPORTRANGE("' + configObj.prevIndexSSID + '","' + CompanyObj.tabPrevYearsOutcome + '!' + 'A:Z' + '")'

    // first Sheet already exist, so set it to active and rename
    var firstSheet = file.getActiveSheet()
    firstSheet.setName(importedOutcomeTabName); // <-- will need to make this dynamic at some point
    var cell = firstSheet.getActiveCell()
    cell.setValue(externalFormula.toString())
    // --- // creates sources page // --- //
    var sourcesSheet = insertSheetIfNotExist(file, '2019 Sources'); // make this dynamic
    sourcesSheet.clear()

    var hasOpCom = CompanyObj.opCom

    // fetch number of Services once
    var companyNumberOfServices = CompanyObj.services.length

    // for each Indicator Class do

    for (var i = 0; i < IndicatorsObj.indicatorClasses.length; i++) {

        var currentClass = IndicatorsObj.indicatorClasses[i]

        Logger.log("Starting " + currentClass.labelLong)

        populateSheetByCategory(file, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, colWidth, hasOpCom)

        Logger.log("Completed " + currentClass.labelLong)
    }

    Logger.log('end main')
    Logger.log(sheetMode + ' Spreadsheet created for ' + companyShortName)
    return fileID
}

// ## BEGIN High-level functions | main components ## //

// TODO: Explain in a few sentences what the whole function is doing
// List the parameters and where their values are coming from


function populateSheetByCategory(file, currentClass, CompanyObj, ResearchStepsObj, companyNumberOfServices, colWidth, hasOpCom) {

    // for each indicator
    // - create a new Sheet
    // - name the Sheet
    // -
    var thisIndClassLength = currentClass.indicators.length

    // iterates over each indicator in the current type
    // each indicator == distinct Sheet do

    var lastRow

    for (var i = 0; i < thisIndClassLength; i++) {

        var thisIndicator = currentClass.indicators[i]

        Logger.log("indicator :" + thisIndicator.labelShort)

        var sheet = insertSheetIfNotExist(file, thisIndicator.labelShort); // creates sheet
        sheet.clear(); // empties sheet if existing
        sheet.setTabColor(currentClass.classColor)

        // checks whether this indicator has components. If yes then it is set to that number, else it is defaulted to 1
        var numberOfIndicatorCatSubComponents = 1
        if (currentClass.hasSubComponents == true) {
            numberOfIndicatorCatSubComponents = currentClass.components.length
        }

        // general formatting of sheet
        // TODO: think about where to refactor to
        sheet.setColumnWidth(1, colWidth)

        var numberOfColumns = (companyNumberOfServices + 2) * numberOfIndicatorCatSubComponents + 1

        // TODO: this formatting and its ineffcient
        for (var col = 2; col <= numberOfColumns; col++) {
            sheet.setColumnWidth(col, colWidth / numberOfIndicatorCatSubComponents)
        } 

        // start sheet in first top left cell
        var activeRow = 1
        var activeCol = 1

        activeRow = addIndicatorGuidance(sheet, currentClass, thisIndicator, activeRow, activeCol, numberOfIndicatorCatSubComponents, hasOpCom, numberOfColumns) // sets up indicator guidance
        
        var dataStartRow = activeRow

        activeRow = addTopHeader(sheet, currentClass, CompanyObj, activeRow, file, numberOfIndicatorCatSubComponents, companyNumberOfServices) // sets up header

        // setting up all the steps for all the indicators

        var stepsLength = ResearchStepsObj.researchSteps.length

    // --- // Main Step-Wise Procedure // --- //

        for (var currentStep = 0; currentStep < stepsLength; currentStep++) {

            Logger.log("step : " + ResearchStepsObj.researchSteps[currentStep].labelShort)

            var currentStepClength = ResearchStepsObj.researchSteps[currentStep].components.length

            // step-wise evaluate components of current research Step, execute the according building function and return the active row, which is then picked up by next building function

            for (var currentStepComponent = 0; currentStepComponent < currentStepClength; currentStepComponent++) {

                var thisStepComponent = ResearchStepsObj.researchSteps[currentStep].components[currentStepComponent].type

                Logger.log("step.component : " + ResearchStepsObj.researchSteps[currentStep].labelShort + " : " + thisStepComponent)

                // stores first row of a step to use later in naming a step
                if (currentStepComponent == 0) { var firstRow = activeRow + 1; }

                // all these functions make the type of substep that the step object specifies at this point
                if (thisStepComponent == "header") {

                    activeRow = addStepHeader(sheet, thisIndicator, CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, companyNumberOfServices)

                }

                else if (thisStepComponent == "elementDropDown") { //resultsDropDown
                    activeRow = addScoringOptions(sheet, thisIndicator, CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices)
                }

                else if (thisStepComponent == "miniElementDropDown") { //reviewDropDown
                    activeRow = addBinaryEvaluation(sheet, thisIndicator, CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices)
                }

                else if (thisStepComponent == "comments") {
                    activeRow = addComments(sheet, thisIndicator, CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices)
                }

                else if (thisStepComponent == "sources") {
                    activeRow = addSources(sheet, thisIndicator, CompanyObj, activeRow, file, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices)
                }

                else if (thisStepComponent == "miniheader") { // rename to something more explicit
                    activeRow = addInstruction(ResearchStepsObj.researchSteps[currentStep], currentStepComponent, activeRow, activeCol, sheet)
                }

                else if (thisStepComponent == "comparison") {
                    activeRow = addComparisonYonY(sheet, thisIndicator, CompanyObj, activeRow, ResearchStepsObj.researchSteps[currentStep], currentStepComponent, numberOfIndicatorCatSubComponents, currentClass, companyNumberOfServices)
                }

                // if there are no more substeps, we store the final row and name the step
                if (currentStepComponent == currentStepClength - 1) {

                    lastRow = activeRow
                    var maxCol = 1 + (companyNumberOfServices + 2) * numberOfIndicatorCatSubComponents; // calculates the max column

                    // we don't want the researchs' names, so move firstRow by 1

                    var range = sheet.getRange(firstRow + 1, 2, lastRow - firstRow - 1, maxCol - 1)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""

                    var stepNamedRange = defineNamedRangeStringImport(indexPrefix, 'DC', ResearchStepsObj.researchSteps[currentStep].labelShort, currentClass.indicators[i].labelShort, component, CompanyObj.id, "", "Step")

                    file.setNamedRange(stepNamedRange, range); // names an entire step
                }
            }
        }
    // --- // END Main Step-Wise Procedure // --- //

    // set font for whole data range
    sheet.getRange(dataStartRow, 1, lastRow, numberOfColumns).setFontFamily("Roboto").setWrap(true)

    }

}
