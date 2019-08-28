// --- connection helper function  --- //

// Connect by Spreadsheet name //
// Universal Method: Connect to Spreadsheet File and return Obj as open Spreadsheet

function connectToSpreadsheetByName(Name) {
  var Spreadsheets = DriveApp.getFilesByName(Name);
  if (!Spreadsheets.hasNext()) {
    Logger.log("Nothing here. Check Spreadsheet Name! Creating a new one.");
    Spreadsheets = SpreadsheetApp.create(Name);
    return Spreadsheets;
  } else {
    // while (Spreadsheet.hasNext()) {
    // Nope. Only do for first Spreadsheet element
    var thisSpreadsheet = Spreadsheets.next();
    Logger.log("locally connected to: " + thisSpreadsheet.getName());
    Logger.log("it's a " + thisSpreadsheet.getMimeType());
    return SpreadsheetApp.open(thisSpreadsheet);
    // }
  }
}

// connect by Spreadsheet ID //
// more accurate then by name //

function connectToSpreadsheetByID(ID) {
  var thisSpreadsheet = SpreadsheetApp.openById(ID);
  Logger.log("locally connected to: " + thisSpreadsheet.getName());
  Logger.log("it's a " + thisSpreadsheet.getMimeType());
  return SpreadsheetApp.open(thisSpreadsheet);

}


// Help Function to overwrite Sheet in Spreadsheet if it is already existing

function insertSheetIfNotExist(Spreadsheet, SheetName) {
  var Sheet;
  if(!Spreadsheet.getSheetByName(SheetName)) {
      Sheet = Spreadsheet.insertSheet(SheetName);
    } else {
      Sheet = Spreadsheet.getSheetByName(SheetName);
    };
  return Sheet;
}

// Main Test Caller //

function mainTestConnectionByName() {
    connectToSpreadsheetByName(spreadsheetName);
  }

function mainTestConnectionByID() {
    connectToSpreadsheetByID(spreadsheetID);
}
