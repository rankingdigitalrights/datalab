#!/bin/bash/

## Shell Script to count lines of code in .js & .json files
pkgs='cloc'
if ! dpkg -s $pkgs >/dev/null 2>&1; then
  sudo apt-get install $pkgs
fi

## clean terminal output
# git ls-files | xargs cloc --by-file-by-lang --exclude-list-file=./docs/stats/.clocignore

## markdown formatted output
git ls-files | xargs cloc --md --by-file-by-lang --exclude-list-file=./docs/stats/.clocignore