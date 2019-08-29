// siganture for refactoring
// modifyPermissions(SpreadsheetName, stepToBeProtected)

var permissionRangesJSON = {
  "steps": {
    "step1": {
      "range": "RDR2019DCS01ivm1",
      "step": 1
    },
    "step1_5": {
      "range": "RDR2019DCS01.5ivm1",
      "step": 1.5
    },
    "step2": {
      "range": "RDR2019DCS02ivm1",
      "step": 2
    }
  }
}
// MAIN CALLER 

function mainPermissionsCaller(companyShortName, filenameVersion, protectStep, unprotectStep, allowedEditors) {

  var sheetMode = 'DC'

  // var companyShortName = "verizon_DC_Prototype_v4";
  var spreadsheetID = "1wsYA33ld17K8mJzclNF3LZNI8XDc07lln2bVfv5hOZs";
  var indicatorString = ["G1", "G2", "G3", "G4", "G5", "G6"];
  var indicatorArray = ["G1", "G2", "G3", "G4", "G5", "G6"];
  var editorsArray = ["sperling@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org"]
  
  var filename = spreadSheetFileName(companyShortName, sheetMode, filenameVersion);

  clearAllProtections(filename)

  // StepWiseProtectSheetUnprotectRanges(
  //   spreadsheetName,
  //   indicatorArray,
  //   permissionRangesJSON,                                      
  //   editorsArray
  // );
  
}


// removes Sheet-level protection and specific protected ranges //

function clearAllProtections(filename) {
  var thisSpreadsheet = connectToSpreadsheetByName(filename);
  Logger.log("remote connected to " + thisSpreadsheet.getName());
  
  var success;

  // remove protected ranges
  var protectionsRanges = thisSpreadsheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  if (protectionsRanges.length === 0) { Logger.log('no protected RANGES found') } else {
    success = [];
    for (var i in protectionsRanges) {
      var protectionRange = protectionsRanges[i];
      success.push(protectionRange.getDescription())
      if (protectionRange.canEdit()) {
        protectionRange.remove();
      }
    }
    Logger.log(success + " RANGES unprotected")
  }

  // unprotect sheets
  var protectionsSheets = thisSpreadsheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  if (protectionsSheets.length === 0) { Logger.log('no protected SHEETS found') } else {
    success = [];
    for (var i in protectionsSheets) {
      var protectionSheet = protectionsSheets[i];
      if (protectionSheet.canEdit()) {
        protectionSheet.remove();
        success++
      }
    }
    Logger.log(success + "SHEETS unprotected")
  }

}

// --- PROTECTIONS --- //

// --- V2 --- //

// --- better Logic: protect Sheet, unportect ranges --- //

function StepWiseProtectSheetUnprotectRanges(spreadsheet, indicators, ranges, editors) {

  Logger.log("to be connected to: " + spreadsheet);
  var thisSpreadsheet = connectToSpreadsheetByName(spreadsheet);
  Logger.log("remote connected to: " + thisSpreadsheet.getName());

  for each(var indicator in indicators) {
    var sheet = thisSpreadsheet.getSheetByName(indicator);
    Logger.log(sheet.getName());
    SingleProtectSheetUnprotectRanges(sheet, indicator, ranges, editors)
  }
}

// Protect the whole sheet, unprotect [ranges], then remove all other users from the list of editors.

function SingleProtectSheetUnprotectRanges(sheet, indicator, ranges, editors) {
  Logger.log("In Single Step " + indicator);
  var protection = sheet.protect().setDescription('Full protected ' + indicator);

  var unprotected = [];

  for each (var step in ranges.steps) {
    Logger.log(indicator + " / " + step.range);
    Logger.log("formula : " + step.range + indicator);
    // setStepProtection(thisSpreadsheet, indicator, step);
    unprotected.push(sheet.getRange(step.range + indicator));
  }

  protection.setUnprotectedRanges(unprotected);

  // Ensure the current user is an editor before removing others. Otherwise, if the user's edit
  // permission comes from a group, the script will throw an exception upon removing the group.
  var me = Session.getEffectiveUser();
  Logger.log("me: " + me);
  Logger.log("editorsObj: " + editors);
  Logger.log("editorsArray: " + [editors]);
  protection.addEditor(me);
  // protection.removeEditors(protection.getEditors());
  protection.addEditors(editorsArray);
  if (protection.canDomainEdit()) {
    protection.setDomainEdit(false);
  }
}

//this works
function mainStepWiseProtect() {
  StepWiseProtect(spreadsheetName)
}

