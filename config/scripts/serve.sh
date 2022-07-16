#!/bin/bash

# 不要杀死衍生进程
BUILD_ID=DONTKILLME
#cd dist node -v npm -v pm2 -v nginx -v

echo "npm install"

cd /var/lib/jenkins/workspace/blog-serve
npm install && npm run build

echo "npm run build"

cd dist

npm run pm2:prod

echo "pm2 start"
