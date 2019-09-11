// --- // central file naming logic // --- //

/**
 * 
 * @param {*} company 
 * @param {*} sheetMode 
 * @param {*} filenameSuffix 
 */

function spreadSheetFileName (company, sheetMode, filenameSuffix) {

    var filename = company + "_" + sheetMode + "_" + "Prototype" + "_" + filenameSuffix

    return filename
}
