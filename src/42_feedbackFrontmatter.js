/* global
    Styles,
*/

// Wrapper for Indicator-Level Front Matter Content

function addFBFrontMatter(Sheet, Indicator, MetaData, activeRow, offsetCol) {

    activeRow += 1

    let rangeStart, rangeEnd
    let frontMatterSpecs = Config.feedbackForms.frontMatter
    let width = frontMatterSpecs.frontMatterColsNr

    // TODO: Revisit Experiment

    frontMatterSpecs.bold = SpreadsheetApp.newTextStyle()
        .setBold(true)
        .build()

    rangeStart = activeRow

    activeRow = addFBSheetHeading(Sheet, Indicator, MetaData, frontMatterSpecs, activeRow, offsetCol, width)

    activeRow = addFBIndyDescription(Sheet, Indicator, MetaData, frontMatterSpecs, activeRow, offsetCol, width)

    activeRow = addElementDescriptions(Sheet, Indicator, MetaData, frontMatterSpecs, activeRow, offsetCol, width)

    activeRow = addFBIndicatorGuidance(Sheet, Indicator, MetaData, frontMatterSpecs, activeRow, offsetCol, width)

    rangeEnd = activeRow

    Sheet.getRange(rangeStart, offsetCol, rangeEnd, width)
        // .setHorizontalAlignment("left")
        .setVerticalAlignment("top")
        .setWrap(true)

    return activeRow += 2
}

// Frontmatter Component Helper Functions

function addFBSheetHeading(Sheet, Indicator, MetaData, frontMatterSpecs, activeRow, offsetCol, width) {

    let title = Indicator.labelShort + ". " + Indicator.labelLong

    // Indicator Heading
    Sheet.getRange(activeRow, offsetCol, 1, width)
        .merge()
        .setValue(title)
        .setFontSize(18)
        .setFontWeight("bold")
        .setFontColor(Styles.colors.blue)

    Sheet.setRowHeight(activeRow, 30)

    // activeRow += 2

    return activeRow + 2

}

function addFBIndyDescription(Sheet, Indicator, MetaData, frontMatterSpecs, activeRow, offsetCol, width) {

    // Indicator Description
    let description = MetaData.description
    let descriptionTerms = MetaData.descriptionTerms
    let descriptionLinks = MetaData.descriptionLinks

    let Cell = Sheet.getRange(activeRow, offsetCol, 1, width)
        .merge()
        .setValue(description)
        .setFontSize(12)

    addRichTextArray(Cell, frontMatterSpecs.bold, description, descriptionTerms, descriptionLinks)

    return activeRow + 2
}
// Indicator Guidance for researchers

function addElementDescriptions(Sheet, Indicator, MetaData, frontMatterSpecs, activeRow, offsetCol, width) {

    let startRow, endRow

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
        // .setHorizontalAlignment("left")
        .setVerticalAlignment("top")

    let elementRow = startRow

    Indicator.elements.forEach((Element, index) => {
        Textrange = Sheet.getRange(elementRow + index, offsetCol + 1, 1, width - 1).merge()

        // console.log("Found terms " + MetaData.elementsTags[index])
        addRichTextArray(Textrange, frontMatterSpecs.bold, Element.description, MetaData.elementsTags[index], MetaData.elementsLinks[index])

    })

    Sheet.getRange(startRow, offsetCol + 1, values.length, 1)
        .setHorizontalAlignment("left")
        .setFontSize(12)

    Sheet.getRange(startRow, offsetCol, values.length, 1)
        .setHorizontalAlignment("right")
        .setFontSize(12)

    activeRow = startRow + values.length

    // endRow = activeRow

    return activeRow + 1
}


function addFBIndicatorGuidance(Sheet, Indicator, MetaData, frontMatterSpecs, activeRow, offsetCol, width) {

    let indicatorGuidanceText = MetaData.guidance
    let indicatorLink = Config.indicatorsLink + "#" + Indicator.labelShort

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

    // TODO: make function applyStyle(TextRange, Style)

    // let richText = SpreadsheetApp.newRichTextValue()
    //     // .setText(frontMatterSpecs.glossaryText)
    //     .setText(Cell.getValue())
    //     // .setTextStyle(11, 26, frontMatterSpecs.bold)
    //     .setTextStyle(27, 40, frontMatterSpecs.bold)
    //     .setLinkUrl(0, 5, "https://bar.foo")
    //     .setTextStyle(0, 5, frontMatterSpecs.bold)
    //     .build()

    // Cell.setRichTextValue(richText)

    addRichTextSingle(Cell, frontMatterSpecs.bold, frontMatterSpecs.glossaryText, null)

    activeRow += 1

    Sheet.getRange(activeRow, offsetCol, 1, 3)
        .merge()
        .setValue(frontMatterSpecs.guidanceText)
        // .setValue(indicatorLink)
        .setFontStyle("italic")
        .setFontWeight("bold")
        .setFontSize(11)

    Sheet.getRange(activeRow, offsetCol + 3, 1, 2)
        .merge()
        .setWrap(true)
        .setValue(indicatorLink)
        .setFontSize(11)

    return activeRow + 1
}
