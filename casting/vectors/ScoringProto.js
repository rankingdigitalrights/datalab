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

    // looping through all the indicator types
    for(var r=0; r<Indicators.indicatorType.length;r++) {
    
    // loop going through all the indicators
    for (var k=0; k<Indicators.indicatorType[r].indicators.length; k++) {
      
      var numberOfComponents=1;
      if(Indicators.indicatorType[r].hasComponents==true) {numberOfComponents=Indicators.indicatorType[r].components.length;}
      
      // for loop going through all the elements of the current research step
      for(var j=0; j<Steps.researchSteps[i].components.length; j++) {
        
        if(j==0) {
          activeRow=activeRow+1;
          activeRow=setCompanyHeader(activeRow, activeCol, sheet,Indicators.indicatorType[r].indicators[k], Indicators.indicatorType[r], CompanyObj);
        }
        
        if(Steps.researchSteps[i].components[j].type=='elementDropDown'){
          activeRow=importElementDropDown(activeRow, activeCol, sheet, Steps.researchSteps[i], j, Indicators.indicatorType[r].indicators[k], CompanyObj, numberOfComponents, Indicators.indicatorType[r]);
        }
        
        if(Steps.researchSteps[i].components[j].type=='comments'){
          activeRow=importComments(activeRow, activeCol, sheet, Steps.researchSteps[i], j, Indicators.indicatorType[r].indicators[k], CompanyObj);
        }
        
        if(Steps.researchSteps[i].components[j].type=='sources'){
          activeRow=importSources(activeRow, activeCol, sheet, Steps.researchSteps[i], j, Indicators.indicatorType[r].indicators[k], CompanyObj);
        }
        
        if(j==Steps.researchSteps[i].components.length-1) {
          // add scoring row
          activeRow=activeRow+1;
          activeRow=addScoring(file,activeRow, activeCol, sheet, Steps.researchSteps[i], j, Indicators.indicatorType[r].indicators[k], CompanyObj, numberOfComponents, Indicators.indicatorType[r]);
        }
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


function importElementDropDown( activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfComponents, indicatorType) {
  
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
      
      // setting up formula that compares values
      var compCellName = ('RDR2019DC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[h].labelShort);
       if (numberOfComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
       compCellName = compCellName.toString();
      
      // adding formula
      var formula = '=IMPORTRANGE("'+CompanyObj.urlDC+'","'+compCellName+'")';
      formula=formula.toString();
      currentCell.setFormula(formula);
      
      
      tempCol=tempCol+1;     
    }
   
    // opCpm
    for(k=0; k<numberOfComponents; k++) {
      currentCell = sheet.getRange(activeRow,tempCol);
      
      // setting up formula that compares values
      var compCellName = ('RDR2019DC' + CompanyObj.id +'opCom' + currentStep.labelShort + currentIndicator.elements[h].labelShort);
       if (numberOfComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
       compCellName = compCellName.toString();
      
      var formula = '=IMPORTRANGE("'+CompanyObj.urlDC+'","'+compCellName+'")';
      formula=formula.toString();
      currentCell.setFormula(formula);
      
      tempCol=tempCol+1;     
    }
    
    // looping through the services now
    for(var g=0;g<CompanyObj.services.length;g++) {
      
      for(k=0; k<numberOfComponents; k++) {
      currentCell = sheet.getRange(activeRow,tempCol);
      
      // setting up formula that compares values
        var compCellName = ('RDR2019DC' + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.elements[h].labelShort);
       if (numberOfComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
       compCellName = compCellName.toString();
      
      var formula = '=IMPORTRANGE("'+CompanyObj.urlDC+'","'+compCellName+'")';
      formula=formula.toString();
      currentCell.setFormula(formula);
      
      tempCol=tempCol+1;     
    }
      
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

function addScoring(file,activeRow, activeCol, sheet, currentStep, element, currentIndicator, CompanyObj, numberOfComponents, indicatorType) {
    for(var h=0; h<currentIndicator.elements.length;h++) {
    var tempCol = activeCol;
    var currentCell = sheet.getRange(activeRow,tempCol);
    var label = 'Points for '+currentIndicator.elements[h].labelShort;
    label = label.toString();
    currentCell.setValue(label);
    currentCell.setWrap(true);
    tempCol=tempCol+1;
    
    // doing overall company
    for(k=0; k<numberOfComponents; k++) {
      currentCell = sheet.getRange(activeRow,tempCol);
      
      // setting up formula that compares values
      var compCellName = ('RDR2019DC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[h].labelShort);
       if (numberOfComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
       compCellName = compCellName.toString();
      
      var formula = '=IMPORTRANGE("'+CompanyObj.urlDC+'","'+compCellName+'")';
      formula=formula.toString();
      currentCell.setFormula(formula);
      
      // above is the formula you would use to get the real source value
      
      // naming the cell
      var cellName = ('RDR2019SC' + CompanyObj.id + currentStep.labelShort + currentIndicator.elements[h].labelShort);
      if (numberOfComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort;}
      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);
      
      // calculating offset
      var up =currentIndicator.elements.length*2+2;
      var range = sheet.getRange(activeRow-up,tempCol);
      currentCell.setValue(range.getA1Notation());
      
      tempCol=tempCol+1;     
    }
   
    // opCpm
    for(k=0; k<numberOfComponents; k++) {
      currentCell = sheet.getRange(activeRow,tempCol);
      
      // setting up formula that compares values
      var compCellName = ('RDR2019DC' + CompanyObj.id +'opCom' + currentStep.labelShort + currentIndicator.elements[h].labelShort);
       if (numberOfComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
       compCellName = compCellName.toString();
      
      var formula = '=IMPORTRANGE("'+CompanyObj.urlDC+'","'+compCellName+'")';
      formula=formula.toString();
      currentCell.setFormula(formula);
      
      // naming the cell
      var cellName = ('RDR2019SC' + CompanyObj.id + 'opCom'+currentStep.labelShort + currentIndicator.elements[h].labelShort);
      if (numberOfComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort;}
      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);
      
      tempCol=tempCol+1;     
    }
    
    // looping through the services now
    for(var g=0;g<CompanyObj.services.length;g++) {
      
      for(k=0; k<numberOfComponents; k++) {
      currentCell = sheet.getRange(activeRow,tempCol);
      
      // setting up formula that compares values
        var compCellName = ('RDR2019DC' + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.elements[h].labelShort);
       if (numberOfComponents != 1) { compCellName = compCellName + indicatorType.components[k].labelShort; }
       compCellName = compCellName.toString();
      
      var formula = '=IMPORTRANGE("'+CompanyObj.urlDC+'","'+compCellName+'")';
      formula=formula.toString();
      currentCell.setFormula(formula);
        
      // naming the cell
      var cellName = ('RDR2019SC' + CompanyObj.services[g].id + currentStep.labelShort + currentIndicator.elements[h].labelShort);
      if (numberOfComponents != 1) { cellName = cellName + indicatorType.components[k].labelShort;}
      cellName = cellName.toString();
      file.setNamedRange(cellName, currentCell);
      
      tempCol=tempCol+1;     
    }
      
    }
        
    
    activeRow=activeRow+1;
  }
  
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