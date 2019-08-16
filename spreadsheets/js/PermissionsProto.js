var permissionRangesJSON = {
  "g5ranges": {
    "step1": {
      "range": "RDR2019DCigo1S01G5",
      "step": 1
    },
    "step1_5": {
      "range": "RDR2019DCigo1S01.5G5",
      "step": 1.5
    },
    "step2": {
      "range": "RDR2019DCigo1S02G5",
      "step": 2
    },
    "step3": {
      "range": "RDR2019DCigo1S03.5G5",
      "step": 3,
    }
  }
}

var dummy = 1213123123;
var spreadsheetName = "CompanyObjPrototypeG5Permissions";

function clearAll() {
  var ss = connectToSpreadsheetByName(spreadsheetName);
  Logger.log(ss.getName());
  var protectionsRanges = ss.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  for (var i = 0; i < protectionsRanges.length; i++) {
    var protectionRange = protectionsRanges[i];
    if (protectionRange.canEdit()) {
      protectionRange.remove();
    }
  }
  var protectionsSheets = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  for (var i = 0; i < protectionsSheets.length; i++) {
    var protectionSheet = protectionsSheets[i];
    if (protectionSheet.canEdit()) {
      protectionSheet.remove();
    }
  }
}

// Main Caller

//this works
function mainStepWiseProtect() {
  StepWiseProtect(spreadsheetName)
}

// this is not operational yet
function mainStepWiseUnProtect() {
  StepWiseUnProtect(spreadsheetName)
}

// Universal Method: Connect to Spreadsheet File and return Obj as open Spreadsheet
// This works
function connectToSpreadsheetByName(spreadsheetName) {
  var Spreadsheets = DriveApp.getFilesByName(spreadsheetName);
  if (!Spreadsheets.hasNext()) {
    Logger.log("Nothing");
    return null;
  } else {
    // while (Spreadsheet.hasNext()) {
    // Nope. Only do for first Spreadsheet element
    var thisSpreadsheet = Spreadsheets.next();
    Logger.log("locally connected to: " + thisSpreadsheet.getName());
    Logger.log("it's a " + thisSpreadsheet.getMimeType());
    return SpreadsheetApp.open(thisSpreadsheet);
    // }
  }
}

// step-wise caller
// turn into for (i in ranges) DO {}
// this works
function StepWiseProtect(spreadsheetName) {
  Logger.log("ranges: " + permissionRangesJSON.g5ranges.step1);
  Logger.log("to be connected to: " + spreadsheetName);
  // var Spreadsheet = SpreadsheetApp.getActive();
  var thisSpreadsheet = connectToSpreadsheetByName(spreadsheetName);
  Logger.log("remote connected to: " + thisSpreadsheet.getName());
  setStepProtection(thisSpreadsheet, "G5", permissionRangesJSON.g5ranges.step1);
  setStepProtection(thisSpreadsheet, "G5", permissionRangesJSON.g5ranges.step1_5);
  setStepProtection(thisSpreadsheet, "G5", permissionRangesJSON.g5ranges.step2);
  setStepProtection(thisSpreadsheet, "G5", permissionRangesJSON.g5ranges.step3);
}

// atomic single step protection function
// this works
function setStepProtection(thisSpreadsheet, Indicator, Step) { // params step, indicator, editor
  Logger.log("received " + thisSpreadsheet);
  // Logger.log("received " + thisSpreadsheet.getCurrentCell());
  var currentSheet = thisSpreadsheet.getSheetByName(Indicator);
  var me = Session.getEffectiveUser();
  var editors = thisSpreadsheet.getEditors();
  // Logger.log(editors);

  var range = currentSheet.getRange(Step.range);
  if (range.canEdit()) {
    var description = (Indicator + 'Step' + Step.step);
    var protection = range.protect().setDescription(description);
    protection.addEditor(me);
    protection.removeEditors(protection.getEditors());
    if (protection.canDomainEdit()) {
      protection.setDomainEdit(false);
    }
    Logger.log("Step " + Step.step + " now prtected")
  } else {
    Logger.log("Step 1 is already protected")
  }

  // var range = currentSheet.getRange(permissionRangesJSON.g5ranges.step1_5);
  // var protection = range.protect().setDescription('G5 Step 1.5 Protected');

}

// UNPROTECT step-wise caller

function mainStepWiseUnProtect() {
  Logger.log(permissionRangesJSON.g5ranges.step1)
  var Spreadsheet = SpreadsheetApp.getActive();
  removeStepProtection(Spreadsheet, "G5", permissionRangesJSON.g5ranges.step1);
}

// # TODO

function removeStepProtection(Spreadsheet, Indicator, Step) { // params step, indicator, editor
  // var currentSheet = Spreadsheet.getSheetByName(Indicator)
  var ss = SpreadsheetApp.getActive();
  var protections = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  var unprotected = ss.getRange(Step.range);
  Logger.log(protections);
  protections.setUnprotectedRanges([Step.range]);
  // var range = currentSheet.getRange(permissionRangesJSON.g5ranges.step1_5);
  // var protection = range.protect().setDescription('G5 Step 1.5 Protected');

}


// SHeet-level permissions
// works

var indicatorString = "G5";

function mainWholeSheetProtect() {
  wholeSheetProtect(indicatorString);
}

function mainWholeSheetUnProtect() {
  wholeSheetUnProtect(indicatorString);
}

function wholeSheetProtect(sheetName) {
  var ss = SpreadsheetApp.getActive()
  var sheet = ss.getSheetByName(sheetName);
  var protection = sheet.protect().setDescription('G5 Protected');
}

function wholeSheetUnProtect(sheetName) {
  var ss = SpreadsheetApp.getActive();
  var protections = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  for (var i = 0; i < protections.length; i++) {
    var protection = protections[i];
    if (protection.canEdit()) {
      protection.remove();
    }
  }
}


// saved for later; not in use right now 
function iteratorDummy() {
  //set permissions
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ranges = ["A1:K", "F1:F", "H1:H", "Y1:Y", "AD1:AF"];

  for (var j in ranges) {
    var protection = active.getRange(ranges[j]).protect();

    var me = Session.getEffectiveUser();
    protection.addEditor(me);
    protection.removeEditors(protection.getEditors());
    if (protection.canDomainEdit()) {
      protection.setDomainEdit(false);
    }
  }
}
