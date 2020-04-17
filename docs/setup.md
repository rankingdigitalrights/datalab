# Setup

## Basic indivual Authenification

> Brief outline of authenticating with Google Apps Script (GAS)

1. Login with dev or authorized personal account
2. Set up 2FA & Recovery Options!!!
3. Enable Base Google Apps Script API for account. 
    - What's GAS API? --> "Google Apps Script API allows third-party applications you authorize to use the Apps Script API to modify your Apps Script projects and deployments."
    - Quickest way: https://script.google.com/home/usersettings
    - if that fails, Admin needs to enable Google Apps Script API / Scope for you / your organization / the dev account
4. set up vscode + git + node (best with nvm) + clasp (link tbd but official instructions perform well)
5. run clasp login
6. in browser, make sure you're logged in as dev (use containers on firefox) allow access for clasp
7. > Security: **make sure that `.clasprc.json` is not committed! Add to `.gitignore` (should be already) and / or to .git/info/refs (~private / local .gitignore)

> **Question: how to connect to existing project?**
> `clasp clone` with shared dev account?
> `clasp clone projectID`after providing access to user?

Both need tp be tested for effectivity and scope issues.

## TODO: Scopes & WebApp Permissions (incl. REST API Access)

- https://developers.google.com/apps-script/api/reference/rest/v1/projects.deployments#entrypoint
- [Oauth2](https://github.com/gsuitedevs/apps-script-oauth2)
