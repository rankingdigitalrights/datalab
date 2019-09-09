# RDR Spreadsheet Engineering

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

> Brace yourself: [Why software projects take longer than you think – a statistical model](https://erikbern.com/2019/04/15/why-software-projects-take-longer-than-you-think-a-statistical-model.html)

## TOC

+ [Intro](#intro)
+ [Quick Start](#quick-start)
+ [Changelog](#changelog)
+ [Documentation](#documentation)

## Intro

This is the project folder for RDR's spreadsheet development.

The current scope of the Spreadsheet development is to automate the generating ("castiong") of spreadsheets for company-level data collection (DC) and for scoring (SC) with as few manual effort as possible.

The environment utilises [Google Apps Script](https://developers.google.com/apps-script/) (short: GAS]) (which is mostly a JavaScript flavour with G-Suite specific classes and methods), and the respective [Google Apps Script API](https://www.google.com/script/start/). Code is excecuted through the [browser](https://script.google.com/home/my) and runs online on Google's servers.

While you can edit and maintain the code in Google's web editor, this is strongly discouraged. To enable proper versioning, [SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth), code-sharing and collaboration, and so on, it is recommend **to use Git, [`clasp`](https://github.com/google/clasp), and an IDE** of choice (i.e. VSCode for easier interaction with NodeJS/npm). This enables you to edit code locally with a proper development environment, store your code in a git* repository, and push/pull the code to GAS to execute online.

> **TL;DR:**
 + define in JSONs
 + develop locally
 + execute & operate online

Following the initial proof-of-concept with G.W., the `project` has been migrated to the `rdresearch` G-Suite account. In theory, you can share projects with other accounts in the same manner as you share any Google file. However, executing the code with any other account than `rdresearch` is not authorised currently (leads to error: `admin_policy_enforced`; probable scope: `https://www.googleapis.com/auth/script.external_request`)

> Conventions: Google Apps Script uses `*.gs` as the filetype, while regular Javascript uses `.js`. We can (*should*) stick to `.js` and ignore implications as clasp auto-converts between file types.

## Quick Start

> IMPORTANT: Keep in mind that the source code is stored in git. Any code changes you make in the online editor won't be fed back into git, unless you use `clasp pull` in your IDE or copy/paste code from your browser into git. If you `push` \ `pull` all targets' files will be overwritten

1. log-in as `rdresearch`
2. open [My Projects](https://script.google.com/home/my) to get an overview of your GAS projects or go directly to the [`Spreadsheet Automation` project](https://script.google.com/a/opentechinstitute.org/d/1ZrUTGLLDXMZxkDB8BRaBpPb-p4ObTJrKI8FfJUN6cL10Iggc0TTalSC5)
3. `00_mainController.gs` should open automatically. If not, open this script. This is the **main interface** to config and run all modules.
4. edit `companyShortName` in alignment to the according `<company>.json` (see the [JSON folder](/json/))
5. double-check `folderName` if you need a specfic folder for your outputs (folder will be a subfolder of `2019 Back-end testing` owned by `rdresearch`; if you want to change the parent folder, you need to replace the folder **id**  of `parentFolderID`)
6. edit the `main<Function>()` caller of the module you want to run (i.e. define whether you want to run only a subset of research steps)
7. in the submenu (grey), choose the function to run, and click play. 
8. wait for the script to finish. Optionally, hit `Ctrl + Enter` to see the log.
9. open the output folder in Google Drive (should be under `My Drive`) and inspect the output

> If you created new data collection or scoring Spreadsheets, and you intend to continue working with them, make sure to update the file IDs in the respective company `JSON` files, i.e. `urlCurrentDataCollectionSheet` or `urlCurrentCompanyScoringSheet`. Otherwise, you will have to update `IMPORTRANGE=ID` by hand.

> If you run into runtime issues (e.g. endless loop), you can inspect and interrupt current executions under [My Executions](https://script.google.com/u/3/home/executions)

<hr/>

### Changelog

> Keep track of new developments here, document your progress, also explicitly indicate breaking changes

**Current dev goal**: replicate a subset of 2019 DC & SC to identify shortcomings

2019 September

+ ...
+ introduced `FeatureRequest` and `bugs` as GitHub Issues (for easier tracking, assigning and elaborating)
+ migrated project to rdresearch
+ implemented `importLocalJSON()` to import JSONs from Google Drive. TODO: needs reliable mechanism for synching JSONs with git [unless we move JSON SSOT to Google Drive which is ok])
+ added output to specific folder functionality

2019 August

+ added permission changes module
+ refactored scoring and data collection modules into rough single units of responsiblity
+ refactored generic tasks (e.g. importJSONxxx(), nameRange(comp,step,ind)) into helper modules
+ added scoring sheet module
+ enabled NodeJS/clasp + GAS API integration, and full integration with git

2019 July

+ initial groundbreaking work by tech intern G.W. based on initiative requirements from L.G. and prototype architecture from I.S.
+ G.W. created and completed the basic data collection module (99% of the core features), explored the core scoring sheet patterns (i.e. the collection of named ranges for indicator scoring), and created a thorugh documentation of the data collection module

### Documentation

> To keep things readable, the documention is kept and maintained in a dedicated document.

+ [**Documentation**](docs/documentation.MD)

https://github.com/rankingdigitalrights/datalab/blob/master/clasp-proj/docs/documentation.MD