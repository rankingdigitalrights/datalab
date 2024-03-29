// ## Main: populateDCSheetByCategory ## //

/* global
    Config, doRepairsOnly, addNewStep, startAtMainStepNr, Styles, indexPrefix, insertSheetIfNotExist, addMainSheetHeader, addMainStepHeader, addStepResearcherRow, addSubStepHeader, addStepEvaluation, addYonYReview, addBinaryEvaluation, addResultsReview, addBinaryReview, addComments, addCommentsReview, addSources, addExtraInstruction, addTwoStepComparison, importYonYResults, importYonYSources, addBinaryFBCheck, addImportFBText, addFeedbackStepReview, addResearcherFBNotes, defineNamedRange, cropEmptyColumns, addSourcesReview, findValueRowStart, includeFormatting
*/

/**
 *
 * @param {GoogleAppsScript.Spreadsheet} SS
 * @param {JSON} Category
 * @param {JSON} Company
 * @param {JSON} ResearchSteps
 * @param {Number} companyNrOfServices
 * @param {boolean} hasOpCom
 * @param {boolean} isNewCompany
 * @param {boolean} doCollapseAll
 * @param {boolean} includeRGuidanceLink
 * @param {boolean} collapseRGuidance
 * @param {boolean} useStepsSubset
 */

