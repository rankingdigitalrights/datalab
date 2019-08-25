// siganture for refactoring
// modifyPermissions(SpreadsheetName, stepToBeProtected)

var permissionRangesJSON = {
  "steps": {
    "step1": {
      "range": "RDR2019DCivm1S01",
      "step": 1
    },
    "step1_5": {
      "range": "RDR2019DCivm1S01.5",
      "step": 1.5
    },
    "step2": {
      "range": "RDR2019DCivm1S02",
      "step": 2
    }
  }
}

var spreadsheetName = "verizonPrototypeFullOutcomeTestPermissions";
var spreadsheetID = "1nTZ7I0X2Dw_9ctREsQ8enpmr4c5vVBrpt8XyxwBUICc";
var indicatorString = ["G1", "G2", "G3", "G4", "G5", "G6"];
var indicatorArray = ["G1", "G2", "G3", "G4", "G5", "G6"];
var editorsArray = ["ilja.sperling@gmail.com"]

// MAIN CALLER 

function mainPermissionsCaller() {
  // clearAllProtections(spreadsheetName);
  // iteratorDummySetProtectedRanges(spreadsheetName);
  // StepWiseProtect(spreadsheetName, indicatorArray, permissionRangesJSON);
  StepWiseProtectSheetUnprotectRanges(spreadsheetName, indicatorArray, permissionRangesJSON);
}


// --- functions -- //

function mainClearAllProtections() {
  clearAllProtections(spreadsheetName);
}

// WORKS // removes Sheet-level protection and specific protected ranges //

function clearAllProtections(spreadsheetName) {
  var ss = connectToSpreadsheetByName(spreadsheetName);
  Logger.log(ss.getName());
  var protectionsRanges = ss.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  for (var i in protectionsRanges) {
    var protectionRange = protectionsRanges[i];
    if (protectionRange.canEdit()) {
      protectionRange.remove();
    }
  }
  var protectionsSheets = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  for (var i in protectionsSheets) {
    var protectionSheet = protectionsSheets[i];
    if (protectionSheet.canEdit()) {
      protectionSheet.remove();
    }
  }
}

// --- PROTECTIONS --- //

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
    protection.addEditors([me, editorsArray]);
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


// --- better Logic: protect Sheet, unportect ranges --- //

function StepWiseProtectSheetUnprotectRanges(spreadsheetName, indicatorArray, ranges) {

  Logger.log("to be connected to: " + spreadsheetName);
  var thisSpreadsheet = connectToSpreadsheetByName(spreadsheetName);
  Logger.log("remote connected to: " + thisSpreadsheet.getName());

  for each(var indicator in indicatorArray) {
    var sheet = thisSpreadsheet.getSheetByName(indicator);
    Logger.log(sheet.getName());
    SingleProtectSheetUnprotectRanges(sheet, indicator, ranges)
  }
}

// Protect the whole sheet, unprotect [ranges], then remove all other users from the list of editors.

function SingleProtectSheetUnprotectRanges(sheet, indicator, ranges) {
  
  var protection = sheet.protect().setDescription('Full protected ' + indicator);

  var unprotected = [];

  for each (var step in permissionRangesJSON.steps) {
    Logger.log(indicator + " / " + step.range);
    // setStepProtection(thisSpreadsheet, indicator, step);
    unprotected.push(sheet.getRange(step.range + indicator));
  }

  protection.setUnprotectedRanges(unprotected);

  // Ensure the current user is an editor before removing others. Otherwise, if the user's edit
  // permission comes from a group, the script will throw an exception upon removing the group.
  var me = Session.getEffectiveUser();
  protection.addEditors([me, editorsArray]);
  protection.removeEditors(protection.getEditors());
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
  var protection = sheet.protect().setDescription(indicatorString + ' Sheet Protection');
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


// saved for later; not in use right now 
function iteratorDummySetProtectedRanges(spreadsheetName) {
  //set permissions
  var ss = connectToSpreadsheetByName(spreadsheetName);
  Logger.log(ss);
  var ranges = ["A1:K", "F1:F", "H1:H", "Y1:Y", "AD1:AF"];

  for (var j in ranges) {
    var protection = ss.getRange(ranges[j]).protect();

    var me = Session.getEffectiveUser();
    protection.addEditor(me);
    protection.removeEditors(protection.getEditors());
    if (protection.canDomainEdit()) {
      protection.setDomainEdit(false);
    }
  }
}
