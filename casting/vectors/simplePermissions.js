var permissionRangesJSON = {
  "g5ranges": {
    "step1": {
      "range": "RDR2019DCigo1S01G5",
      "step" : 1
    },
    "step1_5": {
      "range": "RDR2019DCigo1S01.5G5",
      "step": 1.5
    },
    "step2": {
      "range" : "RDR2019DCigo1S02G5",
      "step" : 2
    },
    "step3": {
      "range" : "RDR2019DCigo1S03.5G5",
      "step" : 3,
    }
  }
}

function clearAll(){
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

// call

function mainSingleStep() {
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
      var description = (Indicator + ' Step ' + Step.step + ' Protected');
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
