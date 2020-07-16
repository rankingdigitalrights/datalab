/* global
    Config,
    locateString
*/

function returnFBStyleParams(configObjKey) {
    return Config.feedbackForms[configObjKey]
}

function calculateCompanyWidthNaive(Company) {

    let services = Company.services.length

    let hasOpCom = Company.hasOpCom
    let width = hasOpCom ? (services + 2) : (services + 1)

    return width
}

function calculateCompanyWidthNet(Company, Indicator, omitOpCom) {

    let services = Company.services.length

    let baseWidth = Company.hasOpCom && !omitOpCom ? 2 : 1

    let width

    let scope = Indicator.scoringScope

    switch (scope) {

        case ("full"):
            width = baseWidth + services
            break

        case ("company"):
            width = baseWidth
            break

        case ("services"):
            width = services
            break
    }

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

// function textStyle(textRange, Style) {
//     textRange.setTextStyle(Style)
//     // return textRange
// }

function addRichTextArray(Cell, Style, content, terms) {

    let richText = SpreadsheetApp.newRichTextValue()
        .setText(content)

    let cellText = Cell.getValue()
    let termPos = locateString(cellText, terms)

    termPos.forEach((term) => {
        // console.log(term)
        if (term[0] !== -1) {
            return richText.setTextStyle(term[0], term[1], Style)
        }
    })

    Cell.setRichTextValue(richText.build())
}

function addRichTextSingle(Cell, Style, content, terms) {

    // OLD

    let richText = SpreadsheetApp.newRichTextValue()
        .setText(content)

    richText = richText.setTextStyle(11, 26, Style)
        // .setLinkUrl(0, 5, "https://bar.foo")
        // .setTextStyle(0, 5, Style)
        .build()

    Cell.setRichTextValue(richText)
        .setFontSize(11)

}
