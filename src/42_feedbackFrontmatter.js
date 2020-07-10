/* global
    Styles
    */

// Wrapper for Indicator-Level Front Matter Content

function addFBFrontMatter(Sheet, Indicator, activeRow, offsetCol) {

    activeRow += 1

    let rangeStart, rangeEnd
    let frontMatterSpecs = Config.feedbackForms.frontMatter
    let width = frontMatterSpecs.frontMatterColsNr

    rangeStart = activeRow

    activeRow = addFBSheetHeading(Sheet, Indicator, frontMatterSpecs, activeRow, offsetCol, width)

    activeRow = addElementDescriptions(Sheet, Indicator, activeRow, offsetCol, width)

    activeRow = addFBIndicatorGuidance(Sheet, Indicator, frontMatterSpecs, activeRow, offsetCol, width)

    rangeEnd = activeRow

    Sheet.getRange(rangeStart, offsetCol, rangeEnd, width)
        // .setHorizontalAlignment("left")
        .setVerticalAlignment("top")
        .setWrap(true)

    return activeRow += 2
}

// Frontmatter Component Helper Functions

function addFBSheetHeading(Sheet, Indicator, frontMatterSpecs, activeRow, offsetCol, width) {

    let title = Indicator.labelShort + ". " + Indicator.labelLong

    let description = Indicator.description > 10 ? Indicator.description : "Indicator Description: TBD"

    // Indicator Heading
    Sheet.getRange(activeRow, offsetCol, 1, width)
        .merge()
        .setValue(title)
        .setFontSize(18)
        .setFontWeight("bold")
        .setFontColor(Styles.colors.blue)

    Sheet.setRowHeight(activeRow, 30)

    activeRow += 2

    // Indicator Description

    Sheet.getRange(activeRow, offsetCol, 1, width)
        .merge()
        .setValue(description)
        .setFontSize(12)

    return activeRow + 2

}
// Indicator Guidance for researchers

function addElementDescriptions(Sheet, Indicator, activeRow, offsetCol, width) {

    let startRow, endRow
    let indicatorLink = Config.indicatorsLink + "#" + Indicator.labelShort

    Sheet.getRange(activeRow, offsetCol)
        .setValue("Elements:")
        .setFontSize(12)
        .setFontWeight("bold")
        .setFontStyle("italic")
    // .setHorizontalAlignment("right")

    activeRow += 1
    startRow = activeRow

    // Elements + Guidance

    let values = []
    let Textrange

    // let prefix, hasPredecessor, isRevised

    Indicator.elements.forEach((Element) => {

        values.push(
            [(Element.labelShort + ": "), Element.description]
        )

    })

    Sheet.getRange(startRow, offsetCol, values.length, values[0].length)
        .setValues(values)
        .setFontSize(12)
        // .setHorizontalAlignment("left")
        .setVerticalAlignment("top")

    let elementRow = startRow

    Indicator.elements.forEach((Element, index) => {
        Textrange = Sheet.getRange(elementRow + index, offsetCol + 1, 1, width - 1).merge()
    })


    Sheet.getRange(startRow, offsetCol, values.length, 1)
        .setHorizontalAlignment("right")

    activeRow = startRow + values.length

    // endRow = activeRow

    return activeRow + 1
}


function addFBIndicatorGuidance(Sheet, Indicator, frontMatterSpecs, activeRow, offsetCol, width) {

    let indicatorGuidanceText = Indicator.indicatorGuidanceText || "Indicator Guidance Text:\n\nTBD"

    // Research Guidance Caption

    Sheet.getRange(activeRow, offsetCol, 1, 2)
        .merge()
        .setValue(frontMatterSpecs.indicatorGuidanceLabel)
        .setFontSize(12)
        .setFontWeight("bold")
        .setFontStyle("italic")
    // .setHorizontalAlignment("right")

    activeRow += 1

    // Research guidance Text

    Sheet.getRange(activeRow, offsetCol, 1, width)
        .merge()
        .setWrap(true)
        .setValue(indicatorGuidanceText)
        .setFontSize(12)

    if (indicatorGuidanceText.length < 100) {
        Sheet.setRowHeight(activeRow, 100)
    }

    activeRow += 2

    let Cell = Sheet.getRange(activeRow, offsetCol, 1, 3)
        .merge()
        // .setValue(frontMatterSpecs.glossaryText)
        .setFontStyle("italic")
        .setFontSize(11)

    Sheet.getRange(activeRow, offsetCol + 3, 1, 2)
        .merge()
        .setWrap(true)
        .setValue(Config.glossaryLink)
        .setFontSize(11)

    let bold = SpreadsheetApp.newTextStyle()
        .setBold(true)
        .build()
    let richText = SpreadsheetApp.newRichTextValue()
        .setText(frontMatterSpecs.glossaryText)
        .setTextStyle(11, 26, bold)
        .build()

    Cell.setRichTextValue(richText)

    activeRow += 1

    Sheet.getRange(activeRow, offsetCol, 1, 3)
        .merge()
        .setValue(frontMatterSpecs.guidanceText)
        .setFontStyle("italic")
        .setFontWeight("bold")
        .setFontSize(11)

    Sheet.getRange(activeRow, offsetCol + 3, 1, 2)
        .merge()
        .setWrap(true)
        .setValue(Config.indicatorsLink + "#" + Indicator.labelShort)
        .setFontSize(11)

    return activeRow + 1
}
