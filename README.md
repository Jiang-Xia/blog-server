<div align="center">
	<h1>Blog Server</h1>
	<p>基于 NestJS + TypeORM + MySQL 的现代化博客后端服务</p>
</div>

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![nestjs](https://img.shields.io/badge/NestJS-10.4.4-red.svg)](https://nestjs.com/)
[![typescript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![mysql](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

</div>

## 📖 项目简介

**Blog Server** 是一个基于 `NestJS` 框架开发的现代化博客后端服务系统，采用 `TypeScript` 开发，使用 `TypeORM` 作为 ORM 框架，`MySQL` 作为数据库。项目提供了完整的博客功能，包括文章管理、用户系统、评论系统、文件上传、权限管理等核心功能。

## ✨ 主要特性

- 🚀 **现代化技术栈**: 基于 NestJS + TypeScript + TypeORM + MySQL
- 🔐 **完善的权限系统**: 支持超级管理员、管理员、作者三种角色
- 📝 **完整的博客功能**: 文章管理、分类标签、评论回复、点赞收藏
- 👥 **用户管理系统**: 用户注册登录、个人信息管理
- 📁 **文件管理**: 支持文件上传和管理
- 💬 **互动功能**: 留言板、评论回复系统
- 📊 **数据统计**: 访问统计、文章统计等
- 🔗 **外链管理**: 支持友情链接管理
- 📱 **API 文档**: 集成 Swagger UI 自动生成 API 文档
- 🐳 **Docker 部署**: 提供完整的 Docker 部署方案
- 🔒 **安全防护**: JWT 认证、角色权限控制

## 🏗️ 项目架构

```
blog-server/
├── src/                           # 源代码目录
│   ├── modules/                   # 功能模块目录
│   │   ├── article/               # 文章管理模块
│   │   │   ├── dto/               # 数据传输对象
│   │   │   ├── entity/            # 数据库实体
│   │   │   ├── interface/         # 接口定义
│   │   │   └── vo/                # 视图对象
│   │   ├── user/                  # 用户管理模块
│   │   │   ├── dto/               # 数据传输对象
│   │   │   ├── entity/            # 数据库实体
│   │   │   └── vo/                # 视图对象
│   │   ├── auth/                  # 认证授权模块
│   │   ├── admin/                 # 管理后台模块
│   │   │   └── system/            # 系统管理子模块
│   │   │       └── entities/      # 系统实体
│   │   ├── category/              # 分类管理模块
│   │   ├── tag/                   # 标签管理模块
│   │   ├── comment/               # 评论管理模块
│   │   ├── reply/                 # 回复管理模块
│   │   ├── like/                  # 点赞管理模块
│   │   ├── msgboard/              # 留言板模块
│   │   ├── file/                  # 文件管理模块
│   │   ├── resources/             # 资源管理模块
│   │   └── pub/                   # 公共接口模块
│   ├── config/                    # 配置文件目录
│   ├── utils/                     # 工具函数目录
│   ├── filters/                   # 异常过滤器目录
│   ├── interceptor/               # 拦截器目录
│   ├── middleware/                # 中间件目录
│   ├── types/                     # 类型定义目录
│   └── script/                    # 脚本文件目录
├── deploy/                        # 部署配置目录
│   ├── front/                     # 前端部署配置
│   │   ├── admin/                 # 管理后台部署
│   │   └── output/                # 输出目录
│   ├── nginx/                     # Nginx 配置
│   └── sql/                       # 数据库脚本
├── config/                        # 项目配置目录
│   └── scripts/                   # 脚本文件
├── assets/                        # 静态资源目录
├── public/                        # 公共资源目录
│   └── data/                      # 数据文件
├── test/                          # 测试文件目录
├── docker-compose.yml             # Docker 编排文件
├── docker-compose.debug.yml       # Docker 调试配置
├── Dockerfile                     # Docker 构建文件
├── ecosystem.config.js            # PM2 配置文件
├── package.json                   # 项目依赖配置
├── tsconfig.json                  # TypeScript 配置
├── nest-cli.json                  # NestJS CLI 配置
├── commitlint.config.js           # 提交规范配置
└── README.md                      # 项目说明文档
```

## 🛠️ 技术栈

### 后端框架
- **[NestJS](https://nestjs.com/)** - 渐进式 Node.js 框架
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript 的超集
- **[TypeORM](https://typeorm.io/)** - 强大的 ORM 框架

### 数据库
- **[MySQL 8.0](https://www.mysql.com/)** - 关系型数据库

### 认证授权
- **[Passport](http://www.passportjs.org/)** - 身份验证中间件
- **[JWT](https://jwt.io/)** - JSON Web Token
- **[@nestjs/jwt](https://docs.nestjs.com/security/authentication)** - JWT 模块

### 文档和工具
- **[Swagger UI](https://swagger.io/tools/swagger-ui/)** - API 文档
- **[class-validator](https://github.com/typestack/class-validator)** - 数据验证
- **[class-transformer](https://github.com/typestack/class-transformer)** - 对象转换

### 部署和运维
- **[Docker](https://www.docker.com/)** - 容器化部署
- **[PM2](https://pm2.keymetrics.io/)** - Node.js 进程管理
- **[Nginx](https://nginx.org/)** - 反向代理服务器

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- MySQL >= 8.0
- Docker (可选)

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install
```

### 环境配置

1. 复制环境配置文件
```bash
cp .env.example .env.development
```

2. 修改数据库配置
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=blog_db
```

> **注意**: 首次启动服务时，系统会自动生成超级管理员账号和默认菜单配置，具体可见日志中打印。

### 启动服务

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run start:prod

# 调试模式
npm run start:debug
```

### Docker 部署

```bash
# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 停止服务
docker-compose down
```

## 📋 功能模块

### 🔐 认证授权模块 (`auth`)
- JWT 令牌认证
- 角色权限控制 (super/admin/author)
- 登录注册功能

### 📝 文章管理模块 (`article`)
- 文章的增删改查
- 文章分类和标签
- 文章访问量统计
- 文章点赞功能
- 文章归档功能

### 👥 用户管理模块 (`user`)
- 用户注册登录
- 用户信息管理
- 用户列表管理

### 🏷️ 分类标签模块 (`category`, `tag`)
- 分类管理
- 标签管理
- 分类标签关联

### 💬 评论系统模块 (`comment`, `reply`)
- 文章评论功能
- 评论回复功能
- 评论管理

### 👍 互动功能模块 (`like`, `msgboard`)
- 文章点赞功能
- 留言板功能

### 📁 文件管理模块 (`file`)
- 文件上传功能
- 文件管理

### ⚙️ 管理后台模块 (`admin`)
- 菜单管理
- 外链管理
- 系统管理

## 🔧 开发指南

### 代码规范

项目使用 ESLint + Prettier 进行代码规范控制：

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 自动修复
npm run lint:fix
```

### 提交规范

项目使用 commitlint 进行提交信息规范：

```bash
# 提交示例
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复文章列表分页问题"
git commit -m "docs: 更新 README 文档"
```

## 📚 API 文档

启动服务后，访问以下地址查看 API 文档：

- **Swagger UI**: `http://localhost:5000/api-docs`

## 🌐 在线预览

- **博客前台**: [https://jiang-xia.top/](https://jiang-xia.top/)
- **管理后台**: [https://admin.jiang-xia.top/](https://admin.jiang-xia.top/)

## 📦 部署说明

### 初始化数据

**服务第一次启动：**
1. `server` 会默认生成一个超级管理员账号，具体可见日志中打印(角色分为：`super，admin，author` 三种)。
2. 对于 `admin` 端左侧菜单管理会默认生成，工作台和系统管理两个导航。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

## 👨‍💻 作者

**jiang-xia**

- GitHub: [@jiang-xia](https://github.com/jiang-xia)
- Gitee: [@jiang-xia](https://gitee.com/jiang-xia)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者们！

---

<div align="center">
如果这个项目对你有帮助，请给个 ⭐️ 支持一下！
</div>
