#!/bin/bash
echo "npm install"
# ��Ҫɱ����������
BUILD_ID=DONTKILLME

npm install && npm run build
echo "npm run builded"

// ɾ��ԭ���ľ�̬��Դ
rm -rf /blog/home/*
# �ѱ���õ�dist�ļ�������/blog/homeĿ¼��
cp -r dist/. /blog/home/

echo "copyed"

nginx -s reload

echo "nginx reloaded"