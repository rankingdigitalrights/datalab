function clearNamedRangesFromCompanySheet(CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {


    Logger.log(CompanyObj)
    var companyShortName = cleanCompanyName(CompanyObj)

    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)
    //   var File = SpreadsheetApp.create(spreadsheetName)
    var File = connectToSpreadsheetByName(spreadsheetName)

    clearNamedRangesFromFile(File)

}