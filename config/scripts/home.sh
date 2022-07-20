#!/bin/bash
echo "npm install"
# 不要杀死衍生进程
BUILD_ID=DONTKILLME

npm install && npm run build
echo "npm run builded"

// 删除原本的静态资源
rm -rf /blog/home/*
# 把编译好的dist文件拷贝到/blog/home目录下
cp -r dist/. /blog/home/

echo "copyed"

nginx -s reload

echo "nginx reloaded"