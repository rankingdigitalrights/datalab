function removeAllProtections(SS) {
    console.log('In removeAllProtections')

    let sheets = SS.getSheets()
    let sheetProtections, rangeProtections

    // looping through each Sheet and removing all protections on the Sheet
    for (let sheet = 0; sheet < sheets.length; sheet++) {
        let Sheet = SS.getSheets()[sheet]

        console.log('In ' + Sheet)

        // getting all the protections on a Sheet and then removing them
        sheetProtections = Sheet.getProtections(
            SpreadsheetApp.ProtectionType.RANGE
        )
        rangeProtections = Sheet.getProtections(
            SpreadsheetApp.ProtectionType.SHEET
        )

        // removing Sheet protections
        for (let j = 0; j < sheetProtections.length; j++) {
            sheetProtections[j].remove()
        }

        // removing range protections
        for (let j = 0; j < rangeProtections.length; j++) {
            rangeProtections[j].remove()
        }
    }
}
