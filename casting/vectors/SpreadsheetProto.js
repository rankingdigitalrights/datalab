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
  //var Steps = importResearchSteps();
  var Steps = importSteps();
  
  
  // MAKING ALL THE NECESSARY TABS
  // 1. the governance tabs
  populate(file, Indicators.governance, Verizon, Steps);

  // 2. setting up freedom
  populate(file, Indicators.freedom, Verizon, Steps);
  
  // 3. the privacy tabs
  populate(file, Indicators.privacy, Verizon, Steps);
  
  
  
  
  
  
  Logger.log('end main');
  return;
}



function populate(file, indicatortype, Verizon, Steps) {
    
  for(var i=0; i<indicatortype.indicators.length; i++) {
       var spread = file.insertSheet();
       spread.setName(indicatortype.indicators[i].labelShort);
    
      // setting active row and an active column
    var activeRow = 1;
    var activeCol = 1;
    
    var subtype =1;
  
    if(indicatortype.hasComponents==true) { subtype=indicatortype.components.length;}
  
    activeRow = header(spread, indicatortype, Verizon, activeRow, file, subtype); // sets up header
    
     for( var j=0; j<Steps.researchSteps.length; j++) {
      for( var k=0; k<Steps.researchSteps[j].elements.length; k++) {
        
        if(Steps.researchSteps[j].elements[k].type == "header") {
          activeRow =stepHeader(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype);
        }
        
        if(Steps.researchSteps[j].elements[k].type == "elementDropDown") {
          activeRow = elementDropDown(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype, indicatortype);
        }
        
       if(Steps.researchSteps[j].elements[k].type == "comments") {
          activeRow = comments(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype, indicatortype);
        }
        
        if(Steps.researchSteps[j].elements[k].type == "sources") {
          activeRow = sourcesStep(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype, indicatortype);
        }
      }
    }

  }
}







// header of sheet function------------------------------------------------
function header(spread, indicatortype, Verizon, activeRow, file, subtype) {
  
  var activeCol =1;
  
  spread.setColumnWidth(1,300);
  for(var i =2;i<=10;i++) {spread.setColumnWidth(i,300/subtype);} // sets column width
  
  var trial = (activeRow+':'+activeRow);
   trial=trial.toString();
   spread.getRange(trial).setHorizontalAlignment('center'); // alligns header row

 
  
  // -----------------------SETTING UP THE HEADER ROW------------------------
  // first collum is blank
  spread.getRange(activeRow,activeCol).setValue('');
  activeCol=activeCol+1;

  // overall Company column(s)
  for(var i=0; i<subtype; i++) {
    var cell = spread.getRange(activeRow,activeCol);
    cell.setValue(Verizon.groupLabel); // adds text
    cell.setBackgroundRGB(252, 111, 125); // sets color
    cell.setFontWeight('bold'); // makes text bold
    
    if(indicatortype.hasComponents==true) {
      var currentCell=spread.getRange(activeRow+1, activeCol);
      currentCell.setValue(indicatortype.components[i].labelLong);
      currentCell.setBackgroundRGB(252, 111, 125); // sets color
      currentCell.setFontWeight('bold'); // makes text bold
    }
    
    activeCol=activeCol+1;
    
  }
  
    for(var i=0; i<subtype; i++) {
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
      
      if(indicatortype.hasComponents==true) {
        var currentCell=spread.getRange(activeRow+1, activeCol);
        currentCell.setValue(indicatortype.components[i].labelLong);
        currentCell.setBackgroundRGB(252, 111, 125); // sets color
        currentCell.setFontWeight('bold'); // makes text bold
    }
      
      activeCol=activeCol+1;
  }
  
  // for remaining collumns
   for(var i = 0; i<Verizon.numberOfServices; i++) {
     for(var j=0; j<subtype; j++) {
     var cell=spread.getRange(activeRow,activeCol);
     cell.setValue(Verizon.services[i].label.current); 
     cell.setBackgroundRGB(252, 111, 125);
     cell.setFontWeight('bold');
 
    if(indicatortype.hasComponents==true) {
      var currentCell=spread.getRange(activeRow+1, activeCol);
      currentCell.setValue(indicatortype.components[j].labelLong);
      currentCell.setBackgroundRGB(252, 111, 125); // sets color
      currentCell.setFontWeight('bold'); // makes text bold
    }
     activeCol=activeCol+1;
     }
    }
  
  spread.setFrozenRows(activeRow); // freezes rows
  
    if(indicatortype.hasComponents==true) { 
      spread.setFrozenRows(activeRow+1);
      var range = ((activeRow+1)+':'+(activeRow+1));
      range=range.toString();
      spread.getRange(range).setHorizontalAlignment('center');
      activeRow = activeRow+1;

    }
    
  return activeRow;
  
}



