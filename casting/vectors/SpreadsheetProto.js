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
  
  // MAKING ALL THE NECESSARY TABS and filling them
  // 1. the governance tabs
  populate(file, Indicators.governance, Verizon, Steps);

  // 2. setting up freedom
  populate(file, Indicators.freedom, Verizon, Steps);
  
  // 3. the privacy tabs
  populate(file, Indicators.privacy, Verizon, Steps);
  
  
 
  Logger.log('end main');
  return;
}



// functions to convert column numbers to letters and vice versa
function columnToLetter(column)
{
  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function letterToColumn(letter)
{
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++)
  {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}

function populate(file, indicatortype, Verizon, Steps) {
    
  for(var i=0; i<indicatortype.indicators.length; i++) {
       var spread = file.insertSheet();
       spread.setName(indicatortype.indicators[i].labelShort);
    
      // setting active row and an active column
    var activeRow = 1;
    var activeCol = 1;
    
    var subtype =1;
  
    if(indicatortype.hasComponents==true) { subtype=indicatortype.components.length;} // if indicator has components add them
  
    activeRow = header(spread, indicatortype, Verizon, activeRow, file, subtype); // sets up header
    
    // setting up all the steps for all the indicators
     for( var j=0; j<Steps.researchSteps.length; j++) {
      for( var k=0; k<Steps.researchSteps[j].elements.length; k++) {
        
        if(Steps.researchSteps[j].elements[k].type == "header") {
          activeRow =stepHeader(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype);
        }
        
        else if(Steps.researchSteps[j].elements[k].type == "elementDropDown") {
          activeRow = elementDropDown(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype, indicatortype);
        }
        
        else if(Steps.researchSteps[j].elements[k].type == "miniElementDropDown") {
          activeRow = miniElementDropDown(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype, indicatortype);
        }
        
       else if(Steps.researchSteps[j].elements[k].type == "comments") {
          activeRow = comments(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype, indicatortype);
        }
        
        else if(Steps.researchSteps[j].elements[k].type == "sources") {
          activeRow = sourcesStep(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype, indicatortype);
        }
        
        else if(Steps.researchSteps[j].elements[k].type == "miniheader") {
          activeRow = miniheader(Steps.researchSteps[j], k, activeRow, spread);
        }
        
        else if(Steps.researchSteps[j].elements[k].type == "comparison") {
          activeRow = comparison(spread, indicatortype.indicators[i], Verizon, activeRow, file, Steps.researchSteps[j], k, subtype, indicatortype);
        }
      }
    }

  }
}


function comparison(spread, indicator, Verizon, activeRow, file, step, m, subtype, indicatortype) {
  
  // sets up column with discription
  for(var j=0; j<indicator.elements.length; j++) {
    var activeCol = 1;
    for(var k=0; k<(Verizon.numberOfServices+3); k++) {
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

          // setting up formula that compares values
          var compCellName = ('RDR2019DC'+Verizon.id+step.elements[m].compShort+indicator.elements[j].labelShort);
          if(subtype!=1) { compCellName=compCellName+indicatortype.components[g].labelShort;}
          compCellName=compCellName.toString();
          
          var value = indicator.compCol + ((k-1)*subtype)+g;
          var col = columnToLetter(value);
          var formula = 'IF('+compCellName+'=IMPORTRANGE("'+Verizon.url+'","'+Verizon.tab+'!';
          formula = formula + col+(indicator.compRow+j);
          formula = formula +'"),"Yes","No")';
          formula.toString();
                    
          thisCell.setFormula(formula);  
            
          activeCol=activeCol+1;
          }
        }
                
        else if (k==2) {
          for(var g=0; g<subtype;g++) {
                    var thisCell = spread.getRange(activeRow+j, activeCol);
          var thisCell = spread.getRange(activeRow+j, activeCol);
          var compCellName = ('RDR2019DC'+Verizon.id+'opCom'+step.elements[m].compShort+indicator.elements[j].labelShort);
          if(subtype!=1) { compCellName=compCellName+indicatortype.components[g].labelShort;}
          compCellName=compCellName.toString();
                        
          var value = indicator.compCol + ((k-1)*subtype)+g;
          var col = columnToLetter(value);
          var formula = 'IF('+compCellName+'=IMPORTRANGE("'+Verizon.url+'","'+Verizon.tab+'!';
          formula = formula + col+(indicator.compRow+j);
          formula = formula +'"),"Yes","No")';
          formula.toString();
                    
          thisCell.setFormula(formula); 
            

          activeCol=activeCol+1;
          }
        }
        
        else {
          for(var g=0; g<subtype;g++) {
            var thisCell = spread.getRange(activeRow+j, activeCol);
            var compCellName = ('RDR2019DC'+Verizon.services[k-3].id+step.elements[m].compShort+indicator.elements[j].labelShort);
          if(subtype!=1) { compCellName=compCellName+indicatortype.components[g].labelShort;}
          compCellName=compCellName.toString();  
          
            
          var value = indicator.compCol + ((k-1)*subtype)+g;
          var col = columnToLetter(value);
          var formula = 'IF('+compCellName+'=IMPORTRANGE("'+Verizon.url+'","'+Verizon.tab+'!';
          formula = formula + col+(indicator.compRow+j);
          formula = formula +'"),"Yes","No")';
          formula.toString();
                    
          thisCell.setFormula(formula);
            

          activeCol=activeCol+1;
          }
        }   
      }
    }
  }
  
  // adding the formating so that the cell turns red if the answer is no
  var colMax =columnToLetter(2+(Verizon.numberOfServices+2)*subtype);
  var rowMax =activeRow+indicator.elements.length;
  
  var range = spread.getRange(activeRow, 2, indicator.elements.length, 2+(Verizon.numberOfServices+2)*subtype)
  
  var rule = SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('No').setBackground("#fa7661").setRanges([range]).build();
  var rules = spread.getConditionalFormatRules();
  rules.push(rule);
  spread.setConditionalFormatRules(rules);
  
  
  activeRow = activeRow=activeRow+indicator.elements.length;
  return activeRow;
}




