function skipIndicatorGuidance(thisIndicator, activeRow, includeRGuidanceLink) {

    // TODO probably move all formatting params to JSON

    var row = activeRow

    row += 1

    var tempStartRow

    row += 1


    thisIndicator.elements.forEach(function (element) {
        row += 1
    })

    if (includeRGuidanceLink) {
        row += 1
    } else {
        row -= 1
    }

    row += 1

    row += 1

    activeRow = row
    return activeRow
}

function fixIndicatorGuidance(sheet, currentClass, thisIndicator, activeRow, activeCol, nrOfIndSubComps, hasOpCom, numberOfColumns, bridgeCompColumnsNr, companyNumberOfServices, includeRGuidanceLink, collapseRGuidance) {

    // TODO probably move all formatting params to JSON

    var row = activeRow
    var col = activeCol

    var maxColHeadings = (2 + bridgeCompColumnsNr) * (nrOfIndSubComps) + 1
    if (companyNumberOfServices == 1 && !hasOpCom) {
        maxColHeadings -= 1
    }

    var maxRow = 1

    var indTitle = thisIndicator.labelShort + ". " + thisIndicator.labelLong
    if (thisIndicator.description.length > 1) {
        indTitle = indTitle + ": " + thisIndicator.description
    }

    // Indicator Heading
    var cell = sheet.getRange(row, col)
        .setValue(indTitle)
        .setFontWeight("bold")
        .setFontSize(14)
        .setHorizontalAlignment("left")
        .setVerticalAlignment("middle")
        .setFontFamily("Oswald")
        .setWrap(true)

    sheet.setRowHeight(row, 40)
    sheet.getRange(row, col, 1, numberOfColumns).merge()
    sheet.getRange(row, col, 1, numberOfColumns).setBackground("lightgrey")
    sheet.setFrozenRows(1)

    row += 1

    var tempStartRow

    if (includeRGuidanceLink) {
        // General Instruction
        cell = sheet.getRange(row, col)
            .setValue("▶ Please read the indicator-specific guidance and discussions before starting the research!")
            .setFontWeight("bold")
            .setFontSize(9)
            .setHorizontalAlignment("left")
            .setVerticalAlignment("middle")
            .setFontFamily("Roboto Mono")
            .setWrap(true)
            .setFontColor("#ea4335")
        // .setFontColor("chocolate")


        sheet.setRowHeight(row, 40)
        sheet.getRange(row, col, 1, numberOfColumns).merge()
        sheet.getRange(row, col, 1, numberOfColumns).setBackground("WhiteSmoke")

        row += 1
        tempStartRow = row // for grouping
    } else {
        tempStartRow = row // for grouping
        row += 1
    }

    

    // Element Instructions
    cell = sheet.getRange(row, 1)
        .setValue("Elements:")
        .setFontWeight("bold")
        .setHorizontalAlignment("right")
        .setVerticalAlignment("top")
        .setFontFamily("Roboto Mono")

    col += 1

    thisIndicator.elements.forEach(function (element) {
        cell = sheet.getRange(row, col)
            .setValue(element.labelShort + ": " + element.description)
            .setFontSize(10)
            .setFontFamily("Roboto")
            .setHorizontalAlignment("left")
        cell = sheet.getRange(row, col, 1, maxColHeadings).merge().setWrap(true)
        row += 1
    })

    if (includeRGuidanceLink) {
        row += 1
        var indicatorLink = "https://rankingdigitalrights.org/2019-indicators/#" + thisIndicator.labelShort

        // TODO: Parameterize

        cell = sheet.getRange(row, 1)
            .setValue("Link to Research Guidance:")
            .setFontWeight("bold")
            .setHorizontalAlignment("right")
            .setFontFamily("Roboto Mono")

        cell = sheet.getRange(row, col, 1, maxColHeadings).merge().setWrap(true)
            .setValue(indicatorLink)

        // var tempLastRow = row // for grouping
    } else {
        row -= 1
    }

    // var rangeStep = sheet.getRange(tempStartRow, 1, row - tempStartRow + 1, numberOfColumns)
    // rangeStep.shiftRowGroupDepth(1)

    // if(collapseRGuidance) {
    //     rangeStep.collapseGroups()
    // }

    row += 1

    sheet.getRange(tempStartRow, 1, row - tempStartRow + 1, numberOfColumns).setBackground("WhiteSmoke")

    sheet.getRange(row, activeCol, 1, numberOfColumns).setBorder(null, null, true, null, null, null, "black", null)

    row += 1

    activeRow = row
    return activeRow
}

