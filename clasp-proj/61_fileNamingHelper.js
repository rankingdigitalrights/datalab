// --- // central File naming logic // --- //

function spreadSheetFileName(filenamePrefix, mainSheetMode, companyShortName, filenameSuffix) {

    var filename = filenamePrefix + ' ' + companyShortName + ' - ' + mainSheetMode + ' ' + filenameSuffix

    return filename
}

function cleanCompanyName(Company) {
    var companyName
    if (Company.label.altFilename) {
        companyFilename = Company.label.altFilename
    } else {
        companyFilename = Company.label.current
    }

    return companyName
}