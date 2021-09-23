function HardCopyFeedbackSS(SS, sheetLabels) {
    let targetFileName = SS.getName() + ' offline'

    // SS = copyMasterSpreadsheet(SS.getId(), targetFolderID, targetFileName, false)

    sheetLabels.forEach((sheetLabel) => {
        let Sheet = SS.getSheetByName(sheetLabel)
        let dataStartRow, lastCol, lastRow
        let searchString, targetRange

        // Disconnect / hard-code IMPORTRANGE data
        searchString = 'Sources|PRELIMINARY EVALUATION'

        dataStartRow = findValueRowStart(Sheet, searchString, 1)

        lastCol = Sheet.getLastColumn()
        lastRow = Sheet.getLastRow()

        targetRange = Sheet.getRange(
            dataStartRow,
            2,
            lastRow - dataStartRow,
            lastCol
        )

        let values = targetRange.getValues()
        targetRange.setValues(values)

        // set fixed Rowheights for the Indicator Front Matter
        // searchString = "Indicator guidance:"
        // dataEndRow = findValueRowStart(Sheet, searchString, 1) + 1

        // let rowNr, height

        // for (rowNr = 4; rowNr < dataEndRow + 1; rowNr++) {
        //     height = Sheet.getRowHeight(rowNr)
        //     console.log(`${rowNr}: ${height}`)
        //     Sheet.setRowHeight(rowNr, height)
        // }
    })
}

function mainHardCopyofBFSource() {
    // TODO: add
    let SS = SpreadsheetApp.openById(
        '1SkHXdEj5_oJs8FfSmEd6MUyCiVVhPP1O_wUBEXWMzp8'
    )

    // let sheetLabels = ["G4b"]

    let sheetLabels = [
        'Sources',
        'G1',
        'G2',
        'G3',
        'G4a',
        'G4b',
        'G4c',
        'G4d',
        'G4e',
        'G5',
        'G6a',
        'G6b',
        'F1a',
        'F1b',
        'F1c',
        'F1d',
        'F2a',
        'F2b',
        'F2c',
        'F2d',
        'F3a',
        'F3b',
        'F3c',
        'F4a',
        'F4b',
        'F4c',
        'F5a',
        'F5b',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
        'F13',
        'P1a',
        'P1b',
        'P2a',
        'P2b',
        'P3a',
        'P3b',
        'P4',
        'P5',
        'P6',
        'P7',
        'P8',
        'P9',
        'P10a',
        'P10b',
        'P11a',
        'P11b',
        'P12',
        'P13',
        'P14',
        'P15',
        'P16',
        'P17',
        'P18',
    ]

    sheetLabels = ['Sources', 'G4a','F1a','P1a']

    // let targetFolderID = "1si0VeymDcsazl_RDelNsahMfSz5jn3Pm"

    HardCopyFeedbackSS(SS, sheetLabels)
}
