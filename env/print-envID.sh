#!/bin/bash

echo "available projects are:\n"
echo "datalab:" $(cat env/prodID.txt)
echo "GW:" $(cat env/devID-gw.txt)
echo "IS:" $(cat env/devID-is.txt)

while read -r line; do
# Reading each line
id=$line
echo "\nCurrent Project ID is:"
echo "$id"
done < .clasp.json
