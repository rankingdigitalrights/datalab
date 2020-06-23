# Documentation

> -> Go back to [README](../README.md)\
> -> Jump to [JSON Dictionary](dictionary.md)\
> -> List of [QC Steps](QC.md)
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

+ the **development** environment
  + **collaboration & version control**: source code shared on `git`, edited locally with an IDE
  + `clasp` for **deploying** to Google Apps Script,
+ the **parameters & configuration**: `JSON` files for Indicators, Companies, Research Steps, and global Index settings
+ the **execution** / **runtime** environment (Google Apps Script online editor),
+ the **output** environment (Google Drive), and
+ the **UI/frontend** (*currently* Google Spreadsheets).

---

## Application Overview

([top ↥](#documentation))

The basic structure is now modular, with

+ 1 Master controller `00_mainController.js` in `/*` (root)
+ all core modules being in `/src/*` and beginning with `1x` (DC), `2x` (SC), etc., and
+ most parameters stored in `/json/*` (companies, indicators, research steps, global Index parameters)

With the exception of the Input Spreadsheets Module, all core modules have been split into ...

+ a main high-level module controller (`x0`)
+ a module interface (`x1`)
+ lower-level helper submodules (`x2 - xN` )

... in order to a single execution interface, to improve Code readability and re-use, and to enable affordable maintenance.

After modules had been introduced and eventually refactored, most modules and methods operate on the same centrally defined set of parameters (the JSON files) and the same set of helper functions (i.e. defining named Ranges). Therefore, if you make changes to e.g. `researchSteps.step.component.labelShort` in `JSON_researchSteps.js` while working on `10_inputInterface.js`, you need to apply this structural change to all modules concerned (**incl. Helpers**) as it might impact e.g. `21_scoringInterface.js`.

---

## Detailed Code / Module Documentation

> due to grown code base and application complexity the technical documentation is now in standalone chapters:

### High-level documentation

+ [00 - Environments](application/00-environment.md)
+ [01 - Architecture](application/01-architecture.md)
+ [02 - Local Setup](application/02-setup.md)
+ [03 - Developer Guidance & Conventions](application/03-guidance-conventions.md)
+ [04 - Maintenance & Repairs](application/04-maintenance.md)

+ ...

### Modules Documentation

> Links to Submodules are in the Main Module chapters

+ [10 - Input Sheets](application/10-input-sheets-main.md)
+ [20 - TBD - Scoring Sheets](application/20-scoring-sheets-main.md)
+ [30 - TBD - Summary Scores / Aggregation](#)
+ [40 - TBD - Company Feedback](#)
+ [50 - TBD - Permissions](#)
+ [60 - TBD - Data Store](application/60-data-store-main.md)
+ [70 - Input Health](application/70-input-health.md)
+ [9x - TBD - Helper Modules Overview](application/90-helper-function.md)

**Helper Modules**

+ [9x - TBD - Helper Modules Overview](application/90-helper-function.md)

---

## JSON: Parameters & Config

([top ↥](#documentation))

> stored in the Git repository as JSON/JS Objects (./json/JSON*.js)

+ research steps
+ indicators
+ companies
+ config (not operational yet)

### Companies JSON

([top ↥](#documentation))

> preliminary: make sure that **service children are listed in order** of previous Index' listing (i.e. prepaid, postpaid, broadband)

+ **Guidelines**

  + **Baseline**: use 1-letter category `prefix` for companies and 2-letter `prefix`for services
  + **Authoritative**: [Dictionary](dictionary.md)
  + use a GUI JSON editor for validation of JSON syntax (i.e. VSCode + [JSON Editor](https://marketplace.visualstudio.com/items?itemName=nickdemayo.vscode-json-editor) `plugin`, or [JSON Editor Online](https://jsoneditoronline.org/))

![VSCode with JSON Editor Plugin](img/vscode_json_editor.jpg)
(*Screenshot: VSCode with JSON Editor Plugin: JSON file is opened on the left, the GUI editor on the right.*)

---

### Config JSON

([top ↥](#documentation))

> defines Index, methodology / sets, companies, folders, and maybe maps editors to companies (should be done from central spreadsheet for convenience for research team)

---

### indicators

+ `JSON_indicators.js`

---

### Research Steps

+ `JSON_researchSteps.js`

---

## Environment & Recommended Setup

### Environment: Google Apps Script / Apps API

([top ↥](#documentation))


+ ~~weird mix of JS 1.6 - 1.8 (ES4-ES6)~~
+ ~~we added some core ES6 methods via manual but official polyfill (`Array.find()`, `Object.entries()`)~~
+ TODO: with the **upgrade** in April 2020 to ES6 we should now have all Array and Object methods and should deprecate `Polyfills`

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

## FAQ

([top ↥](#documentation))

> Q: Can we...?\
> A: Njet.

---

### Learnings

([top ↥](#documentation))

+ if you update existing files, named ranges are not removed by sheet.clear()
+ max. runtime is 30 minutes / 1800 seconds. If your script breaks due to runtime error, you can see the log (Ctrl+Enter in the online editor) to see which company was processed last, delete the output for this company, and re-run the script with a subset, starting with the unfinished company.
+ also, you can run multiple scripts in parallel… For this, `slice(1,4)` the companies vector in multiple parts in `00_mainController.js`
+ file name ambiguity --> use fileID where possible
+ only owner can delete files for real
+ ...

---

### To be explored

([top ↥](#documentation))

+ Collaboration:

    "If you are working on a script project with other developers, you can collaborate on Apps Script projects with shared drives. Files in a shared drive are owned by the group, rather than individuals. This makes development and maintenance of the project easier." [GAS Best practices](https://developers.google.com/apps-script/guides/support/best-practices#consider_collaborating_with_shared_drives)

+ Refactoring:

  + start with VSCode [refactoring](https://code.visualstudio.com/docs/editor/refactoring)
  + see [array vs cell-based operations](https://stackoverflow.com/questions/35289183/long-processing-time-likely-due-to-getvalue-and-cell-inserts)
  + [arrays in GAS in general](https://stackoverflow.com/questions/49020131/how-much-faster-are-arrays-than-accessing-google-sheets-cells-within-google-scri)
