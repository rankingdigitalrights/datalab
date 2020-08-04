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
  controlSpreadsheetID: "1R2YKiItsnacltvRj0RLY6-1yEyyVGKnD3y-sYoyaKqE", // 00-Dashboard-Dev
  YearOnYear: true,
  freezeHead: true,
  // firstScoringStep: 3 // regular index
  subsetMaxStep: 3, // logical, inclusive; TODO: maybe move into mainController
  scoringSteps: [0, 3, 5, 6, 7],
  collapseAllGroups: false,
  indicatorsLink: "https://rankingdigitalrights.org/2020-indicators/",
  glossaryLink: "https://rankingdigitalrights.org/2020-indicators/#glossary",
  feedbackForms: {
    feedbackStep: 3,
    feedbackSubstepResults: 2,
    feedbackSubstepYonYComments: 3,
    compFeedbackSheetName: "Company Feedback",
    yearOnYearHelperTabName: "Year on Year Comments",
    sourcesSheetName: "Sources",
    dataColWidth: 300,
    masterTemplateUrl: "125ZK69c-1NntgOQfM8_tD6n2jM4eOytfZmodU8FfZrc",
    outputFolderId: "1oqphurm6AEZT0CFyvT6Rt57Iyb8JLPxe",
    frontMatter: {
      frontMatterColsNr: 4,
      indicatorGuidanceLabel: "Indicator guidance:",
      glossaryText: "Terms with bold formatting (in the text above) are defined in RDR's Glossary:",
      guidanceText: "See full indicator guidance and associated definitions for this indicator here:"
    },
    mainSection: {
      label: "PRELIMINARY EVALUATION",
      backColor: "#5ca5d9",
      fontColor: "white",
    },
    yearOnYearSection: {
      label: "YEAR-ON-YEAR COMPARISON",
      backColor: "#5ca5d9",
      fontColor: "white",
      contentRowHeight: 150,
      rowLabel: "\n\nChange since 2019 Index:",
      extraInstructionFB: "The following is a preliminary evaluation of whether your company’s disclosure has changed since the 2019 RDR Index (applicable for indicators/elements that are same as in the 2019 RDR Index)."
    },
    feedbackBoxSection: {
      label: "COMPANY RESPONSE",
      backColor: "#ffe599",
      fontColor: null,
      contentRowHeight: 250,
      rowLabel: "\n\nResponse:",
      extraRow: true,
      extraRowLabel: "Sources:",
      extraInstructionFB: "Please add your response to the preliminary evaluation for this indicator in the space below. Be sure to indicate the element and services (if applicable) you are referencing, as well as any sources (including the url) that you feel we should be evaluating."
    }
  },
  sourcesTabName: "2020 Sources",
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
      subStepNr: 1,
      firstStepNr: 0,
      lastStepNr: 3,
      sheetName: "Outcome",
      dataColWidth: 200,
      hasFullScores: true,
      includeSources: true,
      includeNames: false,
      includeResults: true
    }
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
