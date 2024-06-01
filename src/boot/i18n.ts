import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import { keyLocale } from 'src/utils/constants';
import { loadLocal } from 'src/utils/storage';

import messages from 'src/i18n';

export type MessageLanguages = keyof typeof messages;
// Type-define 'en-US' as the master schema for the resource
export type MessageSchema = (typeof messages)['zh-CN'];

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

// 优先获取用户存储的语言，其次是配置的默认值
const fallbackLocale = 'zh-CN';
const lang = loadLocal(keyLocale);
let locale = process.env.DEFAULT_LOCALE ?? fallbackLocale;
if (lang) {
  locale = <string>lang;
}
const i18n = createI18n({
  locale: locale,
  legacy: false,
  fallbackLocale: fallbackLocale,
  messages,
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

export { i18n };
