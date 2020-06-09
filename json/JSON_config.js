var centralConfig = {
  dataOwner: "data@rankingdigitalrights.org",
  devs: ["gutermuth@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "walton@rankingdigitalrights.org"],
  defaultEditors: ["walton@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "ilja.sperling@gmail.com", "wessenauer@rankingdigitalrights.org", "brouillette@rankingdigitalrights.org"],
  defaultViewers: ["wessenauer@rankingdigitalrights.org", "rogoff@rankingdigitalrights.org", "zhang@rankingdigitalrights.org", "brouillette@rankingdigitalrights.org", "abrougui@rankingdigitalrights.org", "rydzak@rankingdigitalrights.org", "walton@rankingdigitalrights.org", "gutermuth@rankingdigitalrights.org", "sperling@rankingdigitalrights.org", "ilja.sperling@gmail.com"],
  indexPrefix: "RDR20",
  prevIndexPrefix: "RDR19",
  filenamePrefix: "2020 -",
  filenameSuffixProd: "",
  filenameSuffixDev: "(Dev)",
  rootFolderNameProd: "2020 RDR Index Data",
  rootFolderIDProd: "19hiRk0NX3s-eF9i-nFGIuNEvYFqGyazR", // Data @ 2020 Index
  backupFolderID: "1hziGVUl24a1e1iDeMUxZOMjNvm1tnY1V",
  rootFolderNameDev: "2020 Index Dev",
  rootFolderIDDev: "1cTmm5BbvyYlO0FvYHaU3y588Rvgns_47", // Data @ 2020 index Dev
  inputFolderNameProd: "2020 RDR Research Data Collection",
  inputFolderNameDev: "2020 - Dev - Input",
  controlSpreadsheetID: "1r3Hq6m9R3l0yMaiAZXf40Z7Gif54Kd1B08MUBk4n_LM", // 00-Dashboard-X
  YearOnYear: true,
  freezeHead: true,
  // firstScoringStep: 3 // regular index
  subsetMaxStep: 3, // logical, inclusive
  scoringSteps: [3, 6],
  collapseAllGroups: false,
  feedbackStep: [4, 5],
  compFeedbackSheetName: "2020 Feedback",
  prevYearOutcomeTab: "2019 Outcome",
  urlPreviousYearResults: "1pxgQMrvL5EfERUvdYXXuHaLo1qunAjDnkWd5ovF-N74", // 2019 Summary Step 7
  prevYearSourcesTab: "2019 Sources",
  urlPreviousYearSources: "1gK8M9-4eLwwbWMsgXH6Gi1VqOXZF1iARWE3Q_CNqgr8",
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
      labelColumnWidth: 140,
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
