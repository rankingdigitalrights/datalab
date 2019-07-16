function main() {
  Logger.log('begin main');
 
  // creating a blank spreadsheet
  var file = SpreadsheetApp.create('VerizonPrototype'); 
  var spread = file.getActiveSheet();

  
  // Verizon Object
  var Verizon = {
  "collection": "companies",
  "id": "ivm1",
  "label": {
    "current": "Verizon Media",
    "legacy": [
      "Oath",
      "Yahoo"
      ]
  },
  "type": "internet",
  "groupLabel": "Verizon Media",
  "opCom": false,
  "opComLabel": null,
  "prevScored": true,
  "firstIndex": 2015,
  "numberOfServices": 2,
  "services": [
    {
      "id":"ivm1ym",
      "type": "mail",
      "label": {
        "current": "Yahoo Mail",
        "legacy": null
        }
    },
    {
      "id":"ivm1t",
      "type": "photoVideo",
      "label": {
        "current": "Tumblr",
        "legacy": null
        }
    }
  ]
}
  
  
  var Indicators = {
    "governance": {
        "labelShort": "G",
        "labelLong": "Governance",
        "description": "The Governance category contains six indicators that measure if and how companies disclose governance processes designed to ensure that they respect the human rights to freedom of expression and privacy. Both rights are part of the Universal Declaration of Human Rights and are enshrined in the International Covenant on Civil and Political Rights. They apply online as well as offline. For the company to perform well in this section, disclosure should follow—and ideally surpass—the UN Guiding Principles on Business and Human Rights and other industry-specific human rights standards for freedom of expression and privacy such as the Global Network Initiative Principles.",
        "indicators": {
            "1": {
                "labelShort":"G1",
                "labelLong": "Policy Commitment",
                "description": "The company should publicly commit to respect users' human rights to freedom of expression and privacy.",
                "elements": {
                    "1": {
                        "labelShort": "G1.1",
                        "description": "Does the company make an explicit, clearly articulated policy commitment to human rights, including freedom of expression and privacy?"
                    },
                    "2": {
                        "labelShort": "G1.2",
                        "description": "This element measures WYZ"
                    }
                }
            }
        },
        "researchGuidance": "This indicator seeks evidence that the company has made  explicit policy commitments to freedom of expression and privacy. This standard is outlined in the UN Guiding Principles on Business and Human Rights’ Operational Principle 16, which states that companies should adopt formal policies publicly expressing their commitment to international human rights principles and standards. Companies should disclose this policy commitment in formal policy documents or in other communications that reflect official company policy."
    },
    "freedom": {
        "labelShort": "F",
        "labelLong": "Freedom of Expression",
        "description": "The Freedom of Expression category contains 11 indicators that measure corporate disclosure of policies affecting users’ freedom of expression. Indicators in this category evaluate whether the company demonstrates concrete ways in which it respects users’ right to freedom of expression, as articulated in the Universal Declaration of Human Rights, the International Covenant on Civil and Political Rights, and other international human rights instruments. A company’s disclosed policies should demonstrate how it works to avoid contributing to actions that may interfere with this right, except where such actions are lawful, proportionate, and for a justifiable purpose. Companies that perform well in this category demonstrate a strong public commitment to transparency, not only in terms of how they comply with laws and regulations or respond to government demands, but also how they determine, communicate, and enforce private rules and commercial practices that affect users’ freedom of expression.",
        "indicators": {
            "1": {
                "labelShort":"F1",
                "labelLong": "Access to terms of service",
                "description": "The company should offer terms of service that are easy to find and easy to understand.",
              "numElements":3,
                "elements": [{
                    "1": {
                        "labelShort": "F1.1",
                        "description": "Are the company's terms of service easy to find?",
                        "companyClass": "telecommuciation"
                    },
                    "2": {
                        "labelShort": "F1.2",
                        "description": "Are the terms of service available in the language(s) most commonly spoken by the company's users?",
                        "companyClass": "telecommuciation"
                    },
                    "3": {
                        "labelShort": "F1.3",
                        "description": "Are the terms of service presented in an understandable manner?",
                        "companyClass": "telecommuciation"
                    }
                }]
            }
        },
        "researchGuidance": "A company’s terms of service outline the relationship between the user and the company. These terms contain rules about prohibited content and activities and companies can also take action against users for violating the rules described in the terms. Given this, we expect companies to ensure that the terms are easy for access and understand.\n\n[TEST]This indicator evaluates if the company’s terms are easy for users to locate. A document that is easy to find is located on the homepage of the company or service, or one or two clicks away from the homepage, or in a logical place where users can expect to find it. The terms should also be available in the major language(s) of the primary operating market. In addition, we expect a company to take steps to help users understand the information presented in their documents. This includes, but is not limited to, providing summaries, tips, or guidance that explain what the terms mean, using section headers, readable font size, or other graphic features to help users understand the document, or writing the terms using readable syntax."
    },
    "privacy": {}
}
  
  // setting active row and an active column
  var activeRow = 1;
  var activeCol = 1;
  
  
  for(var i =1;i<=4;i++) {spread.setColumnWidth(i,300);} // sets column width
  
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
  
  if(Verizon.opCom!=false) {
    var cell = spread.getRange(activeRow,activeCol);
    cell.setValue(Verizon.opComLabel);
    cell.setBackgroundRGB(252, 111, 125);
    cell.setFontWeight('bold');
    activeCol=activeCol+1;
  }
  
  // for remaining collumns
  for(var i = 0; i<Verizon.numberOfServices; i++) {
    var cell=spread.getRange(activeRow,activeCol);
    cell.setValue(Verizon.services[i].label.current); 
    cell.setBackgroundRGB(252, 111, 125);
    cell.setFontWeight('bold');
    activeCol=activeCol+1;

  }
  
  spread.setFrozenRows(1); // freezes rows
  
  // will be used later in dropdown list:
    var rule = SpreadsheetApp.newDataValidation().requireValueInList(['not selected', 'yes','partial','no','no disclosure found','N/A']).build();

  // --------------------------Setting up step and your name row--------------------------
  activeCol=1;
  activeRow=activeRow+1;
  for(var i=0; i<(Verizon.numberOfServices+2);i++) {
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
  for(var j=0; j<3; j++) {
    for(var k=0; k<(Verizon.numberOfServices+2); k++) {
      if(k==0) {
        var cell =spread.getRange(activeRow+j, k+1);
        cell.setValue('Element F1.'+(j+1));
        cell.setBackgroundRGB(223, 135, 212);
        
      }
      
      // names the cells into which answers will be put
      else {
        var thisCell = spread.getRange(activeRow+j, k+1);
        if(k==1) {
          // overall company
          var trial = ('RDR2019DC'+Verizon.id+'S01'+'F01'+'0'+(j+1));
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          // subservices
          var trial = ('RDR2019DC'+Verizon.services[k-2].id+'S01'+'F01'+'0'+(j+1));
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
  activeRow=activeRow+3;
  for(var i =0;i<3;i++) {spread.setRowHeight(activeRow+i,50);} // increases height of row
  for(var j=0; j<3; j++) {
    for(var k=0; k<(Verizon.numberOfServices+2); k++) {
     if(k==0) {
       // first column label
       var cell = spread.getRange(activeRow+j, k+1);
       cell.setValue('Comments for Element F1.'+(j+1)+' (explain score)');
       cell.setBackgroundRGB(223, 135, 212); // colors cell

     }
     else {
       // names the cells
        var thisCell = spread.getRange(activeRow+j, k+1);
       thisCell.setWrap(true);
        if(k==1) {
          var trial = ('RDR2019DC'+Verizon.id+'S01'+'F01'+'0'+(j+1)+'Comments');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);

        }
        
        else {
          var trial = ('RDR2019DC'+Verizon.services[k-2].id+'S01'+'F01'+'0'+(j+1)+'Comments');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }

        
      }
    }
  }
  
  //-----------------------------Sources row------------------------------------
  activeRow=activeRow+3;
    for(var k=0; k<(Verizon.numberOfServices+2); k++) {
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
          var trial = ('RDR2019DC'+Verizon.id+'S01'+'F01'+'Sources');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }
        
        else {
          // services
          var trial = ('RDR2019DC'+Verizon.services[k-2].id+'S01'+'F01'+'Sources');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }
        
        
      }
    }
  
  //spread.getRange('9:9').setBorder(false, false, true, false, false, false, 'black', SpreadsheetApp.BorderStyle.SOLID);
      
    
    
  
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

