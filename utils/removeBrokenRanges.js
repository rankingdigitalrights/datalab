function removeDeadReferences() {
    var activeSS = SpreadsheetApp.openById("1LkJlcXq3wx4cInqjaxpqC3Udf8MeGvzX607RCWtCffw")

    console.log("connected to " + activeSS.getName())

    var Sheet = activeSS.getSheetByName("P4")

    console.log(`in ${Sheet.getName()}`)

    var sheetNamedRanges, loopRangeA1Notation

    sheetNamedRanges = Sheet.getNamedRanges()
    // check for empty array
    if (sheetNamedRanges.length) {
        for (let i = 0; i < sheetNamedRanges.length; i++) {
            loopRangeA1Notation = sheetNamedRanges[i].getRange().getA1Notation()
            if (loopRangeA1Notation.length) {
                if (
                    loopRangeA1Notation === "#REF!"
                ) {
                    console.log(`|--- removed ${sheetNamedRanges[i].getName()} `)
                    sheetNamedRanges[i].remove()
                }
            }
        }
    }
}