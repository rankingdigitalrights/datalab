function mainDeleteStepRows() {

    let stepString = "^Step 3"

    let SS = openSpreadsheetByID("11gMIs_vZXiLtIOO5I0dJbgqNGBuPoBM6Pfoq_nUxjV8")

    let Indicators = subsetIndicatorsObject(indicatorsVector, "G2") // F5a|P1$// indicatorsVector
    // let Indicators = indicatorsVector

    let Sheet, rows
    Indicators.indicatorCategories.forEach(Category =>
        Category.indicators.forEach(Indicator => {
            console.log(Indicator.labelShort)
            Sheet = SS.getSheetByName(Indicator.labelShort)
            if (Sheet !== null) {
                rows = findStepRows(Sheet, stepString)
                deleteRows(Sheet, rows[0], rows[1])
            } else {
                console.log("Sheet for " + Indicator.labelShort + " not found")
            }
        }))

}

function findStepRows(Sheet, stepString) {
    console.log("starting search")
    let raw = Sheet.getDataRange()
    let data = raw.getValues()
    let startRow = data.findIndex(r => r[1].match(stepString)) // 1 := second column

    let lastRow = Sheet.getLastRow()

    return [startRow + 1, lastRow + 1]
}

function deleteRows(Sheet, startRow, lastRow) {
    if (startRow > 2) {
        console.log([startRow, lastRow - startRow])
        Sheet.deleteRows(startRow, lastRow - startRow)
    }
}
