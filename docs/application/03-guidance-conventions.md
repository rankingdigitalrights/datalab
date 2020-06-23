# Developer Guidance & Conventions

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

> The **guiding principle** for module development: All main modules are run from `00_mainController.js`. That means that you shouldn't have to modify module-level code (i.e. un/commenting code blocks) if you want to run a main module with optional parameters or parameter subsets. Instead, add booleans to the main module caller and let modules evaluate if options apply.

## Developer Guidance

+ **Rule #1: never develop in master branch**. Always use a dedicated feature development branch forked from `development`. Never directly merge into master. **Always** use pull requests and let someone else on the team review the request. **Never** touch `-freeze` branches unless you know what you are doing.
+ Google Apps Script uses `*.gs` as the filetype, while regular Javascript uses `.js`. We can (*should*) stick to `.js`(or `.ts` for TypeScript) and ignore implications as clasp auto-converts between file types.
+ **IMPORTANT**: Keep in mind that the source code is stored in git. Any code changes you make in the online editor won't be fed back into git, unless you use `clasp pull` from your IDE (**danger!!!**) or copy/paste code from your browser into git. If you `push` \ `pull`, **all target folder's files will be overwritten**.

## Conventions

### Code Conventions

+ we now have ES6 / v8 Javascript Engine (cf. [v8 runtime](https://www.labnol.org/es6-google-apps-script-v8-200206); [Google's overview](https://developers.google.com/apps-script/guides/v8-runtime); [good ES6 Intro](https://medium.com/better-programming/modern-javascript-techniques-cf2084236af4) )
  + use `let` and `const` where possible
  + try to avoid `var` unless you really want global scope
+ use ternary operator `condition ? true : false` for simple `if-else` blocks
+ ...

### Naming Conventions

+ primitives / simpleVariables start with lower-case letters
+ `Objects` start with `C`apital letters
+ Booleans are prefixed with a verb: `isBoolean`; `hasChildren`; etc.
+ functions() are explicit regarding action and scope: ~~createSingleSheet()~~ addStep() + protectAllSteps()
+ **important**: in compliance with Google Apps Script API syntax (Classes and methods), a Spreadsheet is a `Spreadsheet`, and a Tab / Sheet is a `Sheet`. This should be considered when naming variables and functions. It is encouraged to use `SS` as an abbreviation for a Spreadsheet Object, and `Sheet` for a single Sheet Object, ..., `Range`, `Cell`, and so on
+ ...

### Working with Spreadsheets

+ as soon as input spreadsheets have been produced, grab their IDs from `00-Dashboard` and add them as `currentInputSheetUrl` to the `json/JSON_companies.js`
+ from here on, **all other modules** should work with the `ID` and not the file name to increase reliability
  + if `ID` has not been implemented in other modules yet, please do so
  + if you develop new modules, add getSpreadsheet ``

---