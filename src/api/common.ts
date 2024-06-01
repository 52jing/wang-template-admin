import { AxiosResponse } from 'axios';
import { api } from 'src/boot/axios';
import * as M from 'src/components/models';

// 获取系统字典
export function getSystemDict(
  name: string
): Promise<AxiosResponse<M.ResponseRelationListData>> {
  const url = '/system_dict/' + name;
  return api.get(url, { meta: { needAuth: false } });
}

// 获取用户字典
export function getUserDict(
  group: string,
  code: string
): Promise<AxiosResponse<M.ResponseRelationListData>> {
  const url = '/user_dict';
  const params = { group, code };
  return api.get(url, { params });
}

// 获取用户字典
export function getUserDictById(
  id: M.IdType
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/user_dict/' + id;
  return api.get(url);
}

// 获取前端配置
export function getFrontendProfile(
  id: string
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/frontend/' + id;
  return api.get(url, { meta: { needAuth: false, showLoading: false } });
}

// 获取公告详情
export function getAnnouncement(
  id: string
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = `/announcement/${id}`;
  return api.get(url);
}

// 获取公告
export function getAnnouncements(
  type: string
): Promise<AxiosResponse<M.ResponseListData>> {
  const url = '/announcements';
  const params = { type };
  return api.get(url, { params });
}

// 上传文件
export function upload(
  formdata: FormData
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/upload';
  return api.post(url, formdata, {
    headers: { 'Content-Type': 'multipart/form-data' },
    meta: {
      noCrypto: true,
    },
  });
}

// 上传图片
export function uploadImage(
  formdata: FormData
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/upload_image';
  return api.post(url, formdata, {
    headers: { 'Content-Type': 'multipart/form-data' },
    meta: {
      noCrypto: true,
    },
  });
}

// 获取附件信息
export function getAttachment(
  id: string
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = `/attachment/${id}`;
  return api.get(url);
}

// 下载文件
export function download(id: string) {
  const url = `/download/${id}`;
  return api.get(url, { responseType: 'blob', meta: { noCrypto: true } });
}
