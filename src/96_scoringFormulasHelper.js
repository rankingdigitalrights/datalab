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
    pointsSheet.appendRow(['Score A:', '---', '100', '50', '0', '0', 'N/A', 'N/A'])
    pointsSheet.appendRow(['Score B:', '---', '0', '50', '100', '0', 'N/A', 'N/A'])
}

// eslint-disable-next-line no-unused-vars
function getISOtimeAsString() {
    return new Date().toISOString().substr(0, 16).split('T').join(': ')
}

// eslint-disable-next-line no-unused-vars
function elementScoreFormula(range, isReversedScoring) {
    let Cell = range.getA1Notation()
    const evalRow = isReversedScoring ? 3 : 2
    let formula = `=HLOOKUP(${Cell},Points!$B$1:$H$${evalRow},${evalRow},FALSE)`
    return formula
}

// eslint-disable-next-line no-unused-vars
function levelScoreFormula(serviceCells) {
    let formula = '=IF(AND('
    for (let cell = 0; cell < serviceCells.length; cell++) {
        formula += 'REGEXMATCH(TEXT(' + serviceCells[cell] + ',"$0.00"),"N/A")'
        if (cell < serviceCells.length - 1) {
            formula += ','
        }
    }

    formula += '), "N/A",'

    formula += ' IF(OR('

    for (let cell = 0; cell < serviceCells.length; cell++) {
        formula = formula + serviceCells[cell] + '=' + '"---"' + ','
    }

    formula += '), "---", AVERAGE(' + serviceCells + ')))'

    // Pilot
    // formula += ")"

    return formula
}

// eslint-disable-next-line no-unused-vars
function aggregateScoreFormula(CompositeScoringEntity) {
    // console.log(`|--- DEBUG --- target Cells received ${CompositeScoringEntity.cells}`)

    let formula

    let levelCells = CompositeScoringEntity.cells
    let hasMobile = CompositeScoringEntity.hasMobile
    let subLevelCells
    let allLevelCells

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

        if (hasMobile) {
            formula += `AVERAGE(${subLevelCells}),`
        }

        formula += levelCells + '))'
    } else {
        formula = 'N/A'
    }
    return formula
}

// eslint-disable-next-line no-unused-vars
function applyCompositeScoringLogic(Indicator, compositeID, Cell, cellName, ScoreCells) {
    switch (compositeID) {
        case 'G':
            if (Indicator.scoringScope === 'full' || Indicator.scoringScope === 'company') {
                ScoreCells.CompositeScoreCells.cells.push(cellName)
                Cell.setFontWeight('bold')
            } else {
                Cell.setFontStyle('italic')
                Cell.setFontLine('line-through')
            }
            break

        case 'O':
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

        case 'M':
            if (Indicator.scoringScope === 'full' || Indicator.scoringScope === 'services') {
                ScoreCells.CompositeScoreCells.cells.push(cellName)
                Cell.setFontWeight('bold')
            } else {
                Cell.setFontStyle('italic')
                Cell.setFontLine('line-through')
            }
            break

        case 'S':
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
