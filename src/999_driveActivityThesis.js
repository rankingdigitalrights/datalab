// --- // function to fetch Google Drive activity for all Data Collection Spreadsheets // --- //

/*
fetches atomic events for each spreadsheet from a defined folder of subfolders and adds the results to respective Sheets in an Output Spreadsheet
*/

/*
Google Drive API documentation for Activities:
https://developers.google.com/drive/activity/v1/reference/activities/list
*/

function getUsersActivityDC() {

    // connect to Output Spreadsheet
    var resultsSpreadsheet = connectToSpreadsheetByName("ActivityDCNamed")

    // define name of Overview Sheet
    var overviewSheetName = "2019 DC"

    // check if Overview Sheet exists
    var overViewSheet = resultsSpreadsheet.getSheetByName(overviewSheetName);
    // if not - process 
    if (!overViewSheet) {
        overViewSheet = insertSheetIfNotExist(resultsSpreadsheet, overviewSheetName, true)
        overViewSheet.clear()
        overViewSheet.appendRow(["Sheet", "Id", "Date First", "Date Last"])
    }

    // fetch target folder with Spreadsheets of interest
    var folderOfInterest = DriveApp.getFoldersByName("2019 RDR Research Data Collection").next()

    // as Data Collection is structured into subfolders
    // fetch all subfolders with Spreadsheets of interest
    var subFoldersOfInterest = folderOfInterest.getFolders()

    // fetch Sheet names from resultsSpreadsheet to check which Spreadsheets have been processed already
    var sheets = resultsSpreadsheet.getSheets()

    // for each Subfolder
    while (subFoldersOfInterest.hasNext()) {
        // enter subfolder
        var thisFolder = subFoldersOfInterest.next()
        // fetch all Spreadsheets
        var spreadsheets = thisFolder.getFilesByType("application/vnd.google-apps.ritz")
        // for each Spreadsheet of this subfolder
        while (spreadsheets.hasNext()) {
            // enter Spreadsheet
            var spreadsheet = spreadsheets.next()
            // get Spreadsheet Name

            var thisCompany = spreadsheet.getName()

            // check if company is already in results
            var testGet = resultsSpreadsheet.getSheetByName(thisCompany);

            // if not - process 
            if (!testGet) {

                Logger.log(thisCompany + " yet missing")

                // add general Spreadsheet info to Overview Sheet
                overViewSheet.appendRow([spreadsheet.getName(), spreadsheet.getId(), spreadsheet.getDateCreated(), spreadsheet.getLastUpdated()])

                // create a Results Sheet for this Spreadsheet
                var resultsSheet = insertSheetIfNotExist(resultsSpreadsheet, thisCompany, true)
                resultsSheet.clear()
                resultsSheet.appendRow(["entry", "activity", "event", "time", "target", "main", "secondary", "user"])

                var fileId = spreadsheet.getId()

                var pageToken

                // for fileID := Spreadsheet.fileId() fetch all activities from Google Drive
                // for each page of results

                var entry = 0 // for continious activity numbery across multiple results pages

                do {
                    var result = AppsActivity.Activities.list({
                        'drive.fileId': fileId,
                        'source': 'drive.google.com',
                        'pageToken': pageToken
                    })
                    var activities = result.activities;

                    // for each distinct activity
                    for (var i = 0; i < activities.length; i++) {

                        entry += 1

                        // pull out activity

                        var events = activities[i].singleEvents

                        // for all atomic events of this activity
                        for (var j = 0; j < events.length; j++) {
                            // pull out atomic event
                            var event = events[j]
                            // add event data to resultsSheet
                            // vars: entry, activityNr, eventNr, time (POSIX), file, primary Action, secondary Action, user
                            resultsSheet.appendRow([entry, i + 1, j + 1, event.eventTimeMillis, event.target.name, event.primaryEventType, event.additionalEventTypes.toString(), event.user])
                        }

                    }
                    pageToken = result.nextPageToken;
                } while (pageToken)

            } else {
                Logger.log(thisCompany + " already processed")
            }
        } // end spreadsheet

    } // end subfolder

}

