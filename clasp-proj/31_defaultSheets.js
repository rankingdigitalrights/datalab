    // --- // creates sources page // --- //

    function fillSourceSheet(thisSheet) {

        var webArchiveLink = '=HYPERLINK("https://archive.org/web/", "Internet Archive")'
        thisSheet.appendRow(["Source reference number", "Document title", "URL", "Date of document\n(if applicable)\nYYYY-MM-DD", "Date accessed\nYYYY-MM-DD", "Saved source link", webArchiveLink, "Has this policy changed from the previous year's Index?"])

        var lastCol = thisSheet.getLastColumn()
        
        thisSheet.getRange(1, 1, 1, lastCol)
            .setFontFamily("Roboto")    
            .setFontWeight("bold")
            .setVerticalAlignment("top")
            .setHorizontalAlignment("center")
            .setWrap(true)
            .setFontSize(11)

        thisSheet.getRange(2, 1, 99, lastCol)
            .setFontFamily("Roboto")
            .setVerticalAlignment("top")
            .setWrap(true)
            .setFontSize(10)

        thisSheet.setColumnWidths(1, lastCol, 200)
        thisSheet.setFrozenRows(1)
    }

    function fillPrevOutcomeSheet(thisSheet, sourcesTabName) {
        thisSheet.setName(importedOutcomeTabName)
        var cell = firstSheet.getActiveCell()
        cell.setValue(externalFormula.toString())
    }

    function fillPointsSheet(thisSheet, sourcesTabName) {
        thisSheet.appendRow(["Results:", "not selected", "yes", "partial", "no", "no disclosure found", "N/A"])
        thisSheet.appendRow(["Score A:", "---", "100", "50", "0", "0", "exclude"])
        thisSheet.appendRow(["Score B:", "---", "0", "50", "100", "0", "exclude"])
    }