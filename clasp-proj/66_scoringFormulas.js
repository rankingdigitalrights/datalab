function elementScoreFormula(range) {
    // proof of concept
    var cell = range.getA1Notation()
    /* legacy Formula */
    // var formula = '=IF(' + cell + '=Points!$B1,Points!$B2,IF(' + cell + '=Points!$C1,Points!$C2,IF(' + cell + '=Points!$D1,Points!$D2,IF(' + cell + '=Points!$E1,Points!$E2,IF(' + cell + '=Points!$F1,Points!$F2,IF(' + cell + '=Points!$G1, Points!$G2,"checkx"))))))'
    var formula = '=HLOOKUP(' + cell + 'B138,Points!$B$1:$G$2,2,FALSE)'
    return formula
}

function levelScoreFormula(serviceCells) {
    var formula = '=IF(AND('
    for (var cell = 0; cell < serviceCells.length; cell++) {
        formula = formula + serviceCells[cell] + '=' + '"exclude"' + ",";
    }
    formula = formula + '), "N/A", IF(OR('

    for (cell = 0; cell < serviceCells.length; cell++) {
        formula = formula + serviceCells[cell] + "=" + '"---"' + ",";
    }

    formula = formula + '), "---", AVERAGE(' + serviceCells + ')))'
    return formula
}

function compositeScoreFormula(componentCells) {
    // <> = NE = notEqual(A,B) -> TRUE -> A!=B
    // =IF(AND(B29="N/A",C29="N/A"),"N/A",AVERAGE(IF(B29<>"N/A",B29),IF(C29<>"N/A",C29)))

    var formula = '=AVERAGE('
    formula = formula + componentCells
    formula = formula + ')'
    return formula
}

function indicatorScoreFormula(indicatorAverageElements) {

    // =IF(AND(B31="N/A",F31="N/A"),"N/A",SUM(IF(B31<>"N/A",B31*LevelsI!$B$2),IF(F31<>"N/A",F31*LevelsI!$D$2)))

    var formula = '=AVERAGE('
    // formula = formula + indicatorAverageElements


    for (var cell = 0; cell < indicatorAverageElements.length; cell++) {
        formula = formula + indicatorAverageElements[cell]
        if (cell < indicatorAverageElements.length - 1) {formula += ','}
        // formula +=  '=' + '"exclude"' + ",";
        
    }

    formula = formula + ')'
    return formula
}



function checkScoringLogic(indicator, scoringComponent, cell, cellName, elementsArray) {

    var thisCell = cell
    switch (scoringComponent) {

        case "A":
            if (indicator.scoringScope === "full" | indicator.scoringScope === "company") {
                elementsArray.push(cellName)
                thisCell.setFontWeight('bold')
            } else {
                thisCell.setFontStyle('italic')
            }
            break

        case "B":
            if (indicator.scoringScope === "full" | indicator.scoringScope === "services") {
                elementsArray.push(cellName)
                thisCell.setFontWeight('bold')
            } else {
                thisCell.setFontStyle('italic')
            }
            break

        default:
            elementsArray.push(cellName)
            thisCell.setFontWeight('bold')
            break
    }
    thisCell.setNumberFormat("0.##")
    return thisCell
}