function skipMainStepHeader(thisIndCat, activeRow) {

    var activeCol = 1

    // if the indicator does indeed have components, it freezes the additional row in which they are
    if (thisIndCat.hasSubComponents == true) {
        activeRow = activeRow + 1
    }

    return activeRow
}



// function just creates a single row in which in the first column a label is added
function fixExtraInstruction(currentStep, stepCNr, activeRow, activeCol, sheet) {

    return activeRow + 1
}

// TODO - obsolete description - a step header is a row in which in the first column the name and description of the step is listed
// and in the remaining columns a placeholderText is added
function fixSubStepHeader(sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    activeRow = activeRow + 1

    // sets up labels in the first column
    var cell = sheet.getRange(activeRow, 1)
    var text = currentStep.label
    cell.setValue(text)
        .setBackground(currentStep.subStepColor)
        .setFontWeight("bold")
    // cell = textUnderline(cell)

    // TODO
    // activeRow = addMainStepHeader(sheet, currentClass, CompanyObj, activeRow, SS, nrOfIndSubComps, companyNumberOfServices) // sets up header

    var thisFiller = currentStep.components[stepCNr].placeholderText
    var thisFirstCol = 2
    var thisLastCol = ((companyNumberOfServices + 2) * nrOfIndSubComps)
    // for remaining company, opCom, and services columns it adds the placeholderText

    var cellName
    var thisCell
    var component

    var activeCol = thisFirstCol

    var stepCompType = currentStep.components[stepCNr].id

    for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

        // TODO: fix cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            for (var k = 0; k < nrOfIndSubComps; k++) {
                thisCell = sheet.getRange(activeRow, 1 + serviceNr + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "group", stepCompType)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1

            }
        } else if (serviceNr == 2) {
            // opCom
            for (var k = 0; k < nrOfIndSubComps; k++) {
                thisCell = sheet.getRange(activeRow, 1 + nrOfIndSubComps + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "opCom", stepCompType)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1

            }
        } else {
            // services
            for (var k = 0; k < nrOfIndSubComps; k++) {
                thisCell = sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var g = serviceNr - 3 // helper for Services

                component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                SS.setNamedRange(cellName, thisCell)
                activeCol += 1
            }
        }

    }

    return activeRow + 1

}

// addScoringOptions creates a dropdown list in each column for each subindicator
function fixScoringOptions(sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    var stepCompType = currentStep.components[stepCNr].id

    // row labels
    for (var elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
        var activeCol = 1

        var thisElement = currentIndicator.elements[elemNr]

        var noteString = thisElement.labelShort + ": " + thisElement.description

        // setting up the labels
        var cell = sheet.getRange(activeRow + elemNr, activeCol)
            .setValue(currentStep.components[stepCNr].label + thisElement.labelShort)
            .setBackground(currentStep.subStepColor)
            .setNote(noteString)
        activeCol += 1

        for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // creates column(s) for overall company
            if (serviceNr == 1) {

                // loops through the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {

                    var thisCell = sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, thisElement.labelShort, component, CompanyObj.id, "group", stepCompType)


                    SS.setNamedRange(cellName, thisCell) // names cells

                    activeCol += 1
                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // loops through the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {
                    var thisCell = sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, thisElement.labelShort, component, CompanyObj.id, "opCom", stepCompType)

                    SS.setNamedRange(cellName, thisCell) // names cells

                    activeCol += 1
                }
            }

            // creating all the service columns
            else {
                for (var k = 0; k < nrOfIndSubComps; k++) {
                    var thisCell = sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var g = serviceNr - 3 // helper for Services

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    var cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, thisElement.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                    SS.setNamedRange(cellName, thisCell) // names cells

                    activeCol += 1
                }
            }
        }
    }

    activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}


// this function creates a cell for comments for each subindicator and names the ranges

