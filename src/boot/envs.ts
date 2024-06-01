import { boot } from 'quasar/wrappers';
import { useCommonStore } from 'stores/common';
import { strToBool } from 'src/utils/str';
import pj from '../../package.json';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async () => {
  // 载入环境变量
  const commonStore = useCommonStore();
  commonStore.$patch((state) => {
    if (pj.version) {
      state.version = pj.version;
    }
    const frontendId = process.env.FRONTEND_ID;
    if (frontendId) {
      state.envConfig.frontendId = frontendId;
    }
    state.envConfig.enableRegister =
      strToBool(process.env.ENABLE_REGISTER, false) ?? false;
    state.envConfig.enableLocale =
      strToBool(process.env.ENABLE_LOCALE, true) ?? false;
    state.envConfig.showAjaxBar =
      strToBool(process.env.SHOW_AJAX_BAR, false) ?? false;
    state.envConfig.showHistoryBar =
      strToBool(process.env.SHOW_HISTORY_BAR, true) ?? false;
    state.envConfig.enableCrypto =
      strToBool(process.env.ENABLE_CRYPTO, false) ?? false;
    if (process.env.CRYPTO_MODE) {
      state.envConfig.cryptoMode = process.env.CRYPTO_MODE;
    }
    if (process.env.PUBLIC_KEY) {
      state.envConfig.publicKey = process.env.PUBLIC_KEY;
    }
    state.envConfig.enableDevProxy =
      strToBool(process.env.ENABLE_DEV_PROXY, false) ?? false;
    if (process.env.DEV_TARGET) {
      state.envConfig.devTarget = process.env.DEV_TARGET;
    }
    state.envConfig.enableUsernamePasswordLogin =
      strToBool(process.env.ENABLE_USERNAME_PASSWORD_LOGIN, true) ?? false;
    state.envConfig.enableTelCodeLogin =
      strToBool(process.env.ENABLE_TEL_CODE_LOGIN, true) ?? false;
    state.envConfig.enableCaptcha =
      strToBool(process.env.ENABLE_CAPTCHA, false) ?? false;
    if (process.env.LOGIN_CAPTCHA_TYPE) {
      state.envConfig.loginCaptchaType = process.env.LOGIN_CAPTCHA_TYPE;
    }
  });
});
