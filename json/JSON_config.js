var centralConfig = {
    "dataOwner": "data",
    "devs": ["gutermuth", "sperling", "walton"],
    "indexPrefix": "RDR20",
    "filenameSuffix": "Index Dev",
    "rootFolderID": "1cTmm5BbvyYlO0FvYHaU3y588Rvgns_47", //Data:Test-Dev-Remote
    "rootFolderName": "2020 Index Dev (Fallback)", // optional Folder name string to see if acces by ID fails
    "controlSpreadsheetID": "1r3Hq6m9R3l0yMaiAZXf40Z7Gif54Kd1B08MUBk4n_LM", // 00-Dashboard-Dev
    "YearOnYear": true,
    "urlPreviousYearResults": "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74",
    "freezeHead": true,
    "serviceColWidth": 280,
    "defaultDataColWidth": 100,
    // "firstScoringStep": 3 // regular index
    "scoringSteps": [3, 6],
    "collapseAllGroups": false,
    "notesSheetname": "Researcher Comments",
    "scoringSheetname": "Scores",
    "feedbackSheetname": "Feedback Base",
    "feedbackStep": 3,
    "prevYearOutcomeTab": "2019 Outcome",
    "includeRGuidanceLink": true, // TODO
    "collapseRGuidance": true,
    styles: {
        colors: {
            blue: "#4D9ECF"
        }
    },
    "summaryParams": { // should be in sync with scoringParams in Prod
        "spreadsheetName": "Summary Scores",
        "sheetNameSimple": "Summary Minimal",
        "splitPrePost": false // TODO
    },
    "aggregationParams": {
        // TBD
    },
    // "maxScoringStep": false, // otherwise number
    "integrateOutputs": false, // DC: integrate any output component?
    "integrateOutputsArray": {
        "includeScoring": false, // create regular Outcome?
        "isFullScoring": true, // scores or only comments?
        "includeCompFeedback": false, // TODO
        "includeNotes": false,
        "isPilotMode": false, // if true then disable scoring
        "researchNotesParams": {
            "subStepNr": 1,
            "firstStepNr": 1,
            "lastStepNr": 6,
            "sheetName": "Researcher Comments",
            "dataColWidth": 200,
            "hasFullScores": false,
            "includeSources": false,
            "includeNames": true,
            "includeResults": false
        },
        "scoringParams": {
            "subStepNr": 0,
            "firstStepNr": 1,
            "lastStepNr": 6,
            "sheetName": "Outcome",
            "dataColWidth": 200,
            "hasFullScores": true,
            "includeSources": true,
            "includeNames": false,
            "includeResults": true
        },
        "feedbackParams": {
            "subStepNr": 0,
            "firstStepNr": 1,
            "lastStepNr": 6,
            "sheetName": "Prototype",
            "dataColWidth": 200,
            "hasFullScores": false,
            "includeSources": true,
            "includeNames": false,
            "includeResults": true
        }
    },
    "feedbackParams": {
        "subStepNr": 0,
        "firstStepNr": 3,
        "lastStepNr": 3,
        "sheetName": "Prototype",
        "dataColWidth": 300,
        "hasFullScores": false,
        "includeSources": true,
        "includeNames": false,
        "includeResults": true,
        "sourcesSheetname": "Sources referenced"
    },
    "dataStoreParams": {
        "fileName": "Data Store",
        "summarySheetName": "Aggregated",
        // "subStepNr": 0,
        "firstStepNr": 1,
        "lastStepNr": 6,
        "dataColWidth": 200,
        "integrateOutputs": false
    }
}