function fixComments(sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {


    var stepCompType = currentStep.components[stepCNr].id

    // for (var i = 0; i < currentIndicator.elements.length; i++) {
    //     sheet.setRowHeight(activeRow + i, 50)
    // } // increases height of row

    // loops through subindicators
    for (var elemNr = 0; elemNr < currentIndicator.elements.length; elemNr++) {
        var activeCol = 1
        var cellName

        // adding the labels
        var cell = sheet.getRange(activeRow + elemNr, activeCol)
        cell.setValue(currentStep.components[stepCNr].label + currentIndicator.elements[elemNr].labelShort + currentStep.components[stepCNr].label2)
        cell.setBackground(currentStep.subStepColor) // colors cell
        activeCol += 1

        for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

            // setting up the columns for the overall company
            if (serviceNr == 1) {

                // looping through the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {
                    cell = sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "group", stepCompType)

                    SS.setNamedRange(cellName, cell)
                    activeCol += 1

                }
            }

            // setting up opCom column(s)
            else if (serviceNr == 2) {

                // looping through the number of components
                for (var k = 0; k < nrOfIndSubComps; k++) {

                    cell = sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, "opCom", stepCompType)

                    SS.setNamedRange(cellName, cell)
                    activeCol += 1

                }
            }

            // setting up columns for all the services
            else {
                for (var k = 0; k < nrOfIndSubComps; k++) {

                    cell = sheet.getRange(activeRow + elemNr, activeCol)

                    // cell name formula; output defined in 44_rangeNamingHelper.js

                    var g = serviceNr - 3 // helper for Services

                    var component = ""
                    if (nrOfIndSubComps != 1) {
                        component = currentClass.components[k].labelShort
                    }

                    cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.elements[elemNr].labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                    SS.setNamedRange(cellName, cell)
                    activeCol += 1

                }

            }

        }
    }


    activeRow = activeRow + currentIndicator.elements.length
    return activeRow
}

// this function adds an element drop down list to a single row

function fixBinaryEvaluation(sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {

    var thisStepComponent = currentStep.components[stepCNr]
    var stepCompType = currentStep.components[stepCNr].id
    var activeCol = 1
    var cellName

    // sets up the labels
    var cell = sheet.getRange(activeRow, activeCol)
        .setValue(thisStepComponent.label)
        .setBackground(currentStep.subStepColor)
    if (thisStepComponent.type === "binaryReview") { cell.setFontWeight("bold").setFontStyle("italic").setHorizontalAlignment("center") }
    activeCol += 1

    for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) { // (((companyNumberOfServices+2)*nrOfIndSubComps)+1)

        // names the cells into which answers will be put
        if (serviceNr == 1) {
            // overall company
            for (var k = 0; k < nrOfIndSubComps; k++) {
                cell = sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "group", stepCompType)

                SS.setNamedRange(cellName, cell) // names cells
                activeCol += 1
            }
        }

        // setting up the opCom row
        else if (serviceNr == 2) {
            for (var k = 0; k < nrOfIndSubComps; k++) {
                cell = sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "opCom", stepCompType)

                SS.setNamedRange(cellName, cell) // names cells
                activeCol += 1
            }
        }

        // taking care of all the service columns
        else {
            for (var k = 0; k < nrOfIndSubComps; k++) {
                cell = sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var g = serviceNr - 3
                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                SS.setNamedRange(cellName, cell) // names cells
                activeCol += 1
            }
        }
    }

    return activeRow + 1
}


// the sources step adds a single row in which the sources of each column can be listed

function fixSources(sheet, currentIndicator, CompanyObj, activeRow, SS, currentStep, stepCNr, nrOfIndSubComps, currentClass, companyNumberOfServices) {
    var activeCol = 1

    var stepCompType = currentStep.components[stepCNr].id


    // adding label
    var cell = sheet.getRange(activeRow, activeCol)
        .setValue(currentStep.components[stepCNr].label)
        .setBackground(currentStep.subStepColor)
    activeCol += 1
    var cellName

    for (var serviceNr = 1; serviceNr < (companyNumberOfServices + 3); serviceNr++) {

        // TODO: fix cell reference for OpCom

        if (serviceNr == 1) {
            // main company
            for (var k = 0; k < nrOfIndSubComps; k++) {
                cell = sheet.getRange(activeRow, 1 + serviceNr + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "group", stepCompType)

                SS.setNamedRange(cellName, cell)
                activeCol += 1

            }
        } else if (serviceNr == 2) {
            // opCom
            for (var k = 0; k < nrOfIndSubComps; k++) {
                cell = sheet.getRange(activeRow, 1 + nrOfIndSubComps + k)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, "opCom", stepCompType)

                SS.setNamedRange(cellName, cell)
                activeCol += 1

            }
        } else {
            // services
            for (var k = 0; k < nrOfIndSubComps; k++) {
                cell = sheet.getRange(activeRow, activeCol)

                // cell name formula; output defined in 44_rangeNamingHelper.js

                var g = serviceNr - 3 // helper for Services

                var component = ""
                if (nrOfIndSubComps != 1) {
                    component = currentClass.components[k].labelShort
                }

                cellName = defineNamedRangeStringImport(indexPrefix, "DC", currentStep.subStepID, currentIndicator.labelShort, component, CompanyObj.id, CompanyObj.services[g].id, stepCompType)

                SS.setNamedRange(cellName, cell)
                activeCol += 1
            }
        }

    }

    return activeRow + 1
}
