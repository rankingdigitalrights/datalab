// search folder and create a new one if needed


// TODO: Test
function assignFileOwner(File, lastName) {
    let account = lastName + '@rankingdigitalrights.org'
    File.setOwner(account)
}

function assignFolderOwner(Folder, lastName) {
    let account = lastName + '@rankingdigitalrights.org'
    let currentOwner =
        Folder.setOwner(account)
}

// TODO: Test
function assignFileEditors(File, personsLastNames) {
    let accounts = personsLastNames.map(lastName => lastName + '@rankingdigitalrights.org')
    File.addEditors(accounts)
}

function assignFolderEditors(Folder, personsLastNames) {
    let accounts = personsLastNames.map(lastName => lastName + '@rankingdigitalrights.org')
    Logger.log("accounts " + accounts)
    Folder.addEditors(accounts)
}

function tryAccessParent(parentFolderID) {

    let Parent = DriveApp.getFolderById(parentFolderID)
    let canAccessParent = isEmptyObj(Parent) ? true : false
    Logger.log("CORE: can access rootFolder? --> " + canAccessParent)
    if (canAccessParent) {
        return Parent
    } else {
        return null
    }
}

function createNewFolder(parentFolderID, folderName) {

    let ParentFolder = tryAccessParent(parentFolderID)

    if (ParentFolder) {
        let Children = ParentFolder.getFoldersByName(folderName)
        let Folder
        let folderID
        if (!Children.hasNext()) {
            Logger.log("CORE: Folder " + folderName + " does not exist. Creating a new one")
            Folder = ParentFolder.createFolder(folderName)
            Folder.setOwner("data@rankingdigitalrights.org") // TODO: from config
            assignFolderEditors(Folder, ["sperling"])
            folderID = Folder.getId()
        } else {
            Folder = Children.next()
            folderID = Folder.getId()
        }
        Logger.log("CORE: Found Folder: " + Folder.getName())
        return folderID
    } else {
        Logger.log("CORE ERROR: Can not access Root " + parentFolderID)
        Logger.log("CORE ERROR: Can create Folder " + folderName)
        return null
    }
}

function addFileIDtoControl(mode, companyShortName, fileID, controlSpreadsheetID) {

    let idColumn = 4
    let sheetName = outputFolderName
    Logger.log("### sheetName: " + sheetName)
    let SS = openSpreadsheetByID(controlSpreadsheetID)
    let File = DriveApp.getFileById(fileID)
    let path = printParentFolders(File)
    let Sheet = insertSheetIfNotExist(SS, sheetName, true)
    let isInColumn = isValueInColumn(SS, idColumn, sheetName, fileID)
    if (!isInColumn) {
        const formula = "=HYPERLINK(CONCAT(\"https://docs.google.com/spreadsheets/d/\",INDIRECT(ADDRESS(ROW(),COLUMN()-1))),INDIRECT(ADDRESS(ROW(),COLUMN()-2)))"
        Sheet.appendRow([path, sheetName, companyShortName, fileID, formula])
        Logger.log("created " + sheetName + " File for " + companyShortName + ";\nfileID: " + fileID + " added to Control")
    } else {
        Logger.log("SKIP: " + sheetName + " " + companyShortName + " FileID already added")
    }
}

function printParentFolders(File) {
    let Parents = File.getParents()
    let path = "/"
    while (Parents.hasNext()) {
        path += Parents.next().getName() + "/"
    }
    return path.toString()
}

function findFilePath(fileID) {
    let File = DriveApp.getFileById(fileID)
    let path = printParentFolders(File)
    Logger.log("Filepath " + fileID + ":")
    Logger.log(path)
}

function runFindFilePath() {
    let fileID = "1ycl2JbD0P9KFEIwWDZAepMekfXSQR74w-7XdJOFJqvI"
    findFilePath(fileID)
}