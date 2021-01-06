#!/bin/bash

echo ">>> zipando ..."

zip -qr deploy.zip . --exclude \
    "last_output.json" \
    "src*" \
    "deploy.zip" \
    "scripts*" \
    ".git*" \
    ".gitignore" \
    "tsconfig.json" \
    "package-lock.json" \
    "*.ts*" \
    "*node_modules/.bin*" \
    "*node_modules/typescript*" \
    "*node_modules/@types*" \
    "*node_modules/aws-sdk*" \
    "*node_modules/base64-js*" \
    "*node_modules/buffer*" \
    "*node_modules/events*" \
    "*node_modules/ieee754*" \
    "*node_modules/isarray*" \
    "*node_modules/jmespath*" \
    "*node_modules/punycode*" \
    "*node_modules/querystring*" \
    "*node_modules/sax*" \
    "*node_modules/url*" \
    "*node_modules/uuid*" \
    "*node_modules/xml2js*" \
    "*node_modules/xmlbuilder*"

