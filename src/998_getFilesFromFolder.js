function mainGetFiles() {
    var folder = "2019 Pilot Data Store"
    var sheet = "S04"
    getFilesFromFolder(folder, sheet)
}

function getFilesFromFolder(folder, sheet) {

    var Folder = DriveApp.getFoldersByName(folder).next()
    Logger.log(Folder.getName())

    var File, SS, Sheet
    var thisCompany

    var spreadsheets = Folder.getFilesByType("application/vnd.google-apps.ritz")
    // for each Spreadsheet of this subfolder
    while (spreadsheets.hasNext()) {
        // enter Spreadsheet
        File = spreadsheets.next()
        // get Spreadsheet Name

        thisCompany = File.getName()
        thisId = File.getId()

        SS = SpreadsheetApp.openById(thisId)
        Logger.log(SS.getName())
        Sheet = SS.getSheetByName(sheet)
        Logger.log(Sheet)
        lastColumn = Sheet.getLastColumn()

        Logger.log(thisCompany)
        Logger.log("Width: " + lastColumn)
        Logger.log(thisId)
    }
}