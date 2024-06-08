// 模型定义
import { ValidationRule } from 'quasar';

// 主键类型
export type IdType = string | number;

/**
 * 登录对象
 */
export interface LoginBody {
  username: string;
  password?: string;
  captcha?: string;
  uuid?: string;
  loginType?: string;
  frontendId?: string;
  captchaType?: string;
}

/**
 * 注册对象
 */
export interface RegisterBody {
  frontendId: string;
  username: string;
  nickname: string;
  password: string;
  email?: string;
  tel?: string;
}

/**
 * 登录响应对象
 */
export interface ResponseTokenData {
  accessToken: string;
  refreshToken: string;
  status: number;
}

/**
 * 列表响应对象
 */
export interface ResponseListData {
  data: object[];
  page: number;
  pageSize: number;
  total: number;
  status: number;
}

/**
 * 详情、创建、更新响应对象
 */
export interface ResponseDetailData {
  data: unknown;
  message: string;
  status: number;
}

/**
 * 关联响应对象
 */
export interface ResponseRelationListData {
  data: object[];
  message: string;
  status: number;
}

/**
 * 布尔响应对象
 */
export interface ReponseBooleanData {
  data: boolean;
  message: string;
  status: number;
}

/**
 * 加密响应对象
 */
export interface ResponseCryptoData {
  jsondata: string;
  id: string;
  mode: string;
  status: number;
}

/**
 * 树状节点
 */
export interface TreeNode {
  id: string;
  name: string;
  parentId: string | null;
  sort: number;
  children: Array<TreeNode>;
  disabled?: boolean;
  lazy?: boolean;
}

/**
 * 表格列定义
 */
export interface ResourceTableColumn {
  /**
   * Unique id, identifies column, (used by pagination.sortBy, 'body-cell-[name]' slot, ...)
   * 特殊的名称：
   * icon：显示为图标
   * operation：不关联数据，显示操作栏
   */
  name: string;
  /**
   * Label for header
   */
  label: string;
  /**
   * Row Object property to determine value for this column or function which maps to the required property
   * @param row The current row being processed
   * @returns Value for this column
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: string | ((row: any) => any);
  /**
   * If we use visible-columns, this col will always be visible
   */
  required?: boolean;
  /**
   * If we use visible-columns, this col will be hidden
   */
  hide?: boolean;
  /**
   * Horizontal alignment of cells in this column
   * Default value: right
   */
  align?: 'left' | 'right' | 'center';
  /**
   * Tell QTable you want this column sortable
   */
  sortable?: boolean;
  /**
   * Compare function if you have some custom data or want a specific way to compare two rows; rows with null/undefined values will get sorted without triggering this method (use 'rawSort' instead if you want to handle those values too)
   * @param a Value of the first comparison term
   * @param b Value of the second comparison term
   * @param rowA Full Row object in which is contained the first term
   * @param rowB Full Row object in which is contained the second term
   * @returns Comparison result of term 'a' with term 'b'. Less than 0 when 'a' should come first; greater than 0 if 'b' should come first; equal to 0 if their position must not be changed with respect to each other
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  /**
   * Compare function if you have some custom data or want a specific way to compare two rows; includes rows with null/undefined values (use 'sort' instead if you don't want that)
   * @param a Value of the first comparison term
   * @param b Value of the second comparison term
   * @param rowA Full Row object in which is contained the first term
   * @param rowB Full Row object in which is contained the second term
   * @returns Comparison result of term 'a' with term 'b'. Less than 0 when 'a' should come first; greater than 0 if 'b' should come first; equal to 0 if their position must not be changed with respect to each other
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawSort?: (a: any, b: any, rowA: any, rowB: any) => number;
  /**
   * Set column sort order: 'ad' (ascending-descending) or 'da' (descending-ascending); Overrides the 'column-sort-order' prop
   * Default value: ad
   */
  sortOrder?: 'ad' | 'da';
  /**
   * Function you can apply to format your data
   * @param val Value of the cell
   * @param row Full Row object in which the cell is contained
   * @returns The resulting formatted value
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format?: (val: any, row: any) => any;
  /**
   * Style to apply on normal cells of the column
   * @param row The current row being processed
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: string | ((row: any) => string);
  /**
   * Classes to add on normal cells of the column
   * @param row The current row being processed
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  classes?: string | ((row: any) => string);
  /**
   * Style to apply on header cells of the column
   */
  headerStyle?: string;
  /**
   * Classes to add on header cells of the column
   */
  headerClasses?: string;
}

/**
 * 分页参数对象
 */
export interface PaginationProps {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
}

/**
 * 表格请求参数对象
 */
export interface TableRequestProps {
  pagination: PaginationProps;
  filter?: string | object;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCellValue: (col: object, row: object) => any;
}

/**
 * 资源详情表单字段配置
 */
