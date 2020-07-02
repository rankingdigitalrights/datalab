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
+ [50 - TBD - Permissions](50_permissions-main.md)
+ [60 - TBD - Data Store](60-data-store-main.md)
+ [9x - TBD - Helper Modules Overview](90-helper-function.md)

---

## Description

> Module Purpose: apply and remove permissions to entire sheets or individual steps as needed

+ main Module Callers: 
    + `00_mainController.js::mainProtectCompanies()`
    + `00_mainController.js::mainUnProtectCompanies()`
    + `00_mainController.js::mainOpenStepCompanies()`
+ main Module Interfaces: 
    + `51_permissionsMainOpenStep.js::mainProtectSingleCompany(Company)`
    + `50_permissionsMainUnprotect.js::mainUnprotectSingleCompany(Company)`
    + `50_permissionsMainProtect.js::mainProtectFileOpenStepSingleCompany(Company)`


## Main Procedure main `00_mainController.js::mainProtectCompanies()`

+ for each company of `companies[]` / `companies[].slice()`
    + open a Spreadsheet `<Index> - <Company> - <Mode: Input>`
    + remove all sheet and range protections
    + protect `Outcome` & `Sources` Sheets
    + for each `Indicator` in `Indicators[]`
        + add a sheet protection
        + unprotect Front Matter (Indicator Guidance) and Step 0 (previous Year's Step 7 outcome)


## Main Procedure main `00_mainController.js::mainUnprotectSingleCompany()`

+ for each company of `companies[]` / `companies[].slice()`
    + open a Spreadsheet `<Index> - <Company> - <Mode: Input>`
    + remove all sheet and range protections


## Main Procedure main `00_mainController.js::mainProtectFileOpenStepSingleCompany()`

+ for each company of `companies[]` / `companies[].slice()`
    + open a Spreadsheet `<Index> - <Company> - <Mode: Input>`
    + remove all sheet and range protections
    + protect `Outcome` & `Sources` Sheets
    + for each `Indicator` in `Indicators[]`
        + add a sheet protection
        + unprotect Front Matter (Indicator Guidance) and Step 0 (previous Year's Step 7 outcome)
        + for each `substep` in `step`
            + unprotect substep

