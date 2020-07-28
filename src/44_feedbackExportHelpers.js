function HardCopyFeedbackSS(SS, sheetLabels, targetFolderID) {

    let targetFileName = SS.getName() + " offline"

    // SS = copyMasterSpreadsheet(SS.getId(), targetFolderID, targetFileName, false)

    sheetLabels.forEach(sheetLabel => {

        let Sheet = SS.getSheetByName(sheetLabel)
        let dataStartRow, lastCol, lastRow
        let searchString = "Sources|PRELIMINARY EVALUATION"

        dataStartRow = findValueRowStart(Sheet, searchString, 1)

        lastCol = Sheet.getLastColumn()
        lastRow = Sheet.getLastRow()

        let sheetRange = Sheet.getRange(dataStartRow, 2, lastRow - dataStartRow, lastCol)


        let values = sheetRange.getValues()

        sheetRange.setValues(values)
    })
}


function testHardCopy() {

    let SS = SpreadsheetApp.openById("1lrOcTjf-_zqaLKz1qKNi9UrbmOVei1nLzcrHFxuMDYo")

    // let sheetLabels = ["G4b"]

    let sheetLabels = ["Sources", "G1", "G2", "G3", "G4a", "G4b", "G4c", "G4d", "G4e", "G5", "G6a", "G6b", "F1a", "F1b", "F1c", "F1d", "F2a", "F2b", "F2c", "F2d", "F3a", "F3b", "F3c", "F4a", "F4b", "F4c", "F5a", "F5b", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "P1a", "P1b", "P2a", "P2b", "P3a", "P3b", "P4", "P5", "P6", "P7", "P8", "P9", "P10a", "P10b", "P11a", "P11b", "P12", "P13", "P14", "P15", "P16", "P17", "P18"]

    let targetFolderID = "1si0VeymDcsazl_RDelNsahMfSz5jn3Pm"

    HardCopyFeedbackSS(SS, sheetLabels, targetFolderID)

}
