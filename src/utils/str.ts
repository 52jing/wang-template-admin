import { date } from 'quasar';
import * as C from 'src/utils/constants';

/**
 * 生成随机字符串
 * @param length 字符串长度
 * @returns 随机字符串
 */
export function randomString(length: number) {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += str[Math.floor(Math.random() * str.length)];
  }
  return result;
}

/**
 * 蛇形法命名转驼峰法
 * @param name
 * @returns
 */
export function snakeToCamel(name: string) {
  return name.replace(/_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

/**
 * 驼峰法命名转蛇形法
 * @param name
 * @returns
 */
export function camelToSnake(name: string) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * 字符串转换布尔值
 * @param val
 * @param defVal
 * @returns boolean
 */
export function strToBool(val: string | undefined | null, defVal?: boolean) {
  if (val) {
    if (val === '1' || val === 'on' || val === 'true') {
      return true;
    } else if (val === '0' || val === 'off' || val === 'false') {
      return false;
    } else {
      return defVal;
    }
  } else {
    return defVal;
  }
}

/**
 * 格式化时间日期
 * @param d
 * @param format
 * @returns string
 */
export function formatDate(
  d: string | number | Date | undefined,
  format?: string
) {
  if (!format) {
    format = C.dateTimeFormat;
  }
  return date.formatDate(d, format);
}

const emailPattern =
  /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/;

/**
 * 判断字符串是否为邮箱
 * @param val 字符串
 * @param noBlack 不能为空
 * @returns boolean
 */
export function isEmail(val: string, noBlack?: boolean) {
  if (!val && noBlack !== true) {
    return true;
  }
  return emailPattern.test(val);
}

const telPattern = /^1[3-9][0-9]{9}$/;

/**
 * 判断字符串是否为手机号
 * @param val 字符串
 * @param noBlack 不能为空
 * @returns boolean
 */
export function isTel(val: string, noBlack?: boolean) {
  if (!val && noBlack !== true) {
    return true;
  }
  return telPattern.test(val);
}

/**
 * 获取截取定长的字符串
 * @param val 字符串
 * @param len 最大长度
 * @returns string
 */
export function restrictLength(val: string, len: number) {
  if (val.length <= len) {
    return val;
  } else {
    return val.substring(0, len);
  }
}
