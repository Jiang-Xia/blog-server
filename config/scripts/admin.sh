#!/bin/bash
BUILD_ID=DONTKILLME

echo "node version"
node -v

echo "npm install && build"

npm install && npm run build
echo "npm run builded"

rm -rf /front/admin/blog-admin/*
cp -r dist/. /front/admin/blog-admin/

echo "copyed"

nginx -s reload

echo "nginx reloaded"