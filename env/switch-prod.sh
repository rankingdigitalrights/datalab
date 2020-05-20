#!/bin/bash
while read -r line; do
# Reading each line
id=$line
echo "$id"
done < env/prodID.txt
clasp settings scriptId $id
echo "ENV switched to PRODUCTION"
