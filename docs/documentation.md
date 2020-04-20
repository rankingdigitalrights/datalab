# Documentation

> -> Go back to [README](../README.md)\
> -> Jump to [JSON Dictionary](dictionary.md)

---

## TOC

+ [Intro](#intro)
+ [Architecture](#architecture)
  + [Basics](#basics)
  + [Conventions](#code-conventions)
  + [Main Modules](#main-modules)
  + [Helper Modules](#helper-modules)
  + [JSON](#json)
+ [Environment & Recommended Setup](#environment--recommended-setup)
+ [Google Apps Script / Apps API](#google-apps-script--apps-api)
+ [Clasp & IDE](#clasp--ide)
+ [Setup](#setup)
+ [FAQ](#faq)
+ [Issues](#issues)
  + [Learnings](#learnings)
  + [To be Explored](#to-be-explored)

---
![The development environment](img/dev_environment.jpg)
(*The development environment. Clockwise: VSCode+clasp; Google Apps Script; GitHub; Spreadsheet Output on Drive*)

## Intro

([top ↥](#documentation))

> Following the initial development of the data collection spreadsheets by G.W. and I.S., the whole project has been extended and fundamentally restructured and refactored. There's still a lot of clean-up and refactoring tbd, but so far, the core modules and features are maintainable, naming of the ranges is centralized, the project can output to specific folders (within allowed scope) and so on.

To provide contributors with a cognitive model of this project, it is helpful to distinguish between

+ the development environment (the source code stored on `git`, edited locally with an editor, `clasp` for syncing with Google),
+ the execution / runtime environment (Google Apps Script online editor),
+ the output environment (Google Drive), and
+ the UI/frontend (*currently* Google Spreadsheets).

Currently, the `JSON` files build the fourth component as they are stored on a stage server. This has to be changed yet, and has been changed for the companies vector.

---

## Architecture

### Basics

([top ↥](#documentation))

The core idea is that,

a) based on a set of `parameter vectors` (indicators, research steps, companies) provided as JSON files or JSON Objects (`JSON_companies.js`)

b) for each `company` you

+ first create the `data collection spreadsheet` with `mainAllCompaniesDataCollectionSheets()`, which will be located in `rootFolderID/outputFolderName` of `@rdresearch`'s Drive.

  > The `fileID` of this new spreadsheet should then be added to `urlCurrentDataCollectionSheet` in the respective `JSON_companies.[<company>]` Object.

+ currently defunct: ~~to set step-wise editing `permissions` for the data collection sheet, run `mainPermissions()`~~

+ then create the `company scoring sheet` with `mainCreateScoringSheet()`.

  > ~~In the near future~~ Currently, all outputs are tracked in a `00_Test`.

Eventually, all control should be moved to a `Master Spreadsheet`.

---

### Code Conventions

([top ↥](#documentation))

#### Naming Conventions

+ `Objects` start with `C`apital letters
+ primitives / simpleVariables start with lower-case letters
+ Booleans are prefixed with a verb: `isBoolean`; `hasChildren`; etc.
+ functions() are explicit regarding action and scope: ~~createSingleSheet()~~ createStep() + createAllSteps()
+ **import**: in compliance with Google Apps Script syntax (Classes and methods), a Spreadsheet is a `Spreadsheet`, and a Tab / Sheet is a `Sheet`. This should be considered when naming variables and functions. It is encouraged to use `SS` as an abbreviation for a Spreadsheet Object
+ ...

---

### Main Modules

([top ↥](#documentation))

The basic structure is now modular, with

+ 1 Master controller `00_mainController.js` in `/*` (root)
+ all core modules being in `/src/*` and beginning with `1x` (DC), `2x` (SC), etc., and
+ most parameters stored in `/json/*` (companies, indicators, research steps, global Index parameters)

With the exception of the Input Spreadsheets Module, all core modules have been split into ...

+ a main high-level module controller (`x0`)
+ a module interface (`x1`)
+ lower-level helper submodules (`x2 - xN` )

... in order to improve Code readability and enable affordable maintenance.

After modules had been introduced and eventually refactored, most modules and methods operate on the same centrally defined set of parameters (the JSON files) and the same set of helper functions (i.e. defining named Ranges). Therefore, if you make changes to e.g. `researchSteps.step.component.labelShort` in `JSON_researchSteps.js` while working on `10_inputInterface.js`, you need to apply this structural change to all modules concerned (**incl. Helpers**)  as it might (or rather **will**) break e.g. `21_scoringInterface.js`.

---

**Modules**:

#### `00_`Main Controller

([top ↥](#documentation))

> `00_mainController` is the central Point of Entry to any activity.

Here you define only a few global variables such as the `Index prefix`, and the target output folder, or whether to use subsets, and then run the respective modules for creating sets of data collection (DC) spreadsheets or sets of company-level scoring (SC) spreadsheets from here.

Each main method call picks up the global parameters for using subsets of indicators or research steps. ~~Right now, these subsets are hardcoded in JSON files which are then assigned in `99_importJSON`.~~

To subset companies, currently you have to stick to `companies.slice(indexOfFirstCompany,indexOfWhereToStop)` in the respective caller.

---

#### `1_`: Input Sheets (Data Collection Spreadsheets)

([top ↥](#documentation))

+ `10_inputInterface.js` - core module for the creation of a single company-level data collection spreadsheet
+ `11_dataCollectionComponents.js` - lower-level helper functions for the data collection production

Extensive documentation was created by G.W. ([GDoc](https://docs.google.com/document/d/1972r43uMNTdPMm3xFhtmOvHN3f8S8P1XEzwzju3soCo/edit)). Due to exhaustive refactoring and restructuring it needs to be updated.

+ `12_inputPermissions.js` - future submodule for setting / removing step-wise permission for `data collection spreadsheets` - **currently not operational**

+ currently, step-wise for step: 1 & 1.5; step: 2; Protecting works; un-protecting / assigning editors de-facto not effective with external users (due to missing scope permission). As we are currently using `rdresearch`, and all non-OTI accounts are external...

+ in theory, generic enough to be applied to any class of spreadsheets, if `named Ranges` utilise the `Steps` suffix.

---

#### `2_`: Company Scoring Spreadsheets

([top ↥](#documentation))

> TODO

+ `20_scoringMain.js` (TODO)
+ `21_scoringInterface.js` (can be called from `30_aggregationMain.js` & be integrated into `10_inputInterface.js`)
+ `22_scoringSingleStepProcess.js`(TODO)
+ `23_scoringSubcomponents.js`

> Best, add `DC fileID` to `<company>.json` before casting `SC`. This way SC will immediately be connected to DC.

---

#### `3_`: Aggregation - Summary Scores Spreadsheets

([top ↥](#documentation))

> TODO

+ `30_aggregationMain.js`
+ [...]

---

#### `4_`: Feedback Request Forms

([top ↥](#documentation))

> Process will slightly change for 2020; However, Input sheets need to anticipate feedback input based on blind ID

+ `40_feedbackMain.js`
[...]

---

#### `6_`: Data Store Layer

([top ↥](#documentation))

> TODO

- [ ] TODO: Split Results & Scoring in 2 separate entities (file vs. sheet)
- [ ] TODO: add triggered / webhook POST action to feed / update a DB (based on cell ID as unique ID / Key)

---

#### 7_: Input Spreadsheet Health / Repairs

([top ↥](#documentation))

> TODO

> **Important**: Two modes - 1 to just inspect health & 1 to do repairs. Repairs are enabled with `var doRepairs`. Therefore there are 2 main callers for now, `mainInspectInputSheets()` vs. `mainRepairInputSheets()`

---

### Helper Modules

([top ↥](#documentation))

> `9_`setOfHelpers

> TODO

+ default Sheets
+ importJSON
+ scoringFormula
+ rangeNaming
+ cellFormatting
+ fileNaming
+ importSpreadsheet
+ driveOperations
+ findItems
+ [...]

---

### JSON

([top ↥](#documentation))

> stored in the Git repository (./json)

+ research steps
+ indicators
+ companies
+ config (not operational yet)

#### Companies JSON

([top ↥](#documentation))

> preliminary: make sure that **service children are listed in order** of previous Index' listing (i.e. prepaid, postpaid, broadband)

+ **Guidelines**

  + **Baseline**: use 1-letter category `prefix` for companies and 2-letter `prefix`for services
  + **Authoritative**: [Dictionary](dictionary.md)
  + use a GUI JSON editor for validation of JSON syntax (i.e. VSCode + [JSON Editor](https://marketplace.visualstudio.com/items?itemName=nickdemayo.vscode-json-editor) `plugin`, or [JSON Editor Online](https://jsoneditoronline.org/))

![VSCode with JSON Editor Plugin](img/vscode_json_editor.jpg)
(*Screenshot: VSCode with JSON Editor Plugin: JSON file is opened on the left, the GUI editor on the right.*)

---

#### Config JSON

([top ↥](#documentation))

> defines Index, methodology / sets, companies, folders, and maybe maps editors to companies (should be done from central spreadsheet for convenience for research team)

---

#### indicators

+ `JSON_indicators.js`

---

#### Research Steps

+ `JSON_researchSteps.js`

---

## Environment & Recommended Setup

### Environment: Google Apps Script / Apps API

([top ↥](#documentation))

+ weird mix of JS 1.6 - 1.8 (ES4-ES6)
+ we added some core ES6 methods via manual but official polyfill (`Array.find()`, `Object.entries()`)

*Motivational* quote:

> "The GAS is not a precise version of JavaScript. It supports many features of JavaScript 1.8.5 like Object.keys, Object.isExtensible, etc. but on the other hand it does not support the keywords yield and let introduced in JavaScript 1.7. Another features which the GAS supports are the native JSON class and String.trim function introduced in JavaScript 1.8.1. Also the GAS supports the E4X extension.
>
>The GAS documentation is not complete now and many features are discoverable **experimentally**." [Source](https://stackoverflow.com/a/12280297)

+ [Documentation GAS](https://developers.google.com/apps-script)
+ [GAS Best practices](https://developers.google.com/apps-script/guides/support/best-practices)
+ [SO/google-apps-script](https://stackoverflow.com/questions/tagged/google-apps-script)
+ [SO/corey-g](https://stackoverflow.com/users/1491380/corey-g) (former GAS engineer)

---

### Environment: Clasp & IDE

([top ↥](#documentation))

![VSCode with tripartite window split](img/vscode_setup.jpg)
(*Screenshot: VSCode with tripartite Layout: `01_dataCollection.js` on the left; `99_importJSON.js` helper module on the top right; `00_mainController.js` on the bottom right. Terminal with `clasp push` on the bottom.*)

> Use VSCode. For your own sake.

+ npm clasp
+ npm types/@google-apps-script
+ .claspignore
+ .gitignore
+ typescript.json
+ switching of accounts

---

### Setup

> TODO

+ [/docs/SETUP.md](/docs/setup.md)

## FAQ

([top ↥](#documentation))

> Q: Can we...?\
> A: Njet.

+ general source for GAS discussions:

---

## Issues

([top ↥](#documentation))

+ Permissions https://stackoverflow.com/questions/10796464/transfer-ownership-of-a-file-to-another-user-in-google-apps-script

---

### Learnings

([top ↥](#documentation))

+ if you update existing files, named ranges are not removed by sheet.clear()
+ max. runtime is 30 minutes / 1800 seconds. If your script breaks due to runtime error, you can see the log (Ctrl+Enter in the online editor) to see which company was processed last, delete the output for this company, and re-run the script with a subset, starting with the unfinished company.
+ also, you can run multiple scripts in parallel… For this, `slice(1,4)` the companies vector in multiple parts in `00_mainController.js`

---

### To be explored

([top ↥](#documentation))

+ Collaboration:

    "If you are working on a script project with other developers, you can collaborate on Apps Script projects with shared drives. Files in a shared drive are owned by the group, rather than individuals. This makes development and maintenance of the project easier." [GAS Best practices](https://developers.google.com/apps-script/guides/support/best-practices#consider_collaborating_with_shared_drives)

+ Refactoring:

  + start with VSCode [refactoring](https://code.visualstudio.com/docs/editor/refactoring)
  + see [array vs cell-based operations](https://stackoverflow.com/questions/35289183/long-processing-time-likely-due-to-getvalue-and-cell-inserts)
  + [arrays in GAS in general](https://stackoverflow.com/questions/49020131/how-much-faster-are-arrays-than-accessing-google-sheets-cells-within-google-scri)
