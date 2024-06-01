import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import * as M from 'src/components/models';
// import * as C from 'src/utils/constants';

// 登录
export function login(
  data: M.LoginBody
): Promise<AxiosResponse<M.ResponseTokenData>> {
  const url = '/login';
  // 加密密码
  // data.password = encryptPassword(data.password, context.rootState.common.enableFieldCrypto, context.rootState.common.cryptoMode, context.rootState.common.publicKey)
  return api.post(url, data, { meta: { needAuth: false } });
}

// 刷新令牌
export function refreshAccessToken(
  accessToken?: string,
  refreshToken?: string
): Promise<AxiosResponse<M.ResponseTokenData>> {
  const url = '/refresh_token';
  const data = {
    accessToken,
    refreshToken,
  };
  return api.post(url, data, { meta: { needAuth: false, showLoading: false } });
}

// 注销
export function logout(
  accessToken?: string,
  refreshToken?: string
): Promise<AxiosResponse<M.ReponseBooleanData>> {
  const url = '/logout';
  const data = {
    accessToken,
    refreshToken,
  };
  return api.post(url, data);
}

// 注册
export function register(
  data: M.RegisterBody
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/register';
  return api.post(url, data, { meta: { needAuth: false } });
}

// 获取图像验证码
export function getImageCaptcha(uid: string) {
  const url = '/captcha/image';
  const params = { uid };
  return api.get(url, {
    params: params,
    meta: { needAuth: false, showLoading: false },
  });
}

// 验证验证码
export function verifyCaptcha(
  type: string,
  uid: string,
  captcha: string
): Promise<AxiosResponse<M.ReponseBooleanData>> {
  const url = '/captcha/verify';
  const data = { captchaType: type, uuid: uid, captcha: captcha };
  return api.post(url, data, {
    meta: { needAuth: false, showLoading: false, notifyError: false },
  });
}

// 查询用户
export function userSearch(
  query: string
): Promise<AxiosResponse<M.ResponseListData>> {
  const url = '/user/search';
  const params = { query };
  return api.get(url, {
    params: params,
  });
}
