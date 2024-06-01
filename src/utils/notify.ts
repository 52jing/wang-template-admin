import { AxiosResponse } from 'axios';
import _ from 'lodash';
import { Notify } from 'quasar';
import { QNotifyCreateOptions } from 'quasar';
import { i18n } from 'src/boot/i18n';
import { responseErrorCodeKey, responseMessageKey } from './constants';

interface RequestError {
  response: AxiosResponse;
}

// 状态码响应配置
const errMap: { [k: number]: QNotifyCreateOptions } = {
  403: {
    message: i18n.global.t('message.forbidden'),
    type: 'negative',
  },
  429: {
    message: i18n.global.t('message.rateLimit'),
    type: 'negative',
  },
};

/**
 * 显示错误弹窗
 * @param error 请求错误
 * @param options 通知配置
 */
export function notifyError(
  error?: RequestError,
  options?: QNotifyCreateOptions
) {
  // 设置默认配置
  if (!options) {
    options = {
      type: 'negative',
      message: i18n.global.t('message.serverError'),
    };
  }
  if (!options.type) {
    options.type = 'negative';
  }
  if (error) {
    // 提供错误对象，则提取信息覆盖
    if (error.response.status in errMap) {
      options = _.assign(options, errMap[error.response.status]);
    } else {
      let data = error.response.data;
      if (data instanceof ArrayBuffer) {
        const enc = new TextDecoder('utf-8');
        const uint8 = new Uint8Array(data);
        data = JSON.parse(enc.decode(uint8));
      }
      const msg = [] as string[];
      if (data[responseErrorCodeKey]) {
        msg.push(data[responseErrorCodeKey]);
      }
      if (data[responseMessageKey]) {
        if (data[responseMessageKey] instanceof Array) {
          msg.push(data[responseMessageKey].join('; '));
        } else {
          msg.push(data[responseMessageKey].toString());
        }
      }
      if (msg.length > 0) {
        options.message = msg.join(' ');
      }
    }
  }
  Notify.create(options);
}

/**
 * 显示禁止访问
 */
export function notifyForbidden() {
  notifyError(undefined, { message: i18n.global.t('message.forbidden') });
}

/**
 * 显示成功弹窗
 * @param message 显示信息
 * @param options 通知配置
 */
export function notifySuccess(
  message?: string,
  translate = true,
  options?: QNotifyCreateOptions
) {
  // 默认配置
  if (!options) {
    options = {
      type: 'positive',
      icon: 'fa-solid fa-check',
    };
  }
  if (message) {
    options.message = translate ? i18n.global.t(message) : message;
  } else {
    options.message = i18n.global.t('success');
  }
  Notify.create(options);
}
