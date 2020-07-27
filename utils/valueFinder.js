function mainDeleteStepRows() {

    let stepString = "^[G|F|P].*\n+Response" // "^Step 3"
    let columnNr = 1 // starts with 0 := A so 1 := B

    let SS = openSpreadsheetByID("1rsjAvw06vWjWZx3A1bptRpH8RL0-Ax-SfM3Zny4j_zY")

    // let Indicators = subsetIndicatorsObject(indicatorsVector, "G1") // F5a|P1$// indicatorsVector
    let Indicators = indicatorsVector

    let result = []
    let Sheet, rows
    Indicators.indicatorCategories.forEach(Category =>
        Category.indicators.forEach(Indicator => {
            console.log(Indicator.labelShort)
            Sheet = SS.getSheetByName(Indicator.labelShort)
            if (Sheet !== null) {
                rows = findStepRows(Sheet, stepString, columnNr)
                // deleteRows(Sheet, rows[0], rows[1]) // DA-A-A-NGER
                result.push([Indicator.labelShort, rows[0]])
            } else {
                console.log("Sheet for " + Indicator.labelShort + " not found")
            }
        }))

    console.log(result)
}

function findStepRows(Sheet, stepString, columnNr) {
    console.log("starting search")
    let raw = Sheet.getDataRange()
    let data = raw.getValues()

    let startRow = data.findIndex(r => {
        if (r[columnNr] !== null && r[columnNr].length > 0) {
            return r[columnNr].match(stepString) // 1 := second column
        }
    })

    let lastRow = Sheet.getLastRow()
    // console.log(`Range found: ${startRow} : ${lastRow}`)
    return [startRow + 1, lastRow + 1]
}

function findValueRowStart(Sheet, stepString, columnNr) {
    console.log("starting search")
    let raw = Sheet.getDataRange()
    let data = raw.getValues()

    let startRow = data.findIndex(r => {
        if (r[columnNr] !== null && r[columnNr].length > 0) {
            return r[columnNr].match(stepString) // 1 := second column
        }
    })
    // console.log(`Range found: ${startRow} : ${lastRow}`)
    return (startRow + 1) || null
}

function deleteRows(Sheet, startRow, lastRow) {
    if (startRow > 2) {
        console.log([startRow, lastRow - startRow])
        Sheet.deleteRows(startRow, lastRow - startRow)
    }
}

function testingRowFunction(){
    let value="^The following is a preliminary evaluation"
  //let value="^Please add your response"
    let SS=SpreadsheetApp.openById("1g1t3PCVTQOltRRsJqugBGBq7uYqkf8yHGsSH6ZkfDig")

    let Sheets=SS.getSheets()

    let Sheet
    let rows=['""','""','""','""','""','""','""','""']
    let row=""
    let lastCol

    for (let i=8;i<Sheets.length;i++){
        Sheet=Sheets[i]
        //Logger.log(Sheet.getName())

        row=findValueRowStart(Sheet, value, 2)

        if(row==null){rows.push('""')}
        else{
            lastCol=Sheet.getLastColumn()
            //Logger.log("firstRow="+row+", lastCol="+lastCol)
            
            rows.push('"C'+row+":"+columnToLetter(lastCol, 0)+row+'"')
            
        }
      
      Logger.log("row:"+rows)


    }


}
function UnprotectedCellsFunction(){
    let value="^Dummy Placeholder text"
    let SS=SpreadsheetApp.openById("1g1t3PCVTQOltRRsJqugBGBq7uYqkf8yHGsSH6ZkfDig")

    let Sheets=SS.getSheets()

    let Sheet
    let rows=['""','""','""','""','""','""','""','""']
    let row=""
    let lastCol, lastRow

    for (let i=8;i<Sheets.length;i++){
        Sheet=Sheets[i]
        //Logger.log(Sheet.getName())

        row=findValueRowStart(Sheet, value, 2)
        lastRow=row+1

        if(row==null){rows.push('""')}
        else{
            lastCol=Sheet.getLastColumn()
            //Logger.log("firstRow="+row+", lastCol="+lastCol)
            
            rows.push('"C'+row+":"+columnToLetter(lastCol, 0)+lastRow+'"')
            
        }
      
      Logger.log("row:"+rows)


    }


}

