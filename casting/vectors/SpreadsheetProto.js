function main() {
  Logger.log('begin main');
 
  // creating a blank spreadsheet
  var file = SpreadsheetApp.create('VerizonPrototype'); 
  var sources = file.getActiveSheet(); // creates sources page
  sources.setName('2019 Sources'); // <-- will need to make this dynamic at some point
  
  
  // INSERT FUNCTION MAKING SOURCES PAGE
  
  //importing the two objects needed
  var Verizon = importJsonVerizon();
  var Indicators = importJsonIndicator();
  //var Indicators = trial();
  //var Steps = importResearchSteps();
  var Steps = importSteps();
  
  
  // MAKING ALL THE NECESSARY TABS
  // 1. the governance tabs
  for(var i=0; i<Indicators.governance.indicators.length; i++) {
       var spread = file.insertSheet();
       spread.setName(Indicators.governance.indicators[i].labelShort);
  }
  // 2. the freedom tabs
  for(var i=0; i<Indicators.freedom.indicators.length; i++) {
       var spread = file.insertSheet();
       spread.setName(Indicators.freedom.indicators[i].labelShort);
    
      // setting active row and an active column
    var activeRow = 1;
    var activeCol = 1;
  
    activeRow = header(spread, Indicators, Verizon, activeRow, activeCol, file); // sets up header
    //activeRow = step1(spread, Indicators.freedom.indicators[i], Verizon, activeRow,activeCol, file);
    
    Logger.log(Steps.researchSteps.length);
    for( var j=0; j<Steps.researchSteps.length; j++) {
      for( var k=0; k<Steps.researchSteps[j].elements.length; k++) {
         //Logger.log(Steps.researchSteps[j].elements.length);

        
        if(Steps.researchSteps[j].elements[k].type == "header") {
          activeRow =stepHeader(spread, Indicators.freedom.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k);
        }
        
        if(Steps.researchSteps[j].elements[k].type == "elementDropDown") {
          activeRow = elementDropDown(spread, Indicators.freedom.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k);
        }
        
        if(Steps.researchSteps[j].elements[k].type == "comments") {
          activeRow = comments(spread, Indicators.freedom.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k);
        }
        
        if(Steps.researchSteps[j].elements[k].type == "sources") {
          activeRow = sourcesStep(spread, Indicators.freedom.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k);
        }
      }
    }
    

  }
  
  // 3. the privacy tabs
  for(var i=0; i<Indicators.privacy.indicators.length; i++) {
       var spread = file.insertSheet();
       spread.setName(Indicators.privacy.indicators[i].labelShort); // sets name of sheet
    
    // setting active row and an active column
    var activeRow = 1;
    var activeCol = 1;
    
    activeRow = header(spread, Indicators.privacy.indicators[i], Verizon, activeRow, activeCol, file); // sets up header
    activeRow = step1(spread, Indicators.privacy.indicators[i], Verizon, activeRow,activeCol, file); // step1
    
    //activeRow = step3
  }      
    
    
  
  //------------------------------------------------Step 1.5----------------------------------------------------------
  
  activeRow=activeRow+2;
  
    // --------------------------Setting up step row--------------------------
    var cell = spread.getRange(activeRow,1);
    cell.setBackgroundRGB(223, 135, 212);
    var text ='Step 1.5: Year-on-year analysis';
    cell.setValue(text);
    cell.setFontWeight('bold');

  
    // -------------------Row under that-------------------------------------
    activeRow=activeRow+1;
    var cell = spread.getRange(activeRow,1);
    cell.setBackgroundRGB(223, 135, 212);
    var text ='Is your answer the same as the previous year?';
    cell.setValue(text);
    cell.setFontWeight('bold');

    
  
  
  
  
  
  Logger.log('end main');
  return;
}


// header of sheet function------------------------------------------------
function header(spread, Indicators, Verizon, activeRow, activeCol, file) {
for(var i =1;i<=10;i++) {spread.setColumnWidth(i,300);} // sets column width
  
  spread.getRange('1:1').setHorizontalAlignment('center'); // alligns header row
  
  // -----------------------SETTING UP THE HEADER ROW------------------------
  // first collum is blank
  spread.getRange(activeRow,activeCol).setValue('');
  activeCol=activeCol+1;

  // remaining columns
  var cell = spread.getRange(activeRow,activeCol);
  cell.setValue(Verizon.groupLabel); // adds text
  cell.setBackgroundRGB(252, 111, 125); // sets color
  cell.setFontWeight('bold'); // makes text bold
  activeCol=activeCol+1;
  

  // setting up OpComCompany regardless of whether it has one
  // will just hide the column if it doesn't exist
   var cell = spread.getRange(activeRow,activeCol);
   cell.setValue(Verizon.opComLabel);
   cell.setBackgroundRGB(252, 111, 125);
   cell.setFontWeight('bold');
  if(Verizon.opCom== false) {
    spread.hideColumns(activeCol);
    cell.setValue('N/A');
  }
  activeCol=activeCol+1;
  
  // for remaining collumns
  for(var i = 0; i<Verizon.numberOfServices; i++) {
    var cell=spread.getRange(activeRow,activeCol);
    cell.setValue(Verizon.services[i].label.current); 
    cell.setBackgroundRGB(252, 111, 125);
    cell.setFontWeight('bold');
    activeCol=activeCol+1;

  }
  
  spread.setFrozenRows(1); // freezes rows
  
  return activeRow;
  
}