// --- // function to fetch Google Drive activity for all Scoring Spreadsheets (Companies, Summary Scores, Year-on-Year Comparison // --- //

/* 
fetches atomic events for each spreadsheet from a defined folder and adds the results to respective Sheets in an Output Spreadsheet
*/

/*
Google Drive API documentation for Activities:
https://developers.google.com/drive/activity/v1/reference/activities/list 
*/

function getUsersActivitySC() {

    // connect to Output Spreadsheet
    var resultsSpreadsheet = connectToSpreadsheetByName("ActivitySCNamed")

    // define name of Overview Sheet
    var overviewSheetName = "2019 SC"

    // check if Overview Sheet exists
    var overViewSheet = resultsSpreadsheet.getSheetByName(overviewSheetName)
    // if not - process 
    if (!overViewSheet) {
        overViewSheet = insertSheetIfNotExist(resultsSpreadsheet, overviewSheetName, true)
        overViewSheet.clear()
        overViewSheet.appendRow(["Sheet", "Id", "Date First", "Date Last"])
    }

    // fetch target folder with Spreadsheets of interest
    var folderOfInterest = DriveApp.getFoldersByName("2019 Scoring").next()
    Logger.log(folderOfInterest)

    // fetch Sheet names from resultsSpreadsheet to check which Spreadsheets have been processed already
    var sheets = resultsSpreadsheet.getSheets()

    // enter folder
    var thisFolder = folderOfInterest
    // fetch all Spreadsheets
    var spreadsheets = thisFolder.getFilesByType("application/vnd.google-apps.ritz")

    // for each Spreadsheet of this folder
    while (spreadsheets.hasNext()) {
        // enter Spreadsheet
        var spreadsheet = spreadsheets.next()
        // get Spreadsheet Name
        var thisCompany = spreadsheet.getName()

        // check if company is already in results
        var testGet = resultsSpreadsheet.getSheetByName(thisCompany)

        // if not - process 
        if (!testGet) {

            Logger.log(thisCompany + " yet missing")

            // add general Spreadsheet info to Overview Sheet
            overViewSheet.appendRow([spreadsheet.getName(), spreadsheet.getId(), spreadsheet.getDateCreated(), spreadsheet.getLastUpdated()])

            // create a Results Sheet for this Spreadsheet
            var resultsSheet = insertSheetIfNotExist(resultsSpreadsheet, thisCompany, true)
            resultsSheet.clear()
            resultsSheet.appendRow(["entry", "activity", "event", "time", "target", "main", "secondary", "user"])

            var fileId = spreadsheet.getId()

            var pageToken;

            // for fileID := Spreadsheet.fileId() fetch all activities from Google Drive
            // for each page of results

            var entry = 0 // for continious activity numbery across multiple results pages
            do {
                var result = AppsActivity.Activities.list({
                    'drive.fileId': fileId,
                    'source': 'drive.google.com',
                    'pageToken': pageToken
                })

                var activities = result.activities;

                // for each distinct activity
                for (var i = 0; i < activities.length; i++) {

                    entry += 1

                    // pull out activity
                    var events = activities[i].singleEvents;

                    // for all atomic events of this activity
                    for (var j = 0; j < events.length; j++) {
                        // pull out atomic event
                        var event = events[j];
                        // add event data to resultsSheet
                        // vars: activityNr, eventNr, time (POSIX), file, primary Action, secondary Action, user
                        resultsSheet.appendRow([entry, i + 1, j + 1, event.eventTimeMillis, event.target.name, event.primaryEventType, event.additionalEventTypes.toString(), event.user])
                    }
                }
                pageToken = result.nextPageToken;
            } while (pageToken)

        } else {
            Logger.log(thisCompany + " already processed")
        } // end spreadsheet

    } // end folder

}