function fillPointsSheet(pointsSheet) {
    pointsSheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"])
    pointsSheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude (N/A)"])
    pointsSheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude (N/A)"])
}


function getISOtimeAsString() {
    return new Date().toISOString()
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


function aggregateScoreFormulaServices(cells, Company) {

    let cell

    let formula = "=IF(AND("

    for (cell = 0; cell < cells.length; cell++) {
        formula += cells[cell] + "=\"N/A\""
        if (cell < cells.length - 1) {
            formula += ","
        }
    }

    formula += "), \"N/A\""

    formula += ",IF(AND("

    formula += "XOR("

    for (cell = 0; cell < cells.length; cell++) {
        formula += cells[cell] + "=\"N/A\""
        if (cell < cells.length - 1) {
            formula += ","
        }
    }

    formula += "),"

    formula += ")),\"N/A\""

    formula += ", AVERAGE("

    for (let i = 0; i < cells.length; i++) {
        if (Company.services[i].subtype == "prepaid") {
            formula = formula + "AVERAGE(" + cells[i] + "," + cells[i + 1] + ")"
        } else if (Company.services[i].subtype == "postpaid") {} else {
            formula = formula + cells[i]
        }

        if (i != cells.length - 1 && Company.services[i].subtype != "prepaid") {
            formula = formula + ","
        }


    }

    formula += ")))"

    return formula
}

function checkScoringLogic(indicator, scoringComponent, cell, cellName, elementsArray) {

    let thisCell = cell
    switch (scoringComponent) {

        case "A":
            if (indicator.scoringScope === "full" || indicator.scoringScope === "company") {
                elementsArray.push(cellName)
                thisCell.setFontWeight("bold")
            } else {
                thisCell.setFontStyle("italic")
            }
            break

        case "B":
            if (indicator.scoringScope === "full" || indicator.scoringScope === "services") {
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
