#!/bin/bash

echo ">>> limpando ..."
rm -rf deploy  
rm -rf dist
rm -f deploy.zip 
rm -f *.js *.d.ts *.map 
rm -f last_output.json