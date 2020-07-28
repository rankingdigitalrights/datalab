function HardCopyFeedbackSS(SS, sheetLabels, targetFolderID) {

    let targetFileName = SS.getName() + " offline"

    // SS = copyMasterSpreadsheet(SS.getId(), targetFolderID, targetFileName, false)

    sheetLabels.forEach(sheetLabel => {

        let Sheet = SS.getSheetByName(sheetLabel)
        let dataStartRow, lastCol, lastRow
        let searchString = "PRELIMINARY EVALUATION"

        dataStartRow = findValueRowStart(Sheet, searchString, 1)

        lastCol = Sheet.getLastColumn()
        lastRow = Sheet.getLastRow()

        let sheetRange = Sheet.getRange(dataStartRow, 2, lastRow - dataStartRow, lastCol)


        let values = sheetRange.getValues()

        sheetRange.setValues(values)
    })
}


function testHardCopy() {

    let SS = SpreadsheetApp.openById("1HWXi3zF43ggOTaarHwy7UWma3BiFMrEGZxA1mJZkGxI")

    let sheetLabels = ["G4b"]

    let targetFolderID = "1si0VeymDcsazl_RDelNsahMfSz5jn3Pm"

    HardCopyFeedbackSS(SS, sheetLabels, targetFolderID)

}
