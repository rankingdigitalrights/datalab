function fillPointsSheet(pointsSheet) {
    pointsSheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"])
    pointsSheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude (N/A)"])
    pointsSheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude (N/A)"])
}


function getISOtimeAsString() {
    return new Date().toISOString().substr(0, 16).split("T").join(": ")
}

function elementScoreFormula(range) {
    let cell = range.getA1Notation()
    /* legacy Formula */
    // let formula = '=IF(' + cell + '=Points!$B1,Points!$B2,IF(' + cell + '=Points!$C1,Points!$C2,IF(' + cell + '=Points!$D1,Points!$D2,IF(' + cell + '=Points!$E1,Points!$E2,IF(' + cell + '=Points!$F1,Points!$F2,IF(' + cell + '=Points!$G1, Points!$G2,"checkx"))))))'
    let formula = "=HLOOKUP(" + cell + ",Points!$B$1:$H$2,2,FALSE)"
    return formula
}

function levelScoreFormula(serviceCells) {

    let formula = "=IF(AND("
    for (let cell = 0; cell < serviceCells.length; cell++) {
        formula += serviceCells[cell] + "=" + "\"exclude (N/A)\""
        if (cell < serviceCells.length - 1) {
            formula += ","
        }
    }

    formula += "), \"N/A\","

    formula += " IF(OR("

    for (cell = 0; cell < serviceCells.length; cell++) {
        formula = formula + serviceCells[cell] + "=" + "\"---\"" + ","
    }

    formula += "), \"---\", AVERAGE(" + serviceCells + ")))"

    // Pilot
    // formula += ")"

    return formula
}

function aggregateScoreFormula(cells) {

    console.log(`|--- DEBUG --- target Cells received ${cells}`)

    let cell

    let formula = "=IF(AND("

    for (cell = 0; cell < cells.length; cell++) {
        formula += cells[cell] + "=\"N/A\""
        if (cell < cells.length - 1) {
            formula += ","
        }
    }

    formula += "), \"N/A\""

    formula += ", AVERAGE(" + cells + "))"

    // Pilot
    // formula += ")"

    return formula
}

function applyCompositeScoringLogic(indicator, scoringComponent, Cell, cellName, CompositeScoreCells) {

    switch (scoringComponent) {

        case "C":
            if (indicator.scoringScope === "full" || indicator.scoringScope === "company") {
                CompositeScoreCells.push(cellName)
                Cell.setFontWeight("bold")
            } else {
                Cell.setFontStyle("italic")
                Cell.setFontLine("line-through")
            }
            break

        case "M":
            if (indicator.scoringScope === "full" || indicator.scoringScope === "services") {
                CompositeScoreCells.push(cellName)
                Cell.setFontWeight("bold")
            } else {
                Cell.setFontStyle("italic")
                Cell.setFontLine("line-through")
            }
            break

        case "S":
            if (indicator.scoringScope === "full" || indicator.scoringScope === "services") {
                CompositeScoreCells.push(cellName)
                Cell.setFontWeight("bold")
            } else {
                Cell.setFontStyle("italic")
                Cell.setFontLine("line-through")
            }
            break

        default:
            CompositeScoreCells.push(cellName)
            Cell.setFontWeight("bold")
            break
    }
    Cell.setNumberFormat("0.##")
    return Cell
}
