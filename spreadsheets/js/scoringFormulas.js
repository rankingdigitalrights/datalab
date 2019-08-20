function elementScore(range) {
    // proof of concept
    var cell = range.getA1Notation();
    var formula = '=IF(' + cell + '=Points!$B1,Points!$B2,IF(' + cell + '=Points!$C1,Points!$C2,IF(' + cell + '=Points!$D1,Points!$D2,IF(' + cell + '=Points!$E1,Points!$E2,IF(' + cell + '=Points!$F1,Points!$F2,IF(' + cell + '=Points!$G1, Points!$G2,"checkx"))))))'
    return formula;
}

function serviceScore(serviceCells) {
    var formula = '=IF(AND('
    for(cell = 0; cell < serviceCells.length; cell++) {
        formula = formula +  serviceCells[cell] + '=' + '"exclude"' + ",";    
    }
    formula = formula +  '), "N/A", IF(OR(';
    
    for(cell = 0; cell < serviceCells.length; cell++) {
        formula = formula +  serviceCells[cell] + "=" + '"---"' + ",";    
    }

    formula = formula +  '), "---", AVERAGE(' + serviceCells + ')))';
    return formula;
}