// eslint-disable-next-line no-unused-vars
function populateDCSheetByCategory(
    SS,
    Category,
    Company,
    ResearchSteps,
    companyNrOfServices,
    hasOpCom,
    isNewCompany,
    doCollapseAll,
    includeRGuidanceLink,
    collapseRGuidance,
    useStepsSubset
) {
    // for each indicator
    // - create a new Sheet
    // - name the Sheet
    // - populate the Sheet Step-Wise

    // fallback for subset runs when indicator category only has 1 item

    let category = Category.labelShort

    // Research Steps Subset: define max main Step
    let mainStepsLength =
        useStepsSubset || addNewStep || startAtMainStepNr > 0
            ? Config.subsetMaxStep + 1
            : ResearchSteps.researchSteps.length

    // Indicator Subset
    let indyCatLength = Category.indicators.length

    // iterates over each indicator in the current Category
    // for each indicator = distinct Sheet do

    let lastRow
    let Indicator

    let lastColumn = 0

    for (let i = 0; i < indyCatLength; i++) {
        let Sheet

        Indicator = Category.indicators[i]
        console.log('|--- Begin Indicator :' + Indicator.labelShort)
        // let thisIndScoringScope = Indicator.scoringScope

        // TODO: remove
        // let oldSheet = SS.getSheetByName(Indicator.labelShort)
        // let oldIndex = oldSheet.getIndex()
        // SS.deleteSheet(oldSheet)

        // try to grab existing Indicator sheet or insert new one

        if (!doRepairsOnly && !addNewStep) {
            Sheet = insertSheetIfNotExist(SS, Indicator.labelShort, false)
        }

        // if (oldIndex) {
        //     moveSheetToPos(SS, Sheet, oldIndex)
        // }

        // if (doRepairs or addExtraStep) --> try to open Sheet
        // else skip Indicator

        if (Sheet === null || Sheet === undefined) {
            if (doRepairsOnly || addNewStep) {
                Sheet = SS.getSheetByName(Indicator.labelShort)
            } else {
                console.log('DEBUG - Sheet not found. Skipping')
                continue
            }
        }

        if (Sheet.getName() === Indicator.labelShort) {
            // checks how many company group/opcom columns to hide for this Indicator
            // (based on Scoring Scope)

            let bridgeCompColumnsNr = 2 // default:: no company columns

            if (Indicator.scoringScope === 'full') {
                if (hasOpCom) {
                    bridgeCompColumnsNr = 0
                } else {
                    // if (companyNrOfServices > 1) {
                    bridgeCompColumnsNr = 1
                    // }
                }
            }

            // general formatting of Sheet
            // TODO: think about where to refactor to
            Sheet.setColumnWidth(1, Styles.dims.labelColumnWidth)

            let numberOfColumns = companyNrOfServices + 2 + 1

            let thisColWidth = Styles.dims.serviceColWidth

            // if (Company.services.length === 1) {
            //     thisColWidth = Styles.dims.serviceColWidth * 1.33
            // }

            Sheet.setColumnWidths(2, numberOfColumns - 1, thisColWidth)

            // if not adding an additional step or repairing a particular Step Range
            // --> start Sheet in first top left cell

            let mainStepString
            if (startAtMainStepNr > 0 && doRepairsOnly) {
                mainStepString = '^Step ' + ResearchSteps.researchSteps[startAtMainStepNr].step
            }

            let activeRow =
                addNewStep && !doRepairsOnly
                    ? Sheet.getLastRow() + 2
                    : doRepairsOnly && startAtMainStepNr > 0 && !addNewStep
                    ? findValueRowStart(Sheet, mainStepString, 1)
                    : 1

            let activeCol = 1

            // adds Sheet top-level front-matter and indicator guidance
            if (!addNewStep && !(startAtMainStepNr > 0)) {
                activeRow = addMainSheetHeader(
                    SS,
                    Sheet,
                    Category,
                    Indicator,
                    Company,
                    activeRow,
                    activeCol,
                    hasOpCom,
                    numberOfColumns,
                    bridgeCompColumnsNr,
                    companyNrOfServices,
                    includeRGuidanceLink,
                    collapseRGuidance
                )
            }
            // --- // Begin Main Step-Wise Procedure // --- //

            let contentStartRow = activeRow
            let dataStartRow = 0

            let MainStep, mainStepNr, mainStepColor, subStepsLength

            // for each main step
            for (mainStepNr = startAtMainStepNr; mainStepNr < mainStepsLength; mainStepNr++) {
                MainStep = ResearchSteps.researchSteps[mainStepNr]
                mainStepColor = MainStep.stepColor
                // setting up all the substeps for all the indicators

                console.log('--- MAIN step : ' + MainStep.step)
                subStepsLength = MainStep.substeps.length

                activeRow = addMainStepHeader(
                    Sheet,
                    Category,
                    Company,
                    activeRow,
                    companyNrOfServices,
                    MainStep,
                    mainStepColor
                ) // sets up header

                let beginStep = activeRow

                // add research names row
                // but omit row for Step 0 (the import of the prev. year's outcome)
                if (mainStepNr > 0) {
                    // HOOK for data range and conditional formatting
                    if (dataStartRow === 0 && mainStepNr > 0) {
                        dataStartRow = activeRow
                    }

                    if (!MainStep.omitResearcher) {
                        activeRow = addStepResearcherRow(
                            SS,
                            Sheet,
                            Indicator,
                            Company,
                            activeRow,
                            MainStep,
                            companyNrOfServices
                        )
                    } else {
                        activeRow += 1
                    }
                }

                let endStep = activeRow

                // --- // Begin sub-Step-Wise Procedure // --- //

                // for each substep
                for (let subStepNr = 0; subStepNr < subStepsLength; subStepNr++) {
                    let SubStep = MainStep.substeps[subStepNr]
                    console.log('---- SUB step : ' + SubStep.labelShort)

                    let subStepLength = SubStep.components.length

                    // step-wise evaluate components of current research Step, execute the according building function and return the active row, which is then picked up by next building function

                    // stores first row of a step to use later in naming a step
                    let firstRow = mainStepNr === 0 ? activeRow : activeRow + 1

                    // Begin step component procedure
                    for (let stepCNr = 0; stepCNr < subStepLength; stepCNr++) {
                        let SubStepComp = SubStep.components[stepCNr]
                        let substepCompType = SubStepComp.type

                        console.log('----- component : ' + SubStep.labelShort + ' : ' + substepCompType)

                        // create the type of substep component that is specified in the json

                        switch (substepCompType) {
                            case 'subStepHeader':
                                activeRow = addSubStepHeader(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices
                                )
                                break

                            case 'importPreviousResults':
                                activeRow = importYonYResults(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    category,
                                    Company,
                                    isNewCompany,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices,
                                    false // isComments
                                )
                                break

                            case 'importPreviousComments':
                                activeRow = importYonYResults(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    category,
                                    Company,
                                    isNewCompany,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices,
                                    true // isComments
                                )
                                break

                            case 'importPreviousSources':
                                activeRow = importYonYSources(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    category,
                                    Company,
                                    isNewCompany,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices,
                                    null
                                )
                                break

                            case 'compareTwoSteps':
                                activeRow = addTwoStepComparison(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    isNewCompany,
                                    mainStepNr,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices
                                )
                                break

                            case 'YonYreview':
                                activeRow = addYonYReview(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    isNewCompany,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices
                                )
                                break

                            case 'reviewResults':
                                activeRow = addResultsReview(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    mainStepNr,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices
                                )
                                break

                            case 'reviewComments':
                                activeRow = addCommentsReview(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    mainStepNr,
                                    SubStep,
                                    stepCNr,
                                    Category,
                                    companyNrOfServices
                                )
                                break

                            case 'reviewSources':
                                activeRow = addSourcesReview(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices
                                )
                                break

                            case 'evaluation':
                                activeRow = addStepEvaluation(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    isNewCompany,
                                    activeRow,
                                    mainStepNr,
                                    SubStep,
                                    stepCNr,
                                    Category,
                                    companyNrOfServices
                                )
                                break

                            case 'binaryReview':
                                activeRow = addBinaryReview(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices
                                )
                                break

                            case 'binaryEvaluation':
                                activeRow = addBinaryEvaluation(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    Category,
                                    companyNrOfServices
                                )
                                break
                            case 'comments':
                                activeRow = addComments(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    Category,
                                    companyNrOfServices
                                )
                                break

                            case 'sources':
                                activeRow = addSources(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    SubStep,
                                    stepCNr,
                                    Category,
                                    companyNrOfServices
                                )
                                break

                            case 'extraQuestion':
                                activeRow = addExtraInstruction(
                                    SubStep,
                                    stepCNr,
                                    activeRow,
                                    activeCol,
                                    Sheet,
                                    Company,
                                    companyNrOfServices
                                )
                                break

                            case 'binaryFeedbackCheck':
                                activeRow = addBinaryFBCheck(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    MainStep,
                                    SubStepComp.rowLabel,
                                    companyNrOfServices
                                )
                                break

                            case 'importFeedbackText':
                                activeRow = addImportFBText(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    MainStep,
                                    SubStepComp,
                                    companyNrOfServices
                                )
                                break

                            case 'researcherFBNotes':
                                activeRow = addResearcherFBNotes(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    activeRow,
                                    MainStep,
                                    SubStep,
                                    stepCNr,
                                    companyNrOfServices
                                )
                                break

                            case 'feedbackEvaluation':
                                activeRow = addFeedbackStepReview(
                                    SS,
                                    Sheet,
                                    Indicator,
                                    Company,
                                    isNewCompany,
                                    activeRow,
                                    mainStepNr,
                                    SubStep,
                                    stepCNr,
                                    Category,
                                    companyNrOfServices
                                )
                                break

                            default:
                                Sheet.appendRow(['!!!Error: Missed a component!!! --- ', substepCompType])
                                break
                        }
                    } // END substep component procedure

                    // if there are no more substeps, store the final row and name the step
                    // if (stepCNr === subStepLength - 1) {

                    lastRow = activeRow

                    let maxCol = 1 + (companyNrOfServices + 2) // calculates the max column

                    // exclude researchers' names from step named range
                    // so move firstRow by 1
                    let range = Sheet.getRange(firstRow, 2, lastRow - firstRow, maxCol - 1)

                    // cell name formula; output defined in 44_rangeNamingHelper.js
                    const component = ''
                    let stepNamedRange = defineNamedRange(
                        indexPrefix,
                        'DC',
                        SubStep.subStepID,
                        Category.indicators[i].labelShort,
                        component,
                        Company.id,
                        '',
                        'Step'
                    )

                    SS.setNamedRange(stepNamedRange, range) // names an entire step

                    // GROUPING for substep
                    if (subStepsLength > 1 && !doRepairsOnly) {
                        range = Sheet.getRange(firstRow, 2, lastRow - firstRow, maxCol - 1)
                        let substepRange = range.shiftRowGroupDepth(1)

                        // COLLAPSE substep GROUP per researchSteps substep setting
                        if (!doCollapseAll) {
                            if (SubStep.doCollapse) {
                                substepRange.collapseGroups()
                            }
                        }
                    }

                    endStep = activeRow
                    activeRow += 1
                } // --- // END Sub-Step-Wise Procedure // --- //

                // activeRow += 1

                // group whole step and make main step header row the anchor
                if (!doRepairsOnly) {
                    let rangeStep = Sheet.getRange(beginStep, 1, endStep - beginStep, numberOfColumns)

                    let rangeGroup = rangeStep.shiftRowGroupDepth(1)

                    // collapses substeps, than main step
                    if (MainStep.doCollapse) {
                        rangeGroup.collapseGroups()
                        rangeGroup.collapseGroups()
                    }
                }
            } // --- // END Main-Step-Wise Procedure // --- //

            console.log('|--- Substeps done')
            console.log('|--- Applying Sheet-level Formatting')

            // TODO: refactor to Interface, run over array of Sheets with array of sheetRanges
            // just collect ranges here and push to global array
            if (includeFormatting) {
                let sheetRange = Sheet.getRange(contentStartRow, 1, lastRow, numberOfColumns)
                    .setFontFamily('Roboto')
                    // .setFontSize(10)
                    .setVerticalAlignment('top')

                // set font for whole data range
                if (dataStartRow) {
                    sheetRange = Sheet.getRange(dataStartRow, 1, lastRow, numberOfColumns).setWrap(true)
                }

                let condRuleNames = SpreadsheetApp.newConditionalFormatRule()
                    .whenTextEqualTo('Your Name')
                    .setFontColor('#ea4335')
                    .setBold(true)
                    .setRanges([sheetRange])
                    .build()

                let condRuleValues = SpreadsheetApp.newConditionalFormatRule()
                    .whenTextEqualTo('not selected')
                    .setFontColor('#ea4335')
                    .setBold(true)
                    .setRanges([sheetRange])
                    .build()

                let condRuleTODO = SpreadsheetApp.newConditionalFormatRule()
                    .whenTextEqualTo('TODO')
                    .setFontColor('#ea4335')
                    .setBold(true)
                    .setRanges([sheetRange])
                    .build()

                // let condRuleNewElem = SpreadsheetApp.newConditionalFormatRule()
                //     .whenTextEqualTo(Config.newElementLabelResult)
                //     .setFontColor("#ea4335")
                //     .setBold(true)
                //     .setRanges([sheetRange])
                //     .build();

                let rules = Sheet.getConditionalFormatRules()
                rules.push(condRuleNames)
                rules.push(condRuleValues)
                rules.push(condRuleTODO)

                // rules.push(condRuleNewElem)
                Sheet.setConditionalFormatRules(rules)

                // collapse all groups
                if (doCollapseAll) {
                    Sheet.collapseAllRowGroups()
                }
            }

            // hides opCom column(s) if opCom === false
            // if (thisIndScoringScope === "full") {
            if (!hasOpCom) {
                Sheet.hideColumns(3)
            }
            // } else {
            //     Sheet.hideColumns(2, bridgeCompColumnsNr)
            // }

            lastColumn = lastColumn > 0 ? lastColumn : Sheet.getLastColumn()

            console.log('cropping')
            cropEmptyColumns(Sheet, 0, lastColumn)
            console.log('cropping done')

            // color Indicator Sheet (Tab) in Class Color when done
            // Sheet.setTabColor(Category.classColor)

            console.log('|--- All Sheet-level Formatting applied')
        } else {
            console.log('SHEET not found or something else')
        }

        console.log('Indicator Processed')
    } // End of Indicator Sheet
} // End of populating process
