// --- File-level connection helper function  --- //

/* global
    rootFolderID,
    outputFolderName,
    assignFolderEditors,
    assignFolderOwner,
    assignFileEditors,
    assignFileOwner,
    createNewFolder,
    printParentFolders
*/

// Connect by Spreadsheet name //
// Universal Method: Connect to Spreadsheet File and return Obj as open Spreadsheet

// Main Test Caller //

function mainTestConnectionByName() {
    var spreadsheetName = "verizon test"
    createSpreadsheet(spreadsheetName, false)
}

function mainTestConnectionByID() {
    openSpreadsheetByID(spreadsheetID)
}

// TODO: refactor everywhere into two seperate functions:
// one to try to connect and return null if file does not exist
// one to create a new file
// --> separation of concerns AND explicit action where needed

function createSpreadsheet(spreadsheetName, createNewFile) {

    let Spreadsheets = DriveApp.getFilesByName(spreadsheetName)

    let SS = null

    // if SS doesn't exist
    // --- and createNewFile === true
    // --- create new SS
    // --- else return null
    // else
    // if SS exists --> return SS

    if (!Spreadsheets.hasNext()) {

        Logger.log(spreadsheetName + " does not exist!")

        if (createNewFile) {
            Logger.log("--- --- START: creating " + spreadsheetName + " in " + rootFolderID + "/" + outputFolderName)

            // TODO: add tests whether script (user?) can access folders
            let folderID = createNewFolder(rootFolderID, outputFolderName)

            let resource = {
                title: spreadsheetName,
                mimeType: MimeType.GOOGLE_SHEETS,
                parents: [{
                    id: folderID
                }]
            }

            // Logger.log(resource.parents.id)
            let fileJson = Drive.Files.insert(resource)

            let fileId = fileJson.id

            let File = DriveApp.getFileById(fileId)
            File.setOwner("data@rankingdigitalrights.org")
            let path = printParentFolders(File)
            Logger.log("new Speadsheet fileID: " + fileId)
            Logger.log("File Path: " + path)
            SS = openSpreadsheetByID(fileId)

        } else {
            SS = null
            Logger.log(spreadsheetName + " does not exist and NOT creating a new file")
        }

    } else {

        // Only do for first Spreadsheet element
        SS = Spreadsheets.next()
        Logger.log("File " + SS.getName() + " exists")
        Logger.log("locally connected to: " + SS.getName())

        SS = SpreadsheetApp.open(SS)
    }
    // returns SS or null
    return SS
}

// connect by Spreadsheet ID //
// more accurate then by name //

function openSpreadsheetByID(ID) {

    let SS = SpreadsheetApp.openById(ID)
    Logger.log("locally connected to: " + SS.getName())
    return SS

}


// Helper Function to overwrite Sheet in Spreadsheet if it is already existing

function insertSheetIfNotExist(SS, SheetName, updateSheet) {
    let Sheet
    if (!SS.getSheetByName(SheetName)) {
        Sheet = SS.insertSheet(SheetName)
    } else {
        if (updateSheet) {
            Sheet = SS.getSheetByName(SheetName)
        } else {
            Sheet = null
            Logger.log("WARN: " + "Sheet for " + SheetName + " already exists ")
        }
    }
    return Sheet
}

function moveHideSheetifExists(SS, Sheet, posInt) {

    if (!posInt) {
        posInt = 1
    }

    if (Sheet !== null) {
        moveSheetToPos(SS, Sheet, posInt)
        Sheet.hideSheet()
    }
}

function moveSheetifExists(SS, Sheet, posInt) {

    if (!posInt) {
        posInt = 1
    }

    if (Sheet !== null) {
        moveSheetToPos(SS, Sheet, posInt)
    }
}

function moveSheetToPos(SS, Sheet, posInt) {
    SS.setActiveSheet(Sheet)
    SS.moveActiveSheet(posInt)
}

function importRangeFormula(url, range, integrateOutputs) {

    let formula
    if (integrateOutputs) {
        formula = "=" + range
    } else {
        formula = "=IMPORTRANGE(\"" + url + "\",\"" + range + "\")"
        formula = formula.toString()
    }
    return formula
}

// Sheets have unique Names, so no iteration
function getSheetByName(SS, Sheetname) {
    let Sheet
    if (!SS.getSheetByName(Sheetname)) {
        Sheet = null
        Logger.log("Sheet " + Sheetname + " not found.")
    } else {
        Sheet = SS.getSheetByName(Sheetname)
    }
    return Sheet
}

function removeEmptySheet(SS) {
    let emptySheet = SS.getSheetByName("Sheet1")

    if (emptySheet) {
        SS.deleteSheet(emptySheet)
    }
}

function resizeSheet(Sheet, newRows) {
    let oldRows = Sheet.getMaxRows()
    let rowDiff = newRows - oldRows
    if (oldRows < newRows) {
        Sheet.insertRows(1, rowDiff)
    }
}

function isValueInColumn(SS, columnNr, mode, value) {
    let Range, Sheet, lastRow
    let isInColumn = false
    Sheet = SS.getSheetByName(mode)
    lastRow = Sheet.getLastRow()
    Logger.log("lastRow: " + lastRow)
    if (lastRow >= 1) {
        Range = Sheet.getRange(1, columnNr, lastRow)
        isInColumn = Range.getValues()
            .flat(2) // unnest 2D array to flat 1D array
            .includes(value)
    }
    return isInColumn
}