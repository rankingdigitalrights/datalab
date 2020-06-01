# Layer 0: Setup / Environment(s)

> Last update: 2020-06-01

> TODO: Insert TOC

The global setup is configured into development and production. For now, switching between environments is done manually.

So far, following measures are in place:

> **runtime** / **execution**: [`(Google Apps Script)` Projects](https://script.google.com/home/my)

+ each Project is hosted within Google Drive (therefore can be shared and accessed like any other file)
+ each Project has an unique `id` (stored locally in `appsscript.json`)
+ each Project can be run by accounts it has been shared with (assuming sufficient user *permissions* )
+ **toggle** between projects with `npm run switch <project>`
+ we run almost all modules with our individual accounts
+ we run **permissions** only with `data@rdr`

> **output folders / Drive file system**

+ we try to control filesystem access by our application
+ `data@rdr` hosts, owns, and shares outputs (Spreadsheets & Folders)
+ output folder **roots** (for development and production) are defined in `Config.JSON` by `folderID`
+ folder **names** (root|s & subfolders) are defined in `Config.JSON`
+ **toggle** between `production` vs `development` parameters with `var isProduction = false` in `00_mainController.js`. The default in all branches is `false`

> output **files** (Spreadsheets)

+ to make access to `Company Input Spreadsheets` more robust, (i.e. independent of duplicates or file names), modules operate with `Company.<fileID>`|s
+ `fileID`| of created files (i.e. Input Spreadsheets, Data Store, Scoring Sheets) are tracked in the `Drive/00-dashboard` Spreadsheet
+ `Company.<fileID>`|s are stored in `Companies.json` (i.e. `Company.urlCurrentDataCollectionSheet`) (edited by hand)
