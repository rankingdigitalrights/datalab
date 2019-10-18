// --- // central file naming logic // --- //

function spreadSheetFileName (filenamePrefix, sheetMode, companyShortName, filenameSuffix) {

    var filename = filenamePrefix + ' ' + companyShortName + ' - ' + sheetMode + ' ' + filenameSuffix

    return filename
}
