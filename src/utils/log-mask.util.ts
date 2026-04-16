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
]);

// 判断是否为普通对象，避免误处理 Date/Map 等类型。
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
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

    output[rawKey] = maskForLog(rawValue);
  }

  return output;
}
