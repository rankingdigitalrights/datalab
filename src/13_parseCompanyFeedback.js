// importrange formula to import feedback from Feedback Sheet

function checkFeedbackFormula(feedbackSheetName, indLabel) {
    let In
    let formula = '=VLOOKUP("G1", CompanyFeedback,2,TRUE)'
}


function importFeedbackFormula(feedbackSheetName, indLabel) {
    let In
    let formula = '=IMPORTRANGE("' + feedbackSheetName
}


// Backend Logic would be like this:

/*
function companyHasFeedBack(SS, indLabel) {
    let sheetName = Config.compFeedbackSheetName
    let indExists = isValueInColumn(SS, sheetName, 1, indLabel)
    let indFeedbackExists = indHasFeedback()
    let indFeedback = indReadFeedback()
    // TODO: Logic
}
*/
