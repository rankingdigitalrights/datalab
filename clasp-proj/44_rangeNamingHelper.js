// To change the cell naming logic, re-arrange the vars in the function body (not in the siganture)

function defineNamedRangeStringImport (index, sheetMode, step, indicatorElement, component, company, service, suffix) {

  var compCellName = index + sheetMode + step + indicatorElement + component
  compCellName = compCellName + company + service
  if (suffix) {
    compCellName = compCellName + suffix
  }
  compCellName = compCellName.toString()
  return compCellName
}
