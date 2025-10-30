# 邮箱注册登录功能API测试指南

## 前置条件

1. 确保项目已正确配置邮箱环境变量（参考 `EMAIL_SETUP.md`）
2. 确保Redis服务正在运行
3. 确保数据库已添加email字段

## API测试示例

### 1. 发送注册验证码

```bash
curl -X POST http://localhost:3000/user/email/sendCode \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "type": "register"
  }'
```

**预期响应：**
```json
{
  "message": "验证码发送成功"
}
```

### 2. 邮箱注册

```bash
curl -X POST http://localhost:3000/user/email/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "nickname": "测试用户",
    "password": "123456",
    "passwordRepeat": "123456",
    "verificationCode": "123456"
  }'
```

**预期响应：**
```json
{
  "id": 1,
  "email": "test@example.com",
  "nickname": "测试用户",
  "role": "author",
  "status": "active",
  "createTime": "2025-10-28T10:00:00.000Z",
  "updateTime": "2025-10-28T10:00:00.000Z"
}
```

### 3. 发送登录验证码

```bash
curl -X POST http://localhost:3000/user/email/sendCode \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "type": "login"
  }'
```

### 4. 邮箱登录

```bash
curl -X POST http://localhost:3000/user/email/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456",
    "verificationCode": "123456"
  }'
```

**预期响应：**
```json
{
  "info": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "test@example.com",
      "nickname": "测试用户",
      "role": "author",
      "status": "active"
    }
  }
}
```

## 错误响应示例

### 验证码错误
```json
{
  "statusCode": 400,
  "message": "验证码错误",
  "error": "Bad Request"
}
```

### 邮箱已注册
```json
{
  "statusCode": 400,
  "message": "该邮箱已被注册",
  "error": "Bad Request"
}
```

### 请求过于频繁
```json
{
  "statusCode": 429,
  "message": "请求过于频繁，请稍后再试",
  "error": "Too Many Requests"
}
```

## 使用Swagger测试

1. 启动项目：`npm run start:dev`
2. 访问：`http://localhost:3000/api`
3. 找到"用户模块"相关的邮箱接口
4. 按照上述示例进行测试

## 注意事项

1. **验证码有效期**：5分钟
2. **发送频率**：60秒内只能发送一次
3. **邮箱格式**：必须是有效的邮箱格式
4. **密码**：前端需要使用RSA加密传输
5. **Token使用**：登录成功后可使用token访问需要认证的接口
