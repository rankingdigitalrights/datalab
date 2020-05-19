/*
This file will have two functions that will open up and close research step(s) to
the designated email(s) respectively. A third function will close research step(s)
to all.

https://developers.google.com/apps-script/reference/spreadsheet/protection

*/

// idea for preventing the sharing of folder: https://developers.google.com/apps-script/reference/drive/folder#setShareableByEditors(Boolean)
// see setShareableByEditors
// file also has shareable


/*
function permissionsController() {
    // can easily call all the other permissions functions from this function
  
    // variables that user determines
    let Indicators = indicatorsVector
    let StepLabelShort=["S020","S021","S025"]
        //["S010","S011","S015","S020","S021","S025","S030","S031","S035"] // add all the (sub)steps to be opened
    let companyID="iAZ1" // Amazon ID
    let emails = ["wessenauer@rankingdigitalrights.org", "rogoff@rankingdigitalrights.org", "zhang@rankingdigitalrights.org", "brouillette@rankingdigitalrights.org", "abrougui@rankingdigitalrights.org", "rydzak@rankingdigitalrights.org","ilja.sperling@gmail.com"]
    let Sheetemails = ["walton@rankingdigitalrights.org","sperling@rankingdigitalrights.org","gutermuth@rankingdigitalrights.org"]
    let allEmails= ["walton@rankingdigitalrights.org","sperling@rankingdigitalrights.org","gutermuth@rankingdigitalrights.org","wessenauer@rankingdigitalrights.org", "rogoff@rankingdigitalrights.org", "zhang@rankingdigitalrights.org", "brouillette@rankingdigitalrights.org", "abrougui@rankingdigitalrights.org", "rydzak@rankingdigitalrights.org","ilja.sperling@gmail.com"]

    let Spread=SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1uetDs8PQfIiDRW572b_AP5i9bxC17DSVaqIXVnpe3fc/edit#gid=1404795634');

    // adding viewers
    assignFileViewers(Spread, allEmails)

    // adding editors
    assignFileEditors(Spread, allEmails)

  
    // opening a step
    //openStep(Indicators, StepLabelShort,companyID,emails,Spread)
    
    // protecting all sheets
    protectSheets(Indicators, Sheetemails, Spread)
    
    // removing all protections
    //removeAllProtections(Spread)
    
    // close step
    // closeStep(Indicators,Sheetemails,Spread)
    
  }
  
  // closeStep simply removes all permissions and then adds only the sheet permissions back
  function closeStep(Indicators, emails, Spread) {
    removeAllProtections(Spread)
    protectSheets(Indicators, emails, Spread)
  }
  
  
  function openStep(Indicators, StepLabelShort,companyID,emails,Spread) {
    // might want to call removeAll and then protect sheets to make sure all the permissions are correct?????
    Logger.log("protectSheets")
  
    // looping through the types of indicators (G,F,P)
  for (let i = 0; i < Indicators.indicatorCategories.length; i++) {
    
            var Category = Indicators.indicatorCategories[i]
            Logger.log("--- NEXT : Starting " + Category.labelLong)
    
    
            // looping through indicators
        for (var j = 0; j < Category.indicators.length; j++) {
          var Indicator = Category.indicators[j]
          
          // if the spread has a sheet for this indicator
          if( Spread.getSheetByName(Indicator.labelShort) != null){
            
          var sheet=Spread.getSheetByName(Indicator.labelShort)
          
          Logger.log(sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET))
          
          // getting the list of protections on this spread
          var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
          
          // looking for the protection of the entire sheet with the indicator name
          // assumes there are no two sheet protections with same name
        for (var k = 0; k < protections.length; k++) {
            if (protections[k].getDescription() == Indicator.labelShort) {
            var protection=protections[k] // gets the sheet protection once found
            Logger.log(protection.getDescription())
        
        
            // looping through all the steps you want to open
            for(var l=0; l<StepLabelShort.length; l++) {

                // now need to build the namedRange you want, get A1 notation, then unprotect it, then protect it and open it only to certain people
                // need to make RDR20 and DC variables
                var namedR=defineNamedRange("RDR20", "DC", StepLabelShort[l], Indicator.labelShort, "", companyID, "", "Step")  
                Logger.log(namedR)
        
                var notation = Spread.getRangeByName(namedR).getA1Notation(); 
                var range = sheet.getRange(notation); // getting the range associated with named range
                
                let unprotectedRanges=protection.getUnprotectedRanges()
                unprotectedRanges.push(range)
        
             protection.setUnprotectedRanges(unprotectedRanges) // now this step is unprotected
        
            // create a new protection that will only be open to certain people of that step
            var protectionStep = range.protect().setDescription(Indicator.labelShort+"StepProtection"+StepLabelShort[l]);
    
            protectionStep.removeEditors(protectionStep.getEditors());
            if (protectionStep.canDomainEdit()) {protectionStep.setDomainEdit(false);} // disabeling domain edit
        
            protectionStep.addEditors(emails); // add emails to the step protection
            //Spread.addEditors(emails); // maybe this step isn't needed
          
        }
        
    
   
        
      } // close if       
          
            
            
            Logger.log("indicator :" + Indicator.labelShort)
        }
            
            
            Logger.log("--- Completed " + Category.labelLong)
      }   // end if statement
         
        }  // end individual indicator
    
  } // end category
    
    
  } // end function
  
    
    
    
    function removeAllProtections(Spread) {
     Logger.log("In removeAllProtections")
      var sheets = Spread.getSheets()
      
      // looping through each sheet and removing all protections on the sheet
    for (var i = 0; i < sheets.length ; i++ ) {
        var sheet = Spread.getSheets()[i]
      
        Logger.log("In "+sheet)
    
       
        // getting all the protections on a sheet and then removing them
        var protections=sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
        var protect=sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET)
      
        // removing sheet protections
        for (var j = 0; j < protections.length; j++) {protections[j].remove() }
      
        // removing range protections
        for (var j = 0; j < protect.length; j++) {protect[j].remove()}
      
      }
      
    }
    
  
  
    function protectSheets(Indicators, emails, Spread) {
      Logger.log(" In protectSheets")
  
      // protecting 2019 Outcome
      var protect=Spread.getSheetByName("2019 Outcome").protect().setDescription("2019 Outcome")
      protect.removeEditors(protect.getEditors());
      protect.addEditors(emails)
      if (protect.canDomainEdit()) {protect.setDomainEdit(false);}
      
      // protecting 2019 Sources
      var protect=Spread.getSheetByName("2019 Sources").protect().setDescription("2019 Sources")
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
            
            // if the sheet with this indicator name exists protect that sheet
            if( Spread.getSheetByName(Indicator.labelShort) != null){
  
            // creating a protection for the sheet, description must be name of sheet for openStep to work
             var protection=Spread.getSheetByName(Indicator.labelShort).protect().setDescription(Indicator.labelShort)
    
             // removing other editors and only adding array of emails
            protection.removeEditors(protection.getEditors());
            protection.addEditors(emails)
            if (protection.canDomainEdit()) {protection.setDomainEdit(false);}
    
            Logger.log("indicator :" + Indicator.labelShort)
        }
        }
            
            
            Logger.log("--- Completed " + Category.labelLong)
            
            
        }
    
    
      
    }
    */