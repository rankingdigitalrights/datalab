# Changelog

> Keep track of new developments here, document your progress, also explicitly indicate **breaking** changes

[...]

2019 September

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

2019 August

+ added permission changes module
+ refactored scoring and data collection modules into rough single units of responsibility
+ refactored generic tasks (e.g. importJSONxxx(), nameRange(comp,step,ind)) into helper modules
+ added scoring sheet module
+ enabled NodeJS/clasp + GAS API integration, and full integration with git

2019 July

+ initial groundbreaking work by tech intern G.W. based on initial requirements from L.G. and prototype architecture from I.S.
+ G.W. created and completed the basic data collection module (99% of the core features), explored the core scoring sheet patterns (i.e. the collection of named ranges for indicator scoring), and created a through documentation of the data collection module