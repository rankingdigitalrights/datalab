// --- // central File naming logic // --- //

function spreadSheetFileName (filenamePrefix, mainSheetMode, companyShortName, filenameSuffix) {

    var filename = filenamePrefix + ' ' + companyShortName + ' - ' + mainSheetMode + ' ' + filenameSuffix

    return filename
}
