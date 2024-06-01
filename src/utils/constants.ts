/**
 * 常量定义
 */
// 认证令牌类型
export const authTokenType = 'Bearer';
// 请求头
export const authorizationHeader = 'Authorization';
export const languageHeader = 'Accept-Language';
// 请求参数
export const requestPageKey = '_page';
export const requestPageSizeKey = '_limit';
export const requestSearchKey = '_search';
export const requestSortKey = '_sort';
export const requestRootKey = '_root';
export const requestSortSep = ',';
// 请求体参数
export const requestBodyIdsKey = 'ids';
// 路径
export const rootPathKey = '_root';
export const childrenPathKey = '_children';
// 响应结构键
export const responseDataKey = 'data';
export const responseErrorCodeKey = 'errCode';
export const responseMessageKey = 'message';
export const responsePageKey = 'page';
export const responsePageSizeKey = 'pageSize';
export const responseTotalKey = 'total';
// 验证码
export const imageCaptchaLength = 4;
export const smsCaptchaLength = 6;
export const smsPhoneLength = 11;
export const smsCaptchaSendInterval = 60;
// 密码
export const passwordMinLength = 6;
// 存储键
export const keyPrefix = 'wb_';
export const keyLocale = keyPrefix + 'locale';
export const keyFrontend = keyPrefix + 'frontend';
export const keyAccessToken = keyPrefix + 'access_token';
export const keyRefreshToken = keyPrefix + 'refresh_token';
export const keyUser = keyPrefix + 'user';
export const keyAsideMenu = keyPrefix + 'aside_menu';
export const keyPageHistory = keyPrefix + 'page_history';
export const keyNotification = keyPrefix + 'notification';
// 路由名称
export const routeHomeName = 'index';
export const routeSettingsName = 'settings';
export const routeLoginName = 'login';
export const routeRegisterName = 'register';
export const routeProfileName = 'profile';
export const routeChangePasswordName = 'changePassword';
export const routeAnnouncementDetailName = 'announcementDetail';
export const routeDownloadCenterName = 'downloadCenter';
export const routeInsideMessageBoxName = 'insideMessageBox';
export const routeInsideMessageDetailName = 'insideMessageDetail';
export const routeQuickLinkManageName = 'taskQuickLink';
// 时间日期格式
export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
export const dateFormat = 'YYYY-MM-DD';
export const timeFormat = 'HH:mm:ss';
// 权限
export const permissionDel = ':';
export const viewPermission = 'view';
export const createPermission = 'create';
export const updatePermission = 'update';
export const deletePermission = 'delete';
