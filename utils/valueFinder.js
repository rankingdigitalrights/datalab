/* Brute: takes a start String and Sheet.getLastRow() */
function mainDeleteStepRowsA() {
    let stepString = '^Step 7.0' // "^[G|F|P].*\n+Response" // "^Step 3"
    let columnNr = 0 // starts with 0 := A so 1 := B

    let SS = openSpreadsheetByID('1UwQa0iIfWcEFW6cRxlmw-Sfw3qvs3bwQQ5vwmptrD8o')

    // let Indicators = subsetIndicatorsObject(indicatorsVector, "G1") // F5a|P1$// indicatorsVector
    let Indicators = indicatorsVector

    let result = []
    result.push([
        'indicator',
        'elements',
        'scope',
        'startRow',
        'endRow',
        'maxCol',
    ])

    let Sheet, rows
    Indicators.indicatorCategories.forEach((Category) =>
        Category.indicators.forEach((Indicator) => {
            console.log(Indicator.labelShort)
            Sheet = SS.getSheetByName(Indicator.labelShort)
            if (Sheet !== null) {
                rows = findStepRows(Sheet, stepString, columnNr)
                // deleteRows(Sheet, rows[0], rows[1]) // DA-A-A-NGER
                result.push([
                    Indicator.labelShort,
                    Indicator.elements.length,
                    Indicator.scoringScope,
                    rows[0],
                    rows[1],
                    Sheet.getLastColumn(),
                ])
            } else {
                result.push([
                    Indicator.labelShort,
                    Indicator.elements.length,
                    Indicator.scoringScope,
                    'Sheet not found',
                    '',
                    '',
                ])
            }
        })
    )

    console.log(result)
}

/* Segmented: takes a start String and an End String */
function mainDeleteStepRowsB() {
    let stepString = '^Step 7.0' // "^Old Step 5"
    let endStepString = '^Step 7.1' // "^Step 6"
    let columnNr = 0 // starts with 0 := A so 1 := B

    let SS = openSpreadsheetByID('18nbBe8yAIF2vjwZjioohW1BoiYPg9OE916-1pWT7Stk')

    let Indicators = subsetIndicatorsObject(indicatorsVector, [
        'G3',
        'G4a',
        'G4b',
        'G4c',
        'G4d',
        'G4e',
        'G5',
        'G6a',
        'G6b',
        'F1a',
        'F1b',
        'F1c',
        'F1d',
        'F2a',
        'F2b',
        'F2c',
        'F2d',
    ]) // F5a|P1$// indicatorsVector
    // let Indicators = indicatorsVector

    let result = []
    result.push([
        'indicator',
        'elements',
        'scope',
        'startRow',
        'endRow',
        'maxCol',
    ])

    let Sheet, rowsStart, rowsEnd
    Indicators.indicatorCategories.forEach((Category) =>
        Category.indicators.forEach((Indicator) => {
            console.log(Indicator.labelShort)
            Sheet = SS.getSheetByName(Indicator.labelShort)
            if (Sheet !== null) {
                rowsStart = findStepRows(Sheet, stepString, columnNr)
                rowsEnd = findStepRows(Sheet, endStepString, columnNr)
                // deleteRows(Sheet, rowsStart[0], rowsEnd[0]) // DA-A-A-NGER}
                result.push([
                    Indicator.labelShort,
                    Indicator.elements.length,
                    Indicator.scoringScope,
                    rowsStart[0],
                    rowsEnd[0],
                    Sheet.getLastColumn(),
                ])
            } else {
                result.push([
                    Indicator.labelShort,
                    Indicator.elements.length,
                    Indicator.scoringScope,
                    'Sheet not found',
                    '',
                    '',
                ])
            }
        })
    )

    console.log('results\n\n')
    console.log(result)
}

function findStepRows(Sheet, stepString, columnNr) {
    console.log('starting search')
    let raw = Sheet.getDataRange()
    let data = raw.getValues()

    let startRow = data.findIndex((r) => {
        if (r[columnNr] !== null && r[columnNr].length > 0) {
            return r[columnNr].match(stepString) // 1 := second column
        }
    })

    let lastRow = Sheet.getLastRow()
    // console.log(`Range found: ${startRow} : ${lastRow}`)
    return [startRow + 1, lastRow + 1]
}

function findValueRowStart(Sheet, stepString, columnNr) {
    console.log('starting search')
    let raw = Sheet.getDataRange()
    let data = raw.getValues()

    let startRow = data.findIndex((r) => {
        if (r[columnNr] !== null && r[columnNr].length > 0) {
            return r[columnNr].match(stepString) // 1 := second column
        }
    })
    // console.log(`Range found: ${startRow} : ${lastRow}`)
    return startRow + 1 || null
}

