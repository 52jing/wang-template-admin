import CryptoJS from 'crypto-js';
import sm2 from 'sm-crypto';
import { randomString } from 'src/utils/str';
import * as M from 'src/components/models';

/**
 * 支持的加密模式，与后端对应
 */
const supportedModes = ['aes_rsa', 'aes_sm2', 'rsa', 'sm2'];

/**
 * 获取加密模式名称
 * @param mode 加密模式
 * @returns 加密模式名称
 */
function decryptCryptoMode(mode: string): string {
  const tm = decryptByBase64(mode).toString();
  if (supportedModes.indexOf(tm) >= 0) {
    return tm;
  }
  return '';
}

/**
 * 生成 AES 密钥
 * @returns string
 */
function generateAESKey(): string {
  return randomString(16);
}

/**
 * 使用 AES 加密数据
 * @param text 数据
 * @param aesKey AES密钥
 * @returns 密文
 */
function encryptByAES(text: string, aesKey: string): string {
  const key = CryptoJS.enc.Utf8.parse(aesKey);
  const encryptedData = CryptoJS.AES.encrypt(text, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Base64.stringify(encryptedData.ciphertext);
}

/**
 * 使用 AES 解密数据
 * @param text 密文
 * @param key AES密钥
 * @returns 解密原文
 */
function decryptByAES(text: string, key: CryptoJS.lib.WordArray): string {
  const bytes = CryptoJS.AES.decrypt(text, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * 使用 SM2 加密数据
 * @param text 数据
 * @param publicKey 公钥
 * @returns 加密数据
 */
function encryptBySM2(text: string, publicKey: string): string {
  let encryptedData = sm2.sm2.doEncrypt(text, publicKey, 1);
  // 后端对接，密文必须以 04 开头
  if (!encryptedData.startsWith('04')) {
    encryptedData = '04' + encryptedData;
  }
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encryptedData));
}

/**
 * 使用 Base64 编码数据
 * @param text 数据
 * @returns 加密数据
 */
function encryptByBase64(text: string): string {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
}

/**
 * 使用 Base64 解码数据
 * @param text 数据
 * @returns 原文
 */
function decryptByBase64(text: string): string {
  return CryptoJS.enc.Base64.parse(text).toString(CryptoJS.enc.Utf8);
}

/**
 * 使用 Base64 解码数据
 * @param text 数据
 * @returns 原文
 */
function decryptByBase64Raw(text: string) {
  return CryptoJS.enc.Base64.parse(text);
}

/**
 * 从对象解密数据
 * @param data 返回对象
 * @param publicKey 公钥
 * @returns 解密对象
 */
export function decryptDataFromObject(
  data: M.ResponseCryptoData,
  publicKey: string
) {
  const mode = decryptCryptoMode(data.mode);
  if (!mode) {
    // 无效的模式
    console.warn('无效的加密模式！');
    return data;
  }
  console.log(publicKey);
  switch (mode) {
    case 'aes_sm2':
      const aesKey = decryptByBase64Raw(data.id);
      const str1 = decryptByAES(data.jsondata, aesKey);
      return JSON.parse(str1);
    case 'sm2':
      const str2 = decryptByBase64(data.jsondata);
      return JSON.parse(str2.toString());
    default:
      console.warn('不支持的模式！');
  }
  return data;
}

/**
 * 加密数据到对象
 * @param data 数据
 * @param mode 加密模式
 * @param publicKey 公钥
 * @returns 加密对象
 */
export function encryptDataToObject(
  data: object | string,
  mode: string,
  publicKey: string
) {
  if (supportedModes.indexOf(mode) < 0) {
    // 无效的模式
    console.warn('无效的加密模式！');
    return data;
  }
  let d: string;
  if (typeof data === 'string') {
    d = data;
  } else {
    d = JSON.stringify(data);
  }
  switch (mode) {
    case 'aes_sm2':
      const aesKey = generateAESKey();
      return {
        id: encryptBySM2(aesKey, publicKey),
        jsondata: encryptByAES(d, aesKey),
        mode: encryptByBase64(mode),
      };
    case 'sm2':
      return {
        id: '',
        jsondata: encryptBySM2(d, publicKey),
        mode: encryptByBase64(mode),
      };
    default:
      console.warn('不支持的模式！');
  }
  return data;
}

/**
 * 加密数据字段
 * @param data 数据
 * @param mode 加密模式
 * @param publicKey 公钥
 * @returns 加密对象
 */
export function encryptString(data: string, mode: string, publicKey: string) {
  if (supportedModes.indexOf(mode) < 0) {
    // 无效的模式
    console.warn('无效的加密模式！');
    return data;
  }
  if (mode === 'aes_sm2' || mode === 'sm2') {
    return encryptBySM2(data, publicKey);
  } else {
    console.warn('不支持的模式！');
  }
  return data;
}
