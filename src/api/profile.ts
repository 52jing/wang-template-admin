import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import * as M from 'src/components/models';

// 获取当前用户信息
export function getProfile(): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/profile';
  return api.get(url, { meta: { showLoading: false } });
}

// 修改当前用户信息
export function updateProfile(
  user: M.User
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/profile';
  return api.post(url, user);
}

// 获取当前用户权限
export function getMyPermissions(): Promise<
  AxiosResponse<M.ResponseRelationListData>
> {
  const url = 'my_permissions';
  return api.get(url, { meta: { showLoading: false } });
}

// 获取当前用户菜单
export function getMyMenus(): Promise<
  AxiosResponse<M.ResponseRelationListData>
> {
  const url = '/my_menus';
  return api.get(url, { meta: { showLoading: false } });
}

// 修改密码
export function changePwd(
  oldPwd: string,
  newPwd: string
): Promise<AxiosResponse<M.ReponseBooleanData>> {
  const url = '/change_password';
  return api.post(url, { oldPwd, newPwd });
}
