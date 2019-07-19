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
  }
  
  // 3. the privacy tabs
  for(var i=0; i<Indicators.privacy.indicators.length; i++) {
       var spread = file.insertSheet();
       spread.setName(Indicators.privacy.indicators[i].labelShort);
    
      // setting active row and an active column
    var activeRow = 1;
    var activeCol = 1;
  
    activeRow = header(spread, Indicators, Verizon, activeRow, activeCol, file); // sets up header
  }

  var spread = file.insertSheet();
  spread.setName('Sample');
  
  
  // setting active row and an active column
  var activeRow = 1;
  var activeCol = 1;
  
  activeRow = header(spread, Indicators, Verizon, activeRow, activeCol, file); // sets up header
  activeRow = step1(spread, Indicators, Verizon, activeRow,activeCol, file); // sets up step 1
  
  
  
  
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









// --------------------------------------Step 1 Function------------------------------------

function step1(spread, Indicators, Verizon, activeRow, activeCol, file) {
  
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
  for(var j=0; j<3; j++) {
    for(var k=0; k<(Verizon.numberOfServices+3); k++) {
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
        
        else if (k==2) {
          // opCom
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+'S01'+'F01'+'0'+(j+1));
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          // subservices
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+'S01'+'F01'+'0'+(j+1));
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
    for(var k=0; k<(Verizon.numberOfServices+3); k++) {
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
       else if (k==2) {
          // opCom
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+'S01'+'F01'+'0'+(j+1)+'Comments');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+'S01'+'F01'+'0'+(j+1)+'Comments');
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
       
       else if (k==2) {
          // opCom
          var trial = ('RDR2019DC'+Verizon.id+'opCom'+'S01'+'F01'+'Sources');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell); // names cells
        }
        
        else {
          // services
          var trial = ('RDR2019DC'+Verizon.services[k-3].id+'S01'+'F01'+'Sources');
          trial=trial.toString();
          file.setNamedRange(trial,thisCell);
        }
        
        
      }
    }
  return activeRow;
}











//---------------------------JSON INFO----------------------------------------------
function importJsonVerizon() {
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
};
  
  return Verizon;
  
}


