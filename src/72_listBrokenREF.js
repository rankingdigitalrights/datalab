function listBrokenRefsSingleSheet(ListSheet, sourceSheet, thisIndLabel) {
    var namedRangesRaw = sourceSheet.getNamedRanges()

    var lastRow = ListSheet.getLastRow() + 1

    var namedRanges = []
    var rangeVal

    namedRangesRaw.forEach(function (range) {
        rangeVal = range.getRange().getA1Notation().toString()
        if (rangeVal === "#REF!") {
            namedRanges.push([
                ["---> " + thisIndLabel],
                [range.getName()],
                [rangeVal]
            ])
        }
    })

    var arrayLength = namedRanges.length
    if (arrayLength > 0) {
        var column = ListSheet.getRange(lastRow, 1, arrayLength, 3)
        column.setValues(namedRanges)
    }
}
