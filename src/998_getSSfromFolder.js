function main_getSSfromFolder() {
    var trackingSheets = connectToSpreadsheetByName("00_2019_Pilot_Dashboard", false)
    var folder = "2019 Pilot Data Store"
    var sheet = "S04"
    getSSfromFolder(folder, sheet)
}


function getSSfromFolder(folder, sheet) {

    var Folder = DriveApp.getFoldersByName(folder).next()
    Logger.log(Folder.getName())

    var File, SS, Sheet, thisCompany

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