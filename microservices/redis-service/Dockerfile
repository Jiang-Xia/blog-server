# 使用Node.js基础镜像
FROM node:20.17.0

# 设置工作目录
WORKDIR /app

# 设置生产环境
ENV NODE_ENV=production

# 配置npm镜像源
RUN npm config set registry https://registry.npmmirror.com
RUN npm config list

# 复制package.json并安装依赖
COPY package*.json .

# 安装生产依赖
RUN npm install --production

# 复制源代码
COPY microservices ./microservices
COPY proto ./proto
COPY tsconfig*.json .
COPY nest-cli.json .

# 构建项目
RUN npm run build

# 暴露gRPC端口
EXPOSE 50052

# 启动Redis微服务
CMD ["node", "dist/microservices/redis-service/redis.grpc.server.js"]