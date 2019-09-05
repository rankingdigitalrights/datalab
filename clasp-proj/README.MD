# RDR Spreadsheet Engineering

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

## Intro

This is the project folder for RDR's spreadsheet development.

The current scope of the Spreadsheet development is to automate the generating ("castiong") of spreadsheets for company-level data collection and for scoring with as few manual effort as possible.

The environment utilises [Google Apps Script](https://developers.google.com/apps-script/) (short: GAS]) (which is mostly a JavaScript flavour with G-Suite specific classes and methods), and the respective [Google Apps Script API](https://www.google.com/script/start/). Code is excecuted through the [browser](https://script.google.com/home/my) and runs online on Google's servers.

While you can edit and maintain the code in Google's web editor, this is strongly discouraged. To enable proper versioning, [SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth), code-sharing and collaboration, and so on, it is recommend **to use Git, [`clasp`](https://github.com/google/clasp), and an IDE** of choice (i.e. VSCode for easier interaction with NodeJS/npm). This enables you to edit code locally with a proper development environment, store your code in a git* repository, and push/pull the code to GAS to execute online.

Following the proof-of-concept, the `project` has been moved to the `rdresearch` G-Suite account. In theory, you can share projects with other accounts in the same manner as you share any Google file.

## Quick Start

1. Log-in to `rdresearch`
2. Open [My Projects](https://script.google.com/home/my) to get an overview or go directly to the [`Spreadsheet Automation` project](https://script.google.com/a/opentechinstitute.org/d/1ZrUTGLLDXMZxkDB8BRaBpPb-p4ObTJrKI8FfJUN6cL10Iggc0TTalSC5)
3. `00_mainController.gs` should open automatically. If not, open this script. This is the **main interface** to config and run all modules.
4. Edit `companyShortName` in alignment to the according `<company>.json` (see the [JSON folder](/json/))
5. Double-check `folderName` if you need a specfic folder for your outputs (folder will be a subfolder of `2019 Back-end testing` owned by `rdresearch`; if you want to change the parent folder, you need to replace the folder **id**  of `parentFolderID`)
6. Edit the `main<Function>()` caller of the module you want to run (i.e. define whether you want to run only a subset of research steps)
7. in the submenu (grey), choose the function to run, and click play. 
8. wait for the script to finish. Hit `Ctrl + Enter` to see the log.
9. Open the output folder in Google Drive (should be under `My Drive`) and inspect the output

> if you created new data collection or scoring Spreadsheets, and you intend to continue working with them, make sure to update the file IDs in the respective company `JSON` files, i.e. `urlCurrentDataCollectionSheet` or `urlCurrentCompanyScoringSheet`

<hr/>

###

## Main Modules

+ Main Controller
+ Data Collection Spreadsheets
+ Company Scoring Spreadsheets
+ Permissions

## Helper Modules

+ importJSON
+ scoringFormula
+ cellFormatting
+ fileName

## Recommended Setup

## Google Script API

## Clasp & IDE

+ npm clasp
+ npm types/gas
+ .claspignore
+ .gitignore
