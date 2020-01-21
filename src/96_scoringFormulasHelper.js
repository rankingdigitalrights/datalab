function getISOtimeAsString() {
    return new Date().toISOString()
}

function elementScoreFormula(range) {
    // proof of concept
    var cell = range.getA1Notation()
    /* legacy Formula */
    // var formula = '=IF(' + cell + '=Points!$B1,Points!$B2,IF(' + cell + '=Points!$C1,Points!$C2,IF(' + cell + '=Points!$D1,Points!$D2,IF(' + cell + '=Points!$E1,Points!$E2,IF(' + cell + '=Points!$F1,Points!$F2,IF(' + cell + '=Points!$G1, Points!$G2,"checkx"))))))'
    var formula = "=HLOOKUP(" + cell + ",Points!$B$1:$H$2,2,FALSE)"
    return formula
}

function levelScoreFormula(serviceCells) {

    var formula = "=IF(AND("
    for (var cell = 0; cell < serviceCells.length; cell++) {
        formula = formula + serviceCells[cell] + "=" + "\"exclude\"" + ","
    }

    formula += "), \"N/A\", IF(OR("

    for (cell = 0; cell < serviceCells.length; cell++) {
        formula = formula + serviceCells[cell] + "=" + "\"---\"" + ","
    }

    formula = formula + "), \"---\", AVERAGE(" + serviceCells + ")))"

    return formula
}

function aggregateScoreFormula(cells) {

    var formula = "=IF(NOT(AND("
    var cell

    for (cell = 0; cell < cells.length; cell++) {
        formula += cells[cell] + "=\"N/A\""
        if (cell < cells.length - 1) {
            formula += ","
        }
    }

    formula += ")),"
    formula += "AVERAGE(" + cells + "),"
    formula += "\"N/A\")"

    return formula
}

function checkScoringLogic(indicator, scoringComponent, cell, cellName, elementsArray) {

    var thisCell = cell
    switch (scoringComponent) {

        case "A":
            if (indicator.scoringScope === "full" | indicator.scoringScope === "company") {
                elementsArray.push(cellName)
                thisCell.setFontWeight("bold")
            } else {
                thisCell.setFontStyle("italic")
            }
            break

        case "B":
            if (indicator.scoringScope === "full" | indicator.scoringScope === "services") {
                elementsArray.push(cellName)
                thisCell.setFontWeight("bold")
            } else {
                thisCell.setFontStyle("italic")
            }
            break

        default:
            elementsArray.push(cellName)
            thisCell.setFontWeight("bold")
            break
    }
    thisCell.setNumberFormat("0.##")
    return thisCell
}