import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import * as M from 'src/components/models';

/**
 * 获取模版类型
 */
export function getTemplateTypes(): Promise<
  AxiosResponse<M.ResponseDetailData>
> {
  const url = '/template/template/types';
  return api.get(url);
}
