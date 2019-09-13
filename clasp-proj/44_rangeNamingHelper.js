// --- // crtical: central range naming logic // --- //

// To change the cell naming logic, re-arrange the vars in the function body (not in the siganture)

/**
 * 
 * @param {*} index 
 * @param {*} sheetMode 
 * @param {*} step 
 * @param {*} indicatorElement 
 * @param {*} component 
 * @param {*} company 
 * @param {*} service 
 * @param {*} suffix 
 */

// RDR2019DC S01 G1 iVM1 Step

function defineNamedRangeStringImport(index, sheetMode, step, indicatorElement, component, company, service, suffix) {

  var compCellName = index + sheetMode + step + indicatorElement
  compCellName = compCellName + company + service + component
  if (suffix) {
    compCellName = compCellName + suffix
  }
  compCellName = compCellName.toString()
  return compCellName
}


// --- // rangedName cleaner // --- //
// (as named ranges are not removed with sheet.clear())

function clearAllNamedRangesFromSheet(sheet) {
  var namedRanges = sheet.getNamedRanges();
  for (var i = 0; i < namedRanges.length; i++) {
    namedRanges[i].remove();
  }
  return sheet
}
