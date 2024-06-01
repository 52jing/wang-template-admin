/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE?: 'hash' | 'history' | 'abstract';
    VUE_ROUTER_BASE?: string;
    BASE_API?: string;
    FRONTEND_ID?: string;
    ENABLE_REGISTER?: string;
    ENABLE_LOCALE?: string;
    DEFAULT_LOCALE?: string;
    SHOW_AJAX_BAR?: string;
    SHOW_HISTORY_BAR?: string;
    ENABLE_CAPTCHA?: string;
    LOGIN_CAPTCHA_TYPE?: string;
    ENABLE_USERNAME_PASSWORD_LOGIN?: string;
    ENABLE_TEL_CODE_LOGIN?: string;
    ENABLE_CRYPTO?: string;
    CRYPTO_MODE?: string;
    PUBLIC_KEY?: string;
    ENABLE_DEV_PROXY?: string;
    DEV_TARGET?: string;
  }
}
