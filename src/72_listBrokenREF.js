function listBrokenRefsSingleSheet(SS, ListSheet, sourceSheet, thisIndLabel) {
    console.log("|--- in " + sourceSheet.getName())

    let namedRangesRaw = SS.getNamedRanges()

    let lastRow = ListSheet.getLastRow() + 1

    let namedRanges = []
    let rangeVal, rangeName

    console.log("--- " + "processing " + thisIndLabel + " named Ranges")

    namedRangesRaw.forEach(function (range) {
        rangeVal = range.getRange().getA1Notation().toString()
        rangeName = range.getName()

        if (rangeVal === "#REF!" && rangeName.includes(thisIndLabel)) {
            namedRanges.push([
                ["---> " + thisIndLabel],
                [rangeName],
                [rangeVal]
            ])
        }
    })

    let arrayLength = namedRanges.length
    if (arrayLength > 0) {
        let column = ListSheet.getRange(lastRow, 1, arrayLength, 3)
        column.setValues(namedRanges)
    }
}
