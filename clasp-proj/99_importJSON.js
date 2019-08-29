// --- main config: JSON --- // 
// all these function read in a json file and them parse them so they are usable
function importJsonConfig() {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/config.json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}

function importJsonIndicator(subset) {
  var response;

  if (subset) {
    // response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/researchStepsSubset.json");    
    response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/indicatorsSubset.json");
  } else {
    response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/indicators.json");
  }

  var jsonObj = JSON.parse(response);
  return jsonObj;
}

function importJsonCompany(companyShortName) {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/" + companyShortName + ".json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}

function importResearchSteps(subset) {
  var response;

  if (subset) {
    // response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/researchStepsSubset.json");    
    response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/researchSteps3.json");
  } else {
    response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/researchSteps.json");
  }

  var jsonObj = JSON.parse(response);
  return jsonObj;
}

// --- DEBUGER --- //

function debugJSON() {
  var ResearchStepsObj = importResearchSteps();
  Logger.log(ResearchStepsObj.researchSteps.length);
}
