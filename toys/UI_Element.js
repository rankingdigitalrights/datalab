function onOpen() {
    var ui = SpreadsheetApp.getActive().getUi()
    ui.createMenu('GetValues')
        .addItem('get current', 'getCurrentCellValue')
        .addItem('get by row col', 'getByRowAndColumn')
        .addItem('get by address a1', 'getByCellAddressA1Notation')
        .addToUi()
}

function getCurrentCellValue() {
    var cell = SpreadsheetApp.getActiveSheet().getActiveCell()
    var a1 = cell.getA1Notation()
    var val = cell.getValue()

    SpreadsheetApp.getUi().alert('The active cell ' + a1 + ' value is ' + val)
}

function getByRowAndColumn() {
    var ui = SpreadsheetApp.getUi()

    var response = ui.prompt(
        'Cell address',
        'Please enter the cell address in this format: row,col for example, 5,2 means row 5 col 2',
        ui.ButtonSet.OK
    )

    var resp_text = response.getResponseText()

    var match = resp_text.match(/^(\d+)\,(\d+)/)

    var row = parseInt(match[1])
    var col = parseInt(match[2])
    var value = SpreadsheetApp.getActiveSheet().getRange(row, col).getValue()

    SpreadsheetApp.getUi().alert('The value is ' + value)
}

function getByCellAddressA1Notation() {
    var ui = SpreadsheetApp.getUi()

    var response = ui.prompt(
        'Cell address',
        'Please enter the cell address (A1 notation)',
        ui.ButtonSet.OK
    )

    var a1 = response.getResponseText()

    var value = SpreadsheetApp.getActiveSheet().getRange(a1).getValue()

    ui.alert('cell value ' + value)
}
