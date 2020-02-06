// MAIN CALLER 
var me = Session.getEffectiveUser() // TODO move inside logic

/**
 * 
 * @param {*} indexPrefix 
 * @param {*} companyShortName 
 * @param {*} sheetModeID 
 * @param {*} filenameSuffix 
 * @param {*} protectSteps 
 * @param {*} unprotectSteps 
 * @param {*} allowedEditors 
 * @param {*} useStepsSubset 
 * @param {*} useIndicatorSubset 
 */

function mainPermissionsCaller(indexPrefix, companyShortName, sheetModeID, filenamePrefix, filenameSuffix, protectSteps, unprotectSteps, allowedEditors, useStepsSubset, useIndicatorSubset) {

    var filename = spreadSheetFileName(filenamePrefix, sheetModeID, companyShortName, filenameSuffix)

    clearAllProtections(filename)

    var CompanyObj = importJsonCompany(companyShortName)
    var IndicatorsObj = importJsonIndicator(useIndicatorSubset)
    var ResearchStepsObj = importResearchSteps(useStepsSubset)

    var companyId = CompanyObj.id
    // identify steps for unprotection
    var unprotectStepsObj = findResearchStepShort(ResearchStepsObj, unprotectSteps)
    // Logger.log("received " + unprotectStepsObj.length + " steps")

    // identify steps for protection
    var protectStepsObj = findResearchStepShort(ResearchStepsObj, protectSteps)
    // Logger.log("received " + protectStepsObj.length + " steps")

    // reduce indicatorObj to array[Strings]

    var indicatorArray = []

    for (thisClass in IndicatorsObj.indicatorClasses) {
        for (indicator in IndicatorsObj.indicatorClasses[thisClass].indicators) {
            var thisIndicator = IndicatorsObj.indicatorClasses[thisClass].indicators[indicator].labelShort
            indicatorArray.push(thisIndicator)
        }
    }

    // Logger.log(indicatorArray)



    indicatorWiseProtectSheetUnprotectRanges(indexPrefix, sheetModeID, filename, companyId, indicatorArray, unprotectStepsObj, allowedEditors)

}

// --- // Components // --- //

// Component: removes Sheet-level protection and specific protected ranges 
function clearAllProtections(filename) {
    Logger.log("Unprotection Mode")
    var thisSpreadsheet = connectToSpreadsheetByName(filename, false)
    var success

    // remove protected ranges
    var protectionsRanges = thisSpreadsheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
    if (protectionsRanges.length === 0) {
        Logger.log("no protected RANGES found")
    } else {
        success = []
        for (var i in protectionsRanges) {
            var protectionRange = protectionsRanges[i]
            success.push(protectionRange.getDescription())
            if (protectionRange.canEdit()) {
                protectionRange.remove()
            }
        }
        Logger.log(success + " RANGES unprotected")
    }

    // unprotect sheets
    var protectionsSheets = thisSpreadsheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)
    if (protectionsSheets.length === 0) {
        // Logger.log('no protected SHEETS found')
    } else {
        success = []
        for (var i in protectionsSheets) {
            var protectionSheet = protectionsSheets[i]
            if (protectionSheet.canEdit()) {
                protectionSheet.remove()
                success++
            }
        }
        Logger.log(success + " SHEETS unprotected")
    }

}

// --- PROTECTIONS --- //

// --- V2 --- //

// --- better Logic: protect Sheet, unportect ranges --- //

function indicatorWiseProtectSheetUnprotectRanges(indexPrefix, sheetModeID, filename, companyId, indicatorArray, unprotectStepsObj, allowedEditors) {

    Logger.log("Protection Mode")

    Logger.log("to be connected to: " + filename)
    var thisSpreadsheet = connectToSpreadsheetByName(filename, false)
    Logger.log("remote connected to: " + thisSpreadsheet.getName())

    // for each indicator (= sheet)
    for (var indicator in indicatorArray) {
        var sheet = thisSpreadsheet.getSheetByName(indicatorArray[indicator])
        var thisIndicator = indicatorArray[indicator]
        // Logger.log(sheet.getName())
        // Logger.log("sending: " + thisIndicator)

        singleStepProtectSheetUnprotectRanges(indexPrefix, sheetModeID, sheet, companyId, thisIndicator, unprotectStepsObj, allowedEditors)

    }
    thisSpreadsheet.addViewers(allowedEditors)
    var thisFile = DriveApp.getFileById(thisSpreadsheet.getId())
    thisFile.addViewers(allowedEditors)
    Logger.log("all steps processed")
}

// Protect the whole sheet, unprotect [ranges], then remove all other users from the list of editors.

function singleStepProtectSheetUnprotectRanges(indexPrefix, sheetModeID, sheet, companyId, indicator, steps, allowedEditors) {

    // Logger.log("In Single Step " + indicator)
    var protection = sheet.protect().setDescription(steps + " open")

    var unprotectedRanges = []
    var rangeName
    var range

    for (step in steps) {
        rangeName = defineNamedRangeStringImport(indexPrefix, sheetModeID, steps[step], indicator, "", companyId, "", "Step")
        // Logger.log(rangeName)
        range = sheet.getRange(rangeName)

        unprotectedRanges.push(range)

    }

    protection.setUnprotectedRanges(unprotectedRanges)

    protection.removeEditors(protection.getEditors())

    protection.addEditors(allowedEditors)
    if (protection.canDomainEdit()) {
        protection.setDomainEdit(false)
    }
}

// Protect the whole sheet, unprotect [ranges], then remove all other users from the list of editors.

function singleSheetProtect(sheet, sheetName) {

    // Logger.log("In Single Step " + indicator)
    var protection = sheet.protect().setDescription(sheetName + " protected")

}