# Setup

## Basic individual Authentication

> Brief outline of authenticating with Google Apps Script (GAS)

### Developer Tasks

1. Login with your authorized personal account (dev should not be used)
2. Enable Base Google Apps Script API for account. 
    - What's GAS API? --> "Google Apps Script API allows third-party applications you authorize to use the Apps Script API to modify your Apps Script projects and deployments."
    - Quickest way: https://script.google.com/home/usersettings
    - if that fails, Admin needs to enable Google Apps Script API / Scope for you / your organization / the dev account
3. set up vscode + git + node (best with nvm) + clasp (link tbd but official instructions perform well)
4. run clasp login
5. in browser, make sure you're not logged in as dev allow access to clasp for your personal account
6. > Security: **make sure that `.clasprc.json` is not committed! Add to `.gitignore` (should be already) or to .git/info/refs (~private / local .gitignore)

> **Question: how to connect to existing project?**
> **Should not be necessary anymore** as `scriptId` is now stored in `.clasp.json` and part of the repo
> otherwise `clasp clone <scriptid>` (is stored in )

Both need tp be tested for effectivity and scope issues.

### Admin Tasks

- Share **project** with developer
- Share **target** folders with developer
- Allow read access to **previous outcomes** (for year-on-year)
- allow repository access
- for org, maybe allow API access for GAS

### TODO: Scopes & WebApp Permissions (incl. REST API Access)

- https://developers.google.com/apps-script/api/reference/rest/v1/projects.deployments#entrypoint
- [Oauth2](https://github.com/gsuitedevs/apps-script-oauth2)
