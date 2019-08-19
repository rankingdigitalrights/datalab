// --- main config: JSON --- // 
// all these function read in a json file and them parse them so they are usable
function importJsonConfig() {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/config.json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}

function importJsonIndicator() {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/indicators.json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}

function importJsonCompany() {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/" + companyFileName + ".json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}

function importResearchSteps() {
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/researchSteps3.json");
  // var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/researchStepsSubset.json");
  // var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/researchSteps.json");
  var jsonObj = JSON.parse(response);
  return jsonObj;
}

// --- DEBUGER --- //

function debugJSON() {
  var ResearchStepsObj = importResearchSteps();
  Logger.log(ResearchStepsObj.researchSteps.length);
}

