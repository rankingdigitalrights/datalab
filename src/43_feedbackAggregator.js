/* global
    specialRangeName
*/


function fillCompanyFeedbackInputSheet(SS, Sheet, Company, Indicators) {

    let Cell
    let rangeName
    let rowNr = 1
    let header = ["Indicator", "Feedback received?", "Feedback"]
    Sheet.getRange(rowNr, 1, 1, header.length).setValues([header])
    let id = Company.id

    Indicators.indicatorCategories.forEach(Category =>
        Category.indicators.forEach(Indicator => {
            rowNr += 1

            Sheet.getRange(rowNr, 1).setValue(Indicator.labelShort)

            rangeName = specialRangeName(id, Indicator.labelShort, "CoFBstatus")
            Cell = Sheet.getRange(rowNr, 2)
            Cell.setValue("pending")
            SS.setNamedRange(rangeName, Cell)

            rangeName = specialRangeName(id, Indicator.labelShort, "CoFBtext")
            Cell = Sheet.getRange(rowNr, 3)
            Cell.setValue("placeholder text")
            SS.setNamedRange(rangeName, Cell)

        })
    )
}

function produceYonYCommentsSheet(Sheet, overwrite) {

    let rows = []
    let header = ["Indicator", "Year On Year Comment"]
    rows.push(header)



    IndicatorsObj.indicatorCategories.forEach(Category =>
        Category.indicators.forEach(Indicator => rows.push(
            [Indicator.labelShort, "TODO"]))
    )

    Sheet.getRange(1, 1, rows.length, header.length).setValues(rows)

    Sheet.getRange(1, 1, 1, header.length)
        .setFontSize(12)
        .setFontWeight("bold")

    Sheet.setColumnWidth(2, 500)
}
