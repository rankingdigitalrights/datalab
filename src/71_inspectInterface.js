function inspectInputSheet(SS, ListSheet) {

    let namedRangesRaw = SS.getNamedRanges()
    console.log("named Range received: " + namedRangesRaw.length)

    let namedRanges = []

    let sheetName, range, rangeVal, rangeName

    let regexPattern = new RegExp("[G|F|P]\\d+[a-z]?")

    console.log("processing")

    namedRangesRaw = namedRangesRaw.filter(namedRange =>
        namedRange.getRange().getA1Notation().match("REF"))

    console.log("Filtered Named Ranges: " + namedRangesRaw.length)

    if (namedRangesRaw.length > 0) {

        namedRangesRaw.forEach(namedRange => {

            range = namedRange.getRange()
            rangeVal = range.getA1Notation()

            rangeName = namedRange.getName()
            sheetName = rangeName.match(regexPattern)

            namedRanges.push([
                ["|------"],
                [sheetName],
                [rangeName],
                [rangeVal]
            ])

        })
    }

    if (namedRanges.length > 0) {
        namedRanges = namedRanges.sort()
        let width = namedRanges[0].length
        let height = namedRanges.length
        ListSheet.getRange(ListSheet.getLastRow() + 1, 1, height, width).setValues(namedRanges)
    } else {
        ListSheet.appendRow(["---", "no broken ranges found"])
    }

}