export interface DetailConfigProps {
  // 字段名
  name: string;
  // 显示名
  label: string;
  // 类型
  type?:
    | 'text'
    | 'textarea'
    | 'editor'
    | 'date'
    | 'bool'
    | 'user_dict'
    | 'attachment'
    | 'icon';
  // 格式化函数，参数为字段、字段值、整个对象，返回处理过的字段值
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (field: string, val: any, data?: object) => any;
  // 时间格式，默认 YYYY-MM-DD HH:mm:ss
  dateFormat?: string;
  // 标签样式类名
  labelClassName?: string;
  // 值样式类名
  valClassName?: string;
}

/**
 * 表单配置
 */
export interface FormConfigProps {
  // 字段名
  name: string;
  // 显示名
  label: string;
  // 类型
  type?:
    | 'text'
    | 'textarea'
    | 'editor'
    | 'number'
    | 'checkbox'
    | 'system_dict'
    | 'user_dict'
    | 'relation'
    | 'attachment'
    | 'icon_select'
    | 'select';
  // 输入框最大长度
  maxlength?: number;
  // 文本框是否显示字数
  counter?: boolean;
  // 系统字典名称或用户字典组
  dictName?: string;
  // 关联选择资源名
  relationResource?: string;
  // 关联标签字段
  relationOptionLabel?: string;
  // 关联值字段
  relationOptionValue?: string;
  // 文件类型限制
  fileAccept?: string;
  // 上传文件分类
  uploadType?: string;
  // 最大文件大小
  maxFileSize?: number;
  // 最大文件数量限制
  maxFiles?: number;
  // 校验规则
  rules?: ValidationRule[];
  // 是否可清除
  clearable?: boolean;
  // 选择的选项
  selectOptions?: OptionItem[] | (() => OptionItem[]);
}

/**
 * 选择菜单项
 */
export interface OptionItem {
  label: string;
  value: unknown;
}

/**
 * 系统字典
 */
export interface SystemDict {
  name: string;
  code: string;
}

/**
 * 页面历史记录
 */
export interface PageHistoryRecord {
  label: string;
  path: string;
}

/**
 * 实体接口
 */
export interface Entity {
  [x: string]: string | number | null | undefined;
}

/**
 * 通用实体对象
 */
export abstract class CommonEntity {
  id = '';
  createdTime?: Date;
  createdBy?: string;
  updatedTime?: Date;
  updatedBy?: string;
  remark = '';
}

/**
 * 树状实体对象
 */
export abstract class TreeEntity extends CommonEntity {
  parentId: string | null = null;
  sort = 0;
}

/**
 * 用户
 */
export class User extends CommonEntity {
  username = '';
  nickname = '';
  sex?: string;
  email?: string;
  tel?: string;
  superuser?: boolean;
  staff?: boolean;
  province?: string;
  city?: string;
  area?: string;
  town?: string;
  address?: string;
  needChangePwd?: boolean;
  department?: string;
  departmentId?: string;
  job?: string;
  jobId?: string;
  authorities?: string[];
}

/**
 * 菜单
 */
export class Menu extends TreeEntity implements TreeNode {
  name = '';
  caption = '';
  icon = '';
  path = '';
  children: Menu[] = [];
}

/**
 * 用户字典
 */
export class UserDict extends CommonEntity {
  name = '';
  dictGroup = '';
  dictCode = '';
  dictVal = '';
  dictType = '';
  sort = 0;
}

/**
 * 参数
 */
export class Param extends CommonEntity {
  name = '';
  paramGroup = '';
  paramKey = '';
  paramType = '';
  paramVal: number | boolean | string | undefined = '';
}

/**
 * 公告
 */
export class Announcement extends CommonEntity {
  title = '';
  content = '';
  type = '';
  display = true;
  sort = 0;
  attachments: Attachment[] = [];
}

/**
 * 附件
 */
export class Attachment extends CommonEntity {
  id = '';
  url = '';
  size = 0;
  filename = '';
  originalFilename = '';
  contentType = '';
  hashInfo = '';
  thUrl = '';
  thSize = 0;
  thContentType = '';
}

/**
 * 站内消息
 */
export class InsideMessage extends CommonEntity {
  title = '';
  content = '';
  type = '';
  fromUserId = '';
  toUserId = '';
  readTime?: Date;
}

/**
 * 快捷菜单
 */
export class QuickLink extends CommonEntity {
  name = '';
  icon = '';
  path = '';
  sort = '';
}

/**
 * 数据源
 */
export class Datasource extends CommonEntity {
  name = '';
  type = '';
  config = '';
  connected = false;
  remark = '';
}

/**
 * 数据源参数
 */
export class DatasourceParam extends CommonEntity {
  name = '';
  label = '';
  datasourceId = '';
  required = false;
  defVal = '';
  config = '';
}

/**
 * 创建执行
 */
export class RenderExecutionStart {
  templateId = '';
  datasourceId = '';
  filename = '';
  params: { [key: string]: string } = {};
}

/**
 * 渲染执行
 */
export class RenderExecution extends CommonEntity {
  templateId = '';
  templateName = '';
  templateType = '';
  datasourceId = '';
  datasourceName = '';
  datasourceType = '';
  params = '';
  status = '';
  filename = '';
}

/**
 * 执行结果
 */
export class ExecutionResult extends CommonEntity {
  executionId = '';
  status = '';
  message = '';
  attachments: Attachment[] = [];
}