function deleteRows(Sheet, startRow, lastRow) {
    if (startRow > 2) {
        console.log([startRow, lastRow - startRow])
        Sheet.deleteRows(startRow, lastRow - startRow)
    }
}

function testingRowFunction() {
    let value = '^The following is a preliminary evaluation'
    let value1 = '^Please add your response'
    let SS = SpreadsheetApp.openById(
        '18ylfgtOW2fw1Fs7HaL3UEsxhmk4_73Ru7sTcmHA2t24'
    )

    let Sheets = SS.getSheets()

    let Sheet
    let rows = ['""', '""', '""', '""', '""', '""', '""', '""']
    let rows1 = ['""', '""', '""', '""', '""', '""', '""', '""']
    let row = ''
    let lastCol

    for (let i = 8; i < Sheets.length; i++) {
        Sheet = Sheets[i]
        //console.log(Sheet.getName())

        row = findValueRowStart(Sheet, value, 2)

        if (row == null) {
            rows.push('""')
        } else {
            lastCol = Sheet.getLastColumn()
            //console.log("firstRow="+row+", lastCol="+lastCol)

            rows.push('"C' + row + ':' + columnToLetter(lastCol, 0) + row + '"')
        }

        row = findValueRowStart(Sheet, value1, 2)

        if (row == null) {
            rows1.push('""')
        } else {
            lastCol = Sheet.getLastColumn()
            //console.log("firstRow="+row+", lastCol="+lastCol)

            rows1.push(
                '"C' + row + ':' + columnToLetter(lastCol, 0) + row + '"'
            )
        }

        //console.log("row:"+rows)
    }
    console.log('row:' + rows)
    console.log('row1:' + rows1)
}

function UnprotectedCellsFunction() {
    let value = 'Sources:'
    let SS = SpreadsheetApp.openById(
        '1pRnFSD5256vgvYBHji-tq8OuEyuhKltWY_vaoSVjGow'
    )

    let Sheets = SS.getSheets()

    let Sheet
    let rows = ['""', '""', '""', '""', '""', '""', '""', '""']
    let row = ''
    let row1 = ''
    let rows1 = ['""', '""', '""', '""', '""', '""', '""', '""']
    let lastCol, lastRow

    for (let i = 8; i < Sheets.length; i++) {
        Sheet = Sheets[i]
        //console.log(Sheet.getName())

        row = findValueRowStart(Sheet, value, 1) - 1

        lastRow = row + 1

        if (row == null) {
            rows.push('""')
            rows1.push('""')
        } else if (
            Sheet.getName() == 'Governance' ||
            Sheet.getName() == 'Freedom of Expression' ||
            Sheet.getName() == 'Privacy'
        ) {
            rows.push('""')
            rows1.push('""')
        } else {
            lastCol = Sheet.getLastColumn()
            //console.log("firstRow="+row+", lastCol="+lastCol)

            rows.push(
                '"C' + row + ':' + columnToLetter(lastCol, 0) + lastRow + '"'
            )
            rows1.push('"' + row + ':' + row + '"')
        }
    }
    console.log('row:' + rows)
    console.log('row1:' + rows1)
}

function testingFont() {
    //let value="^The following is a preliminary evaluation"
    let value = '^Indicator guidance:'
    let SS = SpreadsheetApp.openById(
        '18p3m5OFfteCUxRyefa9hyMwmuzVTRbwXm85sLxizcnA'
    )

    let Sheets = SS.getSheets()

    let Sheet
    let rows1 = ['""', '""', '""', '""', '""', '""', '""', '""']
    let rows2 = ['""', '""', '""', '""', '""', '""', '""', '""']
    let row = ''
    let lastRow, lr3, lastCol

    for (let i = 8; i < Sheets.length; i++) {
        Sheet = Sheets[i]
        //console.log(Sheet.getName())

        row = findValueRowStart(Sheet, value, 1)
        //row=findValueRowStart(Sheet, value, 2)

        if (row == null) {
            rows1.push('""')
            rows2.push('""')
        } else {
            lastRow = row + 2
            lr3 = row + 4
            lastCol = Sheet.getLastColumn()

            //console.log("firstRow="+row+", lastCol="+lastCol)

            rows1.push(
                '"A' + 4 + ':' + columnToLetter(lastCol, 0) + lastRow + '"'
            )
            rows2.push(
                '"A' + lastRow + ':' + columnToLetter(lastCol, 0) + lr3 + '"'
            )
        }

        //console.log("row:"+rows)
    }
    console.log('row1:' + rows1)
    console.log('row2:' + rows2)
}