// this is not operational yet
function mainStepWiseUnProtect() {
  StepWiseUnProtect(spreadsheetName)
}

// --- V1 --- //

// step-wise caller
// turn into for (i in ranges) DO {}
// this works

function StepWiseProtect(spreadsheetName, indicatorArray, ranges) {
  // Logger.log("ranges: " + permissionRangesJSON.g5ranges.step1);
  Logger.log("to be connected to: " + spreadsheetName);
  // var Spreadsheet = SpreadsheetApp.getActive();
  var thisSpreadsheet = connectToSpreadsheetByName(spreadsheetName);
  Logger.log("remote connected to: " + thisSpreadsheet.getName());
  for each (var indicator in indicatorArray) {
    Logger.log(indicator)
    for each (var step in permissionRangesJSON.steps) {
      Logger.log(indicator + " / " + step.range);
      setStepProtection(thisSpreadsheet, indicator, step);
    }
  }
  // setStepProtection(thisSpreadsheet, IndicatorString, permissionRangesJSON.g5ranges.step1);
  // setStepProtection(thisSpreadsheet, IndicatorString, permissionRangesJSON.g5ranges.step1_5);
  // setStepProtection(thisSpreadsheet, IndicatorString, permissionRangesJSON.g5ranges.step2);
}

// atomic single step protection function
// this works
function setStepProtection(thisSpreadsheet, indicator, step) { // params step, indicator, editor
  var currentSheet = thisSpreadsheet.getSheetByName(indicator);
  Logger.log("now in: " + currentSheet.getName());
  var me = Session.getEffectiveUser();
  var editors = thisSpreadsheet.getEditors();
  Logger.log("Current Editors: " + editors + " and " + me);

  var range = currentSheet.getRange(step.range + indicator);
  if (range.canEdit()) {
    var description = (indicator + 'Step' + step.step);
    var protection = range.protect().setDescription(description);
    // protection.addEditor(me);
    protection.addEditors(editorsArray);
    protection.removeEditors(protection.getEditors());
    if (protection.canDomainEdit()) {
      protection.setDomainEdit(false);
    }
    Logger.log("Step " + step.step + " now protected")
  } else {
    Logger.log("Step " + step.step + " is already protected")
  }
  Logger.log("New Editors: " + editors);
  // var range = currentSheet.getRange(permissionRangesJSON.g5ranges.step1_5);
  // var protection = range.protect().setDescription('G5 Step 1.5 Protected');

}


// UNPROTECT step-wise caller

function mainStepWiseUnProtect(spreadsheetName, IndicatorString) {
  // Logger.log(permissionRangesJSON.g5ranges.step1)
  var Spreadsheet = connectToSpreadsheetByName(spreadsheetName)
  removeStepProtection(Spreadsheet, IndicatorString, permissionRangesJSON.g5ranges.step1);
}

// # TODO

function removeStepProtection(spreadsheetName, IndicatorString, Step) { // params step, indicator, editor
  // var currentSheet = Spreadsheet.getSheetByName(Indicator)
  var ss = connectToSpreadsheetByName(spreadsheetName);
  var protections = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  var unprotected = ss.getRange(Step.range);
  Logger.log(protections);
  protections.setUnprotectedRanges([Step.range]);
  // var range = currentSheet.getRange(permissionRangesJSON.g5ranges.step1_5);
  // var protection = range.protect().setDescription('G5 Step 1.5 Protected');

}


// Sheet-level permissions
// works

// MAIN CALLER

function mainWholeSheetProtect() {
  wholeSheetProtect(spreadsheetName, indicatorString[4]);
}

function mainWholeSheetUnProtect() {
  wholeSheetUnProtect(spreadsheetName, indicatorString);
}

// --- FUNCTIONS --- //

function wholeSheetProtect(spreadsheetName, indicatorString) {
  var ss = connectToSpreadsheetByName(spreadsheetName);
  var sheet = ss.getSheetByName(indicatorString);
  sheet.protect().setDescription(indicatorString + ' Sheet Protection');
  Logger.log(indicatorString + ' Protected');
}

function wholeSheetUnProtect(spreadsheetName, indicatorString) {
  var ss = connectToSpreadsheetByName(spreadsheetName);
  var protections = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  if (protections.length > 0) {
    Logger.log("Getting ready to unprotect " + protections.length + " Sheets")
  } else {
    Logger.log("No Sheet-level protections found")
  }
  for (var i = 0; i < protections.length; i++) {
    var protection = protections[i];
    if (protection.canEdit()) {
      protection.remove();
      Logger.log(protection.getDescription() + " removed.")
    }
  }
}
