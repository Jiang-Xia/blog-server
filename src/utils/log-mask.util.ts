const SENSITIVE_KEYS = new Set([
  'password',
  'newpassword',
  'oldpassword',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'cookie',
  'phone',
  'email',
  'idcard',
  'bankcard',
  // 验证码/加密载荷等大字段：避免日志爆炸与泄露
  'captchabase64',
  'captcha',
  'svg',
]);

// 判断是否为普通对象，避免误处理 Date/Map 等类型。
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function truncateString(value: string, head = 24, tail = 12): string {
  if (value.length <= head + tail + 20) {
    return value;
  }
  return `${value.slice(0, head)}…(${value.length})…${value.slice(-tail)}`;
}

// 手机号脱敏：保留前三后四，其余打码。
function maskPhone(value: string): string {
  if (value.length < 7) {
    return '******';
  }
  return value.replace(/^(\d{3})\d+(\d{4})$/, '$1****$2');
}

// 邮箱脱敏：仅保留首字符和域名。
function maskEmail(value: string): string {
  const [name = '', domain = ''] = value.split('@');
  if (!name || !domain) {
    return '******';
  }
  return `${name[0]}***@${domain}`;
}

// 根据字段类型选择对应脱敏策略。
function maskValueByKey(key: string, value: unknown): unknown {
  if (typeof value !== 'string') {
    return '******';
  }

  // 验证码 base64 / svg / encrypt content：只保留长度与片段
  if (key === 'captchabase64' || key === 'svg') {
    return truncateString(value);
  }

  if (key.includes('phone')) {
    return maskPhone(value);
  }

  if (key.includes('email')) {
    return maskEmail(value);
  }

  return '******';
}

// 递归脱敏日志对象，支持嵌套对象与数组。
export function maskForLog(input: unknown): unknown {
  if (Array.isArray(input)) {
    return input.map((item) => maskForLog(item));
  }

  // 对超长字符串做截断，避免日志爆炸（尤其是 encrypt content / base64）
  if (typeof input === 'string') {
    if (input.length > 200) {
      return truncateString(input, 32, 16);
    }
    return input;
  }

  if (!isPlainObject(input)) {
    return input;
  }

  const output: Record<string, unknown> = {};
  for (const [rawKey, rawValue] of Object.entries(input)) {
    const normalizedKey = rawKey.toLowerCase();
    if (SENSITIVE_KEYS.has(normalizedKey)) {
      output[rawKey] = maskValueByKey(normalizedKey, rawValue);
      continue;
    }

    // encrypt 网关返回/请求常用 { content: '...' }，内容通常很长，直接截断即可
    if (normalizedKey === 'content' && typeof rawValue === 'string') {
      output[rawKey] = truncateString(rawValue, 32, 16);
      continue;
    }

    output[rawKey] = maskForLog(rawValue);
  }

  return output;
}
