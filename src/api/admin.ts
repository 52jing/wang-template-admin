import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import * as M from 'src/components/models';

/**
 * 管理员设置密码
 * @param userId 用户ID
 * @param newPwd 新密码
 * @returns
 */
export function setPwd(
  userId: M.IdType,
  newPwd: string
): Promise<AxiosResponse<M.ReponseBooleanData>> {
  const url = `/system/user/${userId}/set_password`;
  return api.post(url, { newPwd });
}
