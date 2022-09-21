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
// 加密密钥（长度必须是 16 的整数倍，此处为 32 位）
const secretKey = '54050000778e380000fe5a120000b4ce';
// 偏移量
const iv = 'jiangxia';
/**
 * AES加密
 * @description 使用加密秘钥，对 需要加密的参数 进行加密
 * @param {string} word - 需要加密的参数
 * @param {string} key - 加密密钥（长度必须是 16 的整数倍）
 * @param {string} offset - 偏移量
 * @return 16进制字符串 256位
 */
export function aesEncrypt(word: any, key = secretKey, offset = iv) {
  // 未加密的参数 - 从 UTF-8编码 解析出原始字符串
  const wordUTF8 = enc.Utf8.parse(word);
  // 密钥 - 从 UTF-8编码 解析出原始字符串
  const keyUTF8 = enc.Utf8.parse(key);
  // 偏移量 从 UTF-8编码 解析出原始字符串
  const offsetUTF8 = enc.Utf8.parse(offset);

  const encrypted = AES.encrypt(wordUTF8, keyUTF8, {
    iv: offsetUTF8,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
  // 转成16进制 变成大写不影响解密
  return encrypted.toString(CryptoJS.format.Hex).toUpperCase();
}

/**
 * AES解密
 * @description 使用加密秘钥，对 需要解密的参数 进行解密
 * @param {string} encryptedWord - 需要解密的参数
 * @param {string} key - 加密密钥（长度必须是 16 的整数倍）
 * @param {string} offset - 偏移量
 * @return utf8 字符串
 */
export function aesDecrypt(encryptedWord: any, key = secretKey, offset = iv) {
  // 密钥 - 从 UTF-8编码 解析出原始字符串
  const keyUTF8 = enc.Utf8.parse(key);
  // 偏移量 从 UTF-8编码 解析出原始字符串
  const offsetUTF8 = enc.Utf8.parse(offset);
  // 解析十六进制字符串
  encryptedWord = CryptoJS.format.Hex.parse(encryptedWord);
  // console.log('encryptedWord:',encryptedWord)
  const bytes = AES.decrypt(encryptedWord, keyUTF8, {
    iv: offsetUTF8,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });

  return bytes.toString(enc.Utf8);
}
