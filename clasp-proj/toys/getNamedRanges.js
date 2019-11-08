function getNamedRanges2 (spreadsheetId) {
    var ss = SpreadsheetApp.openById(spreadsheetId);
    Logger.log(ss.getName())

    var namedRanges = ss.getSheets()[5].getNamedRanges();

  namedRanges.forEach(function(range) {
    Logger.log(range.getName() + ": " + range.getRange().getA1Notation())
  })
  
    return namedRanges
}

function mainGetNamedRangesJSON() {
    var spreadsheetId = "1eRzRqGy_baoheL8uxuh2fsMNuXicXAqOzvoLDlS6-Ak";
    var result = getNamedRanges2(spreadsheetId);
    Logger.log(result.toString());
}