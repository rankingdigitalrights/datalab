function getNamedRanges2(spreadsheetId) {
    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheetIdToName = {};
    ss.getSheets().forEach(function(e) {
        sheetIdToName[e.getSheetId()] = e.getSheetName();
    });
    var result = {};
  
    Sheets.Spreadsheets.get(spreadsheetId, {fields: "namedRanges"})
        .namedRanges.forEach(function(e) {
            var sheetName = sheetIdToName[e.range.sheetId.toString()];
            var a1notation = ss.getSheetByName(sheetName).getRange(
                e.range.startRowIndex + 1,
                e.range.startColumnIndex + 1,
                e.range.endRowIndex - e.range.startRowIndex,
                e.range.endColumnIndex - e.range.startColumnIndex
            ).getA1Notation();
            result[e.name] = sheetName + "!" + a1notation;
        });
    return result;
}

function mainGetNamedRangesJSON() {
    var spreadsheetId = spreadsheetID;
    var result = getNamedRanges2(spreadsheetId);
    Logger.log(JSON.stringify(result));
}