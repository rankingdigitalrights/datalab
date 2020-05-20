function cropEmptyColumns(Sheet) {
    var maxColumns = Sheet.getMaxColumns();
    var lastColumn = Sheet.getLastColumn();
    if (maxColumns - lastColumn != 0) {
        Sheet.deleteColumns(lastColumn + 1, maxColumns - lastColumn);
    }
}

function cropEmptyRows(Sheet) {
    var maxRows = Sheet.getMaxRows();
    var lastRow = Sheet.getLastRow();
    if (maxRows - lastRow != 0) {
        Sheet.deleteRows(lastRow + 1, maxRows - lastRow);
    }
}
