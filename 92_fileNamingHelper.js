// --- // central File naming logic // --- //

function spreadSheetFileName(filenamePrefix, mainSheetMode, mainFileNameElement, filenameSuffix) {

    var filename = filenamePrefix + " " + mainFileNameElement + " - " + mainSheetMode + " " + filenameSuffix

    return filename
}

function cleanCompanyName(Company) {
    
    var companyName
    if (Company.label.altFilename) {
        companyName = Company.label.altFilename
    } else {
        companyName = Company.label.current
    }

    Logger.log("Company Name parsed: " + companyName)
    return companyName
}