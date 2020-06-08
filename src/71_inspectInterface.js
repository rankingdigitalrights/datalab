function inspectInputSheet(SS, ListSheet) {

    let namedRangesRaw = SS.getNamedRanges()
    console.log(namedRangesRaw)

    let namedRanges = []

    namedRanges = processNamedRanges(namedRangesRaw)


    // namedRanges.forEach(rangeRow =>
    //     // ListSheet.appendRow(rangeRow)
    //     console.log(rangeRow)
    // )
}

function processNamedRanges(namedRangesRaw) {

    let namedRanges = []
    let sheetName, range, rangeVal, rangeName

    let regexPattern = new RegExp("[G|F|P]\d+[a-z]?")

    namedRangesRaw.forEach(namedRange => {

        range = namedRange.getRange()
        // sheetName = range.getSheet().getName()
        rangeVal = range.getA1Notation()
        rangeName = namedRange.getName()
        sheetName = rangeName.match(regexPattern)

        // if (rangeVal === "#REF!") {
        namedRanges.push([
            [sheetName],
            [rangeName],
            [rangeVal]
        ])
        // }
    })
    return namedRanges
}
