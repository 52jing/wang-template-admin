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

/**
 * 获取数据源参数
 * @param id 数据源ID
 */
export function getDatasourceParams(
  id: string
): Promise<AxiosResponse<M.ResponseRelationListData>> {
  const url = `/template/datasource/${id}/params`;
  return api.get(url);
}

export function addDatasourceParams(
  id: string,
  params: M.DatasourceParam[]
): Promise<AxiosResponse<M.ReponseBooleanData>> {
  const url = `/template/datasource/${id}/params`;
  return api.post(url, { params });
}

export function updateDatasourceParams(
  id: string,
  params: M.DatasourceParam[]
): Promise<AxiosResponse<M.ReponseBooleanData>> {
  const url = `/template/datasource/${id}/params`;
  return api.put(url, { params });
}

export function deleteDatasourceParams(
  id: string,
  pid: string
): Promise<AxiosResponse<M.ReponseBooleanData>> {
  const url = `/template/datasource/${id}/params/${pid}`;
  return api.delete(url);
}

export function connectDatasource(
  id: string
): Promise<AxiosResponse<M.ReponseBooleanData>> {
  const url = `/template/datasource/${id}/connect`;
  return api.post(url);
}

export function retrieveDatasourceData(
  id: string,
  params: { [key: string]: string }
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = `/template/datasource/${id}/retrieve`;
  return api.post(url, params);
}

export function startRenderExecution(
  data: M.RenderExecutionStart
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/template/render_execution/start';
  return api.post(url, data);
}

export const datasourceTypes: M.OptionItem[] = [
  { label: '数据库SQL', value: 'db_sql' },
];

export const supportedDatabase: M.OptionItem[] = [
  { label: 'MySQL', value: 'mysql' },
  { label: 'Postgresql', value: 'postgresql' },
];
