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

function clearAllStepWise() {
  var ss = SpreadsheetApp.getActive();
  var protections = ss.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  for (var i = 0; i < protections.length; i++) {
    var protection = protections[i];
    if (protection.canEdit()) {
      protection.remove();
    }
  }
}

// just for testing

function connect() {
  var Spreadsheet = SpreadsheetApp.getActive();
  var Sheet = Spreadsheet.getSheetByName("G5");
  Logger.log(Sheet.getLastRow())
}

// main Logic; proof-of-concept

// PROTECT step-wise caller

function mainStepWiseProtect() {
  Logger.log(permissionRangesJSON.g5ranges.step1)
  var Spreadsheet = SpreadsheetApp.getActive();
  setStepProtection(Spreadsheet, "G5", permissionRangesJSON.g5ranges.step1);
  setStepProtection(Spreadsheet, "G5", permissionRangesJSON.g5ranges.step1_5);
  setStepProtection(Spreadsheet, "G5", permissionRangesJSON.g5ranges.step2);
  setStepProtection(Spreadsheet, "G5", permissionRangesJSON.g5ranges.step3);
}

// function

function setStepProtection(Spreadsheet, Indicator, Step) { // params step, indicator, editor
  var currentSheet = Spreadsheet.getSheetByName(Indicator)
  var me = Session.getEffectiveUser();
  var editors = Spreadsheet.getEditors();
  Logger.log(editors);

  var range = currentSheet.getRange(Step.range);
  if (range.canEdit()) {
    var description = (Indicator + 'Step' + Step.step);
    var protection = range.protect().setDescription(description);
    protection.addEditor(me);
    protection.removeEditors(protection.getEditors());
    if (protection.canDomainEdit()) {
      protection.setDomainEdit(false);
    }
    Logger.log("Step 1 now prtected")
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

var sheetName = "G5";

function wholeSheetProtect(sheetName){
 var ss = SpreadsheetApp.getActive()
 var sheet = ss.getSheetByName(sheetName);
 var protection = sheet.protect().setDescription('G5 Protected');
}

function wholeSheetUnProtect(sheetName){
  var ss = SpreadsheetApp.getActive();
  var protections = ss.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  for (var i = 0; i < protections.length; i++) {
    var protection = protections[i];
    if (protection.canEdit()) {
      protection.remove();
    }
  }
}


function mainWholeSheetProtect () {
  wholeSheetProtect("G5");
}

function mainWholeSheetUnProtect () {
  wholeSheetUnProtect("G5");
}

function iteratorDummy(){
  //set permissions
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var ranges = ["A1:K","F1:F","H1:H","Y1:Y","AD1:AF"];
    
    for (var j in ranges){
      var protection = active.getRange(ranges[j]).protect();
  
      var me = Session.getEffectiveUser();
      protection.addEditor(me);
      protection.removeEditors(protection.getEditors());
      if (protection.canDomainEdit()) {
        protection.setDomainEdit(false);
      }
    }
  }
  