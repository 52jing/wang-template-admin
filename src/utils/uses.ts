import { useMeta } from 'quasar';
import { toValue } from 'vue';
import { AxiosResponse, ResponseType } from 'axios';
import { RequestConfigMeta } from 'src/boot/axios';
import * as C from 'src/utils/constants';
import * as M from 'src/components/models';
import { i18n } from 'src/boot/i18n';
import { api } from 'src/boot/axios';
import { useCommonStore } from 'src/stores/common';
import _ from 'lodash';

/**
 * 通用页面功能
 * 设置页面 Meta 信息
 */
export function useCommonPage() {
  const commonStore = useCommonStore();
  const pageTitle =
    commonStore.frontendProfile.title +
    ' - ' +
    i18n.global.t(commonStore.pageConfig.title);
  const pageDescription = commonStore.pageConfig.description;
  const pageKeywords = commonStore.pageConfig.keywords;
  const metaData = {
    title: pageTitle,
    meta: {
      description: { name: 'description', content: pageDescription },
      keywords: { name: 'keywords', content: pageKeywords },
    },
  };
  useMeta(metaData);
}

/**
 * Restful 资源对象
 */
class RestResource {
  // 资源地址
  resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  async list({
    // 筛选映射
    filter,
    // 排序数组
    sorts,
    // 获取页码
    page = 1,
    // 每页数量
    pageSize = 10,
    // 搜索字符串
    query = '',
    // 响应类型
    responseType = 'json',
    // 超时时间（毫秒）
    timeout,
    // 处理响应
    transformResponse,
    // 请求后数据处理
    postProcess,
    // 请求配置
    meta,
  }: {
    filter?: Record<string, unknown>;
    sorts?: string[];
    page?: number;
    pageSize?: number;
    query?: string;
    responseType?: ResponseType;
    timeout?: number;
    transformResponse?: (res: AxiosResponse) => AxiosResponse;
    postProcess?: (data: M.ResponseListData) => M.ResponseListData;
    meta?: RequestConfigMeta;
  } = {}): Promise<M.ResponseListData> {
    const url = this.resource;
    // 构建请求参数
    const params = {} as Record<string, string>;
    if (filter) {
      _.assign(params, filter);
    }
    if (sorts && sorts.length > 0) {
      params[C.requestSortKey] = sorts.join(C.requestSortSep);
    }
    if (page && page > 0) {
      params[C.requestPageKey] = page.toString();
    }
    if (pageSize && pageSize > 0) {
      params[C.requestPageSizeKey] = pageSize.toString();
    }
    if (query) {
      params[C.requestSearchKey] = query;
    }
    // 发起请求
    let res = await api.get<M.ResponseListData>(url, {
      params,
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }

  async listRoot({
    // 响应类型
    responseType = 'json',
    // 超时时间（毫秒）
    timeout,
    // 处理响应
    transformResponse,
    // 请求后数据处理
    postProcess,
    // 请求配置
    meta,
  }: {
    responseType?: ResponseType;
    timeout?: number;
    transformResponse?: (res: AxiosResponse) => AxiosResponse;
    postProcess?: (data: M.ResponseListData) => M.ResponseListData;
    meta?: RequestConfigMeta;
  } = {}): Promise<M.ResponseListData> {
    const url = this.resource + '/' + C.rootPathKey;
    // 发起请求
    let res = await api.get<M.ResponseListData>(url, {
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }

  async getChildren(
    id: M.IdType,
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求后数据处理
      postProcess,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      postProcess?: (data: M.ResponseListData) => M.ResponseListData;
      meta?: RequestConfigMeta;
    } = {}
  ): Promise<M.ResponseListData> {
    const url = `${this.resource}/${id}/${C.childrenPathKey}`;
    // 发起请求
    let res = await api.get<M.ResponseListData>(url, {
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }

  async detail(
    id: M.IdType,
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求后数据处理
      postProcess,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      postProcess?: (data: M.ResponseDetailData) => M.ResponseDetailData;
      meta?: RequestConfigMeta;
    } = {}
  ): Promise<M.ResponseDetailData> {
    const url = `${this.resource}/${id}`;
    // 发起请求
    let res = await api.get<M.ResponseDetailData>(url, {
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }

  async create(
    data: object,
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求后数据处理
      postProcess,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      postProcess?: (data: M.ResponseDetailData) => M.ResponseDetailData;
      meta?: RequestConfigMeta;
    } = {}
  ): Promise<M.ResponseDetailData> {
    const url = this.resource;
    // 发起请求
    let res = await api.post<M.ResponseDetailData>(url, data, {
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }

  async update(
    id: M.IdType,
    data: object,
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求后数据处理
      postProcess,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      postProcess?: (data: M.ResponseDetailData) => M.ResponseDetailData;
      meta?: RequestConfigMeta;
    } = {}
  ): Promise<M.ResponseDetailData> {
    const url = `${this.resource}/${id}`;
    // 发起请求
    let res = await api.put<M.ResponseDetailData>(url, data, {
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }

  async delete(
    id: M.IdType,
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      meta?: RequestConfigMeta;
    } = {}
  ) {
    const url = `${this.resource}/${id}`;
    // 发起请求
    let res = await api.delete(url, {
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    return res.data;
  }

  async batchDelete(
    ids: M.IdType[],
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      meta?: RequestConfigMeta;
    } = {}
  ) {
    // 发起请求
    let res = await api.delete(this.resource, {
      data: { ids },
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    return res.data;
  }

  async export({
    // 筛选映射
    filter,
    // 搜索字符串
    query = '',
    // 响应类型
    responseType = 'json',
    // 超时时间（毫秒）
    timeout,
    // 处理响应
    transformResponse,
    // 请求后数据处理
    postProcess,
    // 请求配置
    meta,
  }: {
    filter?: Record<string, unknown>;
    query?: string;
    responseType?: ResponseType;
    timeout?: number;
    transformResponse?: (res: AxiosResponse) => AxiosResponse;
    postProcess?: (data: M.ResponseDetailData) => M.ResponseDetailData;
    meta?: RequestConfigMeta;
  } = {}) {
    const url = this.resource + '/export';
    // 构建请求参数
    const params = {} as Record<string, string>;
    if (filter) {
      _.assign(params, filter);
    }
    if (query) {
      params[C.requestSearchKey] = query;
    }
    // 发起请求
    let res = await api.post<M.ResponseDetailData>(url, undefined, {
      params,
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }
}

/**
 * Restful 一对多，多对多关系
 */
class RestRelation {
  // 资源地址
  resource: string;
  // 关联资源名
  relationName: string;

  constructor(resource: string, relationName: string) {
    this.resource = resource;
    this.relationName = relationName;
  }

  async list(
    id: M.IdType,
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求后数据处理
      postProcess,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      postProcess?: (
        data: M.ResponseRelationListData
      ) => M.ResponseRelationListData;
      meta?: RequestConfigMeta;
    } = {}
  ): Promise<M.ResponseDetailData> {
    const url = `${this.resource}/${id}/${this.relationName}`;
    let res = await api.get<M.ResponseRelationListData>(url, {
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }

  async add(
    id: M.IdType,
    ids: M.IdType[],
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求后数据处理
      postProcess,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      postProcess?: (data: M.ReponseBooleanData) => M.ReponseBooleanData;
      meta?: RequestConfigMeta;
    } = {}
  ): Promise<M.ResponseDetailData> {
    const url = `${this.resource}/${id}/${this.relationName}`;
    let res = await api.post<M.ReponseBooleanData>(
      url,
      { ids },
      {
        meta,
        responseType,
        timeout,
      }
    );
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }

  async set(
    id: M.IdType,
    ids: M.IdType[],
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求后数据处理
      postProcess,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      postProcess?: (data: M.ReponseBooleanData) => M.ReponseBooleanData;
      meta?: RequestConfigMeta;
    } = {}
  ): Promise<M.ResponseDetailData> {
    const url = `${this.resource}/${id}/${this.relationName}`;
    let res = await api.put<M.ReponseBooleanData>(
      url,
      { ids },
      {
        meta,
        responseType,
        timeout,
      }
    );
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }

  async delete(
    id: M.IdType,
    ids: M.IdType[],
    {
      // 响应类型
      responseType = 'json',
      // 超时时间（毫秒）
      timeout,
      // 处理响应
      transformResponse,
      // 请求后数据处理
      postProcess,
      // 请求配置
      meta,
    }: {
      responseType?: ResponseType;
      timeout?: number;
      transformResponse?: (res: AxiosResponse) => AxiosResponse;
      postProcess?: (data: M.ReponseBooleanData) => M.ReponseBooleanData;
      meta?: RequestConfigMeta;
    } = {}
  ): Promise<M.ResponseDetailData> {
    const url = `${this.resource}/${id}/${this.relationName}`;
    let res = await api.delete<M.ReponseBooleanData>(url, {
      data: { ids },
      meta,
      responseType,
      timeout,
    });
    // 处理数据
    if (transformResponse) res = transformResponse(res);
    if (postProcess) {
      return postProcess(res.data);
    }
    return res.data;
  }
}

/**
 * Rest 资源功能
 */
export function useRest() {
  function restResource(resource: string) {
    return new RestResource(toValue(resource));
  }

  function restRelation(resource: string, relationName: string) {
    return new RestRelation(toValue(resource), toValue(relationName));
  }

  return { restResource, restRelation };
}
