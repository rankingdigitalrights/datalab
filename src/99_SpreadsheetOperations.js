// --- Spreadsheet File-level connection helper function  --- //
/**
 * @function copyMasterSpreadsheet()
 * @function createSpreadsheet()
 * @function openSpreadsheetByID()
 * @function insertSheetIfNotExist()
 * @function moveHideSheetifExists() / @function moveSheetifExists()
 * @function moveSheetToPos()
 * @function importRangeFormula()
 * @function getSheetByName()
 * @function removeEmptySheet()
 * @function resizeSheet()
 * @function injectInputRows()
 * */

/* global
    Config, rootFolderID, doRepairsOnly, outputFolderName, createNewFolder, addNewStep
*/

// Connect by Spreadsheet name //
// Universal Method: Connect to Spreadsheet File and return Obj as open Spreadsheet

// Main Test Caller //

function mainTestConnectionByName() {
    var spreadsheetName = 'verizon test'
    createSpreadsheet(spreadsheetName, false)
}

function mainTestConnectionByID() {
    openSpreadsheetByID(spreadsheetID)
}

// Helper function esp. for Company Feedback
// Copies a Spreadsheet into a target Folder
// renames copy; assigns new File Owner and adds Editors
function copyMasterSpreadsheet(masterFileId, outputFolderId, outputFilename, makeDataOwner) {
    let MasterFile = DriveApp.getFileById(masterFileId)
    let outputFolder = DriveApp.getFolderById(outputFolderId)
    let newFile = MasterFile.makeCopy(outputFilename, outputFolder)
    if (makeDataOwner) {
        newFile.setOwner(Config.dataOwner)
        newFile.addEditors(Config.devs)
    }
    let SS = openSpreadsheetByID(newFile.getId())
    return SS
}

// TODO: refactor everywhere into two seperate functions:
// one to try to connect and return null if file does not exist
// one to create a new file
// --> separation of concerns AND explicit action where needed

function createSpreadsheet(spreadsheetName, doCreateNewFile) {
    let Spreadsheets = DriveApp.getFilesByName(spreadsheetName)

    let SS = null

    // if SS doesn't exist
    // --- and doCreateNewFile === true
    // --- create new SS
    // --- else return null
    // else
    // return existing SS

    if (!Spreadsheets.hasNext()) {
        console.log(spreadsheetName + ' does not exist!')

        if (doCreateNewFile) {
            console.log('--- --- START: creating ' + spreadsheetName + ' in ' + rootFolderID + '/' + outputFolderName)

            // TODO: add tests whether script (user?) can access folders
            let folderID = createNewFolder(rootFolderID, outputFolderName)

            let resource = {
                title: spreadsheetName,
                mimeType: MimeType.GOOGLE_SHEETS,
                parents: [
                    {
                        id: folderID,
                    },
                ],
            }

            // console.log(resource.parents.id)
            let fileJson = Drive.Files.insert(resource)

            let fileId = fileJson.id

            let File = DriveApp.getFileById(fileId)
            File.setOwner(Config.dataOwner)
            let path = printParentFolders(File)
            console.log('new Speadsheet fileID: ' + fileId)
            console.log('File Path: ' + path)
            SS = openSpreadsheetByID(fileId)
        } else {
            SS = null
            console.log(spreadsheetName + ' does not exist and NOT creating a new file')
        }
    } else {
        // Only do for first Spreadsheet element
        SS = Spreadsheets.next()
        console.log('File ' + SS.getName() + ' exists')
        console.log('locally connected to: ' + SS.getName())

        SS = SpreadsheetApp.open(SS)
    }
    // returns SS or null
    return SS
}

// connect by Spreadsheet ID //
// more accurate then by name //

function openSpreadsheetByID(ID) {
    let SS = SpreadsheetApp.openById(ID)
    console.log('|---- locally connected to: ' + SS.getName())
    return SS
}

// Helper Function to add a Sheet in a Spreadsheet
// can optionally overwrite a Sheet if it is already existing
// can be injected at sheetPos, otherwise appended at end of Spreadsheet

function insertSheetIfNotExist(SS, sheetName, overWriteSheet, sheetPos) {
    let position = sheetPos || SS.getNumSheets() + 1
    let Sheet = SS.getSheetByName(sheetName)
    if (!Sheet) {
        Sheet = SS.insertSheet(sheetName, position)
    } else {
        console.log('WARN: ' + 'Sheet for ' + sheetName + ' already exists ')

        if (overWriteSheet) {
            console.log('|--- Overwriting ' + sheetName)
        } else {
            if (doRepairsOnly || addNewStep) {
                console.log('Repairing / Updating / Extending ' + sheetName)
            } else {
                Sheet = null
                console.log('|--- Skipping ' + sheetName)
            }
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

/**
 * simplified helper to return the =IMPORTRANGE() formula as a String
 * @param {*} url
 * @param {*} range (can be named range or "!A1:D5";
 *      include ! in payload as namedRange does not need "!")
 * @returns {String}
 */
function importRangeFormula(url, range) {
    return `=IMPORTRANGE("${url}","${range}")`
}

// Sheets have unique Names, so no iteration needed
function getSheetByName(SS, Sheetname) {
    let Sheet
    if (!SS.getSheetByName(Sheetname)) {
        Sheet = null
        console.log('Sheet ' + Sheetname + ' not found.')
    } else {
        Sheet = SS.getSheetByName(Sheetname)
    }
    return Sheet
}

// Helper to remove the always existing first "Sheet1"
function removeEmptySheet(SS) {
    let emptySheet = SS.getSheetByName('Sheet1')

    if (emptySheet) {
        SS.deleteSheet(emptySheet)
    }
}

// esp. for Data Store
// appends n empty rows so that Data Store appendRow
// isn't slowed down (default Sheet starts with 1000 rows)
// and beyond that each row is added row-by-row --> super slow

function resizeSheet(Sheet, newRows) {
    let oldRows = Sheet.getMaxRows()
    let rowDiff = newRows - oldRows
    if (oldRows < newRows) {
        Sheet.insertRows(1, rowDiff)
    }
}

// used for 19_StepInjector
// can inject arbitrary content at row x

function injectInputRows(Sheet, position, nrOfRows, contentWidth, rowOffset, rowLabel, linkedRange, stepcolor) {
    Sheet.insertRows(position, nrOfRows)
    Sheet.getRange(position + rowOffset, 1, 1, 1)
        .setValue(rowLabel)
        .setBackground(stepcolor)
        .setFontWeight('bold')
        .setFontSize(11)
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle')

    Sheet.getRange(position + rowOffset, 2, 1, contentWidth)
        .merge()
        .setValue(`=${linkedRange}`)
}
