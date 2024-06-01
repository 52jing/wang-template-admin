import * as M from 'src/components/models';
import _ from 'lodash';
import { AxiosResponse } from 'axios';

/**
 * 数组转树状结构。
 * 需要数组中的对象包含属性 id、 parentId 和 sort
 * parentId 为 null（根节点）或上层对象 id
 * sort 用于排序，越小的越前面
 * 返回的树状对象包含 children 子对象数组
 *
 * @param {Array} data
 * @param {Boolean} disabled
 * @param {Number} maxScan
 * @returns {Array} M.TreeNode[]
 */
export function buildTree(
  data: Array<M.TreeNode>,
  disabled: boolean,
  maxScan = 100
) {
  const dataCopy = JSON.parse(JSON.stringify(data));
  const tree = [] as M.TreeNode[];
  // scan
  let i = 0;
  while (dataCopy.length > 0 && i <= maxScan) {
    const d = dataCopy.shift();
    if (!d) {
      continue;
    }
    // set disabled
    if (disabled) {
      d.disabled = true;
    }
    if (!d.parentId) {
      // root
      if (!d.children) {
        d.children = [];
      }
      tree.push(d);
    } else {
      // children
      // find parent data
      let findParent = false;
      for (const j in tree) {
        if (d.parentId && tree[j].id.toString() === d.parentId.toString()) {
          findParent = true;
          tree[j].children.push(d);
          break;
        }
      }
      if (!findParent) {
        // parent not found, send back
        dataCopy.push(d);
      }
    }
    // break for max scan
    i++;
  }
  // sort
  const sortFunc = (a: M.TreeNode, b: M.TreeNode) => {
    return a.sort - b.sort;
  };
  tree.sort(sortFunc);
  for (const m of tree) {
    if (m.children) {
      m.children.sort(sortFunc);
    }
  }
  return tree;
}

/**
 * 数组转换为树节点数组
 * @param data 数组
 * @param lazy 是否懒加载
 * @returns 树节点数组
 */
export function listToTreeNodes(
  data: object[],
  lazy = false
): Array<M.TreeNode> {
  const arr: Array<M.TreeNode> = [];
  data.forEach((item) => {
    if (_.has(item, 'id') && _.has(item, 'name')) {
      const children = _.get(item, 'children', new Array<M.TreeNode>());
      const node = {
        id: (_.get(item, 'id') ?? '').toString(),
        name: (_.get(item, 'name') ?? '').toString(),
        parentId: _.get(item, 'parentId', null),
        sort: <number>_.get(item, 'sort', 0),
        children: children,
        disabled: _.get(item, 'disabled', false),
        expandable: true,
        selectable: true,
      };
      if (lazy && children.length === 0) {
        _.set(node, 'lazy', true);
      }
      arr.push(node);
    }
  });
  return arr;
}

/**
 * 格式化请求字符串
 * @param params 请求对象
 * @returns 请求字符串
 */
export function formatQueryString(params: { [key: string]: string }) {
  if (!params) {
    return '';
  }
  const arr: string[] = [];
  _.forIn(params, (val, key) => {
    if (val) {
      arr.push(`${key}=${val}`);
    } else {
      arr.push(`${key}=`);
    }
  });
  if (arr.length > 0) {
    return arr.join('&');
  }
  return '';
}

/**
 * Download file from blob ajax.
 *
 * @param {*} response: axios response
 * @param {*} filename: download filename, find in response header if not provided.
 *
 * The backend shoud set header Access-Control-Expose-Headers = Content-Disposition to show this header to axios.
 */
export function downloadBlobFile(response: AxiosResponse, filename?: string) {
  if (!filename) {
    if ('content-disposition' in response.headers) {
      const find =
        response.headers['content-disposition'].match(/filename=(.*)/);
      if (find && find.length > 0) {
        filename = find[1];
      } else {
        filename = 'download';
      }
    } else {
      filename = 'download';
    }
  }
  const blob = new Blob([response.data]);
  const downloadElement = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = decodeURIComponent(filename ?? '');
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
}
