// --- // central File naming logic // --- //

function spreadSheetFileName(filenamePrefix, mainSheetMode, mainFileNameElement, filenameSuffix) {
    return `${filenamePrefix} ${mainFileNameElement} - ${mainSheetMode} ${filenameSuffix}`
}

// sometimes we provide a manually cleaned / simplified Company name in JSON_Companies.js
// critical for global file naming of produced spreadsheets incl. access by filename
function cleanCompanyName(Company) {
    return Company.label.altFilename ? Company.label.altFilename : Company.label.current
}
