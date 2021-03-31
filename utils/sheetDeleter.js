// Dev Helper to quickly delete an array of Sheet names from a Spreadsheet

function deleteTabs() {
    let SS = SpreadsheetApp.openById('1FZUZhEPTegWXqjkR5ZoBevyIHsCjkIl4DnBtitlLajA')
    let Sheet
    ;['2020 Sources', '2020 Outcome', 'G4a', 'F1a', 'P1a'].forEach((indicator) => {
        Sheet = SS.getSheetByName(indicator)
        Sheet && SS.deleteSheet(Sheet)
    })
}
