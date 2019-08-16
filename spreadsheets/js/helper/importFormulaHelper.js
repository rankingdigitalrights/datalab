var compObj = {
    "company": "Facebook",
    "prevURL": "1G2_5LLS26qLbHodMg3ABa-B-9etzSBDRK_pxR9y4jXk",
    "tab": "FacebookOutcome"
}

function insertSheetIfNotExist(Spreadsheet, SheetName) {
    var Sheet;
    if (!Spreadsheet.getSheetByName(SheetName)) {
        Sheet = Spreadsheet.insertSheet(SheetName);
    } else {
        Sheet = Spreadsheet.getSheetByName(SheetName);
    };
    return Sheet;
}

function addPrevYearOutcomeSheet() {
    var Spreadsheet = SpreadsheetApp.openById("1ethBvdQaqwwUuiIBs67_tO18IS7gPC1KPo15JgCtL14");
    Logger.log(Spreadsheet.getName());
    var thisSheet = insertSheetIfNotExist(Spreadsheet, "Formula");


    var externalFormula = '=IMPORTRANGE("' + compObj.prevURL + '","' + compObj.tab + '!' + 'A:Z' + '")';
    var internalFormula = '=Formula!A1';

    var open = thisSheet.activate();
    var cell = open.getActiveCell();
    cell.setValue(externalFormula.toString());

    var nextSheet = insertSheetIfNotExist(Spreadsheet, "ImportFormula");
    open = nextSheet.activate();
    cell = open.getActiveCell();
    cell.setValue(internalFormula);
}
