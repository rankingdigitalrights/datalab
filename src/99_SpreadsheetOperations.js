// --- connection helper function  --- //

// Connect by Spreadsheet name //
// Universal Method: Connect to Spreadsheet File and return Obj as open Spreadsheet

// Main Test Caller //

function mainTestConnectionByName() {
    var spreadsheetName = "verizon test"
    connectToSpreadsheetByName(spreadsheetName, false)
}

function mainTestConnectionByID() {
    connectToSpreadsheetByID(spreadsheetID)
}

// TODO: refactor everywhere into two seperate functions:
// one to try to connect and return null if file does not exist
// one to create a new file
// --> separation of concerns AND explicit action where needed

function connectToSpreadsheetByName(spreadsheetName, createNewFile) {

    var Spreadsheets = DriveApp.getFilesByName(spreadsheetName)

    var Spreadsheet = null

    // if SS doesn't exist
    // --- and createNewFile === true
    // --- create new SS
    // --- else return null
    // else
    // if SS exists --> return SS

    if (!Spreadsheets.hasNext()) {

        Logger.log(spreadsheetName + " does not exist!")

        if (createNewFile) {
            Logger.log("Creating " + spreadsheetName)

            var folderID = createFolderIfNotExist(rootFolderID, outputFolderName)

            var resource = {
                title: spreadsheetName,
                mimeType: MimeType.GOOGLE_SHEETS,
                parents: [{
                    id: folderID
                }]
            }

            // Logger.log(resource.parents.id)
            var fileJson = Drive.Files.insert(resource)

            var fileId = fileJson.id
            Logger.log("new Speadsheet fileID: " + fileId)
            Spreadsheet = connectToSpreadsheetByID(fileId)

        } else {
            Spreadsheet = null
        }

    } else {

        // while (Spreadsheet.hasNext()) { }
        // Nope. Only do for first Spreadsheet element
        var thisSpreadsheet = Spreadsheets.next()
        Logger.log("File " + thisSpreadsheet.getName() + " exists")
        Logger.log("locally connected to: " + thisSpreadsheet.getName())

        Spreadsheet = SpreadsheetApp.open(thisSpreadsheet)
    }
    // returns SS or null
    return Spreadsheet
}

// connect by Spreadsheet ID //
// more accurate then by name //

function connectToSpreadsheetByID(ID) {

    var thisSpreadsheet = SpreadsheetApp.openById(ID)
    Logger.log("locally connected to: " + thisSpreadsheet.getName())
    return thisSpreadsheet

}


// Help Function to overwrite Sheet in Spreadsheet if it is already existing

function insertSheetIfNotExist(Spreadsheet, SheetName, updateSheet) {
    var Sheet
    if (!Spreadsheet.getSheetByName(SheetName)) {
        Sheet = Spreadsheet.insertSheet(SheetName)
    } else {
        if (updateSheet) {
            Sheet = Spreadsheet.getSheetByName(SheetName)
        } else {
            Sheet = null
            Logger.log("Sheet already exists")
        }
    }
    return Sheet
}

function moveHideSheetifExists(Spreadsheet, Sheet, posInt) {

    if (!posInt) {
        posInt = 1
    }

    if (Sheet !== null) {
        moveSheetToPos(Spreadsheet, Sheet, posInt)
        Sheet.hideSheet()
    }
}

function moveSheetifExists(Spreadsheet, Sheet, posInt) {

    if (!posInt) {
        posInt = 1
    }

    if (Sheet !== null) {
        moveSheetToPos(Spreadsheet, Sheet, posInt)
    }
}



function moveSheetToPos(Spreadsheet, Sheet, posInt) {
    Spreadsheet.setActiveSheet(Sheet)
    Spreadsheet.moveActiveSheet(posInt)
}

function addFileIDtoControl(mode, companyShortName, fileID, controlSpreadsheetID) {

    var spreadsheet = connectToSpreadsheetByID(controlSpreadsheetID)
    var sheet = insertSheetIfNotExist(spreadsheet, mode, true)
    var formula = "=HYPERLINK(CONCAT(\"https://docs.google.com/spreadsheets/d/\",INDIRECT(ADDRESS(ROW(),COLUMN()-1))),INDIRECT(ADDRESS(ROW(),COLUMN()-2)))"
    sheet.appendRow([mode, companyShortName, fileID, formula])
    Logger.log("created" + fileID + "; added to Control")

}

function importRange(url, range, integrateOutputs) {

    var formula

    if (integrateOutputs) {
        formula = "=" + range
    } else {
        formula = "=IMPORTRANGE(\"" + url + "\",\"" + range + "\")"
        formula = formula.toString()
    }
    return formula
}

function getSheetByName(Spreadsheet, Sheetname) {
    var Sheet
    if (!Spreadsheet.getSheetByName(Sheetname)) {
        Sheet = null
        Logger.log("Sheet " + Sheetname + " not found.")
    } else {
        Sheet = Spreadsheet.getSheetByName(Sheetname)
    }
    return Sheet
}

function removeEmptySheet(SS) {
    var emptySheet = SS.getSheetByName("Sheet1")

    if (emptySheet) {
        SS.deleteSheet(emptySheet)
    }
}