function importJsonIndicator() {
  
{
  var Indicators = {
    "governance": {
        "labelShort": "G",
        "labelLong": "Governance",
        "description": "Indicators in this category seek evidence that the company has governance processes in place to ensure that it respects the human rights to freedom of expression and privacy. Both rights are part of the Universal Declaration of Human Rights and are enshrined in the International Covenant on Civil and Political Rights. They apply online as well as offline. In order for a company to perform well in this section, the company’s disclosure should at least follow, and ideally surpass, the UN Guiding Principles on Business and Human Rights and other industry-specific human rights standards focused on freedom of expression and privacy such as the Global Network Initiative.",
        "researchGuidance": "TBD",
        "indicators": [
             {
                "labelShort": "G1",
                "labelLong": "Policy Commitment",
                "description": "The company should publicly commit to respect users’ human rights to freedom of expression and privacy.",
                "elements": [
                    {
                        "labelShort": "G1.1",
                        "description": "Does the company make an explicit, clearly articulated policy commitment to human rights, including freedom of expression and privacy?"
                    }
                ]
            },
             {
                "labelShort": "G2",
                "labelLong": "Governance and management oversight",
                "description": "The company’s senior leadership should exercise oversight over how its policies and practices affect freedom of expression and privacy.",
                "elements": [
                    {
                        "labelShort": "G2.1",
                        "description": "Does the company clearly disclose that the board of directors exercises formal oversight over how company practices affect freedom of expression and privacy?"
                    },
                    {
                        "labelShort": "G2.2",
                        "description": "Does the company clearly disclose that an executive-level committee, team, program or officer oversees how company practices affect freedom of expression and privacy?"
                    },
                    {
                        "labelShort": "G2.3",
                        "description": "Does the company clearly disclose that a management-level committee, team, program or officer oversees how company practices affect freedom of expression and privacy?"
                    }
                ]
            },
             {
                "labelShort": "G3",
                "labelLong": "Internal implementation",
                "description": "The company should have mechanisms in place to implement its commitments to freedom of expression and privacy within the company.",
                "elements": [
                    {
                        "labelShort": "G3.1",
                        "description": "Does the company clearly disclose that it provides employee training on freedom of expression and privacy issues?"
                    },
                    {
                        "labelShort": "G3.2",
                        "description": "Does the company clearly disclose that it maintains an employee whistleblower program through which employees can report concerns related to how the company treats its users’ freedom of expression and privacy rights?"
                    }
                ]
            },
             {
                "labelShort": "G4",
                "labelLong": "Impact assessment",
                "description": "The company should conduct regular, comprehensive, and credible due diligence, such as human rights impact assessments, to identify how all aspects of its business impact freedom of expression and privacy.",
                "elements": [
                    {
                        "labelShort": "G4.1",
                        "description": "As part of its decision-making, does the company consider how laws affect freedom of expression and privacy in jurisdictions where it operates?"
                    },
                    {
                        "labelShort": "G4.2",
                        "description": "Does the company regularly assess freedom of expression and privacy risks associated with existing products and services?"
                    },
                    {
                        "labelShort": "G4.3",
                        "description": "Does the company assess freedom of expression and privacy risks associated with a new activity, including the launch and/or acquisition of new products, services, or companies or entry into new markets?"
                    },
                    {
                        "labelShort": "G4.4",
                        "description": "Does the company assess freedom of expression and privacy risks associated with the processes and mechanisms used to enforce its terms of service (ToS)?"
                    },
                    {
                        "labelShort": "G4.5",
                        "description": "Does the company disclose that it assesses freedom of expression and privacy risks associated with its use of automated decision-making, such as through the use of algorithms and/or artificial intelligence?"
                    },
                    {
                        "labelShort": "G4.6",
                        "description": "Does the company assess freedom of expression and privacy risks associated with its targeted advertising policies and practices?"
                    },
                    {
                        "labelShort": "G4.7",
                        "description": "Does the company conduct additional evaluation wherever the company’s risk assessments identify concerns?"
                    },
                    {
                        "labelShort": "G4.8",
                        "description": "Do senior executivesand/or members of the company’s board of directors review and consider the results of assessments and due diligence in their decision-making?"
                    },
                    {
                        "labelShort": "G4.9",
                        "description": "Does the company conduct assessments on a regular schedule?"
                    },
                    {
                        "labelShort": "G4.10",
                        "description": "Are the company’s assessments assured by an external third party?"
                    },
                    {
                        "labelShort": "G4.11",
                        "description": "Is the external third party that assures the assessment accredited to a relevant and reputable human rights standard by a credible organization?"
                    }

                ]
            },
             {
                "labelShort": "G5",
                "labelLong": "Stakeholder engagement",
                "description": "The company should engage with a range of stakeholders on freedom of expression and privacy issues.",
                "elements": [
                    {
                        "labelShort": "G5.1",
                        "description": "Is the company a member of a multi-stakeholder initiative whose focus includes a commitment to uphold freedom of expression and privacy based on international human rights principles?"
                    },
                    {
                        "labelShort": "G5.2",
                        "description": "If the company is not a member of a multi-stakeholder initiative, is the company a member of an organization that engages systematically and on a regular basis with non-industry and non-governmental stakeholders on freedom of expression and privacy?"
                    },
                    {
                        "labelShort": "G5.3",
                        "description": "If the company is not a member of one of these organizations, does the company disclose that it initiates or participates in meetings with stakeholders that represent, advocate on behalf of, or are people whose freedom of expression and privacy are directly impacted by the company’s business?"
                    }
                ]
            },
             {
                "labelShort": "G6",
                "labelLong": "Remedy",
                "description": "The company should have grievance and remedy mechanisms to address users’ freedom of expression and privacy concerns.",
                "elements": [
                    {
                        "labelShort": "G6.1",
                        "description": "Does the company clearly disclose​ it has a grievance mechanism(s) enabling users to submit complaints if they feel their freedom of expression or privacy has been adversely affected by the company’s policies or practices?"
                    },
                    {
                        "labelShort": "G6.2",
                        "description": "Does the company clearly disclose​ its procedures for providing remedy for freedom of expression- or privacy-related grievances?"
                    },
                    {
                        "labelShort": "G6.3",
                        "description": "Does the company clearly disclose​ timeframes for its grievance and remedy procedures?"
                    },
                    {
                        "labelShort": "G6.4",
                        "description": "Does the company clearly disclose the number of complaints received related to freedom of expression and privacy?"
                    },
                    {
                        "labelShort": "G6.5",
                        "description": "Does the company clearly disclose​ evidence that it is providing remedy for freedom of expression and privacy grievances?"
                    }
                ]
            }
        ]
    },
    "freedom": {
        "labelShort": "F",
        "labelLong": "Freedom of Expression",
        "description": "Indicators in this category seek evidence that the company demonstrates it respects the right to freedom of expression, as articulated in the Universal Declaration of Human Rights, the International Covenant on Civil and Political Rights and other international human rights instruments. The company’s disclosed policies and practices demonstrate how it works to avoid contributing to actions that may interfere with this right, except where such actions are lawful, proportionate and for a justifiable purpose. Companies that perform well on this indicator demonstrate a strong public commitment to transparency not only in terms of how they respond to government and others’ demands, but also how they determine, communicate, and enforce private rules and commercial practices that affect users’ freedom of expression.",
        "researchGuidance": "TBD",
        "indicators": [
            {
                "labelShort": "F1",
                "labelLong": "Access to terms of service",
                "description": "The company should provide terms of service (ToS) that are easy to find and easy to understand.",
                "elements": [
                    {
                        "labelShort": "F1.1",
                        "description": "Are the company’s terms of service (ToS) easy to find?"
                    },
                    {
                        "labelShort": "F1.2",
                        "description": "Are the ToS available in the language(s) most commonly spoken by the company’s users?"
                    },
                    {
                        "labelShort": "F1.3",
                        "description": "Are the ToS presented in an understandable manner?"
                    }
                ]
            },
            {
                "labelShort": "F2",
                "labelLong": "Changes to terms of service",
                "description": "The company should clearly disclose that it provides notice and documentation to users when it changes its terms of service.",
                "elements": [
                    {
                        "labelShort": "F2.1",
                        "description": "Does the company clearly disclose that it notifies users about changes to its terms of service?"
                    },
                    {
                        "labelShort": "F2.2",
                        "description": "Does the company clearly disclose how it will directly notify users of changes?"
                    },
                    {
                        "labelShort": "F2.3",
                        "description": "Does the company clearly disclose the timeframe within which it provides notification prior to changes coming into effect?"
                    },
                    {
                        "labelShort": "F2.4",
                        "description": "Does the company maintain a public archive or change log?"
                    }
                ]
            },
            {
                "labelShort": "F3",
                "labelLong": "Process for terms of service enforcement",
                "description": "The company should clearly explain the circumstances under which it may restrict content or user accounts.",
                "elements": [
                    {
                        "labelShort": "F3.1",
                        "description": "Does the company clearly disclose what types of content or activities it does not permit?"
                    },
                    {
                        "labelShort": "F3.2",
                        "description": "Does the company clearly disclose why it may restrict a user’s account?"
                    },
                    {
                        "labelShort": "F3.3",
                        "description": "Does the company clearly disclose information about the processes it uses to identify content or accounts that violate the company’s rules?"
                    },
                    {
                        "labelShort": "F3.4",
                        "description": "Does the company clearly disclose whether any government authorities receive priority consideration when flagging content to be restricted for violating the company’s rules?"
                    },
                    {
                        "labelShort": "F3.5",
                        "description": "Does the company clearly disclose whether any private entities receive priority consideration when flagging content to be restricted for violating the company’s rules?"
                    },
                    {
                        "labelShort": "F3.6",
                        "description": "Does the company clearly disclose its process for enforcing its rules?"
                    },
                    {
                        "labelShort": "F3.7",
                        "description": "Does the company provide clear examples to help the user understand what the rules are and how they are enforced?"
                    }
                ]
            },
            {
                "labelShort": "F4",
                "labelLong": "Data about terms of service enforcement",
                "description": "The company should clearly disclose and regularly publish data about the volume and nature of actions taken to restrict content or accounts that violate the company’s rules.",
                "elements": [
                    {
                        "labelShort": "F4.1",
                        "description": "Does the company clearly disclose data about the volume and nature of content and accounts restricted for violating the company’s rules?"
                    },
                    {
                        "labelShort": "F4.2",
                        "description": "Does the company report this data at least once a year?"
                    },
                    {
                        "labelShort": "F4.3",
                        "description": "Can the data published by the company be exported as a structured datafile?"
                    }
                ]
            },
            {
                "labelShort": "F5",
                "labelLong": "Process for responding to third-party requests for content or account restriction",
                "description": "The company should clearly disclose its process for responding to government requests(including judicial orders) and private requests to remove, filter, or restrict content or accounts.",
                "elements": [
                    {
                        "labelShort": "F5.1",
                        "description": "Does the company clearly explain its process for responding to non-judicial government requests?"
                    },
                    {
                        "labelShort": "F5.2",
                        "description": "Does the company clearly explain its process for responding to court orders?"
                    },
                    {
                        "labelShort": "F5.3",
                        "description": "Does the company clearly explain its process for responding to government requests from foreign jurisdictions?"
                    },
                    {
                        "labelShort": "F5.4",
                        "description": "Does the company clearly explain its process for responding to private requests?"
                    },
                    {
                        "labelShort": "F5.5",
                        "description": "Do the company’s explanations clearly disclose the legal basis under which it may comply with government requests?"
                    },
                    {
                        "labelShort": "F5.6",
                        "description": "Do the company’s explanations clearly disclose the basis under which it may comply with private requests?"
                    },
                    {
                        "labelShort": "F5.7",
                        "description": "Does the company clearly disclose that it carries out due diligence on government requests before deciding how to respond?"
                    },
                    {
                        "labelShort": "F5.8",
                        "description": "Does the company clearly disclose that it carries out due diligence on private requests before deciding how to respond?"
                    },
                    {
                        "labelShort": "F5.9",
                        "description": "Does the company commit to push back on inappropriate or overbroad requests made by governments?"
                    },
                    {
                        "labelShort": "F5.10",
                        "description": "Does the company commit to push back on inappropriate or overbroad private requests?"
                    },
                    {
                        "labelShort": "F5.11",
                        "description": "Does the company provide clear guidance or examples of implementation of its process of responding to government requests?"
                    },
                    {
                        "labelShort": "F5.12",
                        "description": "Does the company provide clear guidance or examples of implementation of its process of responding to private requests?"
                    }
                ]
            },
            {
                "labelShort": "F6",
                "labelLong": "Data about government requests for content or account restriction",
                "description": "The company should regularly publish data about government requests(including judicial orders) to remove, filter, or restrict content or accounts.",
                "elements": [
                    {
                        "labelShort": "F6.1",
                        "description": "Does the company break out the number of requests it receives by country?"
                    },
                    {
                        "labelShort": "F6.2",
                        "description": "Does the company list the number of accounts affected?"
                    },
                    {
                        "labelShort": "F6.3",
                        "description": "Does the company list the number of pieces of content or URLs affected?"
                    },
                    {
                        "labelShort": "F6.4",
                        "description": "Does the company list the types of subject matter associated with the requests it receives?"
                    },
                    {
                        "labelShort": "F6.5",
                        "description": "Does the company list the number of requests that come from different legal authorities?"
                    },
                    {
                        "labelShort": "F6.6",
                        "description": "Does the company list the number of requests it knowingly receives from government officials to restrict content or accounts through unofficial processes?"
                    },
                    {
                        "labelShort": "F6.7",
                        "description": "Does the company list the number of requests it complied with?"
                    },
                    {
                        "labelShort": "F6.8",
                        "description": "Does the company publish the original requests or disclose that it provides copies to a public third-party archive?"
                    },
                    {
                        "labelShort": "F6.9",
                        "description": "Does the company report this data at least once a year?"
                    },
                    {
                        "labelShort": "F6.10",
                        "description": "Can the data be exported as a structured datafile?"
                    }
                ]
            },
            {
                "labelShort": "F7",
                "labelLong": "Data about private requests for content or account restriction",
                "description": "The company should regularly publish data about private requests to remove, filter, or restrict access to content or accounts.",
                "elements": [
                    {
                        "labelShort": "F7.1",
                        "description": "Does the company break out the number of requests it receives by country?"
                    },
                    {
                        "labelShort": "F7.2",
                        "description": "Does the company list the number of accounts affected?"
                    },
                    {
                        "labelShort": "F7.3",
                        "description": "Does the company list the number of pieces of content or URLs affected?"
                    },
                    {
                        "labelShort": "F7.4",
                        "description": "Does the company list the reasons for removal associated with the requests it receives?"
                    },
                    {
                        "labelShort": "F7.5",
                        "description": "Does the company describe the types of parties from which it receives requests?"
                    },
                    {
                        "labelShort": "F7.6",
                        "description": "Does the company list the number of requests it complied with?"
                    },
                    {
                        "labelShort": "F7.7",
                        "description": "Does the company publish the original requests or disclose that it provides copies to a public third-party archive?"
                    },
                    {
                        "labelShort": "F7.8",
                        "description": "Does the company report this data at least once a year?"
                    },
                    {
                        "labelShort": "F7.9",
                        "description": "Can the data be exported as a structured datafile?"
                    },
                    {
                        "labelShort": "F7.10",
                        "description": "Does the company clearly disclose that its reporting covers all types of private requests that it receives?"
                    }
            ]
            },
            {
                "labelShort": "F8",
                "labelLong": "User notification about content and account restriction",
                "description": "The company should clearly disclose that it notifies users when it restricts content or accounts.",
                "elements": [
                    {
                        "labelShort": "F8.1",
                        "description": "If the company hosts user-generated content, does the company clearly disclose that it notifies users who generated the content when it is restricted?"
                    },
                    {
                        "labelShort": "F8.2",
                        "description": "Does the company clearly disclose that it notifies users who attempt to access content that has been restricted?"
                    },
                    {
                        "labelShort": "F8.3",
                        "description": "In its notification, does the company clearly provide a reason for the content restriction (legal or otherwise)?"
                    },
                    {
                        "labelShort": "F8.4",
                        "description": "Does the company clearly disclose that it notifies users when it restricts their account?"
                    }
                ]
            },
            {
                "labelShort": "F9",
                "labelLong": "Network management (telecommunications companies)",
                "description": "The company should clearly disclose that it does not prioritize, block, or delay certain types of traffic, applications, protocols, or content for any reason beyond assuring quality of service and reliability of the network.",
                "elements": [
                    {
                        "labelShort": "F9.1",
                        "description": "Does the company clearly disclose that it does not prioritize, block, or delay certain types of traffic, applications, protocols, or content for reasons beyond assuring quality of service and reliability of the network?"
                    },
                    {
                        "labelShort": "F9.2",
                        "description": "If the company does engage in these practices, does it clearly disclose its purpose for doing so?"
                    }
                ]
            },
            {
                "labelShort": "F10",
                "labelLong": "Network shutdown (telecommunications companies)",
                "description": "The company should explain the circumstances under which it may shut down or restrict access to the network or to specific protocols, services, or applications on the network.",
                "elements": [
                    {
                        "labelShort": "F10.1",
                        "description": "Does the company clearly explain why it may shut down service to a particular area or group of users"
                    },
                    {
                        "labelShort": "F10.2",
                        "description": "Does the company explain why it may restrict access to specific applications or protocols (e.g., VoIP, messaging) in a particular area or to a specific group of users"
                    },
                    {
                        "labelShort": "F10.3",
                        "description": "Does the company clearly explain its process for responding to requests to shut down a network or restrict access to a service"
                    },
                    {
                        "labelShort": "F10.4",
                        "description": "Does the company commit to push back on requests to shut down a network or restrict access to a service"
                    },
                    {
                        "labelShort": "F10.5",
                        "description": "Does the company commit to notify users directly when it shuts down the network or restricts access to a service"
                    },
                    {
                        "labelShort": "F10.6",
                        "description": "Does the company report on the number of network shutdown requests it receives"
                    },
                    {
                        "labelShort": "F10.7",
                        "description": "Does the company clearly identify the specific legal authority that makes the request?"
                    },
                    {
                        "labelShort": "F10.8",
                        "description": "Does the company list the number of requests it complied with?"
                    }
                ]
            },
            {
                "labelShort": "F11",
                "labelLong": "Identity policy",
                "description": "The company should not require users to verify their identity with their government-issued identification, or other forms of identification that could be connected to their offline identity.",
                "elements": [
                    {
                        "labelShort": "F11.1",
                        "description": "Does the company require users to verify their identity with their government-issued identification, or with other forms of identification that could be connected to their offline identity?"
                    }
                ]
            }
        ]
    },
    "privacy": {
        "labelShort": "P",
        "labelLong": "Privacy",
        "description": "Indicators in this category seek evidence that in its disclosed policies and practices, the company demonstrates concrete ways in which it respects the right to privacy of users, as articulated in the Universal Declaration of Human Rights, the International Covenant on Civil and Political Rights and other international human rights instruments. The company’s disclosed policies and practices demonstrate how it works to avoid contributing to actions that may interfere with users’ privacy, except where such actions are lawful, proportionate and for a justifiable purpose. They will also demonstrate a strong commitment to protect and defend users’ digital security. Companies that perform well on these indicators demonstrate a strong public commitment to transparency not only in terms of how they respond to government and others’ demands, but also how they determine, communicate, and enforce private rules and commercial practices that affect users’ privacy.",
        "researchGuidance": "TBD",
        "indicators": [
            {
                "labelShort": "P1",
                "labelLong": "Access to privacy policies",
                "description": "The company should offer privacy policies that are easy to find and easy to understand.",
                "elements": [
                    {
                        "labelShort": "P1.1",
                        "description": "Are the company’s privacy policies easy to find?"
                    },
                    {
                        "labelShort": "P1.2",
                        "description": "Are the privacy policies available in the language(s) most commonly spoken by the company’s users?"
                    },
                    {
                        "labelShort": "P1.3",
                        "description": "Are the policies presented in an understandable manner?"
                    },
                    {
                        "labelShort": "P1.4",
                        "description": "(For mobile ecosystems): Does the company require apps made available through its app store to provide users with a privacy policy?"
                    }
                ]
            },
            {
                "labelShort": "P2",
                "labelLong": "Changes to privacy policies",
                "description": "The company should clearly disclose that it provides notice and documentation to users when it changes its privacy policies.",
                "elements": [
                    {
                        "labelShort": "P2.1",
                        "description": "Does the company clearly disclose that it notifies users about changes to its privacy policies?"
                    },
                    {
                        "labelShort": "P2.2",
                        "description": "Does the company clearly disclose how it will directly notify users of changes?"
                    },
                    {
                        "labelShort": "P2.3",
                        "description": "Does the company clearly disclose the time frame within which it provides notification prior to changes coming into effect?"
                    },
                    {
                        "labelShort": "P2.4",
                        "description": "Does the company maintain a public archive or change log?"
                    },
                    {
                        "labelShort": "P2.5",
                        "description": "(For mobile ecosystems): Does the company clearly disclose that it requires apps sold through its app store to notify users when the app changes its privacy policy?"
                    }
                ]
            },
            {
                "labelShort": "P3",
                "labelLong": "Collection of user information ",
                "description": "The company should disclose what user information it collects and how.",
                "elements": [
                    {
                        "labelShort": "P3.1",
                        "description": "Does the company clearly disclose what user information it collects?"
                    },
                    {
                        "labelShort": "P3.2",
                        "description": "For each type of user information the company collects, does the company clearly disclose how it collects that user information?"
                    },
                    {
                        "labelShort": "P3.3",
                        "description": "Does the company clearly disclose that it limits collection of user information to what is directly relevant and necessary to accomplish the purpose of its service?"
                    },
                    {
                        "labelShort": "P3.4",
                        "description": "(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party apps made available through its app store discloses what user information the apps collect?"
                    },
                    {
                        "labelShort": "P3.5",
                        "description": "(For mobile ecosystems): Does the company clearly disclose that it evaluates whether third-party apps made available through its app store limit collection of user information to what is directly relevant and necessary to accomplish the purpose of the app?"
                    }
                ]
            },
            {
                "labelShort": "P4",
                "labelLong": "Sharing of user information",
                "description": "The company should clearly disclose what user information it shares and with whom.",
                "elements": [
                    {
                        "labelShort": "P4.1",
                        "description": "For each type of user information the company collects, does the company clearly disclose whether it shares that user information?"
                    },
                    {
                        "labelShort": "P4.2",
                        "description": "For each type of user information the company shares, does the company clearly disclose the types of third parties with which it shares that user information?"
                    },
                    {
                        "labelShort": "P4.3",
                        "description": "Does the company clearly disclose that it may share user information with government(s) or legal authorities?"
                    },
                    {
                        "labelShort": "P4.4",
                        "description": "For each type of user information the company shares, does the company clearly disclose the names of all third parties with which it shares user information?"
                    },
                    {
                        "labelShort": "P4.5",
                        "description": "(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party appsmade available through its app storedisclose what user information the apps share?"
                    },
                    {
                        "labelShort": "P4.6",
                        "description": "(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party appsmade available through its app storedisclose the types of third parties with whom they share user information?"
                    }
                ]
            },
            {
                "labelShort": "P5",
                "labelLong": "Purpose for collecting and sharing user information",
                "description": "The company should clearly disclose why it collects and shares user information.",
                "elements": [
                    {
                        "labelShort": "P5.1",
                        "description": "For each type of user information the company collects, does the company clearly disclose its purpose for collection?"
                    },
                    {
                        "labelShort": "P5.2",
                        "description": "Does the company clearly disclose whether it combines user information from various company services and if so, why?"
                    },
                    {
                        "labelShort": "P5.3",
                        "description": "For each type of user information the company shares, does the company clearly disclose its purpose for sharing?"
                    },
                    {
                        "labelShort": "P5.4",
                        "description": "Does the company clearly disclose that it limits its use of user information to the purpose for which it was collected?"
                    }
                ]
            },
            {
                "labelShort": "P6",
                "labelLong": "Retention of user information",
                "description": "The company should clearly disclose how long it retains user information.",
                "elements": [
                    {
                        "labelShort": "P6.1",
                        "description": "For each type of user information the company collects, does the company clearly disclose how long it retains that user information?"
                    },
                    {
                        "labelShort": "P6.2",
                        "description": "Does the company clearly disclose what de-identified user information it retains?"
                    },
                    {
                        "labelShort": "P6.3",
                        "description": "Does the company clearly disclose the process for de-identifying user information?"
                    },
                    {
                        "labelShort": "P6.4",
                        "description": "Does the company clearly disclose that it deletes all user information after users terminate their account?"
                    },
                    {
                        "labelShort": "P6.5",
                        "description": "Does the company clearly disclose the time frame in which it will delete user information after users terminate their account?"
                    },
                    {
                        "labelShort": "P6.6",
                        "description": "(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party apps made available through its app store disclose how long they retains user information?"
                    },
                    {
                        "labelShort": "P6.7",
                        "description": "(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party apps made available through its app store state that all user information is deleted when users terminate their accounts or delete the app?"
                    }
                ]
            },
            {
                "labelShort": "P7",
                "labelLong": "Users’ control over their own user information",
                "description": "The company should clearly disclose to users what options they have to control the company’s collection, retention and use of their user information.",
                "elements": [
                    {
                        "labelShort": "P7.1",
                        "description": "For each type of user information the company collects, does the company clearly disclose whether users can control the company’s collection of this user information?"
                    },
                    {
                        "labelShort": "P7.2",
                        "description": "For each type of user information the company collects, does the company clearly disclose whether users can delete this user information?"
                    },
                    {
                        "labelShort": "P7.3",
                        "description": "Does the company clearly disclose that it provides users with options to control how their user information is used for targeted advertising?"
                    },
                    {
                        "labelShort": "P7.4",
                        "description": "Does the company clearly disclose that targeted advertising is off by default?"
                    },
                    {
                        "labelShort": "P7.5",
                        "description": "(For mobile ecosystems): Does the company clearly disclose that it provides users with options to control the device’s geolocation functions?"
                    }
                ]
            },
            {
                "labelShort": "P8",
                "labelLong": "Users’ access to their own user information",
                "description": "Companies should allow users to obtain all of their user information the company holds.",
                "elements": [
                    {
                        "labelShort": "P8.1",
                        "description": "Does the company clearly disclose that users can obtain a copy of their user information?"
                    },
                    {
                        "labelShort": "P8.2",
                        "description": "Does the company clearly disclose what user information users can obtain?"
                    },
                    {
                        "labelShort": "P8.3",
                        "description": "Does the company clearly disclose that users can obtain their user information in a structured data format?"
                    },
                    {
                        "labelShort": "P8.4",
                        "description": "Does the company clearly disclose that users can obtain all public-facing and private user information a company holds about them?"
                    },
                    {
                        "labelShort": "P8.5",
                        "description": "(For mobile ecosystems): Does the company clearly disclose that it evaluates whether the privacy policies of third-party apps made available through its app store disclose that users can obtain all of the user information about them the app holds?"
                    }
                ]
            },
            {
                "labelShort": "P9",
                "labelLong": "Collection of user information from third parties (internet and mobile ecosystem companies)",
                "description": "The company should clearly disclose its practices with regard to user information it collects from third-party websites or apps through technical means.",
                "elements": [
                    {
                        "labelShort": "P9.1",
                        "description": "Does the company clearly disclose what user information it collects from third-party websites through technical means?"
                    },
                    {
                        "labelShort": "P9.2",
                        "description": "Does the company clearly explain how it collects user information from third parties through technical means?"
                    },
                    {
                        "labelShort": "P9.3",
                        "description": "Does the company clearly disclose its purpose for collecting user information from third parties through technical means?"
                    },
                    {
                        "labelShort": "P9.4",
                        "description": "Does the company clearly disclose how long it retains the user information it collects from third parties through technical means?"
                    },
                    {
                        "labelShort": "P9.5",
                        "description": "Does the company clearly disclose that it respects user-generated signals to opt-out of data collection?"
                    }
                ]
            },
            {
                "labelShort": "P10",
                "labelLong": "Process for responding to third-party requests for user information",
                "description": "The company should clearly explain its process for responding to requests from governments and other third parties for user information.",
                "elements": [
                    {
                        "labelShort": "P10.1",
                        "description": "Does the company clearly explain its process for responding to non-judicial government requests?"
                    },
                    {
                        "labelShort": "P10.2",
                        "description": "Does the company clearly explain its process for responding to court orders?"
                    },
                    {
                        "labelShort": "P10.3",
                        "description": "Does the company clearly explain its process for responding to government requests from foreign jurisdictions?"
                    },
                    {
                        "labelShort": "P10.4",
                        "description": "Does the company clearly explain its process for responding to requests made by private parties?"
                    },
                    {
                        "labelShort": "P10.5",
                        "description": "Do the company’s explanations clearly disclose the legal basis under which it may comply with government requests?"
                    },
                    {
                        "labelShort": "P10.6",
                        "description": "Do the company’s explanations clearly disclose the basis under which it may comply with requests from private parties?"
                    },
                    {
                        "labelShort": "P10.7",
                        "description": "Does the company disclose that it carries out due diligence on government requests before deciding how to respond?"
                    },
                    {
                        "labelShort": "P10.8",
                        "description": "Does the company disclose that it carries out due diligence on private requests before deciding how to respond?"
                    },
                    {
                        "labelShort": "P10.9",
                        "description": "Does the company commit to push back on inappropriate or overbroad government requests?"
                    },
                    {
                        "labelShort": "P10.10",
                        "description": "Does the company commit to push back on inappropriate or overbroad private requests?"
                    },
                    {
                        "labelShort": "P10.11",
                        "description": "Does the company provide clear guidance or examples of implementation of its process for government requests?"
                    },
                    {
                        "labelShort": "P10.12",
                        "description": "Does the company provide clear guidance or examples of implementation of its process for private requests?"
                    }
                ]
            },
            {
                "labelShort": "P11",
                "labelLong": "Data about third-party requests for user information",
                "description": "The company should regularly publish data about government and other third-party requests for user information.",
                "elements": [
                    {
                        "labelShort": "P11.1",
                        "description": "Does the company list the number of requests it receives by country?"
                    },
                    {
                        "labelShort": "P11.2",
                        "description": "Does the company list the number of requests it receives for stored user information and for real-time communications access?"
                    },
                    {
                        "labelShort": "P11.3",
                        "description": "Does the company list the number of accounts affected?"
                    },
                    {
                        "labelShort": "P11.4",
                        "description": "Does the company list whether a demand sought communications content or non-content or both?"
                    },
                    {
                        "labelShort": "P11.5",
                        "description": "Does the company identify the specific legal authority or type of legal process through which law enforcement and national security demands are made?"
                    },
                    {
                        "labelShort": "P11.6",
                        "description": "Does the company include requests that come from court orders?"
                    },
                    {
                        "labelShort": "P11.7",
                        "description": "Does the company list the number of requests it receives from private parties?"
                    },
                    {
                        "labelShort": "P11.8",
                        "description": "Does the company list the number of requests it complied with, broken down by category of demand?"
                    },
                    {
                        "labelShort": "P11.9",
                        "description": "Does the company list what types of government requests it is prohibited by law from disclosing?"
                    },
                    {
                        "labelShort": "P11.10",
                        "description": "Does the company report this data at least once per year?"
                    },
                    {
                        "labelShort": "P11.11",
                        "description": "Can the data reported by the company be exported as a structured data file?"
                    }
                ]
            },
            {
                "labelShort": "P12",
                "labelLong": "User notification about third-party requests for user information",
                "description": "The company should notify users to the extent legally possible when their user information has been requested by governments and other third parties?",
                "elements": [
                    {
                        "labelShort": "P12.1",
                        "description": "Does the company clearly disclose that it notifies users when government entities (including courts or other judicial bodies) request their user information?"
                    },
                    {
                        "labelShort": "P12.2",
                        "description": "Does the company clearly disclose that it notifies users when private parties request their user information?"
                    },
                    {
                        "labelShort": "P12.3",
                        "description": "Does the company clearly disclose situations when it might not notify users, including a description of the types of government requests it is prohibited by law from disclosing to users?"
                    }
                ]
            },
            {
                "labelShort": "P13",
                "labelLong": "Security oversight",
                "description": "The company should clearly disclose information about its institutional processes to ensure the security of its products and services.",
                "elements": [
                    {
                        "labelShort": "P13.1",
                        "description": "Does the company clearly disclose that it has systems in place to limit and monitor employee access to user information?"
                    },
                    {
                        "labelShort": "P13.2",
                        "description": "Does the company clearly disclose that it has a security team that conducts audits on the company’s products and services?"
                    },
                    {
                        "labelShort": "P13.3",
                        "description": "Does the company clearly disclose that it commissions third-party security audits on its products and services?"
                    }
                ]
            },
            {
                "labelShort": "P14",
                "labelLong": "Addressing security vulnerabilities ",
                "description": "The company should address security vulnerabilities when they are discovered.",
                "elements": [
                    {
                        "labelShort": "P14.1",
                        "description": "Does the company clearly disclose that it has a mechanism through which security researchers can submit vulnerabilities they discover?"
                    },
                    {
                        "labelShort": "P14.2",
                        "description": "Does the company clearly disclose the timeframe in which it will review reports of vulnerabilities?"
                    },
                    {
                        "labelShort": "P14.3",
                        "description": "Does the company commit not to pursue legal action against researchers who report vulnerabilities within the terms of the company’s reporting mechanism?"
                    },
                    {
                        "labelShort": "P14.4",
                        "description": "(For mobile ecosystems) Does the company clearly disclose that software updates, security patches, add-ons, or extensions are downloaded over an encrypted channel?"
                    },
                    {
                        "labelShort": "P14.5",
                        "description": "(For mobile ecosystems and telecommunications companies) Does the company clearly disclose what, if any, modifications it has made to a mobile operating system?"
                    },
                    {
                        "labelShort": "P14.6",
                        "description": "(For mobile ecosystems and telecommunications companies) Does the company clearly disclose what, if any, effect such modifications have on the company’s ability to send security updates to users?"
                    },
                    {
                        "labelShort": "P14.7",
                        "description": "(For mobile ecosystems) Does the company clearly disclose the date through which it will continue to provide security updates for the device/OS?"
                    },
                    {
                        "labelShort": "P14.8",
                        "description": "(For mobile ecosystems) Does the company commit to provide security updates for the operating system and other critical software for a minimum of five years after release?"
                    },
                    {
                        "labelShort": "P14.9",
                        "description": "(For mobile ecosystems and telecommunications companies) If the company uses an operating system adapted from an existing system, does the company commit to provide security patches within one month of a vulnerability being announced to the public?"
                    }
                ]
            },
            {
                "labelShort": "P15",
                "labelLong": "Data breaches",
                "description": "The company should publicly disclose information about its processes for responding to data breaches.",
                "elements": [
                    {
                        "labelShort": "P15.1",
                        "description": "Does the company clearly disclose that it will notify the relevant authorities without undue delay when a data breach occurs?"
                    },
                    {
                        "labelShort": "P15.2",
                        "description": "Does the company clearly disclose its process for notifying data subjects who might be affected by a data breach?"
                    },
                    {
                        "labelShort": "P15.3",
                        "description": "Does the company clearly disclose what kinds of steps it will take to address the impact of a data breach on its users?"
                    }
                ]
            },
            {
                "labelShort": "P16",
                "labelLong": "Encryption of user communication and private content (internet and mobile ecosystem companies)",
                "description": "The company should encrypt user communication and private content so users can control who has access to it.",
                "elements": [
                    {
                        "labelShort": "P16.1",
                        "description": "Does the company clearly disclose that the transmission of user communications is encrypted by default?"
                    },
                    {
                        "labelShort": "P16.2",
                        "description": "Does the company clearly disclose that transmissions of user communications are encrypted using unique keys?"
                    },
                    {
                        "labelShort": "P16.3",
                        "description": "Does the company clearly disclose that users can secure their private content using end-to-end encryption, or full disk encryption (where applicable)?"
                    },
                    {
                        "labelShort": "P16.4",
                        "description": "Does the company clearly disclose that end-to-end encryption, or full disk encryption, is enabled by default?"
                    }
                ]
            },
            {
                "labelShort": "P17",
                "labelLong": "Account Security (internet and mobile ecosystem companies)",
                "description": "The company should help users keep their accounts secure.",
                "elements": [
                    {
                        "labelShort": "P17.1",
                        "description": "Does the company clearly disclose that it deploys advanced authentication methods to prevent fraudulent access?"
                    },
                    {
                        "labelShort": "P17.2",
                        "description": "Does the company clearly disclose that users can view their recent account activity?"
                    },
                    {
                        "labelShort": "P17.3",
                        "description": "Does the company clearly disclose that it notifies users about unusual account activity and possible unauthorized access to their account?"
                    }
                ]
            },
            {
                "labelShort": "P18",
                "labelLong": "Inform and educate users about potential risks",
                "description": "The company should publish information to help users defend themselves against cyber risks.",
                "elements": [
                    {
                        "labelShort": "P18.1",
                        "description": "Does the company publish practical materials that educate users on how to protect themselves from cyber risks relevant to their products or services?"
                    }
                ]
            }
        ]
    }
  }};
return Indicators;
}
