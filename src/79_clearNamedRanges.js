function clearNamedRangesFromCompanySheet(CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {

    var companyShortName = cleanCompanyName(CompanyObj)

    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    var SS = createSpreadsheet(spreadsheetName, false)

    clearNamedRangesFromFile(SS)

}


function clearNamedRangesFromFile(SS) {

    let namedRanges = SS.getNamedRanges()
    for (let i = 0; i < namedRanges.length; i++) {
        SS.removeNamedRange(namedRanges[i])
    }
}
