const centralConfig = {
  collection: 'config',
  indexYear: 2022,
  indexType: 'RDR Index',
  lastRevised: '2021-10-14',
  indexPrefix: 'RDR22',
  prevIndexPrefix: 'RDR20',
  subsetMaxStep: 3, // logical, inclusive; TODO: maybe move into mainController
  dataOwner: 'data@rankingdigitalrights.org',
  devs: [
    'gutermuth@rankingdigitalrights.org',
    'mathurin@rankingdigitalrights.org',
    'montiel@rankingdigitalrights.org'
  ],
  defaultEditors: [
    'gutermuth@rankingdigitalrights.org',
    'mathurin@rankingdigitalrights.org',
    'montiel@rankingdigitalrights.org',
    "wessenauer@rankingdigitalrights.org",
    "zhang@rankingdigitalrights.org",
    "rogoff@rankingdigitalrights.org"
  ],
  defaultViewers: [
    "wessenauer@rankingdigitalrights.org",
    "rogoff@rankingdigitalrights.org",
    "zhang@rankingdigitalrights.org",
    "brouillette@rankingdigitalrights.org",
    "abrougui@rankingdigitalrights.org",
    "rydzak@rankingdigitalrights.org",
    'gutermuth@rankingdigitalrights.org',
    'mathurin@rankingdigitalrights.org'
  ],
  filenamePrefix: '2022 -',
  filenameSuffixProd: '',
  filenameSuffixDev: '(Dev)',
  rootFolderNameProd: '2021 RDR Index Data',
  rootFolderIDProd: '12EcviVht01HRC2H4mRquTeb4Pj2H8nbh',
  backupFolderID: '1hziGVUl24a1e1iDeMUxZOMjNvm1tnY1V', // TODO:
  rootFolderNameDev: '2021 Index Dev',
  rootFolderIDDev: '13RJjg0hFGz2u-RHQnyHmUi6qTl1XT9PR', // Data @ 2021 Index Dev
  inputFolderNameProd: '2022 RDR Research Data Collection',
  inputFolderNameDev: '2021 - Dev - Input',
  outputFolderNameProd: '2022 RDR Company Scoring',
  outputFolderNameDev: '2021 - Dev - Scoring',
  controlSpreadsheetID: '1k__JTE_5lGEBdBhMaguelgq8kom9Rf1x4uYiI2_BI88', // TODO: 00-Dashboard-Dev
  importPrevOutcome: true,
  freezeHead: true,
  // firstScoringStep: 3 // regular index
  scoringSteps: [0, 1, 2, 3, 5, 6, 7],
  collapseAllGroups: false,
  indicatorsLink: 'https://rankingdigitalrights.org/2020-indicators/',
  glossaryLink: 'https://rankingdigitalrights.org/2020-indicators/#glossary',
  feedbackForms: {
    feedbackStep: 3,
    feedbackSubstepResults: 1,
    feedbackSubstepYonYComments: 2,
    compFeedbackSheetName: 'Company Feedback',
    yearOnYearHelperTabName: 'Year on Year Comments',
    sourcesSheetName: 'Sources',
    dataColWidth: 300,
    masterTemplateUrl: '1pu95U68P6AFHdwMx_EFxau3ML91oqj9JM4wP1SC48aQ',
    outputFolderIdProd: '10-o8mKqb1PkiewmHXNMdP3KjUR24RdUl', // TODO: 2020
    outputFolderIdDev: '1f2THqNnhoDfpj0ThUGXGy5CV6N8ydD8e', // TODO: 2020
    frontMatter: {
      frontMatterColsNr: 4,
      indicatorGuidanceLabel: 'Indicator guidance:',
      glossaryText: 'Terms with bold formatting (in the text above) are defined in RDR’s Glossary:',
      guidanceText: 'See full indicator guidance and associated definitions for this indicator here:',
    },
    mainSection: {
      label: 'PRELIMINARY EVALUATION',
      backColor: '#5ca5d9',
      fontColor: 'white',
    },
    yearOnYearSection: {
      label: 'YEAR-ON-YEAR COMPARISON',
      backColor: '#5ca5d9',
      fontColor: 'white',
      contentRowHeight: 150,
      rowLabel: '\n\nChange since 2020 Index:',
      extraInstructionFB:
        'The following is a preliminary evaluation of whether your company’s disclosure has changed since the 2020 RDR Index.',
    },
    feedbackBoxSection: {
      label: 'COMPANY RESPONSE',
      backColor: '#ffe599',
      fontColor: null,
      contentRowHeight: 250,
      rowLabel: '\n\nResponse:',
      extraRow: true,
      extraRowLabel: 'Sources:',
      extraInstructionFB:
        'Please add your response to the preliminary evaluation for this indicator in the space below. Be sure to indicate the element and services (if applicable) you are referencing, as well as any sources (including the url) that you feel we should be evaluating.',
    },
  },
  sourcesTabName: '2022 Sources',
  prevYearOutcomeTab: '2020 Outcome',
  urlPrevOutputSheet: '1HJp7i2RVBGrPm7XbyrafYEtSZqjc9t6Qm3ov4bmHdu0', // 2020 - Excel - Master
  prevYearSourcesTab: '2020 Sources',
  urlPreviousYearSources: '1HJp7i2RVBGrPm7XbyrafYEtSZqjc9t6Qm3ov4bmHdu0', // 2020 - Excel - Master
  newIndicatorLabel: 'New / Revised Indicator',
  newElementLabelResult: 'N/A',
  newElementLabelComment: 'New / Revised Element',
  newCompanyLabelResult: 'N/A',
  newCompanyLabelComment: 'New Company',
  includeRGuidanceLink: true, // TODO
  collapseRGuidance: true,
  styles: {
    colors: {
      blue: '#4D9ECF',
    },
    dims: {
      labelColumnWidth: 140,
      serviceColWidth: 320,
      defaultDataColWidth: 100,
    },
  },
  summaryParams: {
    // should be in sync with scoringParams in Prod
    spreadsheetName: 'Summary Scores',
    sheetNameSimple: 'Summary Minimal',
    splitPrePost: false, // TODO
  },
  aggregationParams: {
    // TBD
  },
  // maxScoringStep: false, // otherwise number
  notesSheetname: 'Researcher Comments',
  scoringSheetname: 'Scores',
  scoringParams: {
    subStepNr: 1,
    firstStepNr: 0,
    lastStepNr: 7,
    sheetName: 'Outcome',
    dataColWidth: 200,
    hasFullScores: true,
    includeSources: true,
    includeNames: false,
    includeResults: true,
  },
  dataStoreParams: {
    outputFolderName: '2022 - Data Store v3',
    fileName: 'Data Store',
    summarySheetName: 'Aggregated',
    // subStepNr: 0,
    firstStepNr: 3, // 0
    lastStepNr: 3, // 1
    integrateOutputs: false,
  },
}
