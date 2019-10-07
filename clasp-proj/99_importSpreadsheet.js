// --- connection helper function  --- //

// Connect by Spreadsheet name //
// Universal Method: Connect to Spreadsheet File and return Obj as open Spreadsheet

// Main Test Caller //

function mainTestConnectionByName() {
  var spreadsheetName = "verizon test"
  connectToSpreadsheetByName(spreadsheetName);
}

function mainTestConnectionByID() {
  connectToSpreadsheetByID(spreadsheetID);
}

function connectToSpreadsheetByName(spreadsheetName) {
  var Spreadsheets = DriveApp.getFilesByName(spreadsheetName)
  var Spreadsheet
  if (!Spreadsheets.hasNext()) {
    Logger.log("Nothing here. Check Spreadsheet Name! Creating a new one.")
    Logger.log("received: " + spreadsheetName)

    // var folderName = 'SpreadsheetCreationTEST'
    var folderID = createFolderIfNotExist(parentFolderID, folderName)

    var resource = {
      title: spreadsheetName,
      mimeType: MimeType.GOOGLE_SHEETS,
      parents: [{
        id: folderID
      }]
    }

    Logger.log(resource.parents.id)
    var fileJson = Drive.Files.insert(resource)

    var fileId = fileJson.id
    Logger.log("new Speadsheet fileID: " + fileId)
    Spreadsheet = connectToSpreadsheetByID(fileId)

    return Spreadsheet

  } else {

    // while (Spreadsheet.hasNext()) {
    // Nope. Only do for first Spreadsheet element
    var thisSpreadsheet = Spreadsheets.next();
    Logger.log("File " + thisSpreadsheet.getName() + " exists")
    Logger.log("locally connected to: " + thisSpreadsheet.getName());

    return SpreadsheetApp.open(thisSpreadsheet);
    // }
  }
}

// connect by Spreadsheet ID //
// more accurate then by name //

function connectToSpreadsheetByID(ID) {
  var thisSpreadsheet = SpreadsheetApp.openById(ID);
  Logger.log("locally connected to: " + thisSpreadsheet.getName());
  return thisSpreadsheet;

}


// Help Function to overwrite Sheet in Spreadsheet if it is already existing

function insertSheetIfNotExist(Spreadsheet, SheetName, updateSheet) {
  var Sheet;
  if (!Spreadsheet.getSheetByName(SheetName)) {
    Sheet = Spreadsheet.insertSheet(SheetName);
  } else {
    if (updateSheet) {
      Sheet = Spreadsheet.getSheetByName(SheetName)
    } else {
      Sheet = null
      Logger.log("Sheet already exists")
    }
  }
  return Sheet;
}


function addFileIDtoControl(mode, company, fileID, Controlsheet) {

  var spreadsheet = connectToSpreadsheetByID(Controlsheet)
  var sheet = insertSheetIfNotExist(spreadsheet, mode, true)
  var formula = '=HYPERLINK(CONCAT("https://docs.google.com/spreadsheets/d/",INDIRECT(ADDRESS(ROW(),COLUMN()-1))),INDIRECT(ADDRESS(ROW(),COLUMN()-2)))'
  sheet.appendRow([mode, company, fileID, formula])
  Logger.log("Entry added to Control")

}

function importRange(url, range) {
  var formula = '=IMPORTRANGE("' + url + '","' + range + '")'
  formula = formula.toString()
  return formula
}
