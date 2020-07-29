#!/bin/bash
while read -r line; do
# Reading each line
id=$line
echo "ENV Script Project ID:"
echo "$id"
done < .clasp.json
