// --- // crtical: central range naming logic // --- //

// To change the cell naming logic, re-arrange the vars in the function body (not in the siganture)

/**
 * 
 * @param {*} index 
 * @param {*} sheetModeID 
 * @param {*} step 
 * @param {*} indicatorElement 
 * @param {*} component 
 * @param {*} companyId 
 * @param {*} service 
 * @param {*} suffix 
 */

// RDR2019DC S01 G1 iVM1 Step

function defineNamedRangeStringImport(index, sheetModeID, step, indicatorElement, component, companyId, service, suffix) {

  var compCellName = index + sheetModeID + step + indicatorElement
  compCellName = compCellName + companyId + service + component
  if (suffix) {
    compCellName = compCellName + suffix
  }
  compCellName = compCellName.toString()
  return compCellName
}


// --- // rangedName cleaner // --- //
// (as named ranges are not removed with sheet.clear())

function clearAllNamedRangesFromSheet(sheet) {
  var namedRanges = sheet.getNamedRanges()
  for (var i = 0; i < namedRanges.length; i++) {
    namedRanges[i].remove()
  }
  return sheet
}
