# Layer 1: High-level architecture

> Last update: 2020-06-01

> TODO: Insert TOC

## Core Concept

a) given a set of **global Parameters** (indicators, research steps, companies, Index config) provided as JSON files or JSON Objects (i.e. `json/JSON_companies.js`)

b) **main modules** perform tasks - vectorized over an array of `companies[]`

c) all **main modules** are **configured** and **executed** from a single **main application interface** `./00_mainController.js`

> The guiding principle for module development should be: you shouldn't have to edit module code if you need to toggle optional parameters or operate on parameter subsets.

## Main Module Callers

### Spreadsheet Production

+ `mainAllCompaniesDataCollectionSheets()`: produces single **Company Input** Spreadsheets
+ `mainPermissions()`: applies **Step-wise Permissions** for protected Input Spreadsheets
+ `mainCreateScoringSheet()`: produces single **Company Scoring** Spreadsheets
+ `mainDataStore()`: produces single **Company Data Store** Spreadsheets, that aggregate Company-level evaluation results and numeric scores in a machine-readable `tidy` table
+ `mainSummaryScores()`: produces **Summary Scores** Spreadsheets for a single Step

### Spreadsheet Monitoring & Maintance 

+ `mainInspectHealth()`: scans a single Company Input Sheet and return broken Named Ranges to `00_dashboard`
+ `mainRepairInputSheets()`: repairs broken named ranges, re-applies formatting, and updates labels, and evaluation options

> all File outputs are tracked in the `00_<IndexID>_Dashboard` Spreadsheet.

> Eventually, all control ~~should~~ could be moved to a `Master Dashboard` Spreadsheet
