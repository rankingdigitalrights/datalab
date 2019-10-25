var centralConfig = {
	"indexPrefix": "RDR2019",
	"filenameSuffix": "Pilot Dev",
	"rootFolderID": "1_0ItAPEi3guFochAExacCl2bTN0abwax", // "2019 Back-end testing"
	"outputFolderName": "2019 Pilot Dev", // ID: 1eZxqA2_ebOYs9oMnySKSzV5ybNwrEmMO
	"controlSpreadsheet": "1PMEEmlueGgf69ZcUjIvS1iFjai9jt6eBd8yKbuZAxMI", // 00_Pilot_Dashboard
	"YearOnYear" : false,
	"freezeHead" : false,
	"serviceColWidth": 280,
	"defaultDataColWidth": 100,
	// "firstScoringStep": 3 // regular index
	"firstScoringStep": 3, // Pilot
	"scoringSteps": [3, 6],
	// "maxScoringStep": false, // otherwise number
	"integrateOutputs": true, // DC: integrate any output component?
	"integrateOutputsArray": {
		"includeScoring": true, // create regular Outcome?
		"isFullScoring": true, // scores or only comments?
		"includeCompFeedback": false, // TODO
		"includeNotes": true,
		"isPilotMode": false, // if true then disable scoring
		"pilotModeParams" : {
			"subStepNr": 1,
			"firstStepNr": 1,
			"sheetName": "Researcher Comments",
			"dataColWidth": 200,
			"hasFullScoring": false
		},
		"scoringParams" : {
			"subStepNr": 0,
			"firstStepNr": 1,
			"lastStepNr": 3,
			"sheetName": "Outcome",
			"dataColWidth": 200,
			"hasFullScoring": true
		},
		"feedbackParams" : {
			"subStepNr": 0,
			"firstStepNr": 3,
			"lastStepNr": 3,
			"sheetName": "RawCompFeedback",
			"dataColWidth": 200,
			"hasFullScoring": false
		}
	},	
	"collapseAllGroups": false,
	"notesSheetname": "Researcher Comments",
	"scoringSheetname": "Outcome",
	"feedbackSheetname": "RawCompFeedback",
	"feedbackStep": 3,
	"prevYearOutcomeTab": "2018 Outcome",
	"includeRGuidanceLink": false, // TODO
	"collapseRGuidance": false
}
