/** set of Google Drive Filesystem Operation
 * create Folders
 * assign OWNER / Viewers / Editors
 * list editors / viewes / owner
 * getAllSSfromFolder() - list all spreadsheets in a folder
 * get filepaths
 * TODO: finish PROTOTYPE deepCloneFolder() for
 * TODO: easier online daily backup of "RDR 202x Research Data"
 */

/* global 
    Config
*/

// TODO: Test
function assignFileOwner(File, lastName) {
    if (typeof File === 'string') {
        File = DriveApp.getFileById(File)
    }

    let account = lastName + '@rankingdigitalrights.org'
    File.setOwner(account)
}

function assignFolderOwner(Folder, lastName) {
    let account = lastName + '@rankingdigitalrights.org'
    Folder.setOwner(account)
}

// TODO: Test
function assignFileEditors(File, accounts) {
    // let accounts = personsLastNames.map(lastName => lastName + '@rankingdigitalrights.org')
    File.addEditors(accounts)
}

function assignFolderEditors(Folder, accounts) {
    // let accounts = personsLastNames.map(lastName => lastName + '@rankingdigitalrights.org')
    Folder.addEditors(accounts)
}

function assignFileViewers(File, accounts) {
    // let accounts = personsLastNames.map(lastName => lastName + '@rankingdigitalrights.org')
    File.addViewers(accounts)
}

function assignFolderViewers(Folder, accounts) {
    // let accounts = personsLastNames.map(lastName => lastName + '@rankingdigitalrights.org')
    Folder.addViewers(accounts)
}

function tryAccessParent(parentFolderID) {
    let Parent = DriveApp.getFolderById(parentFolderID)
    let canAccessParent = isEmptyObj(Parent) ? true : false
    console.log('CORE: can access rootFolder? --> ' + canAccessParent)
    return canAccessParent ? Parent : null
}

// creates a new Subfolder (by Name) in a parentFolder (looked up by ID)

function createNewFolder(parentFolderID, folderName) {
    let ParentFolder = tryAccessParent(parentFolderID)

    if (ParentFolder) {
        console.log('CORE: Connected to ROOT ' + ParentFolder.getName())
        let Children = ParentFolder.getFoldersByName(folderName)
        let Folder
        let folderID
        if (!Children.hasNext()) {
            console.log('CORE: Folder ' + folderName + ' does not exist. Creating a new one')
            Folder = ParentFolder.createFolder(folderName)
            Folder.setOwner(Config.dataOwner) // TODO: from config
            assignFolderEditors(Folder, Config.devs)
            folderID = Folder.getId()
        } else {
            Folder = Children.next()
            folderID = Folder.getId()
        }
        console.log('CORE: Found Folder: ' + Folder.getName())
        return folderID
    } else {
        console.log('CORE ERROR: Can not access ROOT ' + parentFolderID)
        console.log('CORE ERROR: Can create Folder ' + folderName)
        return null
    }
}

/** frequently used: if a new Spreadsheet is created, this function
 * adds @param fileID
 * to @param controlSpreadsheetID
 * if not duplicate (check with @function isValueInColumn() )
 * */

function addFileIDtoControl(mode, companyShortName, fileID, controlSpreadsheetID) {
    let colNr = 4
    let sheetName = outputFolderName
    console.log('### sheetName: ' + sheetName)
    let SS = openSpreadsheetByID(controlSpreadsheetID)
    let File = DriveApp.getFileById(fileID)
    let path = printParentFolders(File)
    let Sheet = insertSheetIfNotExist(SS, sheetName, true)
    let isInColumn = isValueInColumn(SS, sheetName, colNr, fileID)
    if (!isInColumn) {
        const formula =
            '=HYPERLINK(CONCAT("https://docs.google.com/spreadsheets/d/",INDIRECT(ADDRESS(ROW(),COLUMN()-1))),INDIRECT(ADDRESS(ROW(),COLUMN()-2)))'
        Sheet.appendRow([path, sheetName, companyShortName, fileID, formula])
        console.log(
            'created ' + sheetName + ' File for ' + companyShortName + ';\nfileID: ' + fileID + ' added to Control'
        )
    } else {
        console.log('SKIP: ' + sheetName + ' ' + companyShortName + ' FileID already added')
    }
}

function printParentFolders(File) {
    let Parents = File.getParents()
    let path = '/'
    while (Parents.hasNext()) {
        path += Parents.next().getName() + '/'
    }
    return path.toString()
}

function findFilePath(fileID) {
    let File = DriveApp.getFileById(fileID)
    let path = printParentFolders(File)
    console.log('Filepath ' + fileID + ':')
    console.log(path)
}

function runFindFilePath() {
    let fileID = '1ycl2JbD0P9KFEIwWDZAepMekfXSQR74w-7XdJOFJqvI'
    findFilePath(fileID)
}

function test_getSSfromFolder() {
    var trackingSheets = createSpreadsheet('00_2019_Pilot_Dashboard', false)
    var folder = '2019 Pilot Data Store'
    var sheet = 'S04'
    getAllSSfromFolder(folder, sheet)
}

// TODO: make function print to 00-Dashboard

function getAllSSfromFolder(folder, sheet) {
    let Folder = DriveApp.getFoldersByName(folder).next()
    console.log(Folder.getName())

    let File, SS, Sheet, thisCompany, thisId, lastColumn

    let spreadsheets = Folder.getFilesByType('application/vnd.google-apps.ritz')
    // for each Spreadsheet of this subfolder
    while (spreadsheets.hasNext()) {
        // enter Spreadsheet
        File = spreadsheets.next()
        // get Spreadsheet Name

        thisCompany = File.getName()
        thisId = File.getId()

        SS = SpreadsheetApp.openById(thisId)
        console.log(SS.getName())
        Sheet = SS.getSheetByName(sheet)
        console.log(Sheet)
        lastColumn = Sheet.getLastColumn()

        console.log(thisCompany)
        console.log('Width: ' + lastColumn)
        console.log(thisId)
    }
}

// single-use function to deep-clone a folder (i.e. incl. all subfolders and files)

function deepCloneFolder(FolderID, targetRootID) {
    var source = DriveApp.getFolderById(FolderID)
    var target = DriveApp.getFolderById(targetRootID)

    cloneSingleFolder(source, target)
}

function cloneSingleFolder(source, target) {
    var folders = source.getFolders()
    var files = source.getFiles()

    while (files.hasNext()) {
        var file = files.next()
        file.makeCopy(file.getName(), target)
    }

    while (folders.hasNext()) {
        var subFolder = folders.next()
        var folderName = subFolder.getName()
        var targetFolder = target.createFolder(folderName)
        cloneSingleFolder(subFolder, targetFolder)
    }
}
