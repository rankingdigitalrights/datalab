# Layer 1: High-level architecture

> Last update: 2020-06-03

---

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

## Concept

a) given a set of **global Parameters** (indicators, research steps, companies, Index config) provided as JSON Objects (i.e. `json/JSON_companies.js`)

b) **main modules** perform tasks - vectorized over an array of `companies[]`

c) all **main modules** are **configured** and **executed** from a single **main application interface** `./00_mainController.js`

d) file outputs are produced in specified folders & subfolders on Google Drive

## 00 - Main Controller

> `00_mainController` is the central Point of Entry to any activity.

+ has toggle to switch between production and development
+ global options (i.e. subset of research steps) are toggled here.
+ Main Controller imports parameter JSONs and exposes them to the main module callers.
+ most configuration is stored in `./json/config.json`
+ each main module has a `mainCaller()` method, which reads the global parameters and optional toggles, processes the Companies array (or a subset with `Companies.slice(from, to+1)` and calls the respective `module interface` for each Company of the array.

### Main Module Callers - Overview

#### Spreadsheet Production

+ `mainAllCompaniesDataCollectionSheets()`: produces single **Company Input** Spreadsheets - > [[Documentation]](modules/10-input-sheets-main.md)
+ `mainPermissions()`: applies **Step-wise Permissions** for protected Input Spreadsheets
+ `mainCreateScoringSheet()`: produces single **Company Scoring** Spreadsheets
+ `mainDataStore()`: produces single **Company Data Store** Spreadsheets, that aggregate Company-level evaluation results and numeric scores in a machine-readable `tidy` table
+ `mainSummaryScores()`: produces **Summary Scores** Spreadsheets for a single Step

#### Spreadsheet Monitoring & Maintance 

+ `mainInspectHealth()`: scans a single Company Input Sheet and return broken Named Ranges to `00_dashboard`
+ `mainRepairInputSheets()`: repairs broken named ranges, re-applies formatting, and updates labels, and evaluation options

> all File outputs are tracked in the `00_<IndexID>_Dashboard` Spreadsheet.

> Eventually, all control ~~should~~ could be moved to a `Master Dashboard` Spreadsheet
