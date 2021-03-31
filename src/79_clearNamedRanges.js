// TODO: probably outdated
// maybe use Utils in 92_rangeNamingHelper.js
// CAUTION

function clearNamedRangesFromCompanySheet(CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {
    var companyShortName = cleanCompanyName(CompanyObj)

    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    var SS = createSpreadsheet(spreadsheetName, false)

    clearNamedRangesFromFile(SS)
}

function clearNamedRangesFromFile(SS) {
    console.log(SS.getName())
    console.log(SS.getId())

    let namedRanges = SpreadsheetApp.openById(SS.getId()).getNamedRanges()
    console.log(namedRanges)

    let namedRange
    if (namedRanges.length >= 1) {
        for (let i = 0; i < namedRanges.length; i++) {
            namedRange = namedRanges[i]

            console.log(namedRange)

            namedRanges[i].remove()
        }
    } else {
        console.log('No Named Ranges found')
    }
}
