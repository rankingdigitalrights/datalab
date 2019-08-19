function elementScore(range) {
    // proof of concept
    var cell = range.getA1Notation();
    var formula = '=IF(' + cell + '=Validation!$B1,Validation!$B2,IF(' + cell + '=Validation!$C1,Validation!$C2,IF(' + cell + '=Validation!$D1,Validation!$D2,IF(' + cell + '=Validation!$E1,Validation!$E2,IF(' + cell + '=Validation!$F1,Validation!$F2,IF(' + cell + '=Validation!$G1, Validation!$G2,"checkx"))))))'
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
