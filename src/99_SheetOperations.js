// Sheet level cropping operations //

// Offset can be passed to leave i.e. 1 empty row or 1 empty column

function cropEmptyColumns(Sheet, offSet, fixedLastColumn) {
    offSet = offSet || 0 // default value
    fixedLastColumn = fixedLastColumn > 0 ? fixedLastColumn : 0

    // Guard Clause to not delete beyond a prescribed last Column
    // and to prevent trying to delete beyond current last Column
    let maxColumns = Sheet.getMaxColumns()
    let lastColumn = fixedLastColumn > 0 ? fixedLastColumn + offSet : Sheet.getLastColumn() + offSet
    if (maxColumns - lastColumn !== 0) {
        Sheet.deleteColumns(lastColumn + 1, maxColumns - lastColumn)
    }
}

function cropEmptyRows(Sheet, offSet) {
    offSet = offSet || 0

    // Guard Clause to not delete beyond beyond current last Row
    let maxRows = Sheet.getMaxRows()
    let lastRow = Sheet.getLastRow() + offSet
    if (maxRows - lastRow > 0) {
        Sheet.deleteRows(lastRow + 1, maxRows - lastRow)
    }
}
