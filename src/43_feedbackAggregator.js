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

    Sheet.getRange(1, 1, rows.length, header.length)
        .setValues(rows)
        .setVerticalAlignment("top")

    Sheet.getRange(1, 1, 1, header.length)
        .setFontSize(12)
        .setFontWeight("bold")

    Sheet.setColumnWidth(2, 500)
}

function appendTOC(SS, Sheet, Indicators) {

    const flatten = true
    const indicatorLabels = getIndicatorLabelsList(Indicators, flatten)
    console.log("indicatorLabels")
    console.log(indicatorLabels)
    // let tabs = []

    let Sheets = SS.getSheets()

    // console.log(Sheets.map(Sheet => Sheet.getName()))

    let tabs = Sheets.filter(sheet => indicatorLabels.includes(sheet.getName()))

    console.log("tabs")
    console.log(tabs)

    tabs.map(tab => {
        Sheet.appendRow([`=HYPERLINK("#gid=${tab.getSheetId()}","${tab.getSheetName()}")`])
    })
    // return tabs

}

// let Sheets = ["G1", "P9"]
// let indicatorLabels = ["G1", "G2", "G3", "G4a", "G4b", "G4c", "G4d", "G4e", "G5", "G6a", "G6b", "F1a", "F1b", "F1c", "F1d", "F2a", "F2b", "F2c", "F2d", "F3a", "F3b", "F3c", "F4a", "F4b", "F4c", "F5a", "F5b", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "F13", "P1a", "P1b", "P2a", "P2b", "P3a", "P3b", "P4", "P5", "P6", "P7", "P8", "P9", "P10a", "P10b", "P11a", "P11b", "P12", "P13", "P14", "P15", "P16", "P17", "P18"]
// let tabs = Sheets.filter(Sheet => indicatorLabels.includes(Sheet))

// console.log(`tabs: ${tabs}`)
