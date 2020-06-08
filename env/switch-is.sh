#!/bin/bash
while read -r line; do
# Reading each line
id=$line
echo "$id"
done < env/devID-is.txt
clasp settings scriptId $id
echo "ENV switched to DEVELOPMENT - IS"
