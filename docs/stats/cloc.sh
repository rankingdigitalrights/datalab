#!/bin/bash/

pkgs='cloc'
if ! dpkg -s $pkgs >/dev/null 2>&1; then
  sudo apt-get install $pkgs
fi

# git ls-files | xargs cloc --by-file-by-lang --exclude-list-file=./docs/stats/.clocignore

git ls-files | xargs cloc --md --by-file-by-lang --exclude-list-file=./docs/stats/.clocignore