function miniheader(step, m, activeRow, spread) {
  var cell = spread.getRange(activeRow,1);
  cell.setBackgroundRGB(step.c1, step.c2, step.c3);
  cell.setValue(step.elements[m].label);
  cell.setFontWeight('bold');
  cell.setWrap(true);
  activeRow=activeRow+1;
  return activeRow;
  
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

function miniElementDropDown(spread, indicator, Verizon, activeRow, file, step, m, subtype, indicatortype) {
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(step.elements[m].dropdown).build();

  var activeCol = 1;
    for(var k=0; k<(Verizon.numberOfServices+3); k++) { // (((Verizon.numberOfServices+2)*subtype)+1)
      if(k==0) {
         var cell =spread.getRange(activeRow, activeCol);
         cell.setValue(step.elements[m].label);
         cell.setBackgroundRGB(step.c1, step.c2, step.c3);
        activeCol=activeCol+1;
        }
      
      // names the cells into which answers will be put
      else {
        if(k==1) {
          // overall company
          for(var g=0; g<subtype;g++) {
                    var thisCell = spread.getRange(activeRow, activeCol);
          var trial = ('RDR2019DC'+Verizon.id+step.labelShort);
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
                    var thisCell = spread.getRange(activeRow, activeCol);
          var thisCell = spread.getRange(activeRow, activeCol);
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+step.labelShort);
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
                    var thisCell = spread.getRange(activeRow, activeCol);
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+step.labelShort);
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
      "label": "Step 1.5: Year-on-year analysis",
      "labelShort": "S01.5",
      "c1": 168,
      "c2": 168,
      "c3": 50,
      "elements": [
        {
          "type": "header",
          "filler": " "
        },
        {
          "type": "miniheader",
          "label": "Is your answer the same as the previous year?"
        },
        {
          "type": "comparison",
          "label": "Element ",
          "compShort": "S01"
        },
        {
          "type": "miniheader",
          "label": "If no, please select the reason why and provide comments for that element."
        },
        {
          "type": "elementDropDown",
          "label": "Select reason if 'no' for ",
          "dropdown": [
            "not selected",
            "I do not agree with last year's score",
            "the policy appears revised or changed"
          ]
        },
        {
          "type": "comments",
          "label": "Comments for ",
          "label2": " ",
          "nameLabel": "Comments"
        }
      ]
    },
    {
      "label": "Step 2: Review",
      "labelShort": "S02",
      "c1": 186,
      "c2": 136,
      "c3": 177,
      "elements": [
        {
          "type": "header",
          "filler": "Your Name"
        },
        {
          "type": "miniElementDropDown",
          "label": "Do you agree with the answer(s) in Step 1?",
          "dropdown": [
            "not selected",
            "yes",
            "no"
          ]
        },
        {
          "type": "elementDropDown",
          "label": "If 'no': suggested answer for ",
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
          "label2": " (required if 'no', optional if 'yes')",
          "nameLabel": "Comments"
        },
        {
          "type": "miniheader",
          "label": "Do you agree with the year-on-year analysis in Step 1.5?"
        },
        {
          "type": "elementDropDown",
          "label": "In Step 1.5 for ",
          "dropdown": [
            "not selected",
            "yes",
            "no"
          ]
        },
        {
          "type": "comments",
          "label": "If no, comments on ",
          "label2": " If no, comments on ",
          "nameLabel": "Comments2"
        }
        ]
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
      "label": "Step 3.5: Year-on-year analysis",
      "labelShort": "S03.5",
      "c1": 50,
      "c2": 168,
      "c3": 82,
      "elements": [
        {
          "type": "header",
          "filler": " "
        },
        {
          "type": "miniheader",
          "label": "Is your answer the same as the previous year?"
        },
        {
          "type": "comparison",
          "label": "Element ",
          "compShort": "S03"
        },
        {
          "type": "miniheader",
          "label": "If no, please select the reason why and provide comments for that element."
        },
        {
          "type": "elementDropDown",
          "label": "Select reason if 'no' for ",
          "dropdown": [
            "not selected",
            "I do not agree with last year's score",
            "the policy appears revised or changed"
          ]
        },
        {
          "type": "comments",
          "label": "Comments for ",
          "label2": " ",
          "nameLabel": "Comments"
        }
      ]
    },
    {
      "label": "Step 4: First Horizontal Review",
      "labelShort": "S04",
      "c1": 168,
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
      "label": "Step 4.5: Year-on-year analysis",
      "labelShort": "S04.5",
      "c1": 188,
      "c2": 214,
      "c3": 208,
      "elements": [
        {
          "type": "header",
          "filler": " "
        },
        {
          "type": "miniheader",
          "label": "Is your answer the same as the previous year?"
        },
        {
          "type": "comparison",
          "label": "Element ",
          "compShort": "S04"
        },
        {
          "type": "miniheader",
          "label": "If no, please select the reason why and provide comments for that element."
        },
        {
          "type": "elementDropDown",
          "label": "Select reason if 'no' for ",
          "dropdown": [
            "not selected",
            "I do not agree with last year's score",
            "the policy appears revised or changed"
          ]
        },
        {
          "type": "comments",
          "label": "Comments for ",
          "label2": " ",
          "nameLabel": "Comments"
        }
      ]
    },
    {
      "label": "Step 5: Company Feedback",
      "labelShort": "S05",
      "c1": "143",
      "c2": "237",
      "c3": "88",
      "elements": [
        {
          "type": "header",
          "filler": "Your Name"
        },
        {
          "type": "miniElementDropDown",
          "label": "Does company feedback merit a change??",
          "dropdown": [
            "not selected",
            "yes",
            "no"
          ]
        },
        {
          "type": "elementDropDown",
          "label": "If 'yes': suggested answer for ",
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
          "label2": " (required if 'yes', optional if 'no')",
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
      "label": "Step 6: Second Horizontal Review",
      "labelShort": "S06",
      "c1": 162,
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
      "c2": 149,
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
      "label": "Step 7.5: Year-on-year analysis",
      "labelShort": "S07.5",
      "c1": 240,
      "c2": 200,
      "c3": 58,
      "elements": [
        {
          "type": "header",
          "filler": " "
        },
        {
          "type": "miniheader",
          "label": "Is your answer the same as the previous year?"
        },
        {
          "type": "comparison",
          "label": "Element ",
          "compShort": "S07"
        },
        {
          "type": "miniheader",
          "label": "If no, please select the reason why and provide comments for that element."
        },
        {
          "type": "elementDropDown",
          "label": "Select reason if 'no' for ",
          "dropdown": [
            "not selected",
            "I do not agree with last year's score",
            "the policy appears revised or changed"
          ]
        },
        {
          "type": "comments",
          "label": "Comments for ",
          "label2": " ",
          "nameLabel": "Comments"
        }
      ]
    }
  ]
};
  
  return steps;
  
}
