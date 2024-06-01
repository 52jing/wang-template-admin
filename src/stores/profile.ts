import { defineStore } from 'pinia';
import {
  saveLocal,
  removeLocal,
  saveSession,
  removeSession,
} from 'src/utils/storage';
import * as C from 'src/utils/constants';
import { api } from 'src/boot/axios';
import { buildTree } from 'src/utils/obj';
import { useCommonStore } from './common';
import * as authApi from 'src/api/auth';
import * as profileApi from 'src/api/profile';
import * as M from 'src/components/models';

/**
 * 用户相关 Store
 */
export const useProfileStore = defineStore('profile', {
  state: () => ({
    // 用户信息
    user: null as M.User | null,
    // 访问令牌
    accessToken: '',
    // 刷新令牌
    refreshToken: '',
    // 登录后跳转地址
    redirectAfterLogin: '/',
    // 侧边菜单
    asideMenus: [] as M.Menu[],
    // 浏览历史
    pageHistory: [] as M.PageHistoryRecord[],
    // 最大浏览历史数量
    maxPageHistoryNum: 10,
  }),

  getters: {
    isLogin(state) {
      return state.user && state.user.id ? true : false;
    },
    isSuperuser(state) {
      if (state.user) {
        return state.user.superuser ?? false;
      }
      return false;
    },
    isStaff(state) {
      if (state.user) {
        return state.user.staff ?? false;
      }
      return false;
    },
    permissions(state) {
      if (state.user) {
        return state.user.authorities;
      }
      return [];
    },
    // 是否有权限
    hasPerm() {
      return (perm: string) => {
        if (this.permissions) {
          return this.isSuperuser || this.permissions.indexOf(perm) >= 0;
        }
        return false;
      };
    },
  },

  actions: {
    saveAccessTokenToStorage(token?: string) {
      token = token ?? this.accessToken;
      if (token) {
        saveLocal(C.keyAccessToken, token);
      }
    },
    removeAccessToken() {
      this.$patch((state) => {
        state.accessToken = '';
      });
      removeLocal(C.keyAccessToken);
    },
    saveRefreshTokenToStorage(token?: string) {
      token = token ?? this.refreshToken;
      if (token) {
        saveLocal(C.keyRefreshToken, token);
      }
    },
    removeRefreshToken() {
      this.$patch((state) => {
        state.refreshToken = '';
      });
      removeLocal(C.keyRefreshToken);
    },
    saveUserToStorage(user?: M.User) {
      user = user ?? this.user ?? undefined;
      if (user) {
        saveSession(C.keyUser, user);
      }
    },
    removeUser() {
      this.$patch({
        user: null,
      });
      removeSession(C.keyUser);
    },
    saveMenusToStorage(menu?: M.Menu[]) {
      menu = menu ?? this.asideMenus ?? undefined;
      if (menu) {
        saveSession(C.keyAsideMenu, menu);
      }
    },
    removeMenus() {
      this.$patch({
        asideMenus: [],
      });
      removeSession(C.keyAsideMenu);
    },
    saveHistoryToStorage(history?: M.PageHistoryRecord[]) {
      history = history ?? this.pageHistory ?? undefined;
      if (history) {
        saveLocal(C.keyPageHistory, history);
      }
    },
    clearHistory() {
      this.$patch({
        pageHistory: [],
      });
      removeLocal(C.keyPageHistory);
    },
    // 添加浏览历史
    addPageHistory(label: string, path: string) {
      // 去除重复
      let find = false;
      for (const d of this.pageHistory) {
        if (d.path === path) {
          find = true;
          break;
        }
      }
      if (!find) {
        if (this.pageHistory.length >= this.maxPageHistoryNum) {
          this.pageHistory.shift();
        }
        this.pageHistory.push({ label, path });
      }
      this.saveHistoryToStorage();
    },
    // 移除浏览历史
    removePageHistory(path: string) {
      for (const i in this.pageHistory) {
        if (this.pageHistory[i].path === path) {
          this.pageHistory.splice(parseInt(i), 1);
          break;
        }
      }
      this.saveHistoryToStorage();
    },
    // 同步用户
    syncProfile() {
      if (!this.user && this.accessToken) {
        this.getProfile();
      }
    },
    // 登录
    login(data: M.LoginBody) {
      // 添加客户端类型
      const commonStore = useCommonStore();
      data.frontendId = commonStore.frontendProfile.id;
      // 加密密码
      // data.password = encryptPassword(data.password, context.rootState.common.enableFieldCrypto, context.rootState.common.cryptoMode, context.rootState.common.publicKey)
      return new Promise<M.ResponseTokenData>(async (resolve, reject) => {
        try {
          const res = await authApi.login(data);
          const access = res.data.accessToken;
          const refresh = res.data.refreshToken;
          if (access && refresh) {
            // 保存 tokens
            this.$patch((state) => {
              state.accessToken = access;
              state.refreshToken = refresh;
            });
            this.saveAccessTokenToStorage();
            this.saveRefreshTokenToStorage();
            // 获取用户信息
            this.getProfile(true)
              .then(() => {
                resolve(res.data);
              })
              .catch((err) => {
                reject(err);
              });
          }
        } catch (err_1) {
          reject(err_1);
        }
      });
    },
    // 注销
    logout(accessToken?: string, refreshToken?: string) {
      return new Promise<M.ReponseBooleanData>(async (resolve, reject) => {
        try {
          const res = await authApi.logout(
            accessToken ?? this.accessToken,
            refreshToken ?? this.refreshToken
          );
          // 删除令牌
          this.removeAccessToken();
          this.removeRefreshToken();
          // 清理用户信息
          this.removeUser();
          // 清理菜单
          this.removeMenus();
          // 清理历史记录
          this.clearHistory();
          resolve(res.data);
        } catch (err) {
          // 删除令牌
          this.removeAccessToken();
          this.removeRefreshToken();
          // 清理用户信息
          this.removeUser();
          // 清理菜单
          this.removeMenus();
          // 清理历史记录
          this.clearHistory();
          reject(err);
        }
      });
    },
    /**
     * 获取用户信息
     * @param force 是否强制从后端获取
     */
    getProfile(force = false) {
      return new Promise<M.User>(async (resolve, reject) => {
        let user: M.User | null = null;
        if (force !== true) {
          // 先从 store 中取
          user = this.user;
        }
        if (user) {
          resolve(user);
        } else {
          // 发起请求
          try {
            const res = await profileApi.getProfile();
            if (res.data[C.responseDataKey]) {
              user = <M.User>res.data[C.responseDataKey];
              // 更新 store
              this.$patch({
                user: user,
              });
              this.saveUserToStorage();
              // 获取菜单
              this.getMyMenus();
              resolve(user);
            } else {
              reject(res);
            }
          } catch (err) {
            reject(err);
          }
        }
      });
    },
    // 更新用户信息
    updateProfile(data: M.User) {
      const url = '/profile';
      return new Promise<M.User>(async (resolve, reject) => {
        try {
          const res = await api.post(url, data);
          this.$patch({
            user: res.data[C.responseDataKey],
          });
          this.saveUserToStorage();
          resolve(res.data);
        } catch (err) {
          reject(err);
        }
      });
    },
    // 刷新令牌
    refreshAccessToken(accessToken?: string, refreshToken?: string) {
      return new Promise<M.ResponseTokenData>(async (resolve, reject) => {
        try {
          const res = await authApi.refreshAccessToken(
            accessToken ?? this.accessToken,
            refreshToken ?? this.refreshToken
          );
          const access = res.data.accessToken;
          const refresh = res.data.refreshToken;
          if (access && refresh) {
            this.$patch((state) => {
              state.accessToken = access;
              state.refreshToken = refresh;
            });
            this.saveAccessTokenToStorage();
            this.saveRefreshTokenToStorage();
            resolve(res.data);
          } else {
            reject(res);
          }
        } catch (err) {
          reject(err);
        }
      });
    },
    // 修改密码
    changePassword(password: string, newPassword: string) {
      // 加密密码
      // data.password = encryptPassword(data.password, context.rootState.common.enableFieldCrypto, context.rootState.common.cryptoMode, context.rootState.common.publicKey)
      // data.newPassword = encryptPassword(data.newPassword, context.rootState.common.enableFieldCrypto, context.rootState.common.cryptoMode, context.rootState.common.publicKey)
      // data.newPassword2 = encryptPassword(data.newPassword2, context.rootState.common.enableFieldCrypto, context.rootState.common.cryptoMode, context.rootState.common.publicKey)
      return new Promise(async (resolve, reject) => {
        try {
          const res = await profileApi.changePwd(password, newPassword);
          resolve(res.data);
        } catch (err) {
          reject(err);
        }
      });
    },
    // 获取当前用户菜单
    getMyMenus(force = false) {
      return new Promise(async (resolve, reject) => {
        let menus: M.Menu[] | null = null;
        if (force !== true) {
          // 先从 store 中取
          menus = this.asideMenus;
        }
        if (menus && menus.length > 0) {
          resolve(menus);
        } else {
          try {
            const res = await profileApi.getMyMenus();
            menus = [];
            if (
              res.data[C.responseDataKey] &&
              res.data[C.responseDataKey].length > 0
            ) {
              menus = <M.Menu[]>(
                buildTree(<M.TreeNode[]>res.data[C.responseDataKey], false)
              );
              this.$patch({
                asideMenus: menus,
              });
              this.saveMenusToStorage(menus);
            }
            resolve(menus);
          } catch (err) {
            reject(err);
          }
        }
      });
    },
  },
});
