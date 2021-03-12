// --- // critical: central range naming logic // --- //

// To change the cell naming logic, re-arrange the vars in the function body (not in the siganture)

// RDR2019DC S01 G1 iVM1 Step

// eslint-disable-next-line no-unused-vars
function defineNamedRange(index, sheetModeID, step, indicatorElement, component, companyId, service, suffix) {
    let compCellName = index + sheetModeID + step + indicatorElement + companyId + service + component

    // let compCellName = sheetModeID + step + indicatorElement
    // compCellName = compCellName + companyId + service + component

    if (suffix) {
        compCellName = compCellName + suffix
    }
    compCellName = compCellName.toString()
    return compCellName
}

// eslint-disable-next-line no-unused-vars
function specialRangeName(Prefix, Main, Suffix) {
    return Prefix + Main + Suffix
}

// --- // rangedName cleaner // --- //
// (as named ranges are not removed with sheet.clear())

// eslint-disable-next-line no-unused-vars
function clearAllNamedRangesFromSheet(sheet) {
    let namedRanges = sheet.getNamedRanges()
    for (let i = 0; i < namedRanges.length; i++) {
        namedRanges[i].remove()
    }
}

// eslint-disable-next-line no-unused-vars
function removeAllNamedRanges(spreadsheetId) {
    var ss = SpreadsheetApp.openById(spreadsheetId)
    console.log(ss.getName())

    var namedRanges = ss.getNamedRanges()
    console.log(namedRanges.length)

    namedRanges.forEach(function (range) {
        //    console.log(range.getName() + ": " + range.getRange().getA1Notation())
        //    ss.removeNamedRange(range.getName())
        range.remove()
    })
}

// function mainRemoveAllNamedRanges() {
//     var spreadsheetId = "1YbbOuxJ-pAWoUhLIo7SxarJb4uyPB7zg7iVKEj_AB7c";
//     removeAllNamedRanges(spreadsheetId);
// }