function stepHeader(spread, indicator, Verizon, activeRow, file, step, k) {
   activeCol=1;
  activeRow=activeRow+1;
  for(var i=0; i<(Verizon.numberOfServices+3);i++) { // +3 because set up collumn, overall, and opCom
    var cell = spread.getRange(activeRow,i+1);
    if(i==0) {
      cell.setBackgroundRGB(step.c1, step.c2, step.c3);
      var text =step.label;
      cell.setValue(text);
      cell.setFontWeight('bold');
    }
    
    else {
      cell.setValue(step.elements[k].filler);
    }
    
  }
  activeRow = activeRow+1;
  return activeRow;
  
}


function elementDropDown(spread, indicator, Verizon, activeRow, file, step, m) {
  
   var rule = SpreadsheetApp.newDataValidation().requireValueInList(step.elements[m].dropdown).build();
  
    // moving on to actual indicators
  // sets up column with discription
  for(var j=0; j<indicator.elements.length; j++) {
    for(var k=0; k<(Verizon.numberOfServices+3); k++) {
      if(k==0) {
        var cell =spread.getRange(activeRow+j, k+1);
        cell.setValue(step.elements[m].label + indicator.elements[j].labelShort);
        cell.setBackgroundRGB(step.c1, step.c2, step.c3);
        
      }
      
      // names the cells into which answers will be put
      else {
        var thisCell = spread.getRange(activeRow+j, k+1);
        if(k==1) {
          // overall company
          var trial = ('RDR2019DC'+Verizon.id+step.labelShort+indicator.elements[j].labelShort);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else if (k==2) {
          // opCom
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+step.labelShort+indicator.elements[j].labelShort);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          // subservices
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+step.labelShort+indicator.elements[j].labelShort);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }
        thisCell.setDataValidation(rule); // creates dropdown list
        thisCell.setValue('not selected'); // sets default for drop down list
        thisCell.setFontWeight('bold'); // bolds the answers

        
      }
    }
  }
  
  activeRow = activeRow=activeRow+indicator.elements.length;
  return activeRow;
}


function comments(spread, indicator, Verizon, activeRow, file, step, m) {
  var activeCol=1;
  for(var i =0;i<indicator.elements.length;i++) {spread.setRowHeight(activeRow+i,50);} // increases height of row
  for(var j=0; j<indicator.elements.length; j++) {
    for(var k=0; k<(Verizon.numberOfServices+3); k++) {
     if(k==0) {
       // first column label
       var cell = spread.getRange(activeRow+j, k+1);
       cell.setValue(step.elements[m].label+indicator.elements[j].labelShort+step.elements[m].label2);
       cell.setBackgroundRGB(step.c1, step.c2, step.c3); // colors cell

     }
      
     else {
       // names the cells
        var thisCell = spread.getRange(activeRow+j, k+1);
       thisCell.setWrap(true);
        if(k==1) {
          var trial = ('RDR2019DC'+Verizon.id+step.labelShort+indicator.elements[j].labelShort+step.elements[m].nameLabel);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);

        }
       else if (k==2) {
          // opCom
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+step.labelShort+indicator.elements[j].labelShort+step.elements[m].nameLabel);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+step.labelShort+indicator.elements[j].labelShort+step.elements[m].nameLabel);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }

        
      }
    }
  }

  
  activeRow = activeRow+indicator.elements.length;
  return activeRow;
}

function sourcesStep(spread, indicator, Verizon, activeRow, file, step, m) {
  var activeCol=1;
  for(var k=0; k<(Verizon.numberOfServices+3); k++) {
     if(k==0) {
       // first column description
       var cell =spread.getRange(activeRow,activeCol);
       cell.setValue(step.elements[m].label);
       cell.setBackgroundRGB(step.c1, step.c2, step.c3);

     }
     else {
        var thisCell = spread.getRange(activeRow, k+1);
        thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side

        if(k==1) {
          // main company
          var trial = ('RDR2019DC'+Verizon.id+step.labelShort+indicator.labelShort+step.elements[m].nameLabel);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }
       
       else if (k==2) {
          // opCom
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+step.labelShort+indicator.labelShort+step.elements[m].nameLabel);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          // services
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+step.labelShort+indicator.labelShort+step.elements[m].nameLabel);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }
        
        
      }
    }
  
  activeRow = activeRow+1;
  return activeRow;
}

// --------------------------------------Step 1 Function------------------------------------

