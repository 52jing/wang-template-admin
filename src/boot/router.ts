import { boot } from 'quasar/wrappers';
import { notifyForbidden } from 'src/utils/notify';
import { useCommonStore } from 'src/stores/common';
import { useProfileStore } from 'src/stores/profile';
import * as C from 'src/utils/constants';
import 'vue-router';

/**
 * 扩展路由元数据
 */
declare module 'vue-router' {
  interface RouteMeta {
    // 页面标题
    title?: string;
    // 页面描述
    description?: string;
    // 页面关键词
    keywords?: string;
    // 是否不显示折叠菜单，默认 false
    noMenu?: boolean;
    // 菜单标题
    menuTitle?: string;
    // 是否不显示历史记录栏，默认 false
    noHistoryBar?: boolean;
    // 是否不添加历史记录，默认 false
    noHistory?: boolean;
    // 页面需要的权限，默认不限制
    perm?: string;
    // 是否需要超级管理员，默认 false
    requiresSuperuser?: boolean;
    // 是否需要内部用户，默认 false
    requiresStaff?: boolean;
    // 是否需要认证，默认 false
    requiresAuth?: boolean;
  }
}

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router }) => {
  // 路由守卫
  const commonStore = useCommonStore();
  const profileStore = useProfileStore();

  // before each router check
  router.beforeEach((to) => {
    if (!to.meta) {
      return true;
    }
    const meta = to.meta;
    // 更新页面配置
    commonStore.$patch((state) => {
      state.pageConfig.title = meta.title ?? '';
      state.pageConfig.description = meta.description ?? '';
      state.pageConfig.keywords = meta.keywords ?? '';
      state.pageConfig.showMenu = meta.noMenu ? false : true;
      state.pageConfig.menuTitle = meta.menuTitle ?? '';
      state.pageConfig.showHistory = meta.noHistoryBar ? false : true;
    });
    if (profileStore.isLogin) {
      // 已登录
      if (to.name === C.routeLoginName) {
        // 如果登录成功访问登录页跳转到主页
        return { name: C.routeHomeName };
      } else {
        if (meta.requiresSuperuser && !profileStore.isSuperuser) {
          // 需要超级管理员权限
          notifyForbidden();
          return false;
        }
        if (meta.requiresStaff && !profileStore.isStaff) {
          // 需要内部用户权限
          notifyForbidden();
          return false;
        }
        // 路由权限检查
        if (meta.perm) {
          if (!profileStore.hasPerm(meta.perm)) {
            // 无权访问
            notifyForbidden();
            return false;
          }
        }
        // 记录历史
        if (meta.title && meta.noHistory !== true) {
          profileStore.addPageHistory(meta.title, to.path);
        }
        return true;
      }
    } else {
      // 未登录
      if (meta.requiresAuth !== true) {
        // 无需认证
        return true;
      }
      // 尝试获取用户
      profileStore
        .getProfile()
        .then(() => {
          // 登录成功
          if (meta.requiresSuperuser && !profileStore.isSuperuser) {
            // 需要超级管理员权限
            notifyForbidden();
            return false;
          }
          if (meta.requiresStaff && !profileStore.isStaff) {
            // 需要内部用户权限
            notifyForbidden();
            return false;
          }
          // 路由权限检查
          if (meta.perm) {
            if (!profileStore.hasPerm(meta.perm)) {
              // 无权访问
              notifyForbidden();
              return false;
            }
          }
          // 记录历史
          if (meta.title && meta.noHistory !== true) {
            profileStore.addPageHistory(meta.title, to.path);
          }
          return true;
        })
        .catch(() => {
          // 跳转登录页
          profileStore.removeUser();
          return { name: C.routeLoginName };
        });
    }
  });
});
