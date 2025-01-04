#!/bin/bash

git config --global user.name $1
git config --global user.password $2
git add .
git commit -m 'Pipeline executada per $3. Motiu: $4'
git push https://$1:$2@github.com/$1/pipeline_nodejs.git HEAD:ci_jenkins