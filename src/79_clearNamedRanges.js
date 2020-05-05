function clearNamedRangesFromCompanySheet(CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {

    var companyShortName = cleanCompanyName(CompanyObj)

    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    var SS = createSpreadsheet(spreadsheetName, false)

    clearNamedRangesFromFile(SS)

}


function clearNamedRangesFromFile(SS) {

    Logger.log(SS.getName())
    Logger.log(SS.getId())

    let namedRanges = SpreadsheetApp.openById(SS.getId()).getNamedRanges()
    Logger.log(namedRanges)

    let namedRange
    if (namedRanges.length >= 1) {

        for (let i = 0; i < namedRanges.length; i++) {

            namedRange = namedRanges[i]

            Logger.log(namedRange)

            namedRanges[i].remove()
        }
    } else {
        Logger.log("No Named Ranges found")
    }
}
