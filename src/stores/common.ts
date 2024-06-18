import { defineStore } from 'pinia';
import * as C from 'src/utils/constants';
import * as M from 'src/components/models';
import * as commonApi from 'src/api/common';
import { saveLocal, loadLocal, saveSession } from 'src/utils/storage';

/**
 * 应用配置
 * 从后端配置获取
 */
export class FrontendProfile {
  // 应用 ID
  id = '';
  // 应用标题
  title = '';
  // 应用描述
  description = '';
  // 应用作者
  author = '';
  // 域名
  domain = '';
}

/**
 * 应用部署配置
 * 从环境变量读取
 */
export class EnvConfig {
  // 前端 ID
  frontendId = '99';
  // 是否启用注册
  enableRegister = false;
  // 是否启用多语言
  enableLocale = true;
  // 是否显示请求进度条
  showAjaxBar = false;
  // 是否显示浏览记录
  showHistoryBar = true;
  // 是否启用接口加密
  enableCrypto = false;
  // 接口加密模式
  cryptoMode = 'aes_sm2';
  // 接口加密公钥
  publicKey = '';
  // 是否启用字段加密
  enableFieldCrypto = false;
  // 是否启用开发代理
  enableDevProxy = false;
  // 开发代理路径
  devTarget = 'http://127.0.0.1:8000';
  // 是否允许用户名密码登录，set by env
  enableUsernamePasswordLogin = true;
  // 是否允许手机短信验证码登录，set by env
  enableTelCodeLogin = true;
  // whether to enable image captcha, set by env
  enableCaptcha = false;
  // login captcha type: image, slide, set by env
  loginCaptchaType = 'image';
}

/**
 * 页面配置
 * 从路由信息获取
 */
export class PageConfig {
  // 页面标题
  title = '';
  // 页面描述
  description = '';
  // 页面关键词
  keywords = '';
  // 是否显示折叠菜单
  showMenu = true;
  // 侧边菜单标题
  menuTitle = '';
  // 是否显示历史记录
  showHistory = true;
}

/**
 * 多语言管理
 */
export class Language {
  label: string;
  value: string;

  constructor(label: string, value: string) {
    this.label = label;
    this.value = value;
  }
}

export class LangManager {
  showLanguage = true;
  // 支持的语言
  supportedLanguages = [
    new Language('中文', 'zh-CN'),
    new Language('English', 'en-US'),
  ] as Language[];
  selectedIdx = 0;

  constructor(selected?: number) {
    if (selected) {
      this.selectedIdx = selected;
    } else {
      this.loadlang();
    }
  }

  selectedLang() {
    return this.supportedLanguages[this.selectedIdx];
  }

  updateLang(lang: string) {
    for (let i = 0; i < this.supportedLanguages.length; i++) {
      if (this.supportedLanguages[i].value === lang && this.selectedIdx !== i) {
        this.selectedIdx = i;
      }
    }
  }

  saveLang(lang: string) {
    saveLocal(C.keyLocale, lang);
  }

  loadlang() {
    const lang = loadLocal(C.keyLocale);
    if (lang) {
      this.updateLang(<string>lang);
    }
  }
}

// 图形验证码响应对象
export interface CaptchaResponse {
  imgSrc: string;
  uid: string;
}

/**
 * 通用 Store
 */
export const useCommonStore = defineStore('common', {
  state: () => ({
    // package version
    version: '',
    // 应用配置
    frontendProfile: new FrontendProfile(),
    // 环境变量配置
    envConfig: new EnvConfig(),
    // 页面配置
    pageConfig: new PageConfig(),
    // 默认侧边菜单标题
    defaultMenuTitle: 'WangTemplate',
    // 多语言管理
    langs: new LangManager(),
    // 系统字典
    systemDicts: {} as { [key: string]: M.SystemDict[] },
  }),

  getters: {
    // 菜单标题
    menuTitle(state) {
      return state.pageConfig.menuTitle || state.defaultMenuTitle;
    },
  },

  actions: {
    // 更新并保存语言
    updateLang(lang: string) {
      this.langs.updateLang(lang);
      this.langs.saveLang(lang);
    },
    // 保存前端
    saveFrontendToStorage(frontend?: FrontendProfile) {
      frontend = frontend ?? this.frontendProfile;
      if (frontend) {
        saveSession(C.keyFrontend, frontend);
      }
    },
    // 获取系统字典
    getSystemDictList(name: string, force = false) {
      return new Promise<M.SystemDict[]>(async (resolve, reject) => {
        // get from store first
        let data = null;
        if (force !== true) {
          data = this.systemDicts[name];
        }
        if (data) {
          resolve(data);
        } else {
          // request from api
          try {
            const res = await commonApi.getSystemDict(name);
            const sd = <M.SystemDict[]>res.data.data;
            this.$patch((state) => {
              state.systemDicts[name] = sd;
            });
            resolve(sd);
          } catch (err) {
            reject(err);
          }
        }
      });
    },
    // 获取用户字典
    getUserDictList(group: string, code: string) {
      return new Promise<M.UserDict[]>(async (resolve, reject) => {
        try {
          const res = await commonApi.getUserDict(group, code);
          resolve(<M.UserDict[]>res.data.data);
        } catch (err) {
          reject(err);
        }
      });
    },
    // 获取单个用户字典
    getUserDict(id: string) {
      return new Promise<M.UserDict>(async (resolve, reject) => {
        try {
          const res = await commonApi.getUserDictById(id);
          resolve(<M.UserDict>res.data.data);
        } catch (err) {
          reject(err);
        }
      });
    },
    // 获取前端配置
    getFrontendProfile(force?: boolean) {
      return new Promise<FrontendProfile>(async (resolve, reject) => {
        // get from store first
        let data = null;
        if (force !== true) {
          data = this.frontendProfile;
        }
        if (data && data.id) {
          resolve(data);
        } else {
          // request from api
          try {
            const res = await commonApi.getFrontendProfile(
              this.envConfig.frontendId
            );
            const fp = <FrontendProfile>res.data.data;
            if (fp) {
              this.$patch((state) => {
                state.frontendProfile = fp;
              });
              this.saveFrontendToStorage();
            }
            resolve(fp);
          } catch (err) {
            reject(err);
          }
        }
      });
    },
  },
});
