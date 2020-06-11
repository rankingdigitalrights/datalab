# Layer 0: Maintenance

## Documentation TOC

+ [00 - Environments](00-environment.md)
+ [01 - Architecture](01-architecture.md)
+ [02 - Local Setup](02-setup.md)
+ [03 - Developer Guidance & Conventions](03-guidance-conventions.md)
+ [**04 - Maintenance & Repairs**](04-maintenance.md)
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

## Company Input Spreadsheets

For the 2020 Index, the functionality to repair / update / extend Input Spreadsheets has been redesigned. The Pilot's module has been deprecated. 

### Fixing & Updating 

Maintenance of NamedRanges, Labels, and Formatting is now enabled by the

+ `mainInspectInputSheets()` Caller & the `70_inspectSpreadsheets.js`Module (--> [Documentation](70-input-health.md)), and
+ `mainRepairInputSheets()` & the `doRepairsOnly` flags in the `10_inputInterface.js` Module and Submodules (--> [Documentation](10-input-sheets-main.md))

> **Important**: `mainRepairInputSheets()` has to be executed with `data@` if sheets are locked/protected

`mainRepairInputSheets()` calls `processInputSpreadsheet()` and therefore follows the same logic as the regular Input Spreadsheets process. Based on the `doRepairsOnly` flag, every subcomponent which usually would manipulate non-label Cells with `Cell.setValue(cellValue : string)` is skipped. Everything else is updated from scratch, incl. the re-assignment of Named Ranges.

> One exemption to `.setValue()` are subcomponents which do not require user input (such as the automated year-on-year comparison).\n\nIn theory, the logic could be extended to also update N/A-hardcoded cells, since these are more or less guaranteed to be correct.

After `processInputSpreadsheet()` has succefully finished updating the File, `processCompanyHealth()` is run to verify that no ranges are broken anymore.

### Extending / adding new steps

+ similar logic like updating
+ utilises the 'addNewStep' flag in combination with `startAtMainStepNr` and `Config.subsetMaxStep: MainStepNr`
+ `mainInputSheets()` calls the regular Input Sheets routine, but skips previous Main Steps < `startAtMainStepNr`
+ process then fetches `IndicatorSheet.getLastRow()` and adds `n` Main Steps defined by `[startAtMainStepNr, Config.subsetMaxStep]`

> In theory, this Logic can also be used to update only specific main steps. I.e. combined with `filterSingleIndicator(indicatorsVector, "G2")` one could update only F1, Step 2 for all companies.\n\n
> **Important**: `mainRepairInputSheets()` has to be executed with `data@` if sheets are locked/protected
