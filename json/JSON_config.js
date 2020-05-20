var centralConfig = {
  dataOwner: "data@rankingdigitalrights.org",
  devs: ["gutermuth@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "walton@rankingdigitalrights.org"],
  indexPrefix: "RDR20",
  prevIndexPrefix: "RDR19",
  filenameSuffix: "Index Dev",
  rootFolderID: "19hiRk0NX3s-eF9i-nFGIuNEvYFqGyazR", //Data @ 2020 Index
  rootFolderName: "2020 Index", // optional Folder name string to see if access by ID fails
  controlSpreadsheetID: "1r3Hq6m9R3l0yMaiAZXf40Z7Gif54Kd1B08MUBk4n_LM", // 00-Dashboard-Dev
  YearOnYear: true,
  urlPreviousYearResults: "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74", // 2019 Summary Step 7
  urlPreviousYearSources: "1gK8M9-4eLwwbWMsgXH6Gi1VqOXZF1iARWE3Q_CNqgr8",
  freezeHead: true,
  // firstScoringStep: 3 // regular index
  scoringSteps: [3, 6],
  collapseAllGroups: false,
  feedbackStep: 3,
  prevYearOutcomeTab: "2019 Outcome",
  newIndicatorLabel: "New / Revised Indicator",
  newElementLabelResult: "N/A",
  newElementLabelComment: "New / Revised Element",
  newCompanyLabelResult: "N/A",
  newCompanyLabelComment: "New Company",
  includeRGuidanceLink: true, // TODO
  collapseRGuidance: true,
  styles: {
    colors: {
      blue: "#4D9ECF"
    },
    dims: {
      serviceColWidth: 320,
      defaultDataColWidth: 100,
    }
  },
  summaryParams: { // should be in sync with scoringParams in Prod
    spreadsheetName: "Summary Scores",
    sheetNameSimple: "Summary Minimal",
    splitPrePost: false // TODO
  },
  aggregationParams: {
    // TBD
  },
  // maxScoringStep: false, // otherwise number
  integrateOutputs: false, // DC: integrate any output component?
  notesSheetname: "Researcher Comments",
  scoringSheetname: "Scores",
  feedbackSheetname: "Feedback Base",
  integrateOutputsArray: {
    includeScoring: false, // create regular Outcome?
    isFullScoring: true, // scores or only comments?
    includeCompFeedback: false, // TODO
    includeNotes: false,
    isPilotMode: false, // if true then disable scoring
    researchNotesParams: {
      subStepNr: 1,
      firstStepNr: 1,
      lastStepNr: 6,
      sheetName: "Researcher Comments",
      dataColWidth: 200,
      hasFullScores: false,
      includeSources: false,
      includeNames: true,
      includeResults: false
    },
    scoringParams: {
      subStepNr: 0,
      firstStepNr: 1,
      lastStepNr: 6,
      sheetName: "Outcome",
      dataColWidth: 200,
      hasFullScores: true,
      includeSources: true,
      includeNames: false,
      includeResults: true
    },
    feedbackParams: {
      subStepNr: 0,
      firstStepNr: 1,
      lastStepNr: 6,
      sheetName: "Prototype",
      dataColWidth: 200,
      hasFullScores: false,
      includeSources: true,
      includeNames: false,
      includeResults: true
    }
  },
  feedbackParams: {
    subStepNr: 0,
    firstStepNr: 3,
    lastStepNr: 3,
    sheetName: "Prototype",
    dataColWidth: 300,
    hasFullScores: false,
    includeSources: true,
    includeNames: false,
    includeResults: true,
    sourcesSheetname: "Sources referenced"
  },
  dataStoreParams: {
    fileName: "Data Store",
    summarySheetName: "Aggregated",
    // subStepNr: 0,
    firstStepNr: 1,
    lastStepNr: 6,
    dataColWidth: 200,
    integrateOutputs: false
  }
}
