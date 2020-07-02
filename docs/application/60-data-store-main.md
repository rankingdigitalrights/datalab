#### `6_`: Data Store Layer

> TODO

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
+ [50 - TBD - Permissions](50_permissions-main.md)
+ [60 - TBD - Data Store](60-data-store-main.md)
+ [70 - Input Health](70-input-health.md)
+ [9x - TBD - Helper Modules Overview](90-helper-function.md)

---

- [ ] TODO: Split Results & Scoring in 2 separate entities (file vs. sheet)
- [ ] TODO: add triggered / webhook POST action to feed / update a DB (based on cell ID as unique ID / Key)

## Description

> Module Purpose: produces single Company Spreadsheets that contain all data points from the Input Sheets

+ main Module Caller: `00_mainController.js::mainDataStore()()`
+ main Module Interface: `60_dataStorageLayer.js::createCompanyDataStore(Company)`

## Main Procedure

+ for each company of `companies[]` / `companies[].slice()`
  + create a **single** Spreadsheet `<Index> - <Company> - <Mode: Data Store>`
  + for each `<MainStep>` (i.e. `Step 1` & `SubStep` (i.e. `Step 1.5`) from `researchSteps.json`
    + for each `Indicator` in `Indicators[]`
        + import data points in substeps as blocks

+ Output files are located in `Config.rootFolderID/Config.outputFolderName` of `data@rdr`'s Drive.


## Parameters

TBD

## Module Structure

+ `60_dataStorageLayer.js`: Module Interface; run from `00_mainController`
    + `61_dataStorageInterface.js`: Main Company-level procedure; iterates over `<MainStep>` (i.e. `Step 1` & `SubStep` (i.e. `Step 1.5`) from `researchSteps.json` and calls importing helper functions from lower-level submodules
    + `62a_dataStorageSingleStepWide.js`: TBD (difference between wide and long)
    + `62b_dataStorageSingleStepLong.js`: TBD

