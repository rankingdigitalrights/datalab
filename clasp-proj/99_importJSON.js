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

function importJsonCompany(companyShort) {
  Logger.log("local name received: " + companyShort)
  var response = UrlFetchApp.fetch("https://fubits.keybase.pub/stage/" + companyShort + ".json");
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

function importLocalJSON() {
  var fileName = "mtn.json";
  var files = DriveApp.getFilesByName(fileName);
  if (files.hasNext()) {
    var file = files.next();
    var content = file.getAs('application/json')
    var json = JSON.parse(content.getDataAsString())
    Logger.log(json.id);
  }
}