function stepHeader(spread, indicator, Verizon, activeRow, file, step, k, subtype) {
  activeRow=activeRow+1;
  
  var cell = spread.getRange(activeRow,1);
  cell.setBackgroundRGB(step.c1, step.c2, step.c3);
  var text =step.label;
  cell.setValue(text);
  cell.setFontWeight('bold');
  
  for(var i=1; i<(((Verizon.numberOfServices+2)*subtype)+1);i++) {
      var cell = spread.getRange(activeRow,i+1);
      cell.setValue(step.elements[k].filler);
  }
  
  activeRow = activeRow+1;
  return activeRow;
  
}


function elementDropDown(spread, indicator, Verizon, activeRow, file, step, m, subtype, indicatortype) {
  
   var rule = SpreadsheetApp.newDataValidation().requireValueInList(step.elements[m].dropdown).build();
  
    // moving on to actual indicators
  // sets up column with discription
  for(var j=0; j<indicator.elements.length; j++) {
    var activeCol = 1;
    for(var k=0; k<(Verizon.numberOfServices+3); k++) { // (((Verizon.numberOfServices+2)*subtype)+1)
      if(k==0) {
         var cell =spread.getRange(activeRow+j, activeCol);
         cell.setValue(step.elements[m].label + indicator.elements[j].labelShort);
         cell.setBackgroundRGB(step.c1, step.c2, step.c3);
        activeCol=activeCol+1;
        }
      
      // names the cells into which answers will be put
      else {
        if(k==1) {
          // overall company
          for(var g=0; g<subtype;g++) {
                    var thisCell = spread.getRange(activeRow+j, activeCol);
          var trial = ('RDR2019DC'+Verizon.id+step.labelShort+indicator.elements[j].labelShort);
            if(subtype!=1) { trial=trial+indicatortype.components[g].labelShort;
            }
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        thisCell.setDataValidation(rule); // creates dropdown list
        thisCell.setValue('not selected'); // sets default for drop down list
        thisCell.setFontWeight('bold'); // bolds the answers
          activeCol=activeCol+1;
          }
        }
        
        else if (k==2) {
          for(var g=0; g<subtype;g++) {
                    var thisCell = spread.getRange(activeRow+j, activeCol);
          var thisCell = spread.getRange(activeRow+j, activeCol);
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+step.labelShort+indicator.elements[j].labelShort);
            if(subtype!=1) { trial=trial+indicatortype.components[g].labelShort;
            }
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        thisCell.setDataValidation(rule); // creates dropdown list
        thisCell.setValue('not selected'); // sets default for drop down list
        thisCell.setFontWeight('bold'); // bolds the answers
          activeCol=activeCol+1;
          }
        }
        
        else {
          for(var g=0; g<subtype;g++) {
                    var thisCell = spread.getRange(activeRow+j, activeCol);
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+step.labelShort+indicator.elements[j].labelShort);
          if(subtype!=1) { trial=trial+indicatortype.components[g].labelShort;}
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
          thisCell.setDataValidation(rule); // creates dropdown list
            thisCell.setValue('not selected'); // sets default for drop down list
            thisCell.setFontWeight('bold'); // bolds the answers
          activeCol=activeCol+1;
          }
        }   
      }
    }
  }
  
  activeRow = activeRow=activeRow+indicator.elements.length;
  return activeRow;
}


