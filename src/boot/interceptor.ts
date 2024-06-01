import { boot } from 'quasar/wrappers';
import { Loading } from 'quasar';
import axios, { AxiosRequestConfig } from 'axios';
import {
  authTokenType,
  authorizationHeader,
  languageHeader,
} from 'src/utils/constants';
import { api } from './axios';
import { notifyError } from 'src/utils/notify';
import { useProfileStore } from 'src/stores/profile';
import { useCommonStore } from 'src/stores/common';
import * as C from 'src/utils/constants';
import { encryptDataToObject, decryptDataFromObject } from 'src/utils/crypto';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ redirect }) => {
  // 请求拦截器
  const profileStore = useProfileStore();
  const commonStore = useCommonStore();

  // 构造请求头
  const getHeaders = (conf: AxiosRequestConfig) => {
    const d: { [key: string]: string } = {};
    // Authorization
    if (conf.meta && conf.meta.needAuth) {
      const token = profileStore.accessToken;
      if (token) {
        d[authorizationHeader] = authTokenType + ' ' + token;
      }
    }
    // Accept-Language
    const locale = commonStore.langs.selectedLang().value;
    if (locale) {
      d[languageHeader] = locale;
    }
    return d;
  };

  // 请求之前拦截
  api.interceptors.request.use(
    (config) => {
      // 设置请求头
      const h = getHeaders(config);
      for (const k in h) {
        config.headers[k] = h[k];
      }
      // 加密数据
      if (
        commonStore.envConfig.enableCrypto &&
        config.meta?.noCrypto !== true &&
        config.data
      ) {
        config.data = encryptDataToObject(
          config.data,
          commonStore.envConfig.cryptoMode,
          commonStore.envConfig.publicKey
        );
      }
      // 显示载入效果
      if (config.meta?.showLoading) {
        Loading.show(config.meta.loadingConfig);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  let isRefreshing = false;
  type WaitingCallback = () => void;
  let waitingRequests = [] as WaitingCallback[];

  // 响应之后拦截
  api.interceptors.response.use(
    (response) => {
      // 解密数据
      if (
        commonStore.envConfig.enableCrypto &&
        response.config.meta?.noCrypto !== true &&
        response.data
      ) {
        response.data = decryptDataFromObject(
          response.data,
          commonStore.envConfig.publicKey
        );
      }
      // 关闭载入效果
      if (response.config.meta?.showLoading) {
        Loading.hide();
      }
      return response;
    },
    (error) => {
      // TODO
      if (axios.isAxiosError(error)) {
        console.log('axios error', error);
      } else {
        console.log('unexpected error', error);
      }
      if (error.response) {
        const config = error.config;
        // 解密数据
        if (
          commonStore.envConfig.enableCrypto &&
          error.response.config.meta?.noCrypto !== true &&
          error.response.data
        ) {
          error.response.data = decryptDataFromObject(
            error.response.data,
            commonStore.envConfig.publicKey
          );
        }
        // 关闭载入效果
        if (config.meta.showLoading) {
          Loading.hide();
        }
        // 统一错误处理
        switch (error.response.status) {
          case 401:
            // 未认证
            if (config.meta.needAuth) {
              // 需要认证接口
              if (!profileStore.refreshToken) {
                // 无刷新令牌
                redirect({ name: C.routeLoginName });
                return Promise.reject();
              }
              if (!isRefreshing) {
                isRefreshing = true;
                // 刷新令牌
                return profileStore
                  .refreshAccessToken()
                  .then(() => {
                    // 刷新令牌后重新发起等待的请求
                    waitingRequests.forEach((cb) => cb());
                    waitingRequests = [];
                    return api(config);
                  })
                  .catch((err) => {
                    // 刷新失败，返回登录
                    profileStore.logout();
                    waitingRequests = [];
                    redirect({ name: C.routeLoginName });
                    return Promise.reject(err);
                  })
                  .finally(() => {
                    isRefreshing = false;
                  });
              } else {
                // 正在刷新令牌
                return new Promise((resolve) => {
                  waitingRequests.push(() => {
                    resolve(api(config));
                  });
                });
              }
            } else {
              // 不需要认证接口，显示错误信息
              if (config.meta.notifyError) {
                notifyError(error, {
                  message: config.meta.defaultErrorMessage,
                });
              }
            }
            break;
          default:
            // 显示错误信息
            if (config.meta.notifyError) {
              notifyError(error, { message: config.meta.defaultErrorMessage });
            }
            break;
        }
      }
      return Promise.reject(error);
    }
  );
});
