#!/bin/bash
while read -r line; do
# Reading each line
id=$line
echo "$id"
done < env/devID.txt
clasp settings scriptId $id
