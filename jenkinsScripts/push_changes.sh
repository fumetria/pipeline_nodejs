#!/bin/bash

sh "git config --global user.name $1"
sh "git config --global user.password $2"
sh "git add ."
sh "git commit -m 'Pipeline executada per $3. Motiu: $4'"
sh "git push https://$1:$2@github.com/$1/pipeline_nodejs.git HEAD:ci_jenkins"