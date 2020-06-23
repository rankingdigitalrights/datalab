# Module: Input Spreadsheet Health, Updating & Repairs

> Last update: 2020-06-01

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
+ [50 - TBD - Permissions](#)
+ [60 - TBD - Data Store](60-data-store-main.md)
+ [70 - Input Health](70-input-health.md)
+ [9x - TBD - Helper Modules Overview](90-helper-function.md)

---

> For instructions and documentation of the **Updating/Repairs process** see [](04-maintance.md)

> For the 2020 Index, the module itself has been reduced to mere `inspectHealth(Spreadsheet)` functionality. Goal was to get rid of the previously redundant code base (a modified copy of the full Input Spreadsheets Module). The repairment / updating functionality is now enabled by utilising the `Input Module` with flags `addNewStep`, & `doRepairOnly` and is called with `00-mainController.js/mainRepairInputSheets()`

+ This module lists all broken Named Ranges (`value.match("REF")`) in a Company Input Spreadsheet.
+ all broken ranges are appended to the `00-Dashboard/Broken-Input-Refs` Spreadsheet
+ The Spreadsheets are accessed by `fileID` from `Company.urlCurrentDataCollectionSheet`
+ ...
