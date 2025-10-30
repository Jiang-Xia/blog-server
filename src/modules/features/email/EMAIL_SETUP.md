# 邮箱注册登录功能配置说明

## 功能概述

本项目已成功集成邮箱注册和登录功能，包括：

- ✅ 邮箱验证码发送
- ✅ 邮箱注册
- ✅ 邮箱登录
- ✅ 验证码验证
- ✅ 频率限制

## 环境变量配置

请在项目根目录的 `.env` 文件中添加以下邮箱服务配置：

```env
# 邮箱服务配置（必需）
EMAIL_HOST=smtp.qq.com          # SMTP服务器地址
EMAIL_PORT=587                  # SMTP端口
EMAIL_USER=your_email@qq.com    # 发送邮箱账号
EMAIL_PASS=your_email_password  # 邮箱授权码（不是登录密码）
```

## 邮箱服务配置说明

### QQ邮箱配置示例：
1. **EMAIL_HOST**: `smtp.qq.com`
2. **EMAIL_PORT**: `587`
3. **EMAIL_USER**: 您的QQ邮箱地址
4. **EMAIL_PASS**: QQ邮箱的授权码（非登录密码）

**获取QQ邮箱授权码步骤：**
1. 登录QQ邮箱
2. 点击"设置" -> "账户"
3. 找到"POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务"
4. 开启"IMAP/SMTP服务"
5. 按提示获取授权码

### 其他邮箱服务商配置：

**163邮箱：**
```env
EMAIL_HOST=smtp.163.com
EMAIL_PORT=587
```

**Gmail：**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

## API接口说明

### 1. 发送邮箱验证码
```
POST /user/email/sendCode
```

**请求体：**
```json
{
  "email": "user@example.com",
  "type": "register"  // register | login | reset
}
```

### 2. 邮箱注册
```
POST /user/email/register
```

**请求体：**
```json
{
  "email": "user@example.com",
  "nickname": "用户昵称",
  "password": "123456",
  "passwordRepeat": "123456",
  "verificationCode": "123456"
}
```

### 3. 邮箱登录
```
POST /user/email/login
```

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "verificationCode": "123456"
}
```

## 数据库变更

User实体已添加email字段：
```typescript
@Column('text', { nullable: true, unique: true })
email?: string;
```

**注意：** 如果数据库中已有数据，需要执行数据库迁移添加email字段。

## 验证码机制

- **存储方式**: Redis
- **有效期**: 5分钟
- **验证码长度**: 6位数字
- **发送频率限制**: 60秒/次
- **验证后自动删除**: 验证成功后立即从Redis中删除

## 安全特性

1. **邮箱唯一性**: 同一邮箱只能注册一个账户
2. **验证码加密存储**: 验证码在Redis中安全存储
3. **频率限制**: 防止验证码滥发
4. **密码加密**: 使用盐值加密存储密码
5. **JWT认证**: 登录后使用JWT token进行身份验证

## 错误处理

常见错误及解决方案：

1. **邮件发送失败**: 检查邮箱配置和网络连接
2. **验证码过期**: 重新发送验证码
3. **邮箱已注册**: 使用登录功能或找回密码
4. **验证码错误**: 输入正确的验证码
5. **请求过于频繁**: 等待60秒后重新发送

## 测试建议

1. 使用真实的邮箱地址进行测试
2. 确保邮箱服务配置正确
3. 检查垃圾邮件文件夹
4. 验证Redis连接正常
5. 测试各种边界情况（过期、重复等）
