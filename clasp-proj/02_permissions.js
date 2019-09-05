// MAIN CALLER 
var me = Session.getEffectiveUser();

function mainPermissionsCaller(indexPrefix, companyShortName, sheetMode, filenameSuffix, protectSteps, unprotectSteps, allowedEditors, stepsSubset, indicatorSubset) {

	var filename = spreadSheetFileName(companyShortName, sheetMode, filenameSuffix)

	clearAllProtections(filename)

	var CompanyObj = importJsonCompany(companyShortName)
	var IndicatorsObj = importJsonIndicator(indicatorSubset)
	var ResearchStepsObj = importResearchSteps(stepsSubset)

	var companyId = CompanyObj.id
	// identify steps for unprotection
	var unprotectStepsObj = findResearchStepShort(ResearchStepsObj, unprotectSteps)
	// Logger.log("received " + unprotectStepsObj.length + " steps")

	// identify steps for protection
	var protectStepsObj = findResearchStepShort(ResearchStepsObj, protectSteps)
	// Logger.log("received " + protectStepsObj.length + " steps")

	// reduce indicatorObj to array[Strings]

	var indicatorArray = []

	for (thisClass in IndicatorsObj.indicatorClass) {
		for (indicator in IndicatorsObj.indicatorClass[thisClass].indicators) {
			var thisIndicator = IndicatorsObj.indicatorClass[thisClass].indicators[indicator].labelShort
			indicatorArray.push(thisIndicator)
		}
	}

	// Logger.log(indicatorArray)



	indicatorWiseProtectSheetUnprotectRanges(indexPrefix, sheetMode, filename, companyId, indicatorArray, unprotectStepsObj, allowedEditors)

}

// --- // Components // --- //

// Component: removes Sheet-level protection and specific protected ranges 
function clearAllProtections(filename) {
	Logger.log("Unprotection Mode")
	var thisSpreadsheet = connectToSpreadsheetByName(filename)
	var success

	// remove protected ranges
	var protectionsRanges = thisSpreadsheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
	if (protectionsRanges.length === 0) {
		Logger.log('no protected RANGES found')
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

function indicatorWiseProtectSheetUnprotectRanges(indexPrefix, sheetMode, filename, companyId, indicatorArray, unprotectStepsObj, allowedEditors) {

	Logger.log("Protection Mode")

	Logger.log("to be connected to: " + filename)
	var thisSpreadsheet = connectToSpreadsheetByName(filename)
	Logger.log("remote connected to: " + thisSpreadsheet.getName())

	// for each indicator (= sheet)
	for (var indicator in indicatorArray) {
		var sheet = thisSpreadsheet.getSheetByName(indicatorArray[indicator])
		var thisIndicator = indicatorArray[indicator]
		// Logger.log(sheet.getName())
		// Logger.log("sending: " + thisIndicator)

		singleStepProtectSheetUnprotectRanges(indexPrefix, sheetMode, sheet, companyId, thisIndicator, unprotectStepsObj, allowedEditors)

	}
	thisSpreadsheet.addViewers(allowedEditors);
	var thisFile = DriveApp.getFileById(thisSpreadsheet.getId())
	thisFile.addViewers(allowedEditors)
	Logger.log("all steps processed")
}

// Protect the whole sheet, unprotect [ranges], then remove all other users from the list of editors.

function singleStepProtectSheetUnprotectRanges(indexPrefix, sheetMode, sheet, companyId, indicator, steps, allowedEditors) {

	// Logger.log("In Single Step " + indicator)
	var protection = sheet.protect().setDescription(steps + " open")

	var unprotectedRanges = []
	var rangeName
	var range

	for (step in steps) {
		rangeName = defineNamedRangeStringImport(indexPrefix, sheetMode, steps[step], indicator, "", companyId, "", "Step")
		// Logger.log(rangeName)
		range = sheet.getRange(rangeName)

		unprotectedRanges.push(range)

	}

	protection.setUnprotectedRanges(unprotectedRanges);

	protection.removeEditors(protection.getEditors());

	protection.addEditors(allowedEditors);
	if (protection.canDomainEdit()) {
		protection.setDomainEdit(false);
	}
}

