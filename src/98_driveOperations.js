// search Folder and create a new one if needed

function createFolderIfNotExist(ParentFolderID, FolderName) {
    var Parent = DriveApp.getFolderById(ParentFolderID)
    var Children = Parent.getFoldersByName(FolderName)
    var Folder
    var FolderID
    if (!Children.hasNext()) {
        Logger.log("Folder " + FolderName + " does not exist. Creating a new one")
        Folder = Parent.createFolder(FolderName)
        FolderID = Folder.getId()
    } else {
        Folder = Children.next()
        FolderID = Folder.getId()
    }
    Logger.log("Found folder: " + Folder.getName())
    return FolderID
}