function comments(spread, indicator, Verizon, activeRow, file, step, m, subtype, indicatortype) {
  

  for(var i =0;i<indicator.elements.length;i++) {spread.setRowHeight(activeRow+i,50);} // increases height of row
  
  for(var j=0; j<indicator.elements.length; j++) {
    var activeCol = 1;
    for(var k=0; k<(Verizon.numberOfServices+3); k++) {
     if(k==0) {
       // first column label
       var cell = spread.getRange(activeRow+j, k+1);
       cell.setValue(step.elements[m].label+indicator.elements[j].labelShort+step.elements[m].label2);
       cell.setBackgroundRGB(step.c1, step.c2, step.c3); // colors cell
     }
      
     else {
        if(k==1) {
           for(var g=0; g<subtype;g++) {
             var thisCell = spread.getRange(activeRow+j+g, k+1);
             thisCell.setWrap(true);
             var trial = ('RDR2019DC'+Verizon.id+step.labelShort+indicator.elements[j].labelShort+step.elements[m].nameLabel);
             if(subtype!=1) { trial=trial+indicatortype.components[g].labelShort;}
             trial=trial.toString();
             file.setNamedRange(trial,thisCell);
           }
        }
       else if (k==2) {
           for(var g=0; g<subtype;g++) {
             var thisCell = spread.getRange(activeRow+j+g, k+1);
             thisCell.setWrap(true);
             var trial = ('RDR2019DC'+Verizon.id+'opCom'+step.labelShort+indicator.elements[j].labelShort+step.elements[m].nameLabel);
             if(subtype!=1) { trial=trial+indicatortype.components[g].labelShort;}
             trial=trial.toString();
             file.setNamedRange(trial,thisCell);
           }
       }
        
        else {
           for(var g=0; g<subtype;g++) {
             var thisCell = spread.getRange(activeRow+j+g, k+1);
             thisCell.setWrap(true);
             var trial = ('RDR2019DC'+Verizon.services[k-3].id+step.labelShort+indicator.elements[j].labelShort+step.elements[m].nameLabel);
             if(subtype!=1) { trial=trial+indicatortype.components[g].labelShort;}
             trial=trial.toString();
             file.setNamedRange(trial,thisCell);
        }

        }
      }
    }
  }

  
  activeRow = activeRow+indicator.elements.length;
  return activeRow;
}

function sourcesStep(spread, indicator, Verizon, activeRow, file, step, m, subtype, indicatortype) {
  var activeCol=1;
  for(var k=0; k<(Verizon.numberOfServices+3); k++) {
     if(k==0) {
       // first column description
       var cell =spread.getRange(activeRow,activeCol);
       cell.setValue(step.elements[m].label);
       cell.setBackgroundRGB(step.c1, step.c2, step.c3);

     }
     else {

        if(k==1) {
          // main company
          for(var g=0; g<subtype; g++) {
            var thisCell = spread.getRange(activeRow, k+1+g);
            thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side
          var trial = ('RDR2019DC'+Verizon.id+step.labelShort+indicator.labelShort+step.elements[m].nameLabel);
             if(subtype!=1) { trial=trial+indicatortype.components[g].labelShort;}
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
          }
        }
       
       else if (k==2) {
          // opCom
          for(var g=0; g<subtype; g++) {
            var thisCell = spread.getRange(activeRow, k+1+g);
            thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+step.labelShort+indicator.labelShort+step.elements[m].nameLabel);
             if(subtype!=1) { trial=trial+indicatortype.components[g].labelShort;}
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
          }
        }
        
        else {
          // services
          for(var g=0; g<subtype; g++) {
            var thisCell = spread.getRange(activeRow, k+1+g);
            thisCell.setWrap(true); // sets wrap so that text doesn't bleed off the side
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+step.labelShort+indicator.labelShort+step.elements[m].nameLabel);
             if(subtype!=1) { trial=trial+indicatortype.components[g].labelShort;}
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
          }
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
    }, 
    {
      "label": "Step 6: Second Horizontal Review",
      "labelShort": "S06",
      "c1":162,
      "c2": 168,
      "c3": 50,
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
          "label": "Step 7: Final Review",
          "labelShort": "S07",
          "c1": 50,
          "c2":149,
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
        }
  ]
};
  
  return steps;
  
}
