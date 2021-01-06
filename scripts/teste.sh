#!/bin/bash

echo ">>> lambda invoke $1";
aws lambda invoke --function-name $1 last_output.json  
cat last_output.json 
# rm last_output.json
echo "\n\n>>> fim"