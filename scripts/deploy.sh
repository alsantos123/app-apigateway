#!/bin/bash

echo ">>> deploy..."

aws lambda update-function-code \
    --function-name $1 \
    --zip-file fileb://deploy.zip 

aws lambda update-function-configuration \
    --function-name $1 \
    --handler "dist/index.handler" \
    --timeout 30

# aws logs put-retention-policy \
#     --log-group-name $2 \
#     --retention-in-days 90
