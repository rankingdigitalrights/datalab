function mainDeleteStepRows() {

    let stepString = "^Step 3"

    let SS = openSpreadsheetByID("1phB7j-fh3WZUeeEBAlqB7e0r5XI5N6pzm-PP3UlrqYY")

    // let Indicators = subsetIndicatorsObject(indicatorsVector, "G1") // F5a|P1$// indicatorsVector
    let Indicators = indicatorsVector

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

    let startRow = data.findIndex(r => {
        if (r[1] !== null && r[1].length > 0) {
            return r[1].match(stepString) // 1 := second column
        }
    })

    let lastRow = Sheet.getLastRow()
    console.log(`Range found: ${startRow} : ${lastRow}`)
    return [startRow + 1, lastRow + 1]
}

function deleteRows(Sheet, startRow, lastRow) {
    if (startRow > 2) {
        console.log([startRow, lastRow - startRow])
        Sheet.deleteRows(startRow, lastRow - startRow)
    }
}
