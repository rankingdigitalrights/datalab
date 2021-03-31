// -- // All things Scoring // --- //
// - scoring evaluation helper Sheet "Points"
// - scoring formulas for element/level/composite/total

// the authoritative table for any scoring sheets
// Scoring sheets then HLOOKUP(resultCell.String, pointSHeetsRow[2/3]) and return the according score
// eslint-disable-next-line no-unused-vars
function fillPointsSheet(pointsSheet) {
    pointsSheet.appendRow([
        'Results:',
        'not selected',
        'yes',
        'partial',
        'no',
        'no disclosure found',
        'N/A',
        'New / Revised Element',
    ])
    pointsSheet.appendRow(['Score A:', '---', '100', '50', '0', '0', 'N/A', 'N/A']) // row 2: regular scoring scale
    pointsSheet.appendRow(['Score B:', '---', '0', '50', '100', '0', 'N/A', 'N/A']) // row 3: reversed scoring scale for Element.isReversedScoring
}

// Element is simple; we just HLOOKUP a cell in the Points sheet
// eslint-disable-next-line no-unused-vars
function elementScoreFormula(range, isReversedScoring) {
    let Cell = range.getA1Notation()
    const evalRow = isReversedScoring ? 3 : 2
    let formula = `=HLOOKUP(${Cell},Points!$B$1:$H$${evalRow},${evalRow},FALSE)`
    return formula
}

// Level Scoring needs an array of cells of the service columns
// will apply "N/A" / "---" logic or calculate AVERAGE()
// REGEX probably for validating that Element-Level results are numbers
// to decrypt, disect a 2020 Outcome Sheet
// TODO: simplify as `Template ${Literal}`

// eslint-disable-next-line no-unused-vars
function levelScoreFormula(serviceCells) {
    // start of lengthy formula

    // Guard Clause: "N/A"
    let formula = '=IF(AND('
    // inner body: iterate over cells
    for (let cell = 0; cell < serviceCells.length; cell++) {
        formula += 'REGEXMATCH(TEXT(' + serviceCells[cell] + ',"$0.00"),"N/A")'
        if (cell < serviceCells.length - 1) {
            formula += ','
        }
    }
    formula += '), "N/A",'

    // Guard Clause: "---" aka Element result still being "not selected"
    formula += ' IF(OR('
    // inner body: iterate over cells
    for (let cell = 0; cell < serviceCells.length; cell++) {
        formula = formula + serviceCells[cell] + '=' + '"---"' + ','
    }

    // otherwise =AVERAGE(cells)
    formula += '), "---", AVERAGE(' + serviceCells + ')))'

    return formula
}

// Fomula for Composite Scoring
// has additional Logic for implicit Mobile Services Composite
// see Notion/Scoring Documentaion for the Scoring Specs and explainer on Scoring Complexity
// https://www.notion.so/Scoring-6536ee492d654104812125d43fe9c98a
// disect any Outcome Sheet (compare Internet vs. Telco) to understand formula

/** the Composite Scoring Fomula will look like
 * =AVERAGE(
 *    AVERAGE(AVERAGE(PREPAID),AVERAGE(POSTPAID)), // this is the implicit Mobile Services Composite
 *    AVERAGE(BROADBAND)
 *    )
 */

// eslint-disable-next-line no-unused-vars
function aggregateScoreFormula(CompositeScoringEntity) {
    // console.log(`|--- DEBUG --- target Cells received ${CompositeScoringEntity.cells}`)

    let formula

    let levelCells = CompositeScoringEntity.cells
    let hasMobile = CompositeScoringEntity.hasMobile
    let subLevelCells
    let allLevelCells

    /** if has Mobile Services then we split the Service Level cells
     * in two arrays so that we can create two AVERAGE blocks
     */

    if (hasMobile) {
        subLevelCells = CompositeScoringEntity.sublevelScoresMobile.cells
        allLevelCells = [...subLevelCells, ...levelCells]
    } else {
        allLevelCells = levelCells
    }

    if (allLevelCells) {
        formula = '=IF(AND('

        for (let i = 0; i < allLevelCells.length; i++) {
            formula += allLevelCells[i] + '="N/A"'
            if (i < allLevelCells.length - 1) {
                formula += ','
            }
        }

        formula += '), "N/A"'

        formula += ', AVERAGE('

        /** if has Mobile Services then we inject an implicit
         *  MobileServices Composite into the Service Composite Formula */
        if (hasMobile) {
            formula += `AVERAGE(${subLevelCells}),`
        }

        // rest of the Service Level Cells
        formula += levelCells + '))'
    } else {
        formula = 'N/A'
    }
    return formula
}

// applies Formatting to Outcome Sheet Scoring Block
// accoring to Indicator Level Scoring Scopes (G vs F/P and G-Specifics)
// eslint-disable-next-line no-unused-vars
function applyCompositeScoringLogic(Indicator, compositeID, Cell, cellName, ScoreCells) {
    switch (compositeID) {
        case 'G': // G = Group Composite
            if (Indicator.scoringScope === 'full' || Indicator.scoringScope === 'company') {
                ScoreCells.CompositeScoreCells.cells.push(cellName)
                Cell.setFontWeight('bold')
            } else {
                Cell.setFontStyle('italic')
                Cell.setFontLine('line-through')
            }
            break

        case 'O': // O = OpCom Composite
            if (
                (Indicator.scoringScope === 'full' || Indicator.scoringScope === 'company') &&
                ScoreCells.companyScores.levelScoresOpCom.hasOpCom
            ) {
                ScoreCells.CompositeScoreCells.cells.push(cellName)
                Cell.setFontWeight('bold')
            } else {
                // Cell.setValue("N/A")
                Cell.setFontStyle('italic')
                Cell.setFontLine('line-through')
            }
            break

        case 'M': // M = Implicit Mobile Services Composite
        case 'S': // S = Service Level Composite
            if (Indicator.scoringScope === 'full' || Indicator.scoringScope === 'services') {
                ScoreCells.CompositeScoreCells.cells.push(cellName)
                Cell.setFontWeight('bold')
            } else {
                Cell.setFontStyle('italic')
                Cell.setFontLine('line-through')
            }
            break

        default:
            ScoreCells.CompositeScoreCells.cells.push(cellName)
            Cell.setFontWeight('bold')
            break
    }
    Cell.setNumberFormat('0.##')
    return Cell
}
