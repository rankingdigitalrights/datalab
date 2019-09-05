# RDR Spreadsheet Engineering

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

## Intro

This is the repository for RDR's spreadsheet development (and currently also the repository for the data processing scripts for the 2018 and 2019 CSVs). It is work-in-progress and by no means final. Therefore, this repository is not public.

## Project: Spreadsheet Automation

The current scope of the Spreadsheet automation is to generate spreadsheets for company-level data collection and for scoring with as few manual effort as possible.

The environment utilises [Google Apps Script](https://developers.google.com/apps-script/) (short: GAS]) (which is mostly a JavaScript flavour with G-Suite specific classes and methods), and the respective [Google Apps Script API](https://www.google.com/script/start/). Code is excecuted through the [browser](https://script.google.com/home/my) and runs online on Google's servers.

While you can edit and maintain the code in Google's web editor, this is strongly discouraged. To enable proper versioning, [SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth), code-sharing and collaboration, and so on, it is recommend **to use Git, [`clasp`](https://github.com/google/clasp), and an IDE** of choice (i.e. VSCode for easier interaction with NodeJS/npm). This enables you to edit code locally with a proper development environment, store your code in a git* repository, and push/pull the code to GAS to execute online.

## Quick Start

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
