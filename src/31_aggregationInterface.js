// process to fill whole summary scores sheet

/* global
    insertLabelColumn,
    addSummarySingleCompany
*/


// eslint-disable-next-line no-unused-vars
function fillSummaryScoresSheet(Sheet, Indicators, thisSubStepID, Companies, indicatorParams, includeElements,yoy) {

    let currentRow = 1
    let currentCol = 1

    // left column: indicator labels

    currentCol = insertLabelColumn(Sheet, thisSubStepID, Indicators, currentRow, currentCol, includeElements,yoy)

    // now operating in currentCol + 1
    if (!includeElements) {
        currentCol = 7
    }

    if(yoy){currentCol=2}
    // Main part: horizontal company-wise results

    Companies.forEach(Company => {

        // Mobile Total of Pre/Postpaid Hack

        if (Company.type === "telecom" &&
            Company.services.some(service => service.type === "mobile") &&
            Company.services[0].subtype !== "mobileTotal") {

            Company.services.splice(0, 0, {
                "type": "mobile",
                "subtype": "mobileTotal",
                "label": {
                    "current": "Mobile Services"
                }
            })
        }



        if(!yoy){currentCol = addSummarySingleCompany(Sheet, thisSubStepID, Indicators, indicatorParams, currentRow, currentCol, Company, includeElements)}
        
        else{
            currentCol=addSummarySingleCompanyYoy(Sheet, thisSubStepID, Indicators, indicatorParams, currentRow, currentCol, Company, includeElements)
        }
    })

    if (includeElements) {
        Sheet.collapseAllRowGroups()
    }

    let lastRow = Sheet.getLastRow()
    let lastColumn = Sheet.getLastColumn()

    Sheet.getRange(1, 1, lastRow, lastColumn)
        .setFontFamily("Roboto")
        .setFontSize(10)
        .setVerticalAlignment("top")

    return Sheet
}
