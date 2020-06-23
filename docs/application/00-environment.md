# Layer 0: Environment(s)

> Last update: 2020-06-03

---

## Documentation TOC

+ [00 - Environments](00-environment.md)
+ [01 - Architecture](01-architecture.md)
+ [02 - Local Setup](02-setup.md)
+ [03 - Developer Guidance & Conventions](03-guidance-conventions.md)
+ [04 - Maintenance & Repairs](04-maintenance.md)
+ ...
+ [10 - Input Sheets](10-input-sheets-main.md)
+ [20 - TBD - Scoring Sheets](20-scoring-sheets-main.md)
+ [30 - TBD - Summary Scores / Aggregation](#)
+ [40 - TBD - Company Feedback](#)
+ [50 - TBD - Permissions](#)
+ [60 - TBD - Data Store](60-data-store-main.md)
+ [70 - Input Health](70-input-health.md)
+ [9x - TBD - Helper Modules Overview](90-helper-function.md)

---

## Principles

We

+ store code in a Git repository (version-control & collaboration)
+ develop locally
+ deploy to Google Apps Script with clasp
+ execute/run code online
+ access file outputs on Google Drive

The global setup is configured into development and production. For now, switching between environments is triggered manually with `npm tasks`.

So far, following measures are in place:

## Environments

> **runtime** / **execution** environment|s: [`(Google Apps Script)` Projects](https://script.google.com/home/my)

+ each Project is hosted on Google Drive (therefore can be shared like any other file)
+ each Project has an unique `id` (also stored locally in `./appsscript.json`)
+ each Project can be accessed by accounts it has been shared with (assuming sufficient user *permissions* )
+ the main project is `datalab`
+ developers can use individual/private projects
+ add your `id` to the `./env` folder, create a `*.sh` script, and add task to `package.json`
+ **toggle** between projects with `npm run switch <project>`
+ we run almost all modules with our individual accounts
+ we run **permissions** only with `data@rdr`

> **output / file system** environment|s

+ we try to control filesystem access by our application
+ `data@rdr` hosts, owns, and shares production outputs (Spreadsheets & Folders)
+ *TBC*: development outputs shouldn't pollute `data@rdr`. Work locally
+ output folder **roots** (for development and production) are defined in `Config.JSON` by `folderID`
+ folder **names** (root|s & subfolders) are defined in `Config.JSON`
+ **toggle** between `production` vs `development` parameters with `var isProduction = false` in `00_mainController.js`. The default in all branches is `false`

> output **files** (Spreadsheets)

+ to make access to `Company Input Spreadsheets` more robust, (i.e. independent of duplicates or file names), modules operate with `Company.<fileID>`|s
+ `fileID`| of created files (i.e. Input Spreadsheets, Data Store, Scoring Sheets) are tracked in the `Drive/00-dashboard` Spreadsheet
+ `Company.<fileID>`|s are stored in `Companies.json` (i.e. `Company.urlCurrentDataCollectionSheet`) (edited by hand)
