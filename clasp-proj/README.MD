# RDR Spreadsheet Engineering

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

> Brace yourself: [Why software projects take longer than you think – a statistical model](https://erikbern.com/2019/04/15/why-software-projects-take-longer-than-you-think-a-statistical-model.html)

## TOC

+ [Intro](#intro)
+ [Quick Start](#quick-start)
+ [Intro](#intro)

## Intro

This is the project folder for RDR's spreadsheet development.

The current scope of the Spreadsheet development is to automate the generating ("castiong") of spreadsheets for company-level data collection (DC) and for scoring (SC) with as few manual effort as possible.

The environment utilises [Google Apps Script](https://developers.google.com/apps-script/) (short: GAS]) (which is mostly a JavaScript flavour with G-Suite specific classes and methods), and the respective [Google Apps Script API](https://www.google.com/script/start/). Code is excecuted through the [browser](https://script.google.com/home/my) and runs online on Google's servers.

While you can edit and maintain the code in Google's web editor, this is strongly discouraged. To enable proper versioning, [SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth), code-sharing and collaboration, and so on, it is recommend **to use Git, [`clasp`](https://github.com/google/clasp), and an IDE** of choice (i.e. VSCode for easier interaction with NodeJS/npm). This enables you to edit code locally with a proper development environment, store your code in a git* repository, and push/pull the code to GAS to execute online.

Following the proof-of-concept, the `project` has been migrated to the `rdresearch` G-Suite account. In theory, you can share projects with other accounts in the same manner as you share any Google file. However, executing the code with any other account than `rdresearch` is not authorised currently (leads to error: `admin_policy_enforced`; probable scope: https://www.googleapis.com/auth/script.external_request)

> Conventions: Google Apps Script uses `*.gs` as the filetype, while regular Javascript uses `.js`. This can be simpaly ignored as clasp auto-converts the file type.

## Quick Start

> IMPORTANT: Keep in mind that the source code is stored in git. Any code changes you make in the online editor won't be fed back into git, unless you use `clasp pull` in your IDE or copy/paste code from your browser into git.

1. Log-in as `rdresearch`
2. Open [My Projects](https://script.google.com/home/my) to get an overview of your GAS projects or go directly to the [`Spreadsheet Automation` project](https://script.google.com/a/opentechinstitute.org/d/1ZrUTGLLDXMZxkDB8BRaBpPb-p4ObTJrKI8FfJUN6cL10Iggc0TTalSC5)
3. `00_mainController.gs` should open automatically. If not, open this script. This is the **main interface** to config and run all modules.
4. Edit `companyShortName` in alignment to the according `<company>.json` (see the [JSON folder](/json/))
5. Double-check `folderName` if you need a specfic folder for your outputs (folder will be a subfolder of `2019 Back-end testing` owned by `rdresearch`; if you want to change the parent folder, you need to replace the folder **id**  of `parentFolderID`)
6. Edit the `main<Function>()` caller of the module you want to run (i.e. define whether you want to run only a subset of research steps)
7. in the submenu (grey), choose the function to run, and click play. 
8. wait for the script to finish. Optionally, hit `Ctrl + Enter` to see the log.
9. Open the output folder in Google Drive (should be under `My Drive`) and inspect the output

> If you created new data collection or scoring Spreadsheets, and you intend to continue working with them, make sure to update the file IDs in the respective company `JSON` files, i.e. `urlCurrentDataCollectionSheet` or `urlCurrentCompanyScoringSheet`. Otherwise, you will have to update `IMPORTRANGE=ID` by hand.

> If you run into runtime issues (e.g. endless loop), you can inspect and interrupt current executions under [My Executions](https://script.google.com/u/3/home/executions)

<hr/>

## Documentation

> Following the initial development of the data collection spreadsheets by G.W. and I.S., the whole project has been extended and fundamentally restructured and refactored. There's still a lot of clean-up and refactoring tbd, but so far, the core modules and features are maintainable, naming of the ranges is centralised, the project can output to specific folders (within allowed scope) and so on.

To provide contributers with a cognitive model of this project, it is helpful to distinguish between the development environment (the source code stored on `git`, edited locally with an editor, `clasp` for syncing with Google), the execution / runtime environment (Google Apps Script online editor), and the output environment (Google Drive). Currently, the `JSON` files build the fourth component as they are stored on a stage server. This has to be changed yet.

### Change-Log

> Keep track of new developments here, document your progress, also explicitly indicate breaking changes

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

### Architecture / Ecosystem

The core idea is that based on a set of parameters (indicators, research steps, companies) **currently** provided as JSON files, for each company you first create the data collection spreadsheet with `mainCreateDataCollectionSheet`, which is generated in `parentFolderID/folderName` of `rdresearch`.

The file ID of this new spreadsheet should then be added to the respective `<company>.json` 

### Main Modules

The basic structure is now modular, with core modules starting with `0x`. 

+ Main Controller
    
    > `00_mainController` - supposed to be the central touchpoint for any activity.

    Here you define the `company`, the `Index prefix`, and the target output folder, and then config and run the respective modules for creating data collection (DC) spreadsheets or the company-level scoring (SC) spreadsheets from the main controller. The third module is setting permissions for the data collection sheets.

    Each main method call has parameter for using subsets of indicators or subsets of research steps. Right now, these subsets are hardcoded in JSON files which are assigned in `99_importJSON`

+ Data Collection Spreadsheets

    > `01_dataCollection` - core module for the creation of a single company-level data collection spreadsheet

    Extensive documentation was created by G.W. [Google Doc](https://docs.google.com/document/d/1972r43uMNTdPMm3xFhtmOvHN3f8S8P1XEzwzju3soCo/edit). Due to refactoring and restucturing it probably needs to be updated.

+ Company Scoring Spreadsheets

    >


+ Permissions

### Helper Modules

+ importJSON
+ scoringFormula
+ cellFormatting
+ fileName

### JSON

+ research steps
+ indicators
+ companies
+ config (not operational yet)

<hr/>

## Recommended Setup

### Google Script API

### Clasp & IDE

+ npm clasp
+ npm types/gas
+ .claspignore
+ .gitignore
+ typescript.json

### FAQ

### Learnings

### To be explored

+ Collaboration:

    "If you are working on a script project with other developers, you can collaborate on Apps Script projects with shared drives. Files in a shared drive are owned by the group, rather than individuals. This makes development and maintenance of the project easier." [GAS Best practices](https://developers.google.com/apps-script/guides/support/best-practices#consider_collaborating_with_shared_drives)

+ Refactoring:

    start with VSCode [refactoring](https://code.visualstudio.com/docs/editor/refactoring)
