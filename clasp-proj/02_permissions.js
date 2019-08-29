// MAIN CALLER 
var me = Session.getEffectiveUser();

function mainPermissionsCaller(indexPrefix, companyShortName, sheetMode, filenameVersion, protectSteps, unprotectSteps, allowedEditors) {

	var filename = spreadSheetFileName(companyShortName, sheetMode, filenameVersion)

	clearAllProtections(filename)

	var indicatorArray = ["G1", "G2", "G3", "G4", "G5", "G6"]
	var editorsArray = ["sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"]

	var CompanyObj = importJsonCompany(companyShortName)
	var IndicatorsObj = importJsonIndicator()
	var ResearchStepsObj = importResearchSteps()

	var companyId = CompanyObj.id
	// identify steps for unprotection
	var unprotectStepsObj = findResearchStep(ResearchStepsObj, unprotectSteps)
	// Logger.log("received " + unprotectStepsObj.length + " steps")

	// identify steps for protection
	var protectStepsObj = findResearchStep(ResearchStepsObj, protectSteps)
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

	

	indicatorWiseProtectSheetUnprotectRanges(indexPrefix, sheetMode, filename, companyId, indicatorArray, unprotectStepsObj, editorsArray)

}

// --- // Components // --- //

// Component: removes Sheet-level protection and specific protected ranges 
function clearAllProtections(filename) {
	var thisSpreadsheet = connectToSpreadsheetByName(filename)
	// Logger.log("remote connected to " + thisSpreadsheet.getName())

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

function indicatorWiseProtectSheetUnprotectRanges(indexPrefix, sheetMode, filename, companyId, indicatorArray, unprotectStepsObj, editorsArray) {

	// Logger.log("to be connected to: " + filename)
	var thisSpreadsheet = connectToSpreadsheetByName(filename)
	// Logger.log("remote connected to: " + thisSpreadsheet.getName())

	// for each indicator (= sheet)
	for (var indicator in indicatorArray) {
		var sheet = thisSpreadsheet.getSheetByName(indicatorArray[indicator])
		var thisIndicator = indicatorArray[indicator]
		// Logger.log(sheet.getName())
		// Logger.log("sending: " + thisIndicator)

		singleStepProtectSheetUnprotectRanges(indexPrefix, sheetMode, sheet, companyId, thisIndicator, unprotectStepsObj, editorsArray)

	}
	// Logger.log("all steps processed")
}

// Protect the whole sheet, unprotect [ranges], then remove all other users from the list of editors.

function singleStepProtectSheetUnprotectRanges(indexPrefix, sheetMode, sheet, companyId, indicator, steps, editorsArray) {

	// Logger.log("In Single Step " + indicator)
	var protection = sheet.protect().setDescription('Full protected ' + indicator)

	var unprotected = []
	var rangeName
	var range

	for (step in steps) {
		rangeName = defineNamedRangeStringImport(indexPrefix, sheetMode, steps[step], indicator, "", companyId, "", "Step")
		// Logger.log(rangeName)
		range = sheet.getRange(rangeName)

		unprotected.push(range)
		
	}

	protection.setUnprotectedRanges(unprotected);

	// Ensure the current user is an editor before removing others. Otherwise, if the user's edit
	// permission comes from a group, the script will throw an exception upon removing the group.
	// var me = Session.getEffectiveUser();
	// Logger.log("me: " + me);
	// Logger.log("editorsObj: " + editorsArray);
	// Logger.log("editorsArray: " + [editorsArray]);
	protection.addEditor(me);
	// protection.removeEditors(protection.getEditors());
	protection.addEditors(editorsArray);
	if (protection.canDomainEdit()) {
		protection.setDomainEdit(false);
	}
}

