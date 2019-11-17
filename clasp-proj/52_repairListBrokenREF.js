function listBrokenRefs(ListSheet, targetSheet, thisIndLabel) {
    var namedRangesRaw = targetSheet.getNamedRanges()

    var lastRow = ListSheet.getLastRow() + 1

    var namedRanges = []
    var rangeVal

    namedRangesRaw.forEach(function (range) {
        rangeVal = range.getRange().getA1Notation().toString()
        if (rangeVal == "#REF!") {
            namedRanges.push([[range.getName()], [rangeVal]])
        }
    })

    var arrayLength = namedRanges.length
    if (arrayLength > 0) {
        var column = ListSheet.getRange(lastRow, 1, arrayLength, 2)
        column.setValues(namedRanges)
    } else {
        ListSheet.appendRow([thisIndLabel, "OK"])
    }
}

function clearNamedRangesFromFile(File) {

    var range = File.getSheets()[0].getRange(1,1)
    Logger.log(range)
    Logger.log(range.getA1Notation())
    var namedRanges = File.getNamedRanges();
    for (var i = 0; i < namedRanges.length; i++) {
        // namedRanges[i].remove()
        namedRanges[i].setRange(range)
    }
}
