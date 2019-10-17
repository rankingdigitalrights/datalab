    // --- // creates sources page // --- //

    function fillSourceSheet(thisSheet) {

        var webArchiveLink = '=HYPERLINK("https://archive.org/web/", "Internet Archive")'
        thisSheet.appendRow(["Source reference number", "Document title", "URL", "Date of document\n(if applicable)", "Date accessed", "Saved source link", webArchiveLink, "Has this policy changed from the previous year's Index?"])
        thisSheet.getRange(1, 1, 1, thisSheet.getLastColumn())
            .setFontWeight("bold")
            .setFontFamily("Roboto")
            .setVerticalAlignment("top")
            .setHorizontalAlignment("center")
            .setWrap(true)
            .setFontSize(12)
        thisSheet.setColumnWidths(1, thisSheet.getLastColumn(), 200)
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