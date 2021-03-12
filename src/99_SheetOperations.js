function cropEmptyColumns(Sheet, offSet, fixedLastColumn) {
    offSet = offSet || 0 // default value
    fixedLastColumn = fixedLastColumn > 0 ? fixedLastColumn : 0

    let maxColumns = Sheet.getMaxColumns()
    let lastColumn =
        fixedLastColumn > 0
            ? fixedLastColumn + offSet
            : Sheet.getLastColumn() + offSet
    if (maxColumns - lastColumn !== 0) {
        Sheet.deleteColumns(lastColumn + 1, maxColumns - lastColumn)
    }
}

function cropEmptyRows(Sheet, offSet) {
    offSet = offSet || 0

    let maxRows = Sheet.getMaxRows()
    let lastRow = Sheet.getLastRow() + offSet
    if (maxRows - lastRow > 0) {
        Sheet.deleteRows(lastRow + 1, maxRows - lastRow)
    }
}
