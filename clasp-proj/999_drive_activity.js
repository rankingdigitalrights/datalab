function getUsersActivityDC() {

  var resultsSS = connectToSpreadsheetByName("TestingActivityDC")

  var overviewSheet = "2019 DC"

  // check if overview sheet exists
  var resultsSheet = resultsSS.getSheetByName(overviewSheet);
  // if not - process 
  if (!resultsSheet) {
    resultsSheet = insertSheetIfNotExist(resultsSS, overviewSheet)
    resultsSheet.clear()
    resultsSheet.appendRow(["Sheet", "Id", "Date First", "Date Last"])
  }

  var folderOfInterest = DriveApp.getFoldersByName("2019 RDR Research Data Collection").next()
  Logger.log(folderOfInterest)
  var subFoldersOfInterest = folderOfInterest.getFolders()

  var sheets = resultsSS.getSheets()

  // as long as there are subfolders
  while (subFoldersOfInterest.hasNext()) {
    // enter subfolder
    var thisFolder = subFoldersOfInterest.next()
    // fetch all SS
    var spreadsheets = thisFolder.getFilesByType("application/vnd.google-apps.ritz")
    // for each SS of this subfolder
    while (spreadsheets.hasNext()) {
      // enter SS
      var spreadsheet = spreadsheets.next()
      var thisCompany = spreadsheet.getName()

      // check if company is already in results
      var testGet = resultsSS.getSheetByName(thisCompany);

      // if not - process 
      if (!testGet) {

        Logger.log(thisCompany + " yet missing")

        // add to overview
        resultsSheet.appendRow([spreadsheet.getName(), spreadsheet.getId(), spreadsheet.getDateCreated(), spreadsheet.getLastUpdated()])

        // create Sheet
        resultsSheet = insertSheetIfNotExist(resultsSS, thisCompany)
        resultsSheet.clear()

        var fileId = spreadsheet.getId();

        var pageToken;

        // for fileID fetch all activities
        do {
          var result = AppsActivity.Activities.list({
            'drive.fileId': fileId,
            'source': 'drive.google.com',
            'pageToken': pageToken
          });
          var activities = result.activities;
          for (var i = 0; i < activities.length; i++) {
            // event blocks
            var events = activities[i].singleEvents;
            resultsSheet.appendRow([events.toString()])
            for (var j = 0; j < events.length; j++) {
              // single events
              var event = events[j];
              resultsSheet.appendRow([event.toString()])
            }
          }
          pageToken = result.nextPageToken;
        } while (pageToken)

      } else { Logger.log(thisCompany + " already processed") }
    }
  }
}

function getUsersActivitySC() {

  var resultsSS = connectToSpreadsheetByName("TestingActivitySC")

  var overviewSheet = "2019 SC"

  //check if overview sheet exists
  var resultsSheet = resultsSS.getSheetByName(overviewSheet);
  // if not - process 
  if (!resultsSheet) {
    resultsSheet = insertSheetIfNotExist(resultsSS, overviewSheet)
    resultsSheet.clear()
    resultsSheet.appendRow(["Sheet", "Id", "Date First", "Date Last"])
  }

  var folderOfInterest = DriveApp.getFoldersByName("2019 Scoring").next()
  Logger.log(folderOfInterest)
  // var subFoldersOfInterest = folderOfInterest.getFolders()

  var sheets = resultsSS.getSheets()

  // as long as there are subfolders
  // while (subFoldersOfInterest.hasNext()) {
  // enter subfolder
  var thisFolder = folderOfInterest
  // fetch all SS
  var spreadsheets = thisFolder.getFilesByType("application/vnd.google-apps.ritz")
  // for each SS of this subfolder
  while (spreadsheets.hasNext()) {
    // enter SS
    var spreadsheet = spreadsheets.next()
    var thisCompany = spreadsheet.getName()

    // check if company is already in results
    var testGet = resultsSS.getSheetByName(thisCompany);

    // if not - process 
    if (!testGet) {

      Logger.log(thisCompany + " yet missing")

      // add to overview
      resultsSheet.appendRow([spreadsheet.getName(), spreadsheet.getId(), spreadsheet.getDateCreated(), spreadsheet.getLastUpdated()])

      // create Sheet
      resultsSheet = insertSheetIfNotExist(resultsSS, thisCompany)
      resultsSheet.clear()

      var fileId = spreadsheet.getId();

      var pageToken;

      // for fileID fetch all activities
      do {
        var result = AppsActivity.Activities.list({
          'drive.fileId': fileId,
          'source': 'drive.google.com',
          'pageToken': pageToken
        });
        var activities = result.activities;
        for (var i = 0; i < activities.length; i++) {
          // event blocks
          var events = activities[i].singleEvents;
          resultsSheet.appendRow([events.toString()])
          for (var j = 0; j < events.length; j++) {
            // single events
            var event = events[j];
            resultsSheet.appendRow([event.toString()])
          }
        }
        pageToken = result.nextPageToken;
      } while (pageToken)

      // resultsSheet.appendRow([Object.keys(users)])
    } else { Logger.log(thisCompany + " already processed") }
  }
}
