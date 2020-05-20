# Changelog

> Keep track of new developments here, document your progress, also explicitly indicate **breaking** changes

## 2020 April

+ Breaking: Project setup migrated
  + dev@ owns project
  + data@ owns data & outputs
  + users need to use their own accounts to deploy & execute modules
  + login and admin tasks reflected in [setup.md](/docs/setup.md)
+ Main readme & changelog overhauled updated (rolling);
+ git branches cleanup
  + development for main feature testing
  + temporary branches (i.e. `input-dev`; `permissions`) for development of new features
  + `master` for hosting the production code (**protected branch** now)
+ Breaking: Step 0/1 re-designed (incl. Indicators & Research Steps)
  + imports previous Outcome as Step 0
  + Step 1 pulls from Step 0 based on dropdown (did change yes/no)
  + new YonY submodules & research Substep Components
+ Breaking: Indicators F/P updated to 2020
+ Breaking: variable & property names changed to improve readability
+ [...]

+ new function `isValueInColumn()`
+ `addFileIDtoControl()` now checks for redundant ID in `00-Dashboard`
+ `assignFileOwner(lastname)`; `assignFolderOwner(lastname)` added
+ `assignFileEditors(lastNames)`; `assignFolderEditors(lastNames)`added
  + both sets of methods take string `lastname` or Array string `[lastNames]` and add the email address RDR
  + for the Index, `*Editors()` should take any email

## 2020 February

+ Module: Aggregation - more verbosity; N/P added
+ Module: Data Store extended - imports Scores;
+ overall refactoring & renaming

## 2020 January

+ Module: Spreadsheet Healer extended (dropdowns can be updated / extended); renamed to Health Inspector; reports to `00_Dashboard`
+ Module: Summary Scores extended (column grouping)
+ Scoring Formula overhauled
+ Module: Data Store v2 (long form)

## 2019 December

+ `npm` initialized (`eslint` for Syntax compliance, `clasp`,  `typescript` for Syntax completion)
+ Refactoring: clasp-project isolated and renamed; all code moved to `./src`; json moved to `./json`

## 2019 November 

+ Module: Summary Scores operational
+ New Module: Feedback Request Forms operational
+ New Module: Spreadsheet Healer (Input Sheets: Named Ranges, Labels)
+ New Module: Data Store Layer (beta)

## 2019 October

+ `Pilot` branch
+ refactoring of JSON & DC, SC (naming, cleanup); all modules have an Interface now so that submodules can be called from other Modules (i.e. Scoring submodules can be called from Input Sheet Module)
+ Feature: scoring/feedback can be integrated into DC spreadsheet
+ Module: Aggregation Spreadsheets have standard sheets (scoring logic)
+ Aggregation refactored


## 2019 September

+ added DC Feature: Step-wise grouping of rows
+ added Drive activity parser, that can return atomic activity events (i.e. when a document is changed) for sets of spreadsheets (i.e. time, operation, user). Apart from stats, this could be used for triggering actions.
+ **new Dev Capacity** JS/GAS: added first [`polyfill`](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill): `array.proto.includes`. More to come with further refactoring.
+ implemented layout/formatting options for DC & SC; also: Roboto as default Font Family for better readability; TBD: needs to be refactored into single function
+ introduced coloring based on indicator category
+ **new Feature** `FileID`s of new spreadsheet files are now returned and added to `00_Test` spreadsheet in root of `2019 Back-end testing` folder
+ **new SSOT**: Company JSON is now fetched locally (from a global var in `01_JSON_companies.js`)
+ added Indicator Instructions to `DC`
+ added header formatting patterns; refactoring to `function` TBD
+ split up `data collection` into main and helpers to reduce strain
+ introduced `FeatureRequest` and `bugs` as GitHub Issues (for easier tracking, assigning and elaborating)
+ migrated project to rdresearch
+ implemented `importLocalJSON()` to import JSONs from Google Drive. TODO: needs reliable mechanism for synching JSONs with git [unless we move JSON SSOT to Google Drive which is ok])
+ added output to specific folder functionality

## 2019 August

+ added permission changes module
+ refactored scoring and data collection modules into rough single units of responsibility
+ refactored generic tasks (e.g. importJSONxxx(), nameRange(comp,step,ind)) into helper modules
+ added scoring sheet module
+ enabled NodeJS/clasp + GAS API integration, and full integration with git

## 2019 July

+ initial ground-laying work by tech intern G.W. based on initial requirements from L.G. and prototype architecture from I.S.
+ G.W. created and completed the basic data collection module (99% of the core features), explored the core scoring sheet patterns (i.e. the collection of named ranges for indicator scoring), and created a through documentation of the data collection module