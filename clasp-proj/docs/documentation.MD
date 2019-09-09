# Documentation

> (Go back to [README](../README.MD))
> [JSON Dictionary](dictionary.MD)
## TOC

+ [Intro](#intro)
+ [Architecture / Ecosystem](#)
    + [Main Modules](#)
    + [Helper Modules](#)
    + [JSON](#)
+ [Environment & Recommended Setup]()
+ [Google Apps Script / Apps API]()
+ [Clasp & IDE]()
+ FAQ
+ Issues

## Intro

> Following the initial development of the data collection spreadsheets by G.W. and I.S., the whole project has been extended and fundamentally restructured and refactored. There's still a lot of clean-up and refactoring tbd, but so far, the core modules and features are maintainable, naming of the ranges is centralised, the project can output to specific folders (within allowed scope) and so on.

To provide contributers with a cognitive model of this project, it is helpful to distinguish between the development environment (the source code stored on `git`, edited locally with an editor, `clasp` for syncing with Google), the execution / runtime environment (Google Apps Script online editor), and the output environment (Google Drive). Currently, the `JSON` files build the fourth component as they are stored on a stage server. This has to be changed yet.

## Architecture / Ecosystem

The core idea is that,
    
a) based on a set of `parameters` (indicators, research steps, companies) **currently** provided as JSON files

b) for each `company` you 

c) first create the `data collection spreadsheet` with `mainCreateDataCollectionSheet()`, which will be located in `parentFolderID/folderName` of `@rdresearch`'s Drive.

> The `fileID` of this new spreadsheet should then be added to `urlCurrentDataCollectionSheet` in the respective `<company>.json` / `companies.company.urlCurrentDataCollectionSheet`.

d) to set step-wise editing `permissions` for the data collection sheet, run `mainPermissions()`.

e) you create the `company scoring sheet` with `mainCreateScoringSheet()`.

In the near future, all outputs should be tracked in a `Master Spreadsheet`.

Eventually, all control should be moved to a `Master Spreadsheet`.

### Main Modules

The basic structure is now modular, with core modules starting with `0x`.

As modules were created and eventually refactored and synchronised, most modules and methods operate on the same set of parameters. Therefore, if you make changes to e.g. `researchSteps.step.component.labelShort` while working on `01_dataCollection.js`, you need to apply this structural change to all modules concerned (**incl. Helpers**)  as it make brake e.g. `03_scoring.js`.

**Modules**:

+ Main Controller
  
  > `00_mainController` - supposed to be the central touchpoint for any activity.

  Here you define the `company`, the `Index prefix`, and the target output folder, and then config and run the respective modules for creating data collection (DC) spreadsheets or the company-level scoring (SC) spreadsheets from the main controller. The third module is setting permissions for the data collection sheets.

  Each main method call has parameter for using subsets of indicators or subsets of research steps. Right now, these subsets are hardcoded in JSON files which are assigned in `99_importJSON`

+ Data Collection Spreadsheets

  > `01_dataCollection` - core module for the creation of a single company-level data collection spreadsheet

  Extensive documentation was created by G.W. ([GDoc](https://docs.google.com/document/d/1972r43uMNTdPMm3xFhtmOvHN3f8S8P1XEzwzju3soCo/edit)). Due to exhaustive refactoring and restucturing it probably needs to be updated.

  > `02_permissions.js` - core module for setting / removing step-wise permission for `data collection spreadheets`

  + currently, step-wise for step: 1 & 1.5; step: 2; Protecting works; unprotecting / assigning editors de-facto not effective with external users (due to missing scope permission). Aas we are currently using `rdresearch`, alol non-OTI accounts are external...
  + in theory, generic enough to be applied to any class of spreadsheets, if `named Ranges` utilise the `Steps` suffix.

+ Company Scoring Spreadsheets

  > `03_scoring.js` (TBD)

  > Best, add `DC fileID` to `<company>.json` before casting `SC`

### Helper Modules

+ importJSON
+ scoringFormula
+ rangeNaming
+ cellFormatting
+ fileNaming
+ importSpreadsheet
+ driveOperations
+ findItems

### JSON

+ Git --> Drive

  + research steps
  + indicators
  + companies
  + config (not operational yet)

+ Git-only

  + `00_vectors.js` & `var = companiesObj {}`
  + tbd: `ssh` into `git`

#### Research Steps

+ subsets

#### Indicators

+ subsets

#### Companies JSON

> perliminary: make sure that **services are listed in order** of previous Index' listing (i.e. prepaid, postpaid, broadband)

+ **Guidelines**

  + use 1-letter category `prefix` for companies and 2-letter `prefix`for services
  + **Authorative**: [Dictionary](dictionary.MD)
  + use a GUI JSON editor for validation of JSON syntax (i.e. VSCode + [JSON Editor](https://marketplace.visualstudio.com/items?itemName=nickdemayo.vscode-json-editor) `plugin`, or [JSON Editor Online](https://jsoneditoronline.org/))

#### Config

> should define Index, methodology / sets, companies, folders, maybe map editors to companies


<hr/>

## Environment & Recommended Setup

### Google Apps Script / Apps API

+ weired mix of JS 1.6 - 1.8 (ES4-ES6)
+ we added some core ES6 menthods via manual but offical polyfill (`Array.find()`, `Object.entries()`)

*Motivational* quote: 

> "The GAS is not a precise version of JavaScript. It supports many features of JavaScript 1.8.5 like Object.keys, Object.isExtensible, etc. but on the other hand it does not support the keywords yield and let introduced in JavaScript 1.7. Another features which the GAS supports are the native JSON class and String.trim function introduced in JavaScript 1.8.1. Also the GAS supports the E4X extension.
>
>The GAS documentation is not complete now and many features are discoverable **experimentally**." [Source](https://stackoverflow.com/a/12280297)

+ [Documentation GAS](https://developers.google.com/apps-script)
+ [GAS Best practices](https://developers.google.com/apps-script/guides/support/best-practices)
+ [SO/google-apps-script](https://stackoverflow.com/questions/tagged/google-apps-script)
+ [SO/corey-g](https://stackoverflow.com/users/1491380/corey-g) (former GAS engineer)

### Clasp & IDE

+ npm clasp
+ npm types/gas
+ .claspignore
+ .gitignore
+ typescript.json
+ switching of accounts

## FAQ

> Q: Can we...?\
> A: Njet.

+ general source for GAS discussions: 

## Issues

+ Permissions https://stackoverflow.com/questions/10796464/transfer-ownership-of-a-file-to-another-user-in-google-apps-script

### Learnings

### To be explored

+ Collaboration:

    "If you are working on a script project with other developers, you can collaborate on Apps Script projects with shared drives. Files in a shared drive are owned by the group, rather than individuals. This makes development and maintenance of the project easier." [GAS Best practices](https://developers.google.com/apps-script/guides/support/best-practices#consider_collaborating_with_shared_drives)

+ Refactoring:

  + start with VSCode [refactoring](https://code.visualstudio.com/docs/editor/refactoring)
  + see array vs cell-based operations https://stackoverflow.com/questions/35289183/long-processing-time-likely-due-to-getvalue-and-cell-inserts
  + array in general https://stackoverflow.com/questions/49020131/how-much-faster-are-arrays-than-accessing-google-sheets-cells-within-google-scri
