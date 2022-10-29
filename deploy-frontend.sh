#!/bin/bash

cd /tmp
git clone git@github.com:mdlufy/online-chat.git
test $? -ne 0 && exit 

cd online-chat/frontend
npm i
PUBLIC_URL=/online-chat npm run build
rm -rf /tmp/online-chat-build
cp -r build /tmp/online-chat-build

cd  /tmp/online-chat
test $? -ne 0 && exit 

git checkout gh-pages
rm -rf /tmp/online-chat/*
mv /tmp/online-chat-build/* /tmp/online-chat
git add .
git commit -m deploy 
git push

cd /tmp
rm -rf online-chat
rm -rf online-chat-build
