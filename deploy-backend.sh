#!/bin/bash

cd /tmp
git clone git@github.com:mdlufy/online-chat.git
test $? -ne 0 && exit 

cp -r /tmp/online-chat/backend /tmp

cd /tmp/backend
test $? -ne 0 && exit 

git init
git add .
git commit -m deploy

heroku git:remote -a ws-online-chat

git push -f heroku main

cd /tmp
rm -rf online-chat
rm -rf backend