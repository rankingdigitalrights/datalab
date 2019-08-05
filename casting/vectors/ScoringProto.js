function main() {
  // creating a blank spreadsheet
  var file = SpreadsheetApp.create('ScoringPrototype');
  
  // creates sources page
  var sheet = file.getActiveSheet();
  sheet.setName('Outcome'); // <-- will need to make this dynamic at some point
  
  var CompanyObj = importJsonCompany();
  var Indicators = importJsonIndicator();
  var Steps = importResearchSteps();
  
  
  // outermost forloop will be the steps
  for( var i=0; i<Steps.researchSteps.length; i++) {
    var activeRow = 1;
    var activeCol = 1; // this will need to be a complicated formula later!
      
      sheet.setColumnWidth(activeCol, 200);
    
    
    // loop going through all the indicators
    for (var k=0; k<Indicators.governance.indicators.length; k++) {
      
      var numberOfComponents=1;
      if(Indicators.governance.hasComponents==true) {numberOfComponents=Indicators.governance.components.length;}
      
      // for loop going through all the elements of the current research step
      for(var j=0; j<Steps.researchSteps[i].components.length; j++) {
        //TODO!!!!!! make the governance, freedom, privacy all part of a vector
        
        if(j==0) {activeRow=setCompanyHeader(activeRow, activeCol, sheet,Indicators.governance.indicators[k], Indicators.governance, CompanyObj);}
        
        if(Steps.researchSteps[i].components[j].type=='elementDropDown'){
          activeRow=importElementDropDown(activeRow, activeCol, sheet, Steps.researchSteps[i], j, Indicators.governance.indicators[k], CompanyObj, numberOfComponents);
        }
        
        if(Steps.researchSteps[i].components[j].type=='comments'){
          activeRow=importComments(activeRow, activeCol, sheet, Steps.researchSteps[i], j, Indicators.governance.indicators[k], CompanyObj);
        }
        
        if(Steps.researchSteps[i].components[j].type=='sources'){
          activeRow=importSources(activeRow, activeCol, sheet, Steps.researchSteps[i], j, Indicators.governance.indicators[k], CompanyObj);
        }
      }
      
      
    }
  }
  
}


// ---------------------HELPER FUNCTIONS---------------------------------------------
  function setCompanyHeader(activeRow, activeCol, sheet, currentIndicator, indicatorType, companyObj) {
    
    var currentCell = sheet.getRange(activeRow, activeCol);
    currentCell.setValue(currentIndicator.labelShort);
    currentCell.setBackgroundRGB(237, 179, 102);
    currentCell.setFontWeight('bold');
    activeCol=activeCol+1;
    
    // adding the company and subcompanies, etc
    var numberOfComponents = 1;
    if(indicatorType.hasComponents==true) {numberOfComponents=indicatorType.components.length;}
    
    for(var g=0; g<numberOfComponents; g++) {
      var currentCell = sheet.getRange(activeRow, activeCol);
      var label = 'Group-'+companyObj.label.current;
      if(numberOfComponents>1) {label=label+'-'+indicatorType.components[g].labelLong;}
      label = label.toString();
      currentCell.setValue(label);
      currentCell.setWrap(true);
      currentCell.setBackgroundRGB(157,179,176);
      
      activeCol=activeCol+1;
    }
    
    for(var g=0; g<numberOfComponents; g++) {
      var currentCell = sheet.getRange(activeRow, activeCol);
      var label = 'OperatingCo-';
      if(companyObj.opCom==true) {label=label+companyObj.opComLabel;}
      if(numberOfComponents>1) {label=label+indicatorType.components[g].labelLong;}
      label = label.toString();
      currentCell.setValue(label);
      currentCell.setWrap(true);
      currentCell.setBackgroundRGB(157,179,176);
      
      activeCol=activeCol+1;
    }
    
    for(k=0; k<companyObj.numberOfServices; k++) {
      for(var g=0; g<numberOfComponents; g++) {
        var currentCell = sheet.getRange(activeRow, activeCol);
        var label = companyObj.services[k].label.current;
        if(numberOfComponents>1) {label=label+'-'+indicatorType.components[g].labelLong;}
        label = label.toString();
        currentCell.setValue(label);
        currentCell.setWrap(true);
        currentCell.setBackgroundRGB(157,179,176);
        
        activeCol=activeCol+1;
        
      }
      
    }
    
    activeRow=activeRow+1;
    return activeRow;
  }


function importElementDropDown(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfComponents) {
  
  Logger.log('in elementdropdown function');
  for(var h=0; h<currentIndicator.elements.length;h++) {
    var tempCol = activeCol;
    var currentCell = sheet.getRange(activeRow,tempCol);
    var label = currentStep.components[element].label+currentIndicator.elements[h].labelShort;
    label = label.toString();
    currentCell.setValue(label);
    currentCell.setWrap(true);
    tempCol=tempCol+1;
    
    // doing overall company
    for(k=0; k<numberOfComponents; k++) {
      currentCell = sheet.getRange(activeRow,tempCol);
      currentCell.setValue('overall company');
      tempCol=tempCol+1;      
    }
    
    // opCpm
    for(k=0; k<numberOfComponents; k++) {
      currentCell = sheet.getRange(activeRow,tempCol);
      currentCell.setValue('opCom');
      tempCol=tempCol+1;      
    }
    
    
    activeRow=activeRow+1;
  }
  
  return activeRow;
}

function importComments(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj) {
  for(var h=0; h<currentIndicator.elements.length;h++) {
    
    // setting up the labels
    var currentCell = sheet.getRange(activeRow,activeCol);
    var label = currentStep.components[element].label+currentIndicator.elements[h].labelShort+currentStep.components[element].label2;
    label = label.toString();
    currentCell.setValue(label);
    currentCell.setWrap(true);
    
    
    activeRow=activeRow+1;
  }
  
  return activeRow;
}

function importSources(activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj) {
  
  // setting up the label
  var currentCell = sheet.getRange(activeRow, activeCol);
  var label = currentStep.components[element].label;
  label = label.toString();
  currentCell.setValue(label);
  currentCell.setWrap(true);
  
  activeRow=activeRow+1;
  return activeRow;
  
}

// ------------------IMPORT FUNCTIONS------------------------------------------------
  function importJsonCompany() {
    var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/verizon.json");
    var jsonObj = JSON.parse(response);
    return jsonObj;
  }


function importJsonIndicator() {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/indicators.json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}

function importResearchSteps() {
  var jsonObj = {
    "researchSteps": [
      {
        "label": "Step 3: Score Consensus",
        "labelShort": "S03",
        "c1": 50,
        "c2": 147,
        "c3": 168,
        "components": [
          {
            "type": "header",
            "filler": "Your Name"
          },
          {
            "type": "elementDropDown",
            "label": "Consolidated answer for ",
            "dropdown": [
              "not selected",
              "yes",
              "partial",
              "no",
              "no disclosure found",
              "N/A"
              ]
          },
          {
            "type": "comments",
            "label": "Comments for ",
            "label2": " (explain score)",
            "nameLabel": "Comments"
          },
          {
            "type": "sources",
            "label": "Sources (reference, specific page, section, etc.)",
            "nameLabel": "Sources"
          }
          ]
      }
      ]
  };
  
  //var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/researchSteps.json");
  //var jsonObj = JSON.parse(response);
  return jsonObj;
}