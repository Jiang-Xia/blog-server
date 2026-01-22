<div align="center">
	<h1>Blog Server</h1>
	<p>基于 NestJS + TypeORM + MySQL + Redis 的现代化博客后端服务</p>
</div>

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![nestjs](https://img.shields.io/badge/NestJS-11.1.6-red.svg)](https://nestjs.com/)
[![typescript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![mysql](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![redis](https://img.shields.io/badge/Redis-7.0-red.svg)](https://redis.io/)

</div>

## 📖 项目简介

**Blog Server** 是一个功能完善的现代化博客后端服务系统，采用 `NestJS` + `TypeScript` 开发，使用 `TypeORM` 作为 ORM 框架，`MySQL` 作为主数据库，`Redis` 作为缓存和会话存储。项目提供了完整的博客功能，包括文章管理、用户系统、评论回复、文件上传、权限管理、支付集成、邮件通知、第三方登录等核心功能。

## ✨ 主要特性

- 🚀 **现代化技术栈**: 基于 NestJS 11 + TypeScript 5.9 + TypeORM + MySQL 8 + Redis
- 🔐 **完善的权限系统**: 基于 RBAC 的角色权限控制，支持超级管理员、管理员、作者三种角色，支持部门管理
- 📝 **完整的博客功能**: 文章管理、分类标签、评论回复、点赞、软删除、文章置顶、访问统计
- 👥 **用户管理系统**: 用户注册登录、个人信息管理、GitHub 第三方登录、邮箱验证
- 📁 **文件管理**: 支持文件上传、文件管理、静态资源服务
- 💬 **互动功能**: 留言板、评论回复系统、文章点赞
- 💰 **支付集成**: 支持支付宝支付、微信支付（预留）
- 📧 **邮件服务**: 支持邮件发送功能（基于 Nodemailer）
- 🔒 **安全防护**: JWT 认证、图形验证码、密码加密、权限守卫
- 📱 **API 文档**: 集成 Swagger UI 自动生成 API 文档
- 🐳 **Docker 部署**: 提供完整的 Docker 部署方案
- ⚡ **性能优化**: Redis 缓存、全局拦截器、异常过滤器

## 🏗️ 项目架构

```
blog-server/
├── src/                           # 源代码目录
│   ├── modules/                   # 业务模块目录（模块化分层管理）
│   │   ├── core/                  # 基础设施层
│   │   │   └── redis/             # Redis 全局模块（缓存、会话）
│   │   ├── security/              # 安全相关模块
│   │   │   ├── auth/              # 认证授权（JWT、Passport、权限守卫）
│   │   │   └── captcha/           # 图形验证码（svg-captcha + Redis）
│   │   ├── features/              # 业务功能模块（由 FeaturesModule 统一管理）
│   │   │   ├── article/           # 文章管理（CRUD、分类、标签、统计）
│   │   │   ├── user/              # 用户管理（注册、登录、资料、GitHub登录）
│   │   │   ├── admin/             # 管理后台（菜单管理、外链管理）
│   │   │   │   └── system/        # 系统管理（角色、权限、部门）
│   │   │   ├── category/          # 文章分类
│   │   │   ├── tag/               # 文章标签
│   │   │   ├── comment/           # 文章评论
│   │   │   ├── reply/             # 评论回复
│   │   │   ├── like/              # 文章点赞
│   │   │   ├── msgboard/          # 留言板
│   │   │   ├── file/              # 文件上传管理
│   │   │   ├── resources/         # 资源管理
│   │   │   ├── email/             # 邮件服务
│   │   │   └── pub/               # 公共接口（统计、工具）
│   │   └── pay/                   # 支付模块（支付宝、微信支付）
│   ├── config/                    # 配置文件（数据库、Redis、服务、支付等）
│   ├── utils/                     # 工具函数（加密、时间处理等）
│   ├── filters/                   # 全局异常过滤器
│   ├── interceptor/               # 全局拦截器（响应转换）
│   ├── middleware/                # 中间件（网关中间件）
│   ├── types/                     # TypeScript 类型定义
│   ├── app.module.ts              # 根模块
│   └── main.ts                    # 应用入口
├── deploy/                        # 部署配置目录
│   ├── front/                     # 前端部署配置
│   ├── nginx/                     # Nginx 配置
│   └── sql/                       # 数据库初始化脚本
├── config/                        # 项目配置目录
│   ├── scripts/                   # 部署脚本
│   └── nginx.conf                 # Nginx 配置文件
├── assets/                        # 静态资源目录
├── public/                        # 公共资源目录（上传文件存储）
│   ├── data/                      # 数据文件
│   └── uploads/                   # 文件上传目录
├── test/                          # 测试文件目录
├── backups/                       # 数据库备份目录
├── coverage/                      # 测试覆盖率报告
├── dist/                          # 编译输出目录
├── .env.development               # 开发环境配置
├── .env.production                # 生产环境配置
├── .env.test                      # 测试环境配置
├── docker-compose.yml             # Docker 编排文件
├── docker-compose.debug.yml       # Docker 调试配置
├── Dockerfile                     # Docker 构建文件
├── ecosystem.config.js            # PM2 配置文件
├── package.json                   # 项目依赖配置
├── tsconfig.json                  # TypeScript 配置
├── nest-cli.json                  # NestJS CLI 配置
├── eslint.config.ts               # ESLint 配置
├── commitlint.config.js           # Git 提交规范配置
└── README.md                      # 项目说明文档
```

### 🧩 模块管理与装配

项目采用模块化设计，通过 `src/modules/registry.ts` 统一管理所有模块：

```typescript
// 核心模块
export const CoreModules = [RedisModule];

// 安全模块
export const SecurityModules = [AuthModule, CaptchaModule];

// 业务功能模块
export const FeatureModules = [FeaturesModule.register()];

// 所有模块
export const AllAppModules = [...CoreModules, ...SecurityModules, ...FeatureModules, PayModule];
```

**模块说明**：

- **核心模块 (CoreModules)**：`RedisModule` 为全局模块，提供 Redis 缓存和会话管理能力
- **安全模块 (SecurityModules)**：
  - `AuthModule`：JWT 认证、Passport 策略、权限守卫
  - `CaptchaModule`：图形验证码生成与校验（基于 svg-captcha + Redis）
- **业务功能模块 (FeatureModules)**：由 `FeaturesModule` 统一装配，包含 12 个子模块（文章、用户、评论、标签等）
- **支付模块 (PayModule)**：支付宝支付、微信支付集成

## 🛠️ 技术栈

### 后端框架
- **[NestJS 11](https://nestjs.com/)** - 渐进式 Node.js 框架，提供依赖注入、模块化等企业级特性
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - 强类型 JavaScript 超集
- **[TypeORM 0.3](https://typeorm.io/)** - 强大的 ORM 框架，支持 MySQL、PostgreSQL 等多种数据库

### 数据库与缓存
- **[MySQL 8.0](https://www.mysql.com/)** - 关系型数据库，存储核心业务数据
- **[Redis 7.0](https://redis.io/)** - 内存数据库，用于缓存和会话管理（基于 ioredis）

### 认证授权
- **[Passport](http://www.passportjs.org/)** - 身份验证中间件
  - passport-jwt - JWT 策略
  - passport-local - 本地用户名密码策略
  - passport-github2 - GitHub OAuth 登录
- **[@nestjs/jwt](https://docs.nestjs.com/security/authentication)** - JWT 令牌生成与验证
- **crypto-js** - 密码加密
- **node-jsencrypt** - RSA 加密

### 验证与文档
- **[Swagger UI](https://swagger.io/tools/swagger-ui/)** - 自动生成 API 文档（@nestjs/swagger）
- **[class-validator](https://github.com/typestack/class-validator)** - DTO 数据验证
- **[class-transformer](https://github.com/typestack/class-transformer)** - 对象转换

### 第三方服务
- **[Nodemailer](https://nodemailer.com/)** - 邮件发送服务（支持 SMTP）
- **[alipay-sdk](https://github.com/alipay/alipay-sdk-nodejs-all)** - 支付宝支付 SDK
- **[svg-captcha](https://github.com/produck/svg-captcha)** - 图形验证码生成
- **[marked](https://marked.js.org/)** - Markdown 解析器

### 工具库
- **[axios](https://axios-http.com/)** - HTTP 客户端（@nestjs/axios）
- **[dayjs](https://day.js.org/)** - 日期时间处理
- **[ua-parser-js](https://github.com/faisalman/ua-parser-js)** - User-Agent 解析
- **[request-ip](https://github.com/pbojinov/request-ip)** - IP 地址获取
- **[uuid](https://github.com/uuidjs/uuid)** - UUID 生成
- **[multer](https://github.com/expressjs/multer)** - 文件上传中间件

### 任务调度
- **[@nestjs/schedule](https://docs.nestjs.com/techniques/task-scheduling)** - 定时任务（基于 cron）

### 代码质量
- **[ESLint](https://eslint.org/)** - 代码检查工具
- **[Prettier](https://prettier.io/)** - 代码格式化工具
- **[Commitlint](https://commitlint.js.org/)** - Git 提交信息规范
- **[Husky](https://typicode.github.io/husky/)** - Git hooks 工具
- **[Jest](https://jestjs.io/)** - 单元测试框架

### 部署和运维
- **[Docker](https://www.docker.com/)** - 容器化部署
- **[PM2](https://pm2.keymetrics.io/)** - Node.js 进程管理器
- **[Nginx](https://nginx.org/)** - 反向代理和静态资源服务器

## 🚀 快速开始

### 环境要求

- **Node.js** >= 16.0.0（推荐 18.x 或 20.x）
- **MySQL** >= 8.0
- **Redis** >= 5.0（推荐 7.x）
- **Docker** >= 20.10（可选，用于容器化部署）
- **npm** >= 8.0 或 **yarn** >= 1.22

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install
```

### 环境配置

1. **创建环境配置文件**

项目根目录已包含三个环境配置模板：
- `.env.development` - 开发环境
- `.env.production` - 生产环境
- `.env.test` - 测试环境

根据需要修改对应的配置文件：

```env
# 数据库配置
db_host = 127.0.0.1
db_port = 3306
db_username = your_username
db_password = 'your_password'
db_database = myblog
db_synchronize = true  # 生产环境务必设置为 false
db_logging = 'error'

# Redis 配置
redis_host = 127.0.0.1
redis_port = 6379
redis_db = 1

# 服务配置
serve_port = 5000
serve_apiPath = api/v1
serve_baseUrl = http://127.0.0.1:5000

# 初始管理员账号
account_mobile = 18888888888
account_password = super
account_role = super
account_nickname = super

# 文件上传配置
file_filePath = ./public/uploads/

# 邮件服务配置（可选）
app_emailHost = smtp.163.com
app_emailPort = 465
app_emailUser = your_email@163.com
app_emailPass = your_email_auth_code

# GitHub 登录配置（可选）
app_githubClientId = your_github_client_id
app_githubClientSecret = your_github_client_secret
app_githubCallbackUrl = http://127.0.0.1:5000/api/v1/user/auth/github/callback

# 支付宝配置（可选）
pay_alipayAppId = your_alipay_app_id
pay_alipayPrivateKey = your_private_key
pay_alipayPublicKey = your_public_key
pay_alipayGateway = https://openapi.alipay.com/gateway.do
```

2. **创建数据库**

```sql
CREATE DATABASE myblog CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

如需使用初始化脚本，可导入 `deploy/sql/init.sql`：

```bash
# 方式一：使用 mysql 命令导入
mysql -u your_username -p myblog < deploy/sql/init.sql

# 方式二：进入 mysql 后使用 source 命令
mysql -u your_username -p
USE myblog;
source deploy/sql/init.sql;
```

> **重要提示**：
> - **开发环境**：如果 `db_synchronize=true`，首次启动时会自动创建数据库表结构
> - **生产环境**：必须设置 `db_synchronize=false`，使用 `init.sql` 脚本手动初始化
> - **init.sql 脚本内容**：包含完整的表结构、角色、权限、菜单、部门等初始数据
> - **用户账号**：首次启动服务时会自动创建默认管理员账号（手机号：18888888888，密码：super）
> - **详细说明**：请查看下文「初始化数据」章节

### 启动服务

```bash
# 开发模式（热重载）
npm run start:dev

# 生产模式
npm run build
npm run start:prod

# 调试模式
npm run start:debug

# 使用 PM2 启动
npm run pm2:dev      # 开发环境
npm run pm2:prod     # 生产环境
npm run pm2:test     # 测试环境
```

服务启动成功后，访问：
- **API 接口**：http://localhost:5000/api/v1
- **Swagger 文档**：http://localhost:5000/api/v1/doc

### Docker 部署

```bash
# 启动所有服务（包括 MySQL 和 Redis）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f blog-server

# 停止服务
docker-compose down

# 停止并清除数据
docker-compose down -v
```

### 开发调试

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 自动修复
npm run lint:fix

# 运行测试
npm run test

# 测试覆盖率
npm run test:cov

# E2E 测试
npm run test:e2e
```

## 📋 功能模块

### 🔐 认证授权模块 (`security/auth`, `security/captcha`)

**认证授权 (AuthModule)**：
- ✅ JWT 令牌认证（基于 @nestjs/jwt 和 passport-jwt）
- ✅ 本地用户名密码登录（passport-local）
- ✅ GitHub 第三方登录（passport-github2）
- ✅ 基于 RBAC 的角色权限控制（super/admin/author）
- ✅ 全局权限守卫（PermissionGuard）
- ✅ 密码加密存储（crypto-js + salt）

**图形验证码 (CaptchaModule)**：
- ✅ 图形验证码生成（svg-captcha）
- ✅ Redis 存储验证码（5 分钟过期）
- ✅ 验证码校验接口

### 📝 文章管理模块 (`features/article`)

- ✅ 文章 CRUD（创建、查询、更新、删除）
- ✅ 文章分类和标签关联（多对多关系）
- ✅ 文章状态管理（草稿、已发布）
- ✅ 文章置顶功能
- ✅ 软删除（isDelete 标记）
- ✅ 文章访问量统计（views）
- ✅ 文章点赞统计（likes）
- ✅ 文章归档（按年月分组）
- ✅ 文章搜索和分页
- ✅ Markdown 内容解析（marked）
- ✅ 文章封面图

**数据库关系**：
- Article - User (多对一)
- Article - Category (多对一)
- Article - Tag (多对多)
- Article - Comment (一对多)
- Article - Like (一对多)

### 👥 用户管理模块 (`features/user`)

- ✅ 用户注册（手机号/邮箱）
- ✅ 用户登录（本地登录 + GitHub OAuth）
- ✅ 用户信息管理（昵称、头像、个人简介）
- ✅ 用户列表管理（分页、搜索）
- ✅ 用户状态管理（active/locked）
- ✅ 用户角色关联（多对多）
- ✅ 用户部门关联（多对一）
- ✅ 密码修改
- ✅ 用户软删除

### 🏷️ 分类标签模块 (`features/category`, `features/tag`)

**分类管理 (CategoryModule)**：
- ✅ 分类 CRUD
- ✅ 分类颜色标记
- ✅ 一个分类包含多篇文章
- ✅ 分类统计（文章数量）

**标签管理 (TagModule)**：
- ✅ 标签 CRUD
- ✅ 标签颜色标记
- ✅ 多对多文章关联
- ✅ 标签统计（文章数量）

### 💬 评论系统模块 (`features/comment`, `features/reply`)

**评论管理 (CommentModule)**：
- ✅ 文章评论功能
- ✅ 评论 CRUD
- ✅ 评论与用户关联
- ✅ 评论与文章关联
- ✅ 评论列表分页

**回复管理 (ReplyModule)**：
- ✅ 评论回复功能
- ✅ 回复 CRUD
- ✅ 回复嵌套层级

### 👍 互动功能模块 (`features/like`, `features/msgboard`)

**点赞模块 (LikeModule)**：
- ✅ 文章点赞/取消点赞
- ✅ 点赞用户记录
- ✅ 点赞统计

**留言板模块 (MsgboardModule)**：
- ✅ 留言发布
- ✅ 留言 CRUD
- ✅ 留言列表分页

### 📁 文件管理模块 (`features/file`)

- ✅ 文件上传（基于 multer）
- ✅ 支持图片、文档等多种格式
- ✅ 文件存储到本地 `public/uploads/`
- ✅ 文件列表管理
- ✅ 文件删除
- ✅ 静态资源服务（通过 `/static/` 访问）

### 📧 邮件服务模块 (`features/email`)

- ✅ 邮件发送功能（基于 Nodemailer）
- ✅ 支持 SMTP 协议
- ✅ HTML 邮件模板
- ✅ 邮件验证码发送

### 📦 资源管理模块 (`features/resources`)

- ✅ 资源 CRUD
- ✅ 资源分类管理
- ✅ 资源搜索和筛选

### ⚙️ 管理后台模块 (`features/admin`)

**菜单管理 (AdminModule)**：
- ✅ 菜单 CRUD
- ✅ 菜单树形结构
- ✅ 菜单排序
- ✅ 外链管理
- ✅ 菜单权限控制

**系统管理 (SystemModule)**：

- **角色管理 (RoleController)**：
  - ✅ 角色 CRUD
  - ✅ 角色权限关联
  - ✅ 角色与用户多对多关联

- **权限管理 (PrivilegeController)**：
  - ✅ 权限 CRUD
  - ✅ 权限树形结构
  - ✅ 接口权限控制

- **部门管理 (DeptController)**：
  - ✅ 部门 CRUD
  - ✅ 部门树形结构
  - ✅ 部门与用户关联

### 💰 支付模块 (`pay`)

- ✅ 支付宝支付集成（alipay-sdk）
  - 创建订单
  - 支付回调处理
  - 订单查询
- ⏳ 微信支付（预留接口）

### 🌐 公共接口模块 (`features/pub`)

- ✅ 网站统计（文章数、用户数、访问量等）
- ✅ IP 地址解析
- ✅ User-Agent 解析
- ✅ 高德地图 API 集成
- ✅ 公共工具接口

## 🔧 开发指南

### 代码规范

项目使用 **ESLint** + **Prettier** + **Husky** + **lint-staged** 进行代码质量控制：

```bash
# 代码格式化
npm run format

# 代码检查
npm run lint

# 自动修复 ESLint 错误
npm run lint:fix
```

**配置文件**：
- `eslint.config.ts` - ESLint 配置（TypeScript ESLint）
- `.prettierrc.json` - Prettier 配置
- `.prettierignore` - Prettier 忽略文件
- `commitlint.config.js` - 提交信息规范

**Git Hooks**（通过 Husky 自动触发）：
- `pre-commit`：提交前自动执行 `lint-staged`（格式化和检查暂存的文件）
- `commit-msg`：校验提交信息是否符合规范

### 提交规范

项目使用 **Commitlint** + **@commitlint/config-conventional** 进行提交信息规范：

**提交格式**：
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响代码逻辑）
- `refactor`: 重构（既不是新功能也不是修复 bug）
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建系统或外部依赖变更
- `ci`: CI 配置文件和脚本变更
- `chore`: 其他不修改 src 或 test 的变更
- `revert`: 回滚之前的提交

**提交示例**：
```bash
# 新功能
git commit -m "feat(auth): 添加 GitHub 第三方登录功能"

# 修复 bug
git commit -m "fix(article): 修复文章列表分页问题"

# 文档更新
git commit -m "docs: 更新 README 和 API 文档"

# 代码重构
git commit -m "refactor(user): 优化用户模块代码结构"

# 性能优化
git commit -m "perf(redis): 优化 Redis 缓存策略"
```

### 开发流程

1. **创建功能分支**
```bash
git checkout -b feature/your-feature-name
```

2. **开发并测试**
```bash
npm run start:dev
npm run test
```

3. **提交代码**（自动触发代码检查和格式化）
```bash
git add .
git commit -m "feat: 你的功能描述"
```

4. **推送并创建 Pull Request**
```bash
git push origin feature/your-feature-name
```

### 测试规范

```bash
# 运行所有测试
npm run test

# 监听模式（开发时使用）
npm run test:watch

# 生成测试覆盖率报告
npm run test:cov

# 调试测试
npm run test:debug

# E2E 测试
npm run test:e2e
```

测试文件命名规范：`*.spec.ts`

### 目录结构规范

**模块目录结构**：
```
modules/features/article/
├── dto/                    # 数据传输对象
│   ├── create-article.dto.ts
│   └── update-article.dto.ts
├── entity/                 # 数据库实体
│   └── article.entity.ts
├── article.controller.ts   # 控制器
├── article.service.ts      # 服务层
├── article.module.ts       # 模块定义
└── article.spec.ts         # 单元测试
```

**命名规范**：
- 文件名：kebab-case（如：`user-profile.service.ts`）
- 类名：PascalCase（如：`UserProfileService`）
- 变量/函数：camelCase（如：`getUserProfile`）
- 常量：UPPER_SNAKE_CASE（如：`MAX_FILE_SIZE`）
- 接口：PascalCase，前缀 `I`（如：`IUserProfile`）
- 枚举：PascalCase（如：`UserStatus`）

## 📚 API 文档

项目集成了 **Swagger UI**，自动生成完整的 API 文档（基于 @nestjs/swagger）。

启动服务后，访问以下地址：

- **Swagger UI**：http://localhost:5000/api/v1/doc
- **API 接口根路径**：http://localhost:5000/api/v1

**文档特性**：
- ✅ 自动生成所有接口文档
- ✅ 支持在线调试（Try it out）
- ✅ JWT 认证支持（点击右上角 Authorize 输入 Bearer Token）
- ✅ DTO 验证规则展示
- ✅ 请求/响应示例

**主要接口分组**：

| 分组 | 路径前缀 | 说明 |
|------|---------|------|
| 认证授权 | `/api/v1/auth` | 登录、注册、JWT 验证 |
| 用户管理 | `/api/v1/user` | 用户 CRUD、资料管理 |
| 文章管理 | `/api/v1/article` | 文章 CRUD、分类、标签 |
| 分类管理 | `/api/v1/category` | 分类 CRUD |
| 标签管理 | `/api/v1/tag` | 标签 CRUD |
| 评论管理 | `/api/v1/comment` | 评论 CRUD |
| 回复管理 | `/api/v1/reply` | 回复 CRUD |
| 点赞管理 | `/api/v1/like` | 点赞/取消点赞 |
| 留言板 | `/api/v1/msgboard` | 留言 CRUD |
| 文件管理 | `/api/v1/file` | 文件上传、管理 |
| 管理后台 | `/api/v1/admin` | 菜单、外链管理 |
| 系统管理 | `/api/v1/admin/system` | 角色、权限、部门 |
| 支付管理 | `/api/v1/pay` | 支付宝支付 |
| 验证码 | `/api/v1/captcha` | 图形验证码 |
| 公共接口 | `/api/v1/pub` | 统计、工具接口 |

## 📊 数据库设计

**核心数据表**：

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `user` | 用户表 | id, mobile, email, nickname, avatar, password, salt, status, roles, deptId |
| `article` | 文章表 | id, title, content, cover, status, likes, views, topping, isDelete, uid, category, tags |
| `category` | 分类表 | id, label, value, color, uid |
| `tag` | 标签表 | id, label, value, color, uid |
| `comment` | 评论表 | id, content, uid, articleId, userId |
| `reply` | 回复表 | id, content, commentId, userId |
| `like` | 点赞表 | id, uid, articleId |
| `msgboard` | 留言板表 | id, content, uid |
| `menu` | 菜单表 | id, name, path, icon, parentId, sort |
| `role` | 角色表 | id, name, code, description |
| `privilege` | 权限表 | id, name, code, type, url |
| `dept` | 部门表 | id, name, parentId, sort |
| `article_tags_tag` | 文章标签关联表 | articleId, tagId |
| `user_roles_role` | 用户角色关联表 | userId, roleId |

**主要关系**：
- User 1:N Article（一个用户多篇文章）
- Article N:1 Category（多篇文章属于一个分类）
- Article N:N Tag（文章与标签多对多）
- Article 1:N Comment（一篇文章多条评论）
- Comment 1:N Reply（一条评论多条回复）
- User N:N Role（用户与角色多对多）
- User N:1 Dept（多个用户属于一个部门）

**SQL 初始化脚本**：[deploy/sql/init.sql](file:///d:/study/myGithub/blog-server/deploy/sql/init.sql)
- 包含完整的数据库表结构（18 张表）
- 包含初始角色、权限、菜单、部门等基础数据
- 详细说明请查看下文「初始化数据」章节

## 🌐 在线预览

- **博客前台**：[https://jiang-xia.top/](https://jiang-xia.top/)
- **管理后台**：[https://admin.jiang-xia.top/](https://admin.jiang-xia.top/)
- **API 文档**：https://jiang-xia.top/x-blog/api/v1/doc（需部署后访问）

## 📦 部署说明

### 生产环境部署

**方式一：传统部署（PM2）**

1. **构建项目**
```bash
npm run build
```

2. **使用 PM2 启动**
```bash
npm run pm2:prod
```

或直接使用 PM2 命令：
```bash
pm2 start ecosystem.config.js --env production
```

PM2 常用命令：
```bash
pm2 list              # 查看所有进程
pm2 logs blog-server  # 查看日志
pm2 restart blog-server  # 重启服务
pm2 stop blog-server     # 停止服务
pm2 delete blog-server   # 删除进程
pm2 monit             # 实时监控
```

**方式二：Docker 部署**

1. **构建镜像**
```bash
docker build -t blog-server:latest .
```

2. **使用 docker-compose 启动**
```bash
docker-compose up -d
```

3. **查看日志**
```bash
docker-compose logs -f blog-server
```

**方式三：Nginx 反向代理**

配置示例（`config/nginx.conf`）：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/v1/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        alias /path/to/blog-server/public/;
    }
}
```

### 初始化数据

#### 方式一：开发环境自动初始化（推荐用于开发测试）

**配置要求**：
- 在 `.env.development` 中设置 `db_synchronize=true`
- 确保数据库已创建但表为空

**服务第一次启动时会自动执行以下操作**：

1. **创建数据库表结构**
   - 自动根据 Entity 创建所有数据表
   - ⚠️ 生产环境务必设置 `db_synchronize=false`

2. **初始化默认管理员账号**
   - 系统会自动创建一个默认管理员账号
   - 默认手机号：`18888888888`
   - 默认密码：`super`
   - 默认角色：作者（roleId: 3）
   - 默认部门：作者部门（deptId: 4）

**启动日志示例**：
```
[Nest] INFO  服务已经启动,接口请访问:http://127.0.0.1:5000/api/v1
[Nest] INFO  服务已经启动,文档请访问:http://127.0.0.1:5000/api/v1/doc
[Nest] INFO  管理员账户创建成功，手机号：18888888888，密码：super，请及时登录系统修改默认密码
```

#### 方式二：生产环境使用 SQL 脚本（推荐用于生产部署）

**步骤如下**：

1. **导入初始化脚本**
```bash
# 连接到 MySQL 数据库
mysql -u your_username -p

# 创建数据库
CREATE DATABASE IF NOT EXISTS myblog CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE myblog;

# 导入初始化脚本
source deploy/sql/init.sql;
```

2. **验证数据**
```bash
# 检查表是否创建成功
SHOW TABLES;

# 检查初始数据
SELECT * FROM role;          # 应包含 3 个角色：超级管理员、管理员、作者
SELECT * FROM dept;          # 应包含 4 个部门
SELECT * FROM privilege;     # 应包含 99 条权限数据
SELECT * FROM menu;          # 应包含菜单数据
```

**init.sql 脚本包含**：
- ✅ 完整的数据库表结构（18 张表）
- ✅ 角色数据（超级管理员、管理员、作者）
- ✅ 部门数据（酱的博客系统及下属部门）
- ✅ 权限数据（99 条权限配置）
- ✅ 菜单数据（后台管理菜单）
- ✅ 角色-权限关联数据
- ✅ 角色-菜单关联数据
- ✅ 用户-角色关联数据示例

**注意事项**：
- 📌 脚本不包含用户数据，首次启动服务时会自动创建默认管理员账号
- 📌 生产环境必须设置 `db_synchronize=false`，避免数据表被自动修改
- 📌 首次登录后请立即修改默认密码

### 环境变量说明

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `development` / `production` / `test` |
| `db_synchronize` | 是否自动同步表结构 | `true` / `false`（生产环境必须为 false）|
| `db_logging` | 数据库日志级别 | `error` / `query,error` |
| `serve_port` | 服务端口 | `5000` |
| `serve_baseUrl` | 服务基础 URL | `http://your-domain.com` |
| `redis_host` | Redis 主机地址 | `127.0.0.1` |
| `redis_port` | Redis 端口 | `6379` |

### 数据备份

**MySQL 数据库备份**：
```bash
# 备份
mysqldump -u username -p myblog > backup_$(date +%Y%m%d).sql

# 恢复
mysql -u username -p myblog < backup_20260122.sql
```

**备份目录**：`backups/db-data/`

### 性能优化建议

1. **启用 Redis 缓存**：热点数据缓存（文章列表、统计数据等）
2. **数据库索引优化**：为常用查询字段添加索引
3. **启用 Gzip 压缩**：Nginx 配置 gzip
4. **CDN 加速**：静态资源使用 CDN
5. **日志轮转**：使用 PM2 日志轮转功能
6. **限流保护**：使用 @nestjs/throttler 限制请求频率

### 安全建议

1. ✅ 生产环境必须设置 `db_synchronize=false`
2. ✅ 使用强密码，定期更换数据库密码
3. ✅ 启用 HTTPS（使用 Let's Encrypt）
4. ✅ 配置 CORS 白名单
5. ✅ 敏感信息（密钥、密码）使用环境变量，不要提交到代码仓库
6. ✅ 定期更新依赖包（`npm audit` 检查漏洞）
7. ✅ 配置防火墙，只开放必要端口

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
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
