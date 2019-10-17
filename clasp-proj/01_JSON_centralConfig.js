var centralConfig = {
	"indexPrefix": "RDR2019",
	"filenameSuffix": "Pilot Test",
	"rootFolderID": "1_0ItAPEi3guFochAExacCl2bTN0abwax", // "2019 Back-end testing"
	"outputFolderName": "Pilot Drafts", // ID: 1eZxqA2_ebOYs9oMnySKSzV5ybNwrEmMO
	"controlSpreadsheet": "1PMEEmlueGgf69ZcUjIvS1iFjai9jt6eBd8yKbuZAxMI", // 00_Pilot_Dashboard
	"YearOnYear" : false,
	"freezeHead" : false,
	"serviceColWidth": 280,
	"defaultDataColWidth": 100,
	// "firstScoringStep": 3 // regular index
	"firstScoringStep": 3, // Pilot
	"scoringSteps": [3, 6],
	// "maxScoringStep": false, // otherwise number
	"integrateOutputs": true, // add any scoring component? scoring, feedback, comments/notes
	"includeScoring": true, // create regular Outcome?
	"isFullScoring": false, // include comments?
	"pilotMode": false, // if true then disable scoring
	"collapseAllGroups": false,
	"notesSheetname": "Researcher Comments",
	"scoringSheetname": "Outcome",
	"feedbackSheetname": "Raw ComFeedback",
	"feedbackStep": 3,
	"prevYearOutcomeTab": "2018 Outcome",
	"includeDCResearchGuidance": false // TODO
}
