// src/utils/cryptogram.util.ts

import * as crypto from 'crypto';
import { enc, mode, AES, pad } from 'crypto-js';

// 随机盐
export function makeSalt(): string {
  return crypto.randomBytes(3).toString('base64');
}

/**
 * 使用盐加密明文密码
 * @param password 密码
 * @param salt 密码盐
 */
export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  return (
    // 10000 代表迭代次数 16代表长度
    crypto.pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1').toString('base64')
  );
}

/* 
  对称加解密 和home端对应的aes加解密
*/
const secretKey = '54050000778e380000fe5a120000b4ce';
// 偏移量
const iv = 'jiang-xia';

export function aseEncryptParams(word: any, key = secretKey, offset = iv) {
  // 未加密的参数 - 从 UTF-8编码 解析出原始字符串
  const wordUTF8 = enc.Utf8.parse(word);
  // 密钥 - 从 UTF-8编码 解析出原始字符串
  const keyUTF8 = enc.Utf8.parse(key);
  // 偏移量（在此公司内是固定的） - 从 UTF-8编码 解析出原始字符串
  const offsetUTF8 = enc.Utf8.parse(offset);

  // 补充
  // 把字符串转成 UTF-8编码 —— enc.Utf8.stringify(word);

  const encrypted = AES.encrypt(wordUTF8, keyUTF8, {
    iv: offsetUTF8,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });

  return encrypted.toString();
}

/**
 * ASE解密
 * @description 使用加密秘钥，对 需要解密的参数 进行解密
 * @param {string} encryptedWord - 需要解密的参数
 * @param {string} key - 加密密钥（长度必须是 16 的整数倍）
 * @param {string} offset - 偏移量
 */
export function aesDecryptParams(encryptedWord: any, key = secretKey, offset = iv) {
  // 密钥 - 从 UTF-8编码 解析出原始字符串
  const keyUTF8 = enc.Utf8.parse(key);
  // 偏移量（在此公司内是固定的） - 从 UTF-8编码 解析出原始字符串
  const offsetUTF8 = enc.Utf8.parse(offset);

  const bytes = AES.decrypt(encryptedWord, keyUTF8, {
    iv: offsetUTF8,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });

  return bytes.toString(enc.Utf8);
}