function step1(spread, indicator, Verizon, activeRow, activeCol, file) {
  
  // will be used later in dropdown list:
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(['not selected', 'yes','partial','no','no disclosure found','N/A']).build();

  // --------------------------Setting up step and your name row--------------------------
  activeCol=1;
  activeRow=activeRow+1;
  for(var i=0; i<(Verizon.numberOfServices+3);i++) { // +3 because set up collumn, overall, and opCom
    var cell = spread.getRange(activeRow,i+1);
    if(i==0) {
      cell.setBackgroundRGB(223, 135, 212);
      var text ='Step 1: Data Collection';
      cell.setValue(text);
      cell.setFontWeight('bold');
    }
    
    else {
      cell.setValue('Your Name');
    }
    
  }
  
    // --------------------------Setting up subindicator rows--------------------------

  // moving on to actual indicators
  // sets up column with discription
  activeCol=1;
  activeRow=activeRow+1;
  for(var j=0; j<indicator.elements.length; j++) {
    for(var k=0; k<(Verizon.numberOfServices+3); k++) {
      if(k==0) {
        var cell =spread.getRange(activeRow+j, k+1);
        cell.setValue('Element ' + indicator.elements[j].labelShort);
        cell.setBackgroundRGB(223, 135, 212);
        
      }
      
      // names the cells into which answers will be put
      else {
        var thisCell = spread.getRange(activeRow+j, k+1);
        if(k==1) {
          // overall company
          var trial = ('RDR2019DC'+Verizon.id+'S01'+indicator.elements[j].labelShort);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else if (k==2) {
          // opCom
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+'S01'+indicator.elements[j].labelShort);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          // subservices
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+'S01'+indicator.elements[j].labelShort);
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }
        thisCell.setDataValidation(rule); // creates dropdown list
        thisCell.setValue('not selected'); // sets default for drop down list
        thisCell.setFontWeight('bold'); // bolds the answers

        
      }
      //Logger.log(k);
    }
  }
  
  
  // -----------------------------Comments row--------------------------------
  activeCol=1;
  activeRow=activeRow+indicator.elements.length;
  for(var i =0;i<indicator.elements.length;i++) {spread.setRowHeight(activeRow+i,50);} // increases height of row
  for(var j=0; j<indicator.elements.length; j++) {
    for(var k=0; k<(Verizon.numberOfServices+3); k++) {
     if(k==0) {
       // first column label
       var cell = spread.getRange(activeRow+j, k+1);
       cell.setValue('Comments for Element '+indicator.elements[j].labelShort+' (explain score)');
       cell.setBackgroundRGB(223, 135, 212); // colors cell

     }
      
     else {
       // names the cells
        var thisCell = spread.getRange(activeRow+j, k+1);
       thisCell.setWrap(true);
        if(k==1) {
          var trial = ('RDR2019DC'+Verizon.id+'S01'+indicator.elements[j].labelShort+'Comments');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);

        }
       else if (k==2) {
          // opCom
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+'S01'+indicator.elements[j].labelShort+'Comments');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+'S01'+indicator.elements[j].labelShort+'Comments');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }

        
      }
    }
  }
  
  //-----------------------------Sources row------------------------------------
  activeRow=activeRow+indicator.elements.length;
    for(var k=0; k<(Verizon.numberOfServices+3); k++) {
     if(k==0) {
       // first column description
       var cell =spread.getRange(activeRow,activeCol);
       cell.setValue('Sources (reference, specific page, section, etc.)');
       cell.setBackgroundRGB(223, 135, 212);

     }
     else {
        var thisCell = spread.getRange(activeRow, k+1);
        thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side

        if(k==1) {
          // main company
          var trial = ('RDR2019DC'+Verizon.id+'S01'+indicator.labelShort+'Sources');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }
       
       else if (k==2) {
          // opCom
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+'S01'+indicator.labelShort+'Sources');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          // services
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+'S01'+indicator.labelShort+'Sources');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }
        
        
      }
    }
  return activeRow;
}




//---------------------------JSON INFO----------------------------------------------
// all these function read in a jason file and them parse them so they are usable
function importJsonVerizon() {
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
  var response = UrlFetchApp.fetch("  https://fubits.keybase.pub/stage/researchSteps.json"); 
  var jsonObj = JSON.parse(response); 
  return jsonObj;
}

function importSteps() {
  var steps= {
  "researchSteps": [
    {
      "label": "Step 1: Data Collection",
      "labelShort": "S01",
      "elements": [
        {
          "type": "header",
          "filler": "Your Name"
        },
        {
          "type": "elementDropDown",
          "label": "Element ",
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
      ],
      "c1": 223,
      "c2": 135,
      "c3": 212
    },
    {
      "label": "Step 3: Score Consensus",
      "labelShort": "S03",
      "c1": 50,
      "c2": 147,
      "c3": 168,
      "elements": [
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
    },
    {
      "label": "Step 4: First Horizontal Review",
      "labelShort": "S04",
      "c1":168,
      "c2": 50,
      "c3": 80,
      "elements": [
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
    },
    {
      "label": "Step 5: Company Feedback",
      "labelShort": "S05",
      "c1": 50,
      "c2": 168,
      "c3": 98,
      "elements": [
        {
          "type": "header",
          "filler": "Your Name"
        }
        ]
    }
  ]
};