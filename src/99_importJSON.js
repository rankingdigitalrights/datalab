// --- main config: JSON --- // 

// fetches JSON from Google Drive

function importLocalJSON(fileName, subset) {

    var finalFilename = fileName

    if (subset) {
        finalFilename = finalFilename + "Subset"
    }

    Logger.log("JSON: trying to import " + finalFilename + ".json")

    var files = DriveApp.getFilesByName(finalFilename + ".json")

    if (files.hasNext()) {
        var File = files.next()
        var content = File.getAs("application/json")
        var jsonObj = JSON.parse(content.getDataAsString())
        Logger.log(finalFilename + ".json imported")
        return jsonObj
    } else {
        Logger.log(finalFilename + ".json not found")
        return null
    }

}


function getLocalScriptFile(ID) {
    let url = "https://script.googleapis.com/v1/projects/1rZM9rFC9zFPkbxgTzqRBbynz60Bo5xRcdBpL9yi9l6TksLBkJNDAk2Wv/content"

    var all = UrlFetchApp.getRequest(url)
    Logger.log(all)
}

// legacy functions for fetching JSON from external url
// deprecated 

// function importJsonIndicator(url, subset) {
//   var response

//   if (subset) {
//     response = UrlFetchApp.fetch(url + "indicatorsSubset.json");
//   } else {
//     response = UrlFetchApp.fetch(url + "indicators.json");
//   }

//   var jsonObj = JSON.parse(response)
//   return jsonObj
// }