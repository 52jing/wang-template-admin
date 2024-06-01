import { api } from 'src/boot/axios';
import { AxiosResponse } from 'axios';
import * as M from 'src/components/models';

// 获取用户发送的消息
export function getUserSentMessages(
  page: number,
  pageSize: number
): Promise<AxiosResponse<M.ResponseListData>> {
  const url = '/task/message/sent';
  const params = { page, pageSize };
  return api.get(url, { params });
}

// 获取用户收到的消息
export function getUserReceivedMessages(
  unread: boolean,
  page: number,
  pageSize: number
): Promise<AxiosResponse<M.ResponseListData>> {
  const url = '/task/message/received';
  const params = { unread, page, pageSize };
  return api.get(url, { params });
}

// 获取站内信
export function getMessage(
  id: M.IdType
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = `/task/message/${id}`;
  return api.get(url);
}

// 发送站内信
export function sendMessage(
  data: M.InsideMessage
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/task/message';
  return api.post(url, data);
}

// 读取站内信
export function readMessage(
  id: M.IdType
): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = `/task/message/${id}/read`;
  return api.post(url);
}

// 全部标记已读
export function markAllRead(): Promise<AxiosResponse<M.ResponseDetailData>> {
  const url = '/task/message/all_read';
  return api.post(url);
}
