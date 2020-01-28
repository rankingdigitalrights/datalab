function listBrokenRefsSingleSheet(ListSheet, sourceSheet, thisIndLabel) {
    var namedRangesRaw = sourceSheet.getNamedRanges()

    var lastRow = ListSheet.getLastRow() + 1

    var namedRanges = []
    var rangeVal

    namedRangesRaw.forEach(function (range) {
        rangeVal = range.getRange().getA1Notation().toString()
        if (rangeVal === "#REF!") {
            namedRanges.push([
                ["---"],
                [thisIndLabel],
                [range.getName()],
                [rangeVal]
            ])
        }
    })

    var arrayLength = namedRanges.length
    if (arrayLength > 0) {
        var column = ListSheet.getRange(lastRow, 1, arrayLength, namedRanges[0].length)
        column.setValues(namedRanges)
    }
}

/**
function clearNamedRangesFromFile(SS) {

    var range = SS.getSheets()[0].getRange(1, 1)
    Logger.log(range)
    Logger.log(range.getA1Notation())
    var namedRanges = SS.getNamedRanges()
    for (var i = 0; i < namedRanges.length; i++) {
        // namedRanges[i].remove()
        namedRanges[i].setRange(range)
    }
}
 */