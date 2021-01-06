#!/bin/bash

echo ">>> deploy..."

aws lambda update-function-code --function-name $1 --zip-file fileb://deploy.zip 
aws lambda update-function-configuration --function-name $1 --handler "dist/index.handler" --timeout 30

