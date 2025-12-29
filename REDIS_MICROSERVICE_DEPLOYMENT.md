# Redis微服务独立部署指南

## 概述

本文档介绍了如何将Redis微服务独立部署到单独的服务器上，实现与主应用的解耦。

Redis微服务现在完全独立于主应用，不依赖主应用的配置文件和其他组件，可以独立部署和运行。

Redis微服务支持多种部署方式：
- 独立Docker镜像打包部署
- PM2进程管理部署
- 直接运行部署

## 架构说明

- Redis微服务：提供Redis操作的gRPC服务，运行在独立服务器上
- 主应用：通过gRPC调用Redis微服务，不再直接连接Redis数据库
- Redis数据库：存储实际数据，可部署在与微服务相同的服务器或独立服务器上

## 部署步骤

### 1. 在目标服务器上准备环境

```bash
# 克隆代码
git clone <your-repo-url>
cd blog-server

# 安装依赖
npm install
```

### 2. 配置Redis微服务

Redis微服务会自动使用项目中已有的环境配置（如.env.production），您只需要额外配置gRPC服务相关参数：

```bash
# gRPC服务配置（必需）
export REDIS_GRPC_HOST=0.0.0.0  # 允许外部连接
export REDIS_GRPC_PORT=50052

# 其他配置（可选，如未在已有环境文件中配置）
export NODE_ENV=production
```

### 3. 启动Redis微服务

#### 使用Docker Compose（推荐）

```bash
# 启动Redis微服务
docker-compose -f docker-compose.redis-standalone.yml up -d
```

#### 直接运行

```bash
# 设置环境变量
export NODE_ENV=production
export REDIS_HOST=your-redis-host
export REDIS_PORT=6379
export REDIS_GRPC_HOST=0.0.0.0
export REDIS_GRPC_PORT=50052

# 启动Redis微服务
npm run start:redis-service:standalone
```

#### 使用PM2（推荐用于生产环境）

```bash
# 安装PM2（如果尚未安装）
npm install -g pm2

# 创建logs目录
mkdir -p logs

# 可以根据需要复制现有的环境配置文件作为基础（可选）
cp .env.production .env  # 如果需要修改环境配置

# 构建项目（生产环境推荐）
npm run build

# 使用PM2启动Redis微服务（开发模式，实时编译）
pm2 start ecosystem.redis-service.config.js

# 或使用PM2启动Redis微服务（生产模式，使用构建后的文件）
pm2 start npm --name redis-microservice-prod -- run start:redis-service:prod

# 查看运行状态
pm2 status

# 查看日志
pm2 logs redis-microservice

# 保存PM2配置（服务器重启后自动启动）
pm2 save
```

### 4. 配置主应用连接Redis微服务

在主应用服务器上，修改环境配置：

```bash
# 设置Redis微服务地址（替换为实际的Redis微服务IP和端口）
export REDIS_GRPC_URL=your-redis-service-ip:50052
```

### 5. 验证连接

启动主应用并测试Redis相关功能，确保能够正常连接到远程Redis微服务。

## Docker Compose 配置说明

### Redis微服务独立部署

- `docker-compose.redis-standalone.yml`：用于在独立服务器上部署Redis微服务和Redis数据库
- Redis微服务监听50052端口，提供gRPC服务
- Redis数据库监听6379端口

### 独立Docker镜像打包

Redis微服务有专门的Dockerfile，可以独立构建镜像：

```bash
# 构建Redis微服务镜像
cd microservices/redis-service
docker build -t redis-microservice .

# 运行Redis微服务容器
docker run -d \
  --name redis-microservice \
  -p 50052:50052 \
  -e REDIS_HOST=your-redis-host \
  -e REDIS_PORT=6379 \
  -e REDIS_GRPC_HOST=0.0.0.0 \
  -e REDIS_GRPC_PORT=50052 \
  redis-microservice
```

### 主应用连接外部Redis微服务

- `docker-compose.main-app-external-redis.yml`：用于主应用连接外部Redis微服务
- 需要修改 `REDIS_GRPC_URL` 环境变量为实际的Redis微服务地址

## 安全考虑

1. **网络安全性**：
   - 使用防火墙限制对gRPC端口（50052）的访问
   - 只允许主应用服务器访问Redis微服务端口

2. **数据传输安全**：
   - 在生产环境中考虑使用TLS加密gRPC通信
   - 定期更新Redis密码认证

3. **访问控制**：
   - 限制Redis数据库的访问权限
   - 使用专用用户运行Redis微服务

## 监控和维护

1. **日志监控**：
   - 定期检查Redis微服务日志
   - 监控gRPC请求响应时间和错误率

2. **性能监控**：
   - 监控Redis数据库性能指标
   - 监控服务器资源使用情况

3. **备份策略**：
   - 定期备份Redis数据
   - 测试备份恢复流程

## 故障排除

### 连接问题

- 检查Redis微服务是否正常运行
- 确认网络连通性（ping和telnet测试）
- 检查防火墙设置

### 性能问题

- 检查Redis数据库性能指标
- 监控gRPC请求队列长度
- 考虑增加Redis微服务实例

## 扩展性考虑

1. **水平扩展**：可根据需要部署多个Redis微服务实例
2. **负载均衡**：在多个Redis微服务实例前添加负载均衡器
3. **缓存策略**：在主应用中添加适当的缓存层以减少gRPC调用次数

## PM2部署方式

除了Docker部署，也可以使用PM2进行部署，这种方式更适合简单的服务器部署场景。

### Redis微服务PM2部署

1. 确保已在目标服务器安装Redis数据库
2. 配置环境变量
3. 使用PM2启动服务

### 主应用PM2部署

对于主应用，可以继续使用现有的PM2配置，只需确保`REDIS_GRPC_URL`环境变量指向正确的Redis微服务地址：

```bash
# 设置环境变量
export REDIS_GRPC_URL=your-redis-service-ip:50052

# 使用现有的PM2配置启动主应用
pm2 start ecosystem.config.js
```

PM2部署的优势：
- 部署简单，无需Docker环境
- 资源占用相对较少
- 进程管理方便
- 自动重启功能