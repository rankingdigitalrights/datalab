/*
This file will have two functions that will open up and close research step(s) to
the designated email(s) respectively. A third function will close research step(s)
to all.

https://developers.google.com/apps-script/reference/spreadsheet/protection

*/

function openStepTest() {
    // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
    // future input vars: url
    Logger.log("protectSheets")
        
    let Indicators = indicatorsVector
    var StepLabelShort="subStepID" // make this a variable later
    var emails = ["ggw12@georgetown.edu","sperling@rankingdigitalrights.org"]
    var Spread=SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1VAnqcoRUKdsrKWL1bPRRZiGKpLdapZ4aUGFYeI7iXh8/edit#gid=744690756');
    

  var Indicator = "F1c"
  var sheet=Spread.getSheetByName(Indicator)
  var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET); // finding all the sheet protections
  
  for (var k = 0; k < protections.length; k++) {
    if (protections[k].getDescription() == Indicator) {
      
      
      var protection=protections[k]
      Logger.log(protection.getDescription())

      
      // now need to build the namedRange you want, get A1 notation, then unprotect it, then protect it and open it only to certain people
      var namedR=""
      namedR=defineNamedRange("RDR20", "DC", "S01", Indicator, "", "iAP1", "", "Step") 
      
      Logger.log(namedR)
      
      var notation = Spread.getRangeByName(namedR).getA1Notation();
      var range = sheet.getRange(notation); 
      var rangeArray=[range]   
      
      protection.setUnprotectedRanges(rangeArray) // now this step is unprotected
      
      // create a new protection that will only be open to certain people
      var protectionStep = range.protect().setDescription(Indicator+"Protection");
      
      var me = Session.getEffectiveUser()
      protectionStep.addEditor(me)
  
      protectionStep.removeEditors(protectionStep.getEditors());
      if (protectionStep.canDomainEdit()) {protectionStep.setDomainEdit(false);}
      
          protection.addEditors(emails);
              Spread.addEditors(emails);
  
      
  
      
      
    }        
        
          
          
         // Logger.log("indicator :" + Indicator.labelShort)
      }
          
          
          //Logger.log("--- Completed " + Category.labelLong)
          
}


function openStep() {
  
  // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
  // future input vars: url
  Logger.log("protectSheets")
        
    let Indicators = indicatorsVector
    var StepLabelShort="S01" // make this a variable later
    var companyID="iAp1"
    var emails = ["ggw12@georgetown.edu","sperling@rankingdigitalrights.org"]
    var Spread=SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1VAnqcoRUKdsrKWL1bPRRZiGKpLdapZ4aUGFYeI7iXh8/edit#gid=744690756');
    
  // looping through the types of indicators (G,F,P)
for (let i = 0; i < Indicators.indicatorCategories.length; i++) {
  
          var Category = Indicators.indicatorCategories[i]
          Logger.log("--- NEXT : Starting " + Category.labelLong)
  
  
          // looping through indicators and getting indicator individual sheets
      for (var j = 0; j < Category.indicators.length; j++) {
        var Indicator = Category.indicators[j]
        var sheet=Spread.getSheetByName(Indicator.labelShort)
        
        Logger.log(sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET))
        
        var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
        
        // looking for the protection of the entire sheet with the indicator name
  for (var k = 0; k < protections.length; k++) {
    if (protections[k].getDescription() == Indicator.labelShort) {
      var protection=protections[k]
      Logger.log(protection.getDescription())
      
      // now need to build the namedRange you want, get A1 notation, then unprotect it, then protect it and open it only to certain people
      var namedR=defineNamedRange(indexPrefix, "DC", StepLabelShort, Indicator.labelShort, "", companyID, "", "Step")  
      Logger.log(namedR)
      
      var notation = Spread.getRangeByName(namedR).getA1Notation();
      var range = sheet.getRange(notation); 
      var rangeArray=[range]   
      
      protection.setUnprotectedRanges(rangeArray) // now this step is unprotected
      
      // create a new protection that will only be open to certain people of that step
      var protectionStep = range.protect().setDescription(Indicator.labelShort+"StepProtection");
  
      protectionStep.removeEditors(protectionStep.getEditors());
      if (protectionStep.canDomainEdit()) {protectionStep.setDomainEdit(false);}
      
          protection.addEditors(emails);
              Spread.addEditors(emails);
  
 
      
    } // close if       
        
          
          
          Logger.log("indicator :" + Indicator.labelShort)
      }
          
          
          Logger.log("--- Completed " + Category.labelLong)
          
          
      }  
}
  
  
} // end function

  
  
  
  function removeAllProtections() {
   Logger.log("In removeAllProtections")
   var Spread=SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1VAnqcoRUKdsrKWL1bPRRZiGKpLdapZ4aUGFYeI7iXh8/edit#gid=744690756')
    var sheets = Spread.getSheets()
    
    // looping through each sheet and removing all protections on the sheet
  for (var i = 0; i < sheets.length ; i++ ) {
    var sheet = Spread.getSheets()[i]
    
     Logger.log("In "+sheet)
  
    
    var protections=sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
    var protect=sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)
    for (var j = 0; j < protections.length; j++) {
      protections[j].remove()
    }
    for (var j = 0; j < protect.length; j++) {
      protect[j].remove()
    }
    
    }
    
  }
  
  function protectSheets() {
    Logger.log(" In protectSheets")
        
    let Indicators = indicatorsVector;
    var emails = ["ggw12@georgetown.edu","sperling@rankingdigitalrights.org"]
    var Spread=SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1VAnqcoRUKdsrKWL1bPRRZiGKpLdapZ4aUGFYeI7iXh8/edit#gid=744690756');
    
    // protecting 2019 Outcome
    var protect=Spread.getSheetByName("2019 Outcome").protect().setDescription("2019 Outcome")
    protect.removeEditors(protect.getEditors());
    protect.addEditors(emails)
    if (protect.canDomainEdit()) {protect.setDomainEdit(false);}
    
    
    
    // looping through the types of indicators
    for (let i = 0; i < Indicators.indicatorCategories.length; i++) {
  
          var Category = Indicators.indicatorCategories[i]
  
          Logger.log("--- NEXT : Starting " + Category.labelLong)
  
  
      // looping through each indicator in the types and protecting individual sheets
      for (var j = 0; j < Category.indicators.length; j++) {
            Logger.log(Category.indicators[j].labelShort)
  
          var Indicator = Category.indicators[j] // specific indicator
          
          // creating a protection for the sheet, description must be name of sheet for openStep to work
           var protection=Spread.getSheetByName(Indicator.labelShort).protect().setDescription(Indicator.labelShort)
  
           // removing other editors and only adding array of emails
      protection.removeEditors(protection.getEditors());
      protection.addEditors(emails)
      if (protection.canDomainEdit()) {protection.setDomainEdit(false);}
  
          Logger.log("indicator :" + Indicator.labelShort)
      }
          
          
          Logger.log("--- Completed " + Category.labelLong)
          
          
      }
  
  
    
  }
  
  function permissionsTesting() {
      Logger.log("in permissionsTesting")
      
      var emails = ["ggw12@georgetown.edu","walton@rankingdigitalrights.org"]
      var Spread=SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1VAnqcoRUKdsrKWL1bPRRZiGKpLdapZ4aUGFYeI7iXh8/edit#gid=744690756');
  
      //var Sheet=SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1b0vYmNq51hb7_Nejd4RMpetIhN63A-iQvvI4_J5ZE9g/edit#gid=685545106');
      //var notation = Sheet.getRangeByName("RDR20DCundefinedG4biAP1Step").getA1Notation();
        //var notation = Sheet.getRangeByName("RDR20DCundefinedG4biAP1Step").getRange();
  
    //var range = Sheet.getRange(notation);
        
    //Logger.log(range)
    
    //var range = Sheet.getRange('B101:D121');
     // var protection = range.protect().setDescription('Sample protected range');
    
    var protection=Spread.getSheets()[2].protect().setDescription('F1c');
  
    /*
      var me = Session.getEffectiveUser();
      protection.addEditor(me);
     */
  
      protection.removeEditors(protection.getEditors());
    protection.addEditor('ggw12@georgetown.edu');
      if (protection.canDomainEdit()) {protection.setDomainEdit(false);}
    
        //let Indicators = indicatorsVector;
  
  
  
  }
