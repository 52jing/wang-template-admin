import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { QLoadingShowOptions } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// 请求元配置信息
export interface RequestConfigMeta {
  // 标示接口是否需要认证，认证则添加认证头，且返回 401 时跳转登录页面，默认 true
  needAuth?: boolean;
  // 标示接口是否自动显示错误信息，默认 true
  notifyError?: boolean;
  // 标示接口的默认错误信息，notifyError 为 true 时有效
  defaultErrorMessage?: string;
  // 标示接口是否取消加解密，当启用全局加解密时有效，默认 false
  noCrypto?: boolean;
  // 标示接口是否显示载入效果，默认 true
  showLoading?: boolean;
  // 标示载入效果配置
  loadingConfig?: QLoadingShowOptions;
}

// 扩展请求配置接口
declare module 'axios' {
  export interface AxiosRequestConfig {
    meta?: RequestConfigMeta;
  }
}

let baseApi = '/api/';
if (process.env.BASE_API) {
  baseApi = process.env.BASE_API;
}

const requestTimeout = 30000;

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: baseApi,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
  timeout: requestTimeout,
  meta: {
    needAuth: true,
    notifyError: true,
    defaultErrorMessage: '',
    noCrypto: false,
    showLoading: true,
    loadingConfig: {},
  },
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
