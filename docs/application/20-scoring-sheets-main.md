> *old documentation chunk from main page

# `2_`: Company Scoring Spreadsheets

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

## Description

> Module Purpose: single Company Scoring Collection Spreadsheets (*Company Scoring Sheets*)

+ main Module Caller: `00_mainController.js::mainScoringSheets()`
+ main Module Caller: `00_mainController.js::createSpreadsheetOutput(Company)`


## Main Procedure

+ for each company of `companies[]` / `companies[].slice()`
    + create a **single** Spreadsheet `<Index> - <Company> - <Mode: Output>`
    + for each `Indicator` in `Indicators[]`
        + for each `Step` in `researchSteps[]`
            + create column header
            + for each `Indicator` in `Indicators[]`
                + create header row for `Indicator` and company services
                + for each `Component` in `Step`
                    + import label and results from input sheet
                    + add scoring row
    + apply formating


+ Output files are located in `Config.rootFolderID/Config.outputFolderName` of `data@rdr`'s Drive.
+ The `fileID` of new spreadsheet should then be added as value of`<company>.urlCurrentCompanyScoringSheet` in the respective `JSON_companies.[<company>]` Object.

## Parameters

> TBD

+ Config[]
+ Companies[]
+ Research Steps[]
+ Indicators[]
+ useStepsSubset
+ Target Folder 


## Module Structure

+ `20_scoringMain.js`: Main scoring process caller `00_mainController`
    + `21_scoringInterface.js`: Scoring Interface; iterating over `researchSteps[]` and calls helper functions from lower-level submodules
    + `22_scoringSingleStepProcess.js`: imports results for all indicators of a single step
    + `23_scoringSubcomponents.js`: helper functions called in `22_scoringSingleStepProcess.js`


## Submodule Documentation

+ `21_scoringInterface.js::addSetOfScoringSteps`
    + for each `Step` in `researchSteps[]`
        + call `22_scoringSingleStep::scoringSingleStep` to import results and format column
    + freeze first column

+ `22_scoringSingleStep::scoringSingleStep`
    + call `23_scoringSubcomponents.js::setScoringSheetHeader` to create header for `Step`
    + for each `IndicatorCategory` in `IndicatorCategories[]`
        + for each `Indicator` in `Indicators[]`
        +  call `23_scoringSubcomponents.js::setScoringCompanyHeader` to create header for `Indicator` and `Services[]`
        + for each `StepComponent` in `StepComponents[]`
            + call `23_scoringSubcomponents.js::importElementBlock` or `23_scoringSubcomponents.js::importElementRow` to import results from `InputSheet`
        + add scoring
        + apply formating

+ `23_scoringSubcomponents.js::setScoringSheetHeader`
    + if `block`== 1
        + create header for `Company`
        + apply formating
    + create header for `Step`

+ `23_scoringSubcomponents.js::setScoringCompanyHeader`
    + if `block`== 1
        + create header for `Indicator`
        + apply formating
    + for each `Service` in `Services[]`
        + add subheader
        + apply formating

