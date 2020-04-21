function clearNamedRangesFromCompanySheet(CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {

    var companyShortName = cleanCompanyName(CompanyObj)

    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)

    var SS = createSpreadsheet(spreadsheetName, false)

    clearNamedRangesFromFile(SS)

}