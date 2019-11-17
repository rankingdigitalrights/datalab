function clearNamedRangesFromCompanySheet(CompanyObj, filenamePrefix, filenameSuffix, mainSheetMode) {


    Logger.log(CompanyObj)
    var companyShortName

    if (CompanyObj.label.altFilename) {
        companyShortName = CompanyObj.label.altFilename
    } else {
        companyShortName = CompanyObj.label.current
    }

    var spreadsheetName = spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix)
    //   var File = SpreadsheetApp.create(spreadsheetName)
    var File = connectToSpreadsheetByName(spreadsheetName)

    clearNamedRangesFromFile(File)

}