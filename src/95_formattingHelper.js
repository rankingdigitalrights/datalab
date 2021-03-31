/* global
    Config,
    locateString
*/

function returnFBStyleParams(configObjKey) {
    return Config.feedbackForms[configObjKey]
}

/** useful to simplify estimate of horizopntal company dimension
 * namely: group + opcom + nr of services
 * Full: don't omit OpCom column
 * Naive: respect if has no OpCom
 * Net: applies Scoring Scopes logic
 */

function calculateCompanyWidthFull(Company) {
    return Company.services.length + 2
}

function calculateCompanyWidthNaive(Company) {
    let services = Company.services.length

    let hasOpCom = Company.hasOpCom
    let width = hasOpCom ? services + 2 : services + 1

    return width
}

function calculateCompanyWidthNet(Company, Indicator, omitOpCom) {
    let services = Company.services.length

    let baseWidth = Company.hasOpCom && !omitOpCom ? 2 : 1

    let width

    let scope = Indicator.scoringScope

    switch (scope) {
        case 'full':
            width = baseWidth + services
            break

        case 'company':
            width = baseWidth
            break

        case 'services':
            width = services
            break
    }

    return width
}

// visual formatting helper; used for Scoring Sheets
// could be further parameterized
function styleScoringIndicatorHeader(currentCell, label, colorHex) {
    currentCell
        .setValue(label)
        .setFontWeight('bold')
        .setWrap(true)
        .setBackground(colorHex)
        .setVerticalAlignment('middle')
        .setHorizontalAlignment('center')
    return currentCell
}

// functions to convert column numbers to letters and vice versa
// for easier translation of column number to column letter in formulas

function columnToLetter(column) {
    let temp,
        letter = ''
    while (column > 0) {
        temp = (column - 1) % 26
        letter = String.fromCharCode(temp + 65) + letter
        column = (column - temp - 1) / 26
    }
    return letter
}

// Special Case for 2020 and Import of 2019 G Indicator Subcomponents (FoE/P)
// used to add a offest to transpose column-wise indicator subcomponent column placement
// into row-wise Step 0 import
// can probably be deprecated but is still used in 12_inputYonYimport.js
function columnToLetterYonY(column, offset) {
    let temp,
        letter = ''
    let shift = offset ? offset : 0
    while (column > 0) {
        temp = (column - 1 + offset) % 26
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

// rich text helper to underline a string in a cell
function textUnderline(cell) {
    var style = SpreadsheetApp.newTextStyle().setUnderline(true).build()
    cell.setTextStyle(style)
    return cell
}

// function textStyle(textRange, Style) {
//     textRange.setTextStyle(Style)
//     // return textRange
// }

// apply an array of rich text styles to a cell
// can be used for adding hyperlinks
function addRichTextArray(Cell, Style, content, terms, links) {
    let richText = SpreadsheetApp.newRichTextValue().setText(content)

    let cellText = Cell.getValue()
    let termPos = locateString(cellText, terms)
    // let termURL
    if (termPos.length > 0) {
        termPos.forEach((term) => {
            // console.log(term)
            // termURL = Config.indicatorsLink + links[index]
            if (term[0] !== -1) {
                return richText.setTextStyle(term[0], term[1], Style) //.setLinkUrl(term[0], term[1], termURL)
            }
        })

        Cell.setRichTextValue(richText.build())
    }
}

function addRichTextSingle(Cell, Style, content, terms) {
    // OLD

    let richText = SpreadsheetApp.newRichTextValue().setText(content)

    richText = richText
        .setTextStyle(11, 26, Style)
        .setTextStyle(62, 76, Style)
        // .setLinkUrl(69, 83, Config.glossaryLink)
        // .setTextStyle(0, 5, Style)
        .build()

    Cell.setRichTextValue(richText).setFontSize(11)
}
