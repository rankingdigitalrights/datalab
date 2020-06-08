# Layer 1 - Modules: Input Sheets

> Last update: 2020-06-01

## Documentation TOC

+ [00 - Environments](00-environment.md)
+ [01 - Architecture](01-architecture.md)
+ [02 - Local Setup](02-setup.md)
+ [03 - Developer Guidance & Conventions](03-guidance-conventions.md)
+ ...
+ [10 - Input Sheets](10-input-sheets-main.md)
+ [20 - TBD - Scoring Sheets](20-scoring-sheets-main.md)
+ [30 - TBD - Summary Scores / Aggregation](#)
+ [40 - TBD - Company Feedback](#)
+ [50 - TBD - Permissions](#)
+ [60 - TBD - Data Store](60-data-store-main.md)
+ [9x - TBD - Helper Modules Overview](90-helper-function.md)

---

## Description

> Module Purpose: produces single Company Data Collection Spreadsheets (*Company Input Sheets*)

+ main Module Caller: `00_mainController.js::mainAllCompaniesDataCollectionSheets()`
+ main Module Interface: `10_inputInterface.js::createSpreadsheetInput(Company)`

## Main Procedure

+ for each company of `companies[]` / `companies[].slice()`
  + create a **single** Spreadsheet `<Index> - <Company> - <Mode: Input>`
  + insert `Sources` Sheet
  + (optional) insert `Outcome` & `Sources` Sheets from previous Index
  + for each `Indicator` in `Indicators[]`
    + insert `<Indicator>`-Sheet
    + add Front Matter (Indicator Guidance)
    + add Company Header
    + (optional) add Step 0 (previous Year's Step 7 outcome)
    + for each `<MainStep>` (i.e. `Step 1` & `SubStep` (i.e. `Step 1.5`) from `researchSteps.json`
      + add components from `SubStep.components[]`
      + set Named Ranges
      + apply formatting

+ Output files are located in `Config.rootFolderID/Config.outputFolderName` of `data@rdr`'s Drive.
+ The `fileID` of new spreadsheet should then be added as value of`<company>.urlCurrentDataCollectionSheet` in the respective `JSON_companies.[<company>]` Object.

## Parameters

> TBD

+ Config[]
+ Companies[]
+ Research Steps[]
+ Indicators[]
+ ...
+ Target Folder 

## Module Structure

+ `10_inputInterface.js`: Module Interface; run from `00_mainController`
  + `11_inputMainProcess.js`: Main Company-level procedure; iterates over `Indicators[]` and calls component-specific helper functions from lower-level submodules
    + `12_inputBaseHeaders.js`: Indicator/Sheet-level Front Matter (Guidance, Company header, researcher row)
    + `12_inputBaseModules.js`: Basic Substep Components (evaluation, comments, sources, binary review)
    + `12_inputStepFlow.js`: New Components to enable results import between steps (`if thisStep.result == prevStep.result` --> `import(prevStep)`)
    + `12_inputYonYimport.js`: imports previous year's outcome; adds automated year-on-year review
    + deprecated `13_old_inputPermissions.js` - old Step-wise permissions submodule. **--> Replaced with new Main Module `50_Permissions.js`**

## Submodule Documentation

> TBD
