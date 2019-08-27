// Company Group Element Score
function dummydummydummy () {
var cellName = ('RDR2019SC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[currentElementNr].labelShort);
      if (numberOfIndicatorCatSubComponents != 1) {
          cellName = cellName + indicatorClass.components[k].labelShort
        }

      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);

// Company Group Element Score
}

function defineNamedRangeStringImport(index, track, step, indicatorElement, component, company, service, suffix) {
    
    // if (numberOfIndicatorCatSubComponents != 1) { compCellName = compCellName + indicatorClass.components[k].labelShort; }

    var compCellName = index + track + step + indicatorElement + component;
    compCellName = compCellName + company + service
    if (suffix) {compCellName + suffix} 
    compCellName = compCellName.toString();
    return compCellName
}
