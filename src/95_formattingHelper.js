/* global
    Config
*/

function returnFBStyleParams(configObjKey) {
    return Config.feedbackForms[configObjKey]
}

function calculateCompanyWidth(Company) {

    let services = Company.services.length
    let hasOpCom = Company.hasOpCom
    let width = hasOpCom ? (services + 2) : (services + 1)
    return width
}

function styleScoringIndicatorHeader(currentCell, rowLabel, colorHex) {
    currentCell.setValue(rowLabel)
    currentCell.setWrap(true)
    currentCell.setBackground(colorHex)
    currentCell.setVerticalAlignment("top")
    currentCell.setHorizontalAlignment("center")
    return currentCell
}

// functions to convert column numbers to letters and vice versa
// for easier translation of column number to column letter in formulas
function columnToLetter(column, offset) {
    var temp, letter = ""

    if (offset) column += offset

    while (column > 0) {
        temp = (column - 1) % 26
        letter = String.fromCharCode(temp + 65) + letter
        column = (column - temp - 1) / 26
    }
    return letter
}

function letterToColumn(letter) {
    var column = 0,
        length = letter.length
    for (var i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1)
    }
    return column
}

function textUnderline(cell) {
    var style = SpreadsheetApp.newTextStyle().setUnderline(true).build()
    cell.setTextStyle(style)
    return cell
}
