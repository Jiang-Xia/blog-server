# docker pull node
# 不加: 使用本地node
FROM node:20.17.0
ENV NODE_ENV=production
# 工作根目录
WORKDIR /app 
# 把除了.dockerignore中的文件拷贝到/app中
# COPY . /app
RUN ls
RUN npm config set registry https://registry.npmmirror.com
RUN npm config list
# 把 package.json 拷贝到workdir中
COPY package.json .

# !天坑 一定要加上--include=dev不然只会安装package.json中dependencies的依赖
RUN npm install --include=dev

RUN npm list

COPY . .
COPY proto ./proto

RUN npm run build

# 容器重启会执行的命令
CMD [ "npm", "run", "start:prod" ]

EXPOSE 5000:5000


# docker image build -t blog-server .
# 登录docker docker login -u 963798512@qq.com -